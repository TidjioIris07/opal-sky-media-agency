import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';
import { createAuth } from '../lib/auth-config';

const databaseUrl = process.env.DATABASE_URL;
const email = process.env.SEED_ADMIN_EMAIL;
const name = process.env.SEED_ADMIN_NAME;
const password = process.env.SEED_ADMIN_PASSWORD;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set');
}

if (!email || !name || !password) {
  throw new Error(
    'SEED_ADMIN_EMAIL, SEED_ADMIN_NAME, and SEED_ADMIN_PASSWORD are required',
  );
}

const seedAdmin = { email, name, password };

const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });
const auth = createAuth(prisma, { disableSignUp: false });

async function main() {
  const existingUser = await prisma.user.findUnique({
    where: { email: seedAdmin.email },
  });

  if (existingUser) {
    console.log(`Admin user already exists: ${seedAdmin.email}`);
    return;
  }

  const result = await auth.api.signUpEmail({
    body: seedAdmin,
  });

  await prisma.user.update({
    where: { id: result.user.id },
    data: { role: 'SUPER_ADMIN' },
  });

  console.log(`Created super admin: ${seedAdmin.email}`);
}

main()
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : 'Seed failed');
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
