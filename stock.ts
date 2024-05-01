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

 */

import { writeFile } from "fs/promises";

export class Stock {
  public symbol: string;
  public companyName: string;
  public industry?: string;
  public headQuarters?: string;
  public numEmployees?: number;
  public currentPrice: number;

  constructor(
    symbol: string,
    companyName: string,
    currentPrice: number,
    industry?: string,
    headQuarters?: string,
    numEmployees?: number
  ) {
    this.symbol = symbol;
    this.companyName = companyName;
    this.industry = industry;
    this.headQuarters = headQuarters;
    this.numEmployees = numEmployees;
    this.currentPrice = currentPrice;
  }
}

const testData = async (n: Number) => {
  const response = await fetch(
    `https://financialmodelingprep.com/api/v3/search?&query=AA&limit=${n}&apikey=YDfBNhrA06arKawmBGoNInbOs6J8VgXX`
  );
  const results = (await response.json()) as { results: any[] };
  const stocks: Array<Stock> = [];
  console.log(results);
  for (const result of results) {
    const companyInfo = (await (
      await fetch(
        `https://financialmodelingprep.com/api/v3/profile/${result.symbol}?apikey=YDfBNhrA06arKawmBGoNInbOs6J8VgXX`
      )
    ).json()) as { companyInfo: any[] };
    stocks.push(
      new Stock(
        result.symbol,
        result.name,
        companyInfo[0].price,
        companyInfo[0].industry,
        companyInfo[0].country,
        companyInfo[0].fullTimeEmployees
      )
    );
  }
  console.log(stocks);
  await writeFile("stocks.json", JSON.stringify(stocks));
};

testData(100);
