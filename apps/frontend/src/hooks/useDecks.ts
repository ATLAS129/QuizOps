import { useQuery } from "@tanstack/react-query";
import { getAllMyDecks } from "../api/decks";

export function useGetAllMyDecks() {
  return useQuery({
    queryKey: ["decks"],
    queryFn: getAllMyDecks,
    retry: false,
  });
}
