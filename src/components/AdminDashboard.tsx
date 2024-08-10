"use client";

import { fetchAccount, updateAccount } from "@/api";
import { accounts as Account } from "@prisma/client";
import { useState } from "react";

export default function AdminDashboard({
  account,
}: {
  account: {
    id: Account["id"];
    name: Account["name"];
    balance: Account["balance"];
    awarded: Account["awarded"];
  };
}) {
  const [awarded, setAwarded] = useState(account.awarded);
  const [balance, setBalance] = useState(account.balance);

  const handleAward = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const amount = Number(new FormData(event.currentTarget).get("amount"));
    if (amount <= 0) {
      alert("Amount must be greater than 0");
      return;
    }
    const response = await updateAccount(`/api/accounts/${account.id}/award`, {
      amount,
    });

    const data = await response.json();
    if (response.ok) {
      setAwarded(data.awarded);
    } else {
      alert(data.message);
    }
  };

  const handleClear = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await fetchAccount(`/api/accounts/${account.id}/clear`);

    const data = await response.json();
    if (response.ok) {
      setBalance(data.balance);
      setAwarded(data.awarded);
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="p-4 bg-gray-800 h-full">
      <h1 className="text-2xl font-bold mb-4">
        Admin Dashboard for account {account.id}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2 text-black">
            Award Pocket Money
          </h2>
          <form onSubmit={handleAward}>
            <label className="block mb-2 text-black">
              Amount:
              <input
                name="amount"
                type="number"
                step="0.05"
                className="border p-2 rounded w-full"
              />
            </label>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded"
            >
              Award
            </button>
          </form>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2 text-black">
            Create Chores (Coming Soon)
          </h2>
          <form>
            <label className="block mb-2 text-black">
              Chore Name:
              <input
                type="text"
                className="border p-2 rounded w-full"
                disabled
              />
            </label>
            <label className="block mb-2 text-black">
              Reward:
              <input
                type="number"
                className="border p-2 rounded w-full"
                disabled
              />
            </label>
            <button
              type="submit"
              className="bg-green-500 text-white p-2 rounded"
              disabled
            >
              Create
            </button>
          </form>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2 text-black">
            Track Savings
          </h2>
          <div className="border p-2 rounded">
            <p className="text-black">
              Total in Money Box: ${balance.toFixed(2)}
            </p>
            <p className="text-black">Total Awarded: ${awarded.toFixed(2)}</p>
            <p className="text-black">Last Transaction: None</p>
          </div>
          <div className="flex gap-4 mt-2">
            <form action="./">
              <button
                type="submit"
                className="bg-yellow-500 text-white p-2 rounded mt-2"
              >
                View Account
              </button>
            </form>
            <form onSubmit={handleClear}>
              <button
                type="submit"
                className="bg-red-500 text-white p-2 rounded mt-2"
              >
                Clear Account
              </button>
            </form>
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2 text-black">Add Account</h2>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2 text-black">Setup Goal</h2>
        </div>
      </div>
    </div>
  );
}
