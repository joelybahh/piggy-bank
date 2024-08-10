"use server";

import prisma from "@/lib/prisma";

import { accounts as Account, users as User } from "@prisma/client";
import { hashPassword } from "./auth";

export const getAccountPublic = async (id: string) => {
  const account = await prisma.accounts.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
    },
  });
  return account;
};

export const getAccountAuthed = async (id: string) => {
  const account = await prisma.accounts.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      balance: true,
      awarded: true,
    },
  });
  return account;
};

export const applyFunds = async (id: string, cleared: number) => {
  const account = await getAccountAuthed(id);

  if (!account) throw new Error("Account not found");
  if (account.awarded === 0) throw new Error("No funds to clear");
  if (account.awarded < cleared) throw new Error("Insufficient funds");

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

export const awardFunds = async (id: string, awarded: number) => {
  const account = await getAccountAuthed(id);

  if (!account) throw new Error("Account not found");

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

export const unapplyFunds = async (id: string, amount: number) => {
  const account = await getAccountAuthed(id);

  if (!account) throw new Error("Account not found");
  if (account.balance === 0) throw new Error("No funds to unclear");
  if (account.balance < amount) throw new Error("Insufficient funds");

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

export const clearFunds = async (id: string) => {
  const account = await getAccountAuthed(id);

  if (!account) throw new Error("Account not found");

  const acc = await prisma.accounts.update({
    where: {
      id: account.id,
    },
    data: {
      awarded: 0,
      balance: 0,
    },
  });

  return acc;
};

export const createAccount = async (data: Account) => {
  const password = await hashPassword(data.password);
  const account = await prisma.accounts.create({
    data: {
      ...data,
      password,
    },
  });

  return account;
};

export const createUser = async (data: User) => {
  const user = await prisma.users.create({
    data,
  });

  return user;
};

export const createUserAndAccount = async (details: User, acc: Account) => {
  const account = await createAccount(acc);
  const user = await prisma.users.create({
    data: {
      ...details,
      account_id: account.id,
    },
    include: {
      account: {
        select: {
          id: true,
        },
      },
    },
  });

  return user;
};
