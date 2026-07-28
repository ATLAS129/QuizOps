import { useRef } from "react";
import { FaFilePdf } from "react-icons/fa6";

interface deckInterface {
  title: string;
  isCompleted: boolean;
  cards: number;
}

const decks: deckInterface[] = [
  { title: "First quiz", isCompleted: true, cards: 5 },
  { title: "Second quiz", isCompleted: false, cards: 10 },
  { title: "Third quiz", isCompleted: true, cards: 7 },
];

const MainPageComponent = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = () => {
    if (!textareaRef.current) return;

    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  };

  return (
    <main className="p-3 flex flex-col gap-5">
      <div className="w-full max-h-1/2 bg-bg-surface flex flex-col items-center p-3">
        <h1 className="pb-3">
          💡Generate quizzes from PDFs, 💻websites, or your own instructions.🚀
        </h1>
        <div className="bg-bg-background hover:brightness-110 flex flex-col justify-center items-center w-full rounded-lg">
          <div className="w-full flex flex-col justify-center items-center gap-8 cursor-pointer flex-1 py-6">
            <FaFilePdf className="size-24" />
            <div className="select-none">
              <p>Drag and drop PDF here</p>
              <p className="text-xs text-text-muted">
                Supports PDF up to 50 MB
              </p>
            </div>
          </div>
        </div>
        <p className="px-5 py-2">
          or{" "}
          <span className="underline cursor-pointer hover:no-underline">
            Select file
          </span>
        </p>
        <p className="pb-4 pt-2 text-center text-text-muted px-3">
          You can combine multiple sources
        </p>

        <div className="w-full flex flex-col justify-center items-center gap-5 px-2">
          <div className="w-full py-3 px-2 flex items-center gap-3 bg-bg-background rounded-lg">
            <label htmlFor="url" className="w-1/5 text-text-muted">
              📱URL
            </label>
            <input
              type="text"
              id="url"
              className="flex-1 border border-bg-surface-hover px-2 py-3 rounded-sm"
              placeholder="Paste webpage URL..."
            />
          </div>
          <div className="w-full py-4 px-2 flex items-center gap-3 bg-bg-background rounded-lg">
            <label htmlFor="prompt" className="w-1/5 text-text-muted">
              ✏️Prompt
            </label>
            <textarea
              ref={textareaRef}
              rows={1}
              onInput={handleInput}
              placeholder="Ask AI what quiz to create..."
              className="px-2 py-2 w-full resize-none overflow-y-auto border border-bg-surface-hover min-h-11 max-h-50 flex-1 rounded-sm"
            />
          </div>
        </div>

        <div className="pt-5">
          <button className="py-2 px-32 bg-accent-primary hover:bg-accent-hover cursor-pointer rounded-lg">
            Generate
          </button>
        </div>
        <div className="text-text-muted text-xs pt-1">
          Choose atleast one source
        </div>
      </div>

      <div className="w-full max-h-1/2 bg-bg-surface flex flex-col items-center p-3">
        <h1 className="pb-3">✨My decks✨</h1>
        {decks ? (
          <div className="w-full flex flex-col gap-5 justify-center items-center">
            {decks.map((deck) => (
              <div className="w-full bg-bg-background py-5 rounded-lg flex flex-col lg:flex-row px-5 gap-5 items-center justify-between">
                <h1 className="font-bold">{deck.title}</h1>
                <div className="flex flex-col lg:flex-row items-center justify-center gap-5">
                  <p>{deck.cards} cards</p>
                  <div className="flex gap-5">
                    <div
                      className={`flex justify-center items-center rounded-md w-30 ${deck.isCompleted ? "bg-green-500" : "bg-red-500"}`}
                    >
                      {deck.isCompleted ? "Completed" : "Not completed"}
                    </div>
                    <button className="bg-accent-primary hover:bg-accent-hover cursor-pointer px-3 py-1 rounded-md select-none">
                      Take a quiz
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>No decks found</div>
        )}
      </div>
    </main>
  );
};

export default MainPageComponent;
