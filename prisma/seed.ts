import { PrismaClient } from "@prisma/client";

const financedb = new PrismaClient();

const amazon = await financedb.stock.create({
  data: {
    companyName: "Amazon",
    symbol: "AMZN",
    currentPrice: 100,
  },
});

console.log(
  `New Stock registered: ${amazon.companyName}, with symbol ${amazon.symbol}`
);

const google = await financedb.stock.create({
  data: {
    companyName: "Google",
    symbol: "GOOG",
    currentPrice: 110,
  },
});

console.log(
  `New Stock registered: ${google.companyName}, with symbol ${google.symbol}`
);

const microsoft = await financedb.stock.create({
  data: {
    companyName: "Microsoft",
    symbol: "MSFT",
    currentPrice: 90,
  },
});

console.log(
  `New Stock registered: ${amazon.companyName}, with symbol ${amazon.symbol}`
);
