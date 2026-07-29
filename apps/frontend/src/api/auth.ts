import { apiFetch } from "../lib/fetchClient";

export async function fetchCurrentUser() {
  const check = () => apiFetch("/users/me", { credentials: "include" });

  let res = await check();

  if (res.status === 401) {
    const refreshRes = await apiFetch("/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (refreshRes.ok) {
      res = await check();
    } else {
      return null;
    }
  }

  return res;
}

export const login = async (data: { email: string; password: string }) =>
  apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const signup = async (data: {
  email: string;
  name: string;
  password: string;
  repeatPassword: string;
}) => {
  if (data.password !== data.repeatPassword) {
    throw new Error("Passwords do not match");
  }

  return apiFetch("/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });
};
