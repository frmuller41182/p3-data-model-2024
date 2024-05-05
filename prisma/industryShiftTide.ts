import { PrismaClient } from "@prisma/client";
import { getRandomNumber } from "../functions/getRandomNumber";
/*
This script will simulate a shift in workforce between the two industries specified in the function paramaters. It will subtract a random percentage 
of employees from companies in the fromIndustry and add a random percentage of employees to companies in the toIndustry.
*/

const financedb = new PrismaClient();

const employeeMigration = async (fromIndustry: string, toIndustry: string) => {
  const fromIndustryCompanies = await financedb.stock.findMany({
    where: { industry: fromIndustry },
  });
  const toIndustryCompanies = await financedb.stock.findMany({
    where: { industry: toIndustry },
  });
  for (let i = 0; i < fromIndustryCompanies.length; i++) {
    const fromCompany = fromIndustryCompanies[i];
    const randomIndex = Math.floor(Math.random() * toIndustryCompanies.length);
    const toCompany = toIndustryCompanies[randomIndex];
    const employeesShifted = Math.floor(
      fromCompany.numEmployees -
        fromCompany.numEmployees * getRandomNumber(0.3, 0.6)
    );
    console.log(
      `Oh no! ${employeesShifted} out of ${fromCompany.numEmployees} Employees have shifted from ${fromCompany.companyName} to ${toCompany.companyName}`
    );
    await financedb.stock.update({
      where: { stockId: fromCompany.stockId },
      data: { numEmployees: fromCompany.numEmployees - employeesShifted },
    });
    await financedb.stock.update({
      where: { stockId: toCompany.stockId },
      data: { numEmployees: toCompany.numEmployees + employeesShifted },
    });
  }
  await financedb.marketEvent.create({
    data: {
      eventName: `Industry Shift - ${fromIndustry} to ${toIndustry}`,
      affectedStocks: {
        connect: fromIndustryCompanies.map((stock) => ({
          stockId: stock.stockId,
        })),
      },
    },
  });
  console.log(
    `Industry Shift - ${fromIndustry} to ${toIndustry} Simulation completed!`
  );
};

const getRandomIndustry = async () => {
  const allStocks = await financedb.stock.findMany();
  const randomIndex = Math.floor(Math.random() * allStocks.length);
  // Return the random object from the array
  return allStocks[randomIndex].industry;
};

async function main() {
  const fromIndustry = await getRandomIndustry();
  let toIndustry = await getRandomIndustry();
  if (toIndustry === fromIndustry) {
    toIndustry = await getRandomIndustry();
    return;
  }
  await employeeMigration(fromIndustry, toIndustry).catch(console.error);
}

await main().catch(console.error);
