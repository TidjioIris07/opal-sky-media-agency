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

const SignInLayout = () => {
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

        <CardContent>
          <form>
            <div className="sign-in__form">
              <div className="sign-in__field">
                <Label htmlFor="email">Email</Label>

                <Input
                  id="email"
                  type="email"
                  placeholder="you@opalskymedia.com"
                  required
                />
              </div>

              <div className="sign-in__field">
                <div className="sign-in__password-header">
                  <Label htmlFor="password">Password</Label>

                  <a href="#" className="sign-in__forgot-password">
                    Forgot your password?
                  </a>
                </div>

                <Input id="password" type="password" required />
              </div>
            </div>
          </form>
        </CardContent>

        <CardFooter className="sign-in__footer">
          <Button type="submit" className="sign-in__submit">
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignInLayout;
