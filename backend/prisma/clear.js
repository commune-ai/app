const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.transactionHistory.deleteMany({});
  await prisma.moduleCode.deleteMany({});
  await prisma.module.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.

  console.log("All data deleted successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
``
