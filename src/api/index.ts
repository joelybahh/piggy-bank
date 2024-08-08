export async function updateAccount(
  url: string,
  { amount }: { amount: number },
) {
  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount }),
  });
}

export async function fetchAccount(url: string) {
  const res = await fetch(url);
  return res.json();
}
