import { useGetAllMyDecks } from "../hooks/useDecks";
import type { deckInterface } from "./MainPage";
import { FaPlay } from "react-icons/fa";

const DecksSection = () => {
  const { data: decks, isLoading } = useGetAllMyDecks();

  if (isLoading) {
    return <p>Loading</p>;
  }

  return (
    <div className="w-full max-h-1/2 bg-bg-surface flex flex-col items-center p-3">
      <h1 className="pb-3 w-full">✨My decks✨</h1>
      {decks ? (
        <div className="w-full flex flex-col gap-5 justify-center items-center">
          {decks.map((deck: deckInterface) => (
            <div
              key={deck.id}
              className="w-full bg-bg-background py-5 rounded-lg flex flex-col md:flex-row px-5 gap-5 items-center justify-between"
            >
              <h1 className="font-bold text-sm w-1/2">{deck.title}</h1>
              <div className="flex items-center justify-center gap-5">
                <p className="text-text-muted text-sm">
                  {deck._count.cards} cards
                </p>
                <div
                  className={`flex justify-center items-center rounded-md p-1 w-30 ${deck.isCompleted ? "bg-green-500" : "bg-red-500"}`}
                >
                  {deck.isCompleted ? "Completed" : "Not completed"}
                </div>
                <button className="bg-accent-primary hover:bg-accent-hover cursor-pointer px-3 py-1 rounded-md select-none flex justify-center items-center gap-2">
                  <FaPlay />
                  Take a quiz
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>No decks found</div>
      )}
    </div>
  );
};

export default DecksSection;
