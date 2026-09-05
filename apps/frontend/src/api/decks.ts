import { apiFetch } from "../lib/fetchClient";

export const getAllMyDecks = async (limit?: number) => {
  try {
    const res = await apiFetch(`/decks${limit ? `?limit=${limit}` : ""}`);

    return res;
  } catch (err: any) {
    throw new Error(err.message);
  }
};

export const getOneDeck = async (deckId: string) => {
  try {
    const res = await apiFetch(`/decks/${deckId}`);

    return res;
  } catch (err: any) {
    throw new Error(err.message);
  }
};

export const getDeckHistory = async (deckId: string, limit?: number) => {
  try {
    const res = await apiFetch(
      `/decks/${deckId}/history${limit ? `?limit=${limit}` : ""}`,
    );

    return res;
  } catch (err: any) {
    throw new Error(err.message);
  }
};

export const getCardsFromDeck = async (deskId: string) => {
  try {
    const res = await apiFetch(`/decks/${deskId}/cards`);

    return res;
  } catch (err: any) {
    throw new Error(err.message);
  }
};

export const createDeck = async (data: {
  url?: string;
  prompt?: string;
  file?: File | null;
  questionType?: "Mixed" | "Multiple choice" | "True / False";
  difficulty?: "Easy" | "Medium" | "Hard" | "Mixed";
  numberOfQuestions?: "5" | "10" | "15" | "20";
  extraOptions?: string[];
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
    if (data.difficulty) {
      formData.append("difficulty", data.difficulty);
    }
    if (data.questionType) {
      formData.append("questionType", data.questionType);
    }
    if (data.numberOfQuestions) {
      formData.append("numberOfQuestions", data.numberOfQuestions);
    }
    if (data.extraOptions?.length) {
      formData.append("extraOptions", JSON.stringify(data.extraOptions));
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
