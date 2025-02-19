const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

async function main() {
  // Create a user
  const hash_password= await bcrypt.hash("Qwerty@12", 10);
  const user = await prisma.user.create({
    data: {
      email: "commune@google.com",
      name: "commune",
      password: hash_password,
    },
  });

  // Create modules with module codes and transaction history
  for (let i = 1; i <= 10; i++) {
    const module = await prisma.module.create({
      data: {
        name: `Module ${i}`,
        description: `Description for module ${i}`,
        network: "Ethereum",
        tags: ["AI", "Blockchain"],
        key: `module-key-${i}`,
        founder: "Founder Name",
        hash: "somehashvalue",
        codelocation: "https://github.com/example/module",
        appurl: "https://module.example.com",
        userId: user.id,
      },
    });

    await prisma.moduleCode.create({
      data: {
        code: { content: `console.log('Module ${i} code');` },
        schema: { type: "json", properties: { key: "value" } },
        moduleId: module.id,
      },
    });

    await prisma.transactionHistory.create({
      data: {
        endpoint: `/api/module/${module.id}/execute`,
        input: { param1: "value1", param2: "value2" },
        output: { result: "success" },
        moduleId: module.id,
      },
    });
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
