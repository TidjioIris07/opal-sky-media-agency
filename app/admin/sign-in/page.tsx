'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

function getSafeCallbackURL() {
  if (typeof window === 'undefined') {
    return '/admin/dashboard';
  }

  const callbackURL = new URLSearchParams(window.location.search).get(
    'callbackURL',
  );

  if (callbackURL?.startsWith('/') && !callbackURL.startsWith('//')) {
    const resolvedURL = new URL(callbackURL, window.location.origin);

    if (resolvedURL.origin === window.location.origin) {
      return `${resolvedURL.pathname}${resolvedURL.search}${resolvedURL.hash}`;
    }
  }

  return '/admin/dashboard';
}

const SignInLayout = () => {
  const router = useRouter();
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!isSessionPending && session) {
      router.replace(getSafeCallbackURL());
    }
  }, [isSessionPending, router, session]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get('email') ?? '').trim();
    const password = String(formData.get('password') ?? '');
    const emailInput = form.elements.namedItem('email') as HTMLInputElement;

    setErrorMessage('');

    if (!email || !emailInput.checkValidity()) {
      setErrorMessage('Enter a valid email address.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters.');
      return;
    }

    setIsSubmitting(true);

    const { error } = await authClient.signIn.email({
      email,
      password,
      callbackURL: getSafeCallbackURL(),
    });

    if (error) {
      setErrorMessage('Invalid email or password.');
      setIsSubmitting(false);
      return;
    }

    router.replace(getSafeCallbackURL());
  }

  return (
    <div className="sign-in">
      <Card className="sign-in__card">
        <CardHeader>
          <CardTitle className="sign-in__title">
            Opal Sky Media
            <span className="text-primary"> Agency</span>
          </CardTitle>

          <CardTitle className="sign-in__subtitle">Admin Sign In</CardTitle>

          <CardDescription className="sign-in__description">
            Manage the website content and media.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit} noValidate>
          <CardContent>
            <div className="sign-in__form">
              <div className="sign-in__field">
                <Label htmlFor="email">Email</Label>

                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@opalskymedia.com"
                  autoComplete="email"
                  required
                  aria-invalid={!!errorMessage}
                  aria-describedby="sign-in-error"
                />
              </div>

              <div className="sign-in__field">
                <div className="sign-in__password-header">
                  <Label htmlFor="password">Password</Label>

                  <a href="#" className="sign-in__forgot-password">
                    Forgot your password?
                  </a>
                </div>

                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  minLength={8}
                  aria-invalid={!!errorMessage}
                  aria-describedby="sign-in-error"
                />
              </div>

              <div
                id="sign-in-error"
                className="text-destructive text-sm"
                aria-live="polite"
                role="alert"
              >
                {errorMessage}
              </div>
            </div>
          </CardContent>

          <CardFooter className="sign-in__footer">
            <Button
              type="submit"
              className="sign-in__submit"
              disabled={isSubmitting || isSessionPending}
            >
              {isSubmitting ? 'Signing in...' : 'Login'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SignInLayout;
