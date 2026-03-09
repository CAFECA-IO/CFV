const { PrismaClient } = require("@prisma/client");
require('dotenv').config({ path: `.env.local`, override: true });

const prisma = new PrismaClient();

const recharge = async () => {
  try {
    const result = await prisma.users.updateMany({
      where: {
        quota: {
          lt: 1000,
        },
      },
      data: {
        quota: 1000,
      },
    });
    console.log(`Recharged quota to 1000 for ${result.count} users.`);
  } catch (error) {
    console.error("Error recharging users:", error);
  } finally {
    await prisma.$disconnect();
  }
};

recharge();
export {};
