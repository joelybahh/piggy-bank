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
    <form action={onSubmit}>
      <input type="password" name="password" required />
      <button type="submit">Login</button>
      {error && <p>{error}</p>}
    </form>
  );
}
