import 'server-only';

import { cache } from 'react';
import { headers } from 'next/headers';
import { forbidden, redirect } from 'next/navigation';
import { UserRole } from '@/src/generated/prisma/enums';
import { auth } from '@/lib/auth';

export const getSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() });
});

export async function requireSession() {
  const session = await getSession();

  if (!session) {
    redirect('/admin/sign-in');
  }

  return session;
}

export async function requireRole(...allowedRoles: UserRole[]) {
  const session = await requireSession();

  if (!allowedRoles.some((allowedRole) => allowedRole === session.user.role)) {
    forbidden();
  }

  return session;
}
