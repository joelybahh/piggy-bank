import { awardFunds, createUserAndAccount } from "@/lib/account";
import { isAdminAuthenticated } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { account: string } },
) {
  const { account } = params;
  const body = await req.json();

  const adminAuthenticated = await isAdminAuthenticated(account);
  if (!adminAuthenticated) {
    return new Response("Unauthorized", { status: 401 });
  }

  const res = await createUserAndAccount(body.user, body.account);

  return Response.json(res);
}
