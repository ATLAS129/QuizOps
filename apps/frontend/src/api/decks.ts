import { apiFetch } from "../lib/fetchClient";

export const getAllMyDecks = async (limit?: number) => {
  try {
    const res = await apiFetch(`/decks${limit ? `?limit=${limit}` : ""}`);

    return res;
  } catch (err: any) {
    throw new Error(err.message);
  }
};

export const createDeck = async (data: {
  url?: string;
  prompt?: string;
  file?: File | null;
}) => {
  try {
    const formData = new FormData();

    if (data.url) {
      formData.append("url", data.url);
    }
    if (data.prompt) {
      formData.append("prompt", data.prompt);
    }
    if (data.file) {
      formData.append("file", data.file);
    }

    const res = await apiFetch("/decks", {
      method: "POST",
      body: formData,
    });

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
