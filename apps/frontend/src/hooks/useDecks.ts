import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDeck,
  deleteDeck,
  getAllMyDecks,
  updateDeck,
} from "../api/decks";

export function useGetAllMyDecks(limit?: number) {
  return useQuery({
    queryKey: ["decks", limit],
    queryFn: () => getAllMyDecks(limit),
    retry: false,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
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
