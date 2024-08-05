import { cookies } from "next/headers";
import AdminDashboard from "@/components/AdminDashboard";
import PasswordForm from "@/components/PasswordForm";
import { verifyPassword } from "@/lib/auth";
import prisma from "@/lib/prisma";

export default async function AdminPage({
  params,
}: {
  params: { account: string };
}) {
  const cookieStore = cookies();
  const isAuthenticated = cookieStore.get(`admin_auth_${params.account}`);

  if (isAuthenticated) {
    return <AdminDashboard accountId={params.account} />;
  }

  async function authenticate(formData: FormData) {
    "use server";
    const password = formData.get("password") as string;
    const account = await prisma.accounts.findUnique({
      where: { id: params.account },
      select: {
        password: true,
      },
    });

    if (account && (await verifyPassword(password, account.password || ""))) {
      cookies().set(`admin_auth_${params.account}`, "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600, // 1 hour
      });
      return { success: true };
    }
    return { success: false, error: "Invalid password" };
  }

  return <PasswordForm authenticate={authenticate} />;
}
