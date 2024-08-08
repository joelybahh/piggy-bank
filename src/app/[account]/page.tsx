// src/app/[account]/page.tsx
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import PasscodeForm from "@/components/PasscodeForm";
import PiggyBankApp from "@/components/PiggyBankApp";
import { getAccountAuthed, getAccountPublic } from "@/lib/account";

export default async function AccountPage({
  params,
}: {
  params: { account: string };
}) {
  const cookieStore = cookies();
  const isAuthenticated = cookieStore.get(`auth_${params.account}`);

  if (isAuthenticated) {
    const account = await getAccountAuthed(params.account);
    if (!account) {
      return <div>Account not found</div>;
    }
    return <PiggyBankApp account={account} />;
  }

  async function verifyPasscode(formData: FormData) {
    "use server";
    const inputPasscode = formData.get("passcode") as string;
    const account = await prisma.accounts.findUnique({
      where: { id: params.account },
      select: { passcode: true },
    });

    if (account?.passcode === inputPasscode) {
      cookies().set(`auth_${params.account}`, "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600 * 24, // 24 hours
      });
      return true;
    }
    return false;
  }

  const account = await getAccountPublic(params.account);

  return (
    <PasscodeForm verifyPasscode={verifyPasscode} title={account?.name || ""} />
  );
}
