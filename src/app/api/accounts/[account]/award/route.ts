import { awardFunds } from "@/lib/actions";
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

  const total = Number(body.amount);
  if (isNaN(total)) {
    return new Response("Invalid awarded amount", { status: 400 });
  }

  const res = await awardFunds(account, total);

  return Response.json(res);
}
