import { getAllAccounts } from "@/lib/actions";
import Link from "next/link";

export default async function Home() {
  const accounts = await getAllAccounts();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {accounts.map((account) => (
        <Link key={account.id} href={`/${account.id}`}>
          <div className="border p-4 rounded shadow-lg cursor-pointer">
            <h2 className="text-xl font-bold">{account.name}</h2>
            <p className="text-gray-700">
              Balance: ${account.balance.toFixed(2)}
            </p>
            <p className="text-gray-500">
              Awarded: ${account.awarded.toFixed(2)}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
