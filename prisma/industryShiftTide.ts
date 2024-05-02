import { PrismaClient } from "@prisma/client";
/*
This script will simulate a shift in workforce between the two industries specified in the function paramaters. It will subtract a random percentage 
of employees from companies in the fromIndustry and add a random percentage of employees to companies in the toIndustry. Of course, this will also
impact the stock price of the companies. It will decrease the price from the fromIndustry by a random percentage and increase the price for the 
companies winning employees over. 
*/

export const getRandomNumber = (min: number, max: number) => {
  const randomNumber = Math.random() * (max - min) + min;
  return randomNumber;
};

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
    const toCompany = toIndustryCompanies[i];
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
};

await employeeMigration("Pharmaceuticals", "Software");
