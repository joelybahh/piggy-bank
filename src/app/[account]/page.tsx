import PiggyBankApp from "@/components/PiggyBankApp";
import { getAccount } from "@/lib/account";

export default async function Home({
  params,
}: {
  params: { account: string };
}) {
  const account = await getAccount(params.account);

  if (!account) {
    return <div>Account not found</div>;
  }

  return <PiggyBankApp account={account} />;
}
