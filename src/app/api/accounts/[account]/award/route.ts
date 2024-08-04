// A nextJS 14 app router `route.ts` file

import { awardFunds } from "@/lib/account";
import { NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { account: string } },
) {
  const { account } = params;
  const body = await req.json();

  const total = Number(body.amount);
  if (isNaN(total)) {
    return new Response("Invalid awarded amount", { status: 400 });
  }

  const res = await awardFunds(account, total);

  return Response.json(res);
}
