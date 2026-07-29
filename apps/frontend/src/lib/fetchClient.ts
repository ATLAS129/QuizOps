const BASE_URL = "http://localhost:3000";

export async function apiFetch(path: string, options: any = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
  });

  if (!res.ok) throw new Error("Something went wrong.");

  return res.json();
}
