import { PrismaClient } from "@prisma/client";
import { getUsers } from "../user";
import fs from "fs";

const financedb = new PrismaClient();

const createUsers = async (n: number) => {
  const users = await getUsers(n);
  try {
    for (const user of users) {
      const data = { name: user.name, alias: user.alias, email: user.email };
      console.log("Attempting to create user with data:", data);
      const newUser = await financedb.user.create({
        data,
      });
      console.log("User created");
    }
  } catch (error) {
    console.error(error);
  }
};
await createUsers(100);

const createStocks = async () => {
  console.log("Creating stocks");
  //load the contents of a stocks.json file into a variable
  //loop through the stocks and create a new stock for each one
  //save the stocks to the database
  const stocksData = fs.readFileSync("stocks.json", "utf8");
  const stocks = JSON.parse(stocksData);
  for (const stock of stocks) {
    console.log("Creating stock with data:", stock);
    await financedb.stock.create({
      data: {
        symbol: stock.symbol,
        companyName: stock.companyName,
        currentPrice: stock.currentPrice,
        industry: stock.industry,
        headQuarters: stock.headQuarters,
        numEmployees: Number(stock.numEmployees),
      },
    });
  }
};

await createStocks();
