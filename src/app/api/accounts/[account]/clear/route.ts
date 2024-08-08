import { clearFunds } from "@/lib/account";
import { isAdminAuthenticated } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { account: string } },
) {
  const { account } = params;

  const adminAuthenticated = await isAdminAuthenticated(account);
  if (!adminAuthenticated) {
    return new Response("Unauthorized", { status: 401 });
  }

  const res = await clearFunds(account);

  return Response.json(res);
}
