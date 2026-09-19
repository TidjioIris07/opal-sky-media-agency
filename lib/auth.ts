import { prisma } from '@/lib/prisma';
import { createAuth } from '@/lib/auth-config';

export const auth = createAuth(prisma);
