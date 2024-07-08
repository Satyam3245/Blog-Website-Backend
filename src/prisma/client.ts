import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
    datasources: {
      db: {
        // URL should include the connection string to your database
        url: process.env.DATABASE_URL,
      },
    },
   
});




export default prisma;