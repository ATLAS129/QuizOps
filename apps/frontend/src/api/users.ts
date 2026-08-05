import { apiFetch } from "../lib/fetchClient";

export const updateMe = async (data: { name: string; email: string }) => {
  try {
    const res = await apiFetch("/users/me/update", {
      body: JSON.stringify(data),
      method: "PATCH",
    });

    return res;
  } catch (err: any) {
    throw new Error(err.message);
  }
};
