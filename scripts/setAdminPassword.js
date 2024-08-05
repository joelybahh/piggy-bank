const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const readline = require("readline");

const prisma = new PrismaClient();

async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function setAdminPassword() {
  rl.question("Enter the account ID: ", async (accountId) => {
    rl.question("Enter the new admin password: ", async (password) => {
      const hashedPassword = await hashPassword(password);
      console.log(hashedPassword);
      try {
        await prisma.accounts.update({
          where: { id: accountId },
          data: { password: hashedPassword },
        });
        console.log("Admin password set successfully");
      } catch (error) {
        console.error("Error setting admin password:", error);
      } finally {
        rl.close();
        await prisma.$disconnect();
      }
    });
  });
}

setAdminPassword();
