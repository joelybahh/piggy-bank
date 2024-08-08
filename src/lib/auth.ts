import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import prisma from "./prisma";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function isAdminAuthenticated(id: string, password?: string) {
  const account = await prisma.accounts.findUnique({
    where: { id },
    select: {
      password: true,
    },
  });

  const cookieStore = cookies();
  const alreadyAuthenticated = cookieStore.get(`admin_auth_${id}`);
  if (alreadyAuthenticated) return true;

  if (!password) return false;

  if (account && (await verifyPassword(password, account.password || ""))) {
    cookies().set(`admin_auth_${id}`, "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600, // 1 hour
    });
    return true;
  }
  return false;
}
