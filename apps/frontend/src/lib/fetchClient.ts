export async function apiFetch(path: string, options: any = {}) {
  const headers = new Headers(options.headers || {});
  const baseUrl = import.meta.env.VITE_BASE_URL;

  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const doFetch = () =>
    fetch(`${baseUrl}${path}`, {
      ...options,
      credentials: "include",
      headers,
      body: options.body,
    });

  const res = await doFetch();

  const getErrorMessage = async (response: Response) => {
    const text = await response.text();
    if (!text) return "Request failed.";

    try {
      const payload = JSON.parse(text) as { message?: string | string[] };
      return Array.isArray(payload.message)
        ? payload.message.join(", ")
        : payload.message || text;
    } catch {
      return text;
    }
  };

  if (!res.ok) {
    if (res.status === 401) {
      const refreshRes = await fetch(`${baseUrl}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (!refreshRes.ok) {
        throw new Error("Session expired. Please log in again.");
      }

      const retryRes = await doFetch();

      if (!retryRes.ok) {
        const errorMessage = await getErrorMessage(retryRes);
        throw new Error(errorMessage || "Request failed.");
      }

      return retryRes.json();
    }
    const message = await getErrorMessage(res);
    throw new Error(message || "Something went wrong.");
  }

  return res.json();
}
