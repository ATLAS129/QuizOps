import { apiFetch } from "../lib/fetchClient";

export const getAllMyDecks = async () => {
  try {
    const res = await apiFetch("/decks");

    return res;
  } catch (err: any) {
    throw new Error(err.message);
  }
};
