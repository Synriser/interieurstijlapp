import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client instance
 * Used throughout the application for database access
 */
const prisma = new PrismaClient();

export default prisma;
