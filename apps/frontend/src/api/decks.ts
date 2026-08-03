import { apiFetch } from "../lib/fetchClient";

export const getAllMyDecks = async () => {
  try {
    const res = await apiFetch("/decks");

    return res;
  } catch (err: any) {
    throw new Error(err.message);
  }
};

export const updateDeck = async (deckId: string, data: any) => {
  try {
    const res = await apiFetch(`/decks/${deckId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    return res;
  } catch (err: any) {
    throw new Error(err.message);
  }
};

export const deleteDeck = async (deckId: string) => {
  try {
    const res = await apiFetch(`/decks/${deckId}`, { method: "DELETE" });
    return res;
  } catch (err: any) {
    throw new Error(err.message);
  }
};
