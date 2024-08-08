"use client";

import { fetchAccount, updateAccount } from "@/api";

export default function AdminDashboard({ accountId }: { accountId: string }) {
  const handleAward = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const amount = Number(new FormData(event.currentTarget).get("amount"));
    if (amount <= 0) {
      alert("Amount must be greater than 0");
      return;
    }
    await updateAccount(`/api/accounts/${accountId}/award`, {
      amount,
    });
  };

  const handleClear = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await fetchAccount(`/api/accounts/${accountId}/clear`);
  };

  return (
    <div className="p-4 bg-gray-800">
      <h1 className="text-2xl font-bold mb-4">
        Admin Dashboard for account {accountId}
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
            <p className="text-black">Total Savings: $0.00</p>
            <p className="text-black">Last Transaction: None</p>
          </div>
          {/** Clear account button */}

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
    </div>
  );
}
