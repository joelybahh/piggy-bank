const { PrismaClient } = require("@prisma/client");
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
    rl.question("Enter the new passcode: ", async (passcode) => {
      try {
        await prisma.accounts.update({
          where: { id: accountId },
          data: { passcode: passcode },
        });
        console.log("passcode set successfully");
      } catch (error) {
        console.error("Error setting passcode:", error);
      } finally {
        rl.close();
        await prisma.$disconnect();
      }
    });
  });
}

setAdminPassword();
