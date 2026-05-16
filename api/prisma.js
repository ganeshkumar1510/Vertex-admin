import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

let prisma = null;

export function databaseUrlConfigured() {
  const url = process.env.DATABASE_URL || '';
  return url.length > 0 && !url.includes('[YOUR-PASSWORD]');
}

export function getPrisma() {
  if (!databaseUrlConfigured()) return null;
  if (!prisma) {
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    prisma = new PrismaClient({ adapter });
  }
  return prisma;
}
