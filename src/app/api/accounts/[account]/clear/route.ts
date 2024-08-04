import { clearFunds } from "@/lib/account";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { account: string } },
) {
  const { account } = params;

  const res = await clearFunds(account);

  return Response.json(res);
}
