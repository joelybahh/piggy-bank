import { createGoal } from "@/lib/actions";
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

  const res = await createGoal(account, body);

  return Response.json(res);
}
