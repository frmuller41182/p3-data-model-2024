/* 
In this script I will simulate a market crash, and update the current price of all stocks to be between 30 and 70% less. After succeeding on this I can 
log some interesting insights into the console as well probably.
*/

import { PrismaClient } from "@prisma/client";

const financedb = new PrismaClient();

const marketCrash = async () => {
  const stocks = await financedb.stock.findMany();
  for (const stock of stocks) {
    const minDrop = 0.3;
    const maxDrop = 0.7;
    const priceDrop = Math.random() * (maxDrop - minDrop) + minDrop;
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
};

await marketCrash();
