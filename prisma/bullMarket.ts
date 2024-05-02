/* 
In this script I will simulate a bull market, and update the current price of all stocks to be between 30 and 70% more. After succeeding on this I can 
log some interesting insights into the console as well probably.
*/

import { PrismaClient } from "@prisma/client";

const financedb = new PrismaClient();

const bullMarket = async () => {
  const stocks = await financedb.stock.findMany();
  for (const stock of stocks) {
    const minIncrease = 0.3;
    const maxIncrease = 0.7;
    const priceDrop = Math.random() * (maxIncrease - minIncrease) + minIncrease;
    console.log(`price drop: ${priceDrop * 100}`);
    const newPrice = (
      stock.currentPrice +
      stock.currentPrice * priceDrop
    ).toFixed(2);
    console.log(
      `Stock ${
        stock.symbol
      } has benefited from the bullish market rush!! Their share price rosed from ${stock.currentPrice.toFixed(
        2
      )} to ${newPrice} USD.`
    );
    await financedb.stock.update({
      where: { stockId: stock.stockId },
      data: { currentPrice: parseFloat(newPrice) },
    });
  }
};

await bullMarket();
