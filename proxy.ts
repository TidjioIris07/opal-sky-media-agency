import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const sessionCookieNames = [
  'better-auth.session_token',
  '__Secure-better-auth.session_token',
];

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === '/admin/sign-in') {
    return NextResponse.next();
  }

  const hasSessionCookie = sessionCookieNames.some((name) =>
    request.cookies.has(name),
  );

  if (!hasSessionCookie) {
    return NextResponse.redirect(new URL('/admin/sign-in', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
