/* 
In this script I will simulate a bull market, and update the current price of all stocks to be between 30 and 70% more. After succeeding on this I can 
log some interesting insights into the console as well probably.
*/

import { PrismaClient } from "@prisma/client";

export const getRandomNumber = (min: number, max: number) => {
  const randomNumber = Math.random() * (max - min) + min;
  return randomNumber;
};

const financedb = new PrismaClient();

const bullMarket = async () => {
  const numStocksAfected = getRandomNumber(5, 60);
  const stocks = await financedb.stock.findMany({ take: numStocksAfected });
  for (const stock of stocks) {
    const priceDrop = getRandomNumber(0.3, 0.7);
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
  console.log("Bull market simulation complete!");
  await financedb.marketEvent.create({
    data: {
      eventName: "BullMarket",
      affectedStocks: {
        connect: stocks.map((stock) => ({ stockId: stock.stockId })),
      },
    },
  });
};

await bullMarket();
