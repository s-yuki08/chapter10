import { PrismaClient } from '@/app/generated/prisma/client'
import { PrismaBetterSQLite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSQLite3({
  url: "file:./prisma/dev.db"
})

export const prisma = new PrismaClient({ adapter })
