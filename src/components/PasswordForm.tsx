"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PasswordForm({
  authenticate,
}: {
  authenticate: (
    formData: FormData,
  ) => Promise<{ success: boolean; error?: string }>;
}) {
  const [error, setError] = useState("");
  const router = useRouter();

  async function onSubmit(formData: FormData) {
    const result = await authenticate(formData);
    if (result.success) {
      router.refresh();
    } else {
      setError(result.error || "Authentication failed");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          onSubmit(formData);
        }}
        className="max-w-md my-auto mx-auto p-6 bg-white rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            required
            className="mt-1 block w-full px-3 py-2 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Login
        </button>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </form>
    </div>
  );
}
