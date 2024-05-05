import { PrismaClient } from "@prisma/client";

/* 

This script will simulate an acquisition!! So the buySide company will acquire the sellSide company. We all know mergers don't really exist anyways,
so that is why we only do acquisitions here.

Now, the acquiring company will:

1. Absorb 60% of the sellSide employees.
2. Have it's stock price increased by 30%.

The acquired company will of course be removed from the stocks table. Since we have set up an "onDelet" behavior in the relation between stocks and transactions,
the transactions of the acquired company will also be removed.
*/

const financedb = new PrismaClient();

const acquisition = async (buySide: string, sellSide: string) => {
  const buySideCompany = await financedb.stock.findFirst({
    where: { symbol: buySide },
  });
  const sellSideCompany = await financedb.stock.findFirst({
    where: { symbol: sellSide },
  });
  console.log(`Well well well.... it seems like negotiations between ${buySideCompany?.companyName}
    and ${sellSideCompany?.companyName} reached a conclusion!!! ${buySideCompany?.companyName} will be buying ${sellSideCompany?.companyName},
    will the regulators allow it or will they ban it due to antitrust concerns?`);
  console.log(`The ${buySideCompany?.companyName} will now absorb ${Math.round(
    sellSideCompany?.numEmployees! * 0.6
  )}
     employees from the ${sellSideCompany?.companyName} company.`);
  await financedb.stock.update({
    where: { stockId: buySideCompany?.stockId! },
    data: {
      numEmployees:
        buySideCompany?.numEmployees! +
        Math.round(sellSideCompany?.numEmployees! * 0.6),
      currentPrice: buySideCompany?.currentPrice! * 1.3,
    },
  });
  await financedb.marketEvent.create({
    data: {
      eventName: `Acquisition - ${buySideCompany?.symbol} acquires ${sellSideCompany?.symbol}`,
      affectedStocks: {
        connect: [
          { stockId: buySideCompany?.stockId! },
          { stockId: sellSideCompany?.stockId! },
        ],
      },
    },
  });
  await financedb.stock.delete({
    where: { stockId: sellSideCompany?.stockId },
  });
  console.log(
    `${buySideCompany?.companyName} has acquired ${sellSideCompany?.companyName}!`
  );
};

//Let's level it up! Allowing the users to parse the arguments they want when calling the scripts.

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error(
    `Hey there! You need to provide both a buying and a selling company name. Otherwise, don't include any parameters and the program will pick some at random.`
  );
  process.exit(1);
}

const buySide = args[0];
const sellSide = args[1];

await acquisition(buySide, sellSide).catch(console.error);