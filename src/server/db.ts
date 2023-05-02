import { PrismaClient } from '@prisma/client';
import useAccelerate from '@prisma/extension-accelerate';

import { env } from '~/env.mjs';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  }).$extends(useAccelerate);

if (env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

/* 
Extend `Prisma Client`:
import { PrismaClient } from '@prisma/client';
import useAccelerate from '@prisma/extension-accelerate';
 
const prisma = new PrismaClient().$extends(useAccelerate)
*/
