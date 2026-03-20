import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@macanx.in' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@macanx.in',
      passwordHash: hash,
      role: 'ADMIN',
    },
  });

  console.log('Seeded admin user:', admin.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
