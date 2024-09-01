import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from 'uuid';
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import prisma from "./prisma";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET
);

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function generateToken(userId: string): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h") // Set to your preferred expiration time
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<{ userId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { userId: string };
  } catch (error) {
    return null;
  }
}

export async function verifySession(userId: string): Promise<boolean> {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get('session_token')?.value;

  if (!sessionToken) {
    return false;
  }

  const payload = await verifyToken(sessionToken);
  if (!payload || payload.userId !== userId) {
    return false;
  }

  const session = await prisma.session.findFirst({
    where: {
      userId: userId,
      expiresAt: { gt: new Date() },
    },
  });

  return !!session;
}

/**
 * Check if the admin is authenticated
 * @deprecated Use `verifySession` instead
 */
export async function isAdminAuthenticated(id: string, password?: string) {
  const account = await prisma.account.findUnique({
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


export async function createSession(userId: string, ipAddress?: string, userAgent?: string) {
  return prisma.session.create({
    data: {
      id: uuidv4(),
      userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      ipAddress,
      userAgent,
    },
  });
}

export async function getSessionFromToken(token: string) {
  const payload = await verifyToken(token);
  if (!payload) return null;

  const session = await prisma.session.findFirst({
    where: {
      userId: payload.userId,
      expiresAt: { gt: new Date() },
    },
    include: { user: true },
  });

  return session;
}

export async function invalidateSession(sessionId: string) {
  return prisma.session.delete({ where: { id: sessionId } });
}