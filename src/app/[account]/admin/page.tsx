import { cookies } from "next/headers";
import AdminDashboard from "@/components/AdminDashboard";
import PasswordForm from "@/components/PasswordForm";
import { isAdminAuthenticated } from "@/lib/auth";

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
    const isAuthenticated = await isAdminAuthenticated(
      params.account,
      password,
    );

    if (isAuthenticated) {
      return { success: true };
    } else {
      return { success: false, error: "Invalid password" };
    }
  }

  return <PasswordForm authenticate={authenticate} />;
}
