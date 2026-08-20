import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDeck,
  deleteDeck,
  getAllMyDecks,
  getCardsFromDeck,
  getDeckHistory,
  getOneDeck,
  updateDeck,
} from "../api/decks";

export function useGetAllMyDecks(limit?: number) {
  return useQuery({
    queryKey: ["decks", limit],
    queryFn: () => getAllMyDecks(limit),
    retry: false,
  });
}

export function useGetOneDeck(deckId: string) {
  return useQuery({
    queryKey: ["deck", deckId],
    queryFn: () => getOneDeck(deckId),
    enabled: Boolean(deckId),
    retry: false,
  });
}

export function useGetDeckHistory(deckId: string) {
  return useQuery({
    queryKey: ["deck-history", deckId],
    queryFn: () => getDeckHistory(deckId),
    enabled: Boolean(deckId),
    retry: false,
  });
}

export function useGetCardsFromDeck(deckId: string) {
  return useQuery({
    queryKey: ["cards", deckId],
    queryFn: () => getCardsFromDeck(deckId),
  });
}

export function useCreateDeck() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDeck,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["decks"] });
    },
  });
}

export function useUpdateDeck() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ deckId, data }: { deckId: string; data: any }) =>
      updateDeck(deckId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["decks"] });
    },
  });
}

export function useDeleteOneDeck() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDeck,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["decks"] });
    },
  });
}
