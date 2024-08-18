import { unapplyFunds } from "@/lib/actions";
import { NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { account: string } },
) {
  const { account } = params;
  const body = await req.json();

  const res = await unapplyFunds(account, body.amount);

  return Response.json(res);
}
