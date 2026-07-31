import { apiFetch, BASE_URL } from "../lib/fetchClient";

export const fetchCurrentUser = async () => {
  try {
    const res = await apiFetch("/users/me");

    return res;
  } catch (err: any) {
    throw new Error(err.message);
  }
};

export const login = async (data: { email: string; password: string }) => {
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      body: JSON.stringify(data),
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const resError = await res.json();
      throw new Error(resError.message);
    }

    return res.json();
  } catch (err: any) {
    throw new Error(err.message);
  }
};

export const signup = async (data: {
  email: string;
  name: string;
  password: string;
  repeatPassword: string;
}) => {
  if (data.password !== data.repeatPassword) {
    throw new Error("Passwords do not match");
  }
  try {
    const res = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      body: JSON.stringify(data),
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const resError = await res.json();
      throw new Error(resError.message);
    }

    return res;
  } catch (err: any) {
    throw new Error(err.message);
  }
};
