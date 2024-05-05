/* 
In this script I will simulate a market crash, and update the current price of all stocks to be between 30 and 70% less. After succeeding on this I can 
log some interesting insights into the console as well probably.
*/

import { PrismaClient } from "@prisma/client";
import { getRandomNumber } from "./getRandomNumber";

const financedb = new PrismaClient();

export const marketCrash = async () => {
  const stocks = await financedb.stock.findMany();
  for (const stock of stocks) {
    const priceDrop = getRandomNumber(0.3, 0.7);
    console.log(`price drop: ${priceDrop * 100}`);
    const newPrice = (
      stock.currentPrice -
      stock.currentPrice * priceDrop
    ).toFixed(2);
    console.log(
      `Stock ${
        stock.symbol
      } has suffered from the market crash!! Their share price droped from ${stock.currentPrice.toFixed(
        2
      )} to ${newPrice} USD.`
    );
    await financedb.stock.update({
      where: { stockId: stock.stockId },
      data: { currentPrice: parseFloat(newPrice) },
    });
  }
  console.log("Market Crash simulation complete!");
  await financedb.marketEvent.create({
    data: {
      eventName: "Market Crash",
      affectedStocks: {
        connect: stocks.map((stock) => ({ stockId: stock.stockId })),
      },
    },
  });
};