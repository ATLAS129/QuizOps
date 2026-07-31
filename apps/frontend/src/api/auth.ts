import { apiFetch } from "../lib/fetchClient";

export const fetchCurrentUser = async () =>
  apiFetch("/users/me", { credentials: "include" });

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
