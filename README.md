# Full Stack Web Development Project 3 - Data Model

This project simulates various scenarios in the financial services industry, including acquisitions, workforce shifts between industries, and market "manipulations". It leverages Prisma as an ORM to interact with a PostgreSQL database.

## Getting Started

Follow these steps to get your application up and running:

### 1. Install Dependencies

First, clone the repository and install the necessary dependencies:

```
$ bun install
```

### 2. Set up Database

Navigate to the directory containing the docker-compose.yml file and launch the Docker container:

```
$ cd docker
$ docker-compose up -d
```

the `-d`flag runs the containers in the background, so you will be able to keep using the terminal.

### 3. Configure Environment Variable

Ensure your .env file is set up correctly in the root directory of the project. It should include the correct database connection string:

```
DATABASE_URL="postgresql://fullstack:fullstack123@localhost:5432/financeDB"
```

Replace fullstack:fullstack123 with your username and password if different, and playground with your database name as necessary. Otherwise, if you leave the default values in the docker-compose.yml file you can use the URL above.

### 4. Set up Prisma

Run the following commands to set up Prisma. These commands generate the Prisma client and push the schema to your database, creating any necessary tables.

```
$ bunx prisma generate
$ bunx prisma db push
```

### 5. Seed the Database

To populate your database with initial data:

```
$ bunx prisma db seed
```

This step executes the seeding script defined in your prisma/seed.ts, which should populate your database with the initial required data.

### 6. Open Prisma Studio

In order to explore the data generated in the previous step, and to observe the changes produced by the scripts, it is strongly recommended to open Prisma Studio. You may do so by executing the following command:

```
$bunx prisma studio
```

You can then open Prisma Studio in you web browser with the output URL.

## Play Around!!

This project includes scripts to simulate playful scenarios with the data generated in the `seed` command. Below are the explanations on what each of them do, as well as instructions on how to execute them:

### marketManiuplation
