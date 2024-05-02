import { PrismaClient } from "@prisma/client";

const financedb = new PrismaClient();

const deleteAllData = async () => {
  await financedb.transaction.deleteMany();
  await financedb.portfolio.deleteMany();
  await financedb.user.deleteMany();
  await financedb.stock.deleteMany();
  await financedb.marketEvent.deleteMany();
};

await deleteAllData();