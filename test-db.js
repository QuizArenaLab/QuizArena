const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres.hexcrhhprivrfzxwstat:37f56e36f5ce32ef73a90d5ee@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres?sslmode=require"
    }
  }
});

async function main() {
  try {
    const count = await prisma.user.count();
    console.log("Connected successfully! Users count:", count);
  } catch (error) {
    console.error("Connection failed:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
