import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteDeck, getAllMyDecks, updateDeck } from "../api/decks";

export function useGetAllMyDecks() {
  return useQuery({
    queryKey: ["decks"],
    queryFn: getAllMyDecks,
    retry: false,
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
