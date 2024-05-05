/*
This script will:
1) Create a TS class for the Stock Entity.
2) Fetch data from two APIs to populate the different fields of Objects of the defined Stock Class.
3) Export a function that will create "n" nuber of Stock Objects that will be feed into the database through the seed.ts script.

Reference Entity Schema

model Stock {
  stockId      Int           @id @default(autoincrement())
  symbol       String        @unique
  companyName  String        @unique
  industry     String
  headQuarters String
  numEmployees Int
  currentPrice Float
  transactions Transaction[]
  portfolios   Portfolio[]   @relation("Portfolio@StocksManytoMany")
  marketEvents MarketEvent[] @relation("Event@StockManytoMany")
}

First we populate the independent fields of the entities (i.e., the ones which do not have any relations). 
We will tackle the ones with relations afterwards.

NOTE FOR PAU: I tried to populate the DB with multiple stocks using this financial model APIs, however there was a limit to their FREE Tier. So what I did was use the APIs in different day, write the results in a stocks.json file, and then read the results in the stocks.json file when populating the DB!

 */

import { writeFile } from "fs/promises";

export class Stock {
  constructor(
    public symbol: string,
    public companyName: string,
    public currentPrice: number,
    public industry?: string,
    public headQuarters?: string,
    public numEmployees?: number
  ) {}
}

const testData = async (n: Number) => {
  const response = await fetch(
    `https://financialmodelingprep.com/api/v3/search?&query=AA&limit=${n}&apikey=NA`
  );
  const results = await response.json();
  const stocks: Array<Stock> = [];
  console.log(results);
  for (const result of [...results]) {
    const companyInfo = await (
      await fetch(
        `https://financialmodelingprep.com/api/v3/profile/${result.symbol}?apikey=NA`
      )
    ).json();
    const companyInfoObject = companyInfo[0];
    stocks.push(
      new Stock(
        result.symbol,
        result.name,
        companyInfoObject.price,
        companyInfoObject.industry,
        companyInfoObject.country,
        companyInfoObject.fullTimeEmployees
      )
    );
  }
  console.log(stocks);
  await writeFile("stocks_fromAPI.json", JSON.stringify(stocks));
};

testData(50);
