import { applyFunds } from "@/lib/account";
import { NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { account: string } },
) {
  const { account } = params;
  const body = await req.json();

  const res = await applyFunds(account, body.amount);

  return Response.json(res);
}
