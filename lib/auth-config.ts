import { betterAuth } from 'better-auth';
import { prismaAdapter } from '@better-auth/prisma-adapter';
import type { PrismaClient } from '@/src/generated/prisma/client';

export function createAuth(
  prisma: PrismaClient,
  options: { disableSignUp?: boolean } = {},
) {
  const secret = process.env.BETTER_AUTH_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error('BETTER_AUTH_SECRET must be at least 32 characters');
  }

  return betterAuth({
    secret,
    database: prismaAdapter(prisma, { provider: 'postgresql' }),
    emailAndPassword: {
      enabled: true,
      disableSignUp: options.disableSignUp ?? true,
      minPasswordLength: 8,
      maxPasswordLength: 128,
    },
    user: {
      additionalFields: {
        role: {
          type: 'string',
          required: true,
          defaultValue: 'EDITOR',
          input: false,
        },
      },
    },
  });
}
