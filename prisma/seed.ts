const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const account = await prisma.accounts.create({
    data: {
      awarded: 10,
      balance: 0,
      name: "Ashton's Account",
    },
  });

  const ashton = await prisma.users.create({
    data: {
      username: "ashton",
      password: "password",
      account_id: account.id,
    },
  });

  console.log("Created user: ", ashton);
  console.log("Created accoun: ", account);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
