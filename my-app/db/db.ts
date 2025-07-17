import { PrismaClient } from '@prisma/client'

// Global variable to store the Prisma client instance
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create a new Prisma client instance or reuse existing one in development
export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  })

// In development, store the client in the global object to prevent hot reload issues
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
