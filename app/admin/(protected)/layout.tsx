import type { ReactNode } from 'react';
import { requireRole } from '@/lib/auth-guard';

export default async function ProtectedAdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  await requireRole('SUPER_ADMIN', 'EDITOR');

  return children;
}