import { PrismaClient } from "@prisma/client";
import { getUsers } from "../user";

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
