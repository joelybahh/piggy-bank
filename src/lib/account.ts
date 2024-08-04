import prisma from "@/lib/prisma";

export const getAccount = async (username: string) => {
  const account = await prisma.accounts.findFirst({
    where: {
      user: {
        username,
      },
    },
  });
  return account;
};

// Account Error class with appropriate status code
export class AccountError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export const applyFunds = async (username: string, cleared: number) => {
  const account = await getAccount(username);

  if (!account) throw new AccountError("Account not found", 404);
  if (account.awarded === 0) throw new AccountError("No funds to clear", 400);
  if (account.awarded < cleared)
    throw new AccountError("Insufficient funds", 400);

  const acc = await prisma.accounts.update({
    where: {
      id: account.id,
    },
    data: {
      awarded: account.awarded - cleared,
      balance: account.balance + cleared,
    },
  });

  return acc;
};

export const awardFunds = async (username: string, awarded: number) => {
  const account = await getAccount(username);

  if (!account) throw new AccountError("Account not found", 404);

  const acc = await prisma.accounts.update({
    where: {
      id: account.id,
    },
    data: {
      awarded: account.awarded + awarded,
    },
  });

  return acc;
};

export const unapplyFunds = async (username: string, amount: number) => {
  const account = await getAccount(username);

  if (!account) throw new AccountError("Account not found", 404);
  if (account.balance === 0) throw new AccountError("No funds to unclear", 400);
  if (account.balance < amount)
    throw new AccountError("Insufficient funds", 400);

  const acc = await prisma.accounts.update({
    where: {
      id: account.id,
    },
    data: {
      awarded: account.awarded + amount,
      balance: account.balance - amount,
    },
  });

  return acc;
};
