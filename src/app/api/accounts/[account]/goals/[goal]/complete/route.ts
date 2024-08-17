import { completeGoal, unapplyFunds } from "@/lib/account";
import { NextRequest } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { account: string; goal: string } },
) {
  const { account, goal } = params;

  const res = await completeGoal(account, goal);

  return Response.json(res);
}
