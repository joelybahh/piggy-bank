export async function updateAccount(
  url: string,
  { amount }: { amount: number },
) {
  return await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount }),
  });
}

export async function fetchAccount(url: string) {
  return await fetch(url);
}
