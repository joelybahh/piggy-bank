import { cookies } from "next/headers";
import AdminDashboard from "@/components/AdminDashboard";
import PasswordForm from "@/components/PasswordForm";
import { isAdminAuthenticated } from "@/lib/auth";
import { getAccountAuthed } from "@/lib/actions";

export default async function AdminPage({
  params,
}: {
  params: { account: string };
}) {
  const cookieStore = cookies();
  const isAuthenticated = cookieStore.get(`admin_auth_${params.account}`);

  if (isAuthenticated) {
    const account = await getAccountAuthed(params.account);

    if (!account) {
      return <div>Account not found</div>;
    }

    return <AdminDashboard account={account} />;
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
