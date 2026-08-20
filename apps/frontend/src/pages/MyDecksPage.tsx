import { useGetAllMyDecks } from "../hooks/useDecks";
import LoadingSpinner from "../components/LoadingSpinner";
import { Link } from "react-router";
import { FaPlay } from "react-icons/fa";
import { formatTime } from "../lib/formatTime";

const MyDecksPage = () => {
  const { data: decks, isLoading: isDecksLoading } = useGetAllMyDecks();

  if (isDecksLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-3xl border border-white/10 bg-bg-surface p-8 shadow-xl shadow-black/10">
        <div className="flex flex-col gap-4">
          <p className="text-sm uppercase tracking-[0.2em] text-text-muted">
            Your decks
          </p>
          <h1 className="text-4xl font-semibold">💡All decks</h1>
        </div>
      </div>

      {decks && decks.length > 0 ? (
        <div className="flex flex-col gap-3">
          {decks.map((deck: any) => (
            <div
              key={deck.id}
              className="rounded-3xl border border-white/10 bg-bg-background/80 p-6 transition hover:-translate-y-1 hover:border-accent-primary/40"
            >
              <div className="mb-4 flex items-center justify-center gap-3">
                <div>
                  <Link
                    to={`/deck/${deck.id}`}
                    className="text-xl font-semibold hover:underline"
                  >
                    {deck.title}
                  </Link>
                  <p className="mt-1 text-sm text-text-muted">
                    Created {new Date(deck.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mt-6 relative flex items-center justify-center text-xs">
                <span className="absolute left-0 rounded-full bg-bg-surface px-3 py-2 text-left">
                  {deck._count?.cards ?? 0} cards
                </span>
                <Link
                  to={`/deck/${deck.id}/take`}
                  className="inline-flex items-center gap-2 rounded-lg text-white bg-accent-primary px-3 py-2 text-sm font-medium transition hover:bg-accent-hover"
                >
                  <FaPlay className="text-xs" />
                  Take quiz
                </Link>
                <div className="absolute right-0 flex justify-center items-center gap-3">
                  {deck.isCompleted &&
                    deck.completionHistory &&
                    (() => {
                      const completion = Array.isArray(deck.completionHistory)
                        ? deck.completionHistory[0]
                        : deck.completionHistory;

                      return completion ? (
                        <>
                          <div>
                            <span className="px-3 py-2 rounded-full bg-bg-surface text-xs text-text-muted">
                              Time spent
                            </span>
                            <span
                              className={`rounded-full px-3 py-2 text-xs font-medium`}
                            >
                              {formatTime(completion.completionDuration)}
                            </span>
                          </div>
                          <span
                            className={`rounded-full px-3 py-2 text-xs font-medium ${
                              deck.isCompleted
                                ? "bg-emerald-500/15 text-emerald-400"
                                : "bg-rose-500/15 text-rose-400"
                            }`}
                          >
                            {completion.correctAnswersCompleted +
                              "/" +
                              deck._count.cards}
                          </span>
                        </>
                      ) : null;
                    })()}
                  <span
                    className={`rounded-full px-3 py-2 text-xs font-medium ${
                      deck.isCompleted
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-rose-500/15 text-rose-400"
                    }`}
                  >
                    {deck.isCompleted ? "Completed" : "Not completed"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-white/10 bg-bg-background/70 p-10 text-center text-text-muted">
          There are no decks yet. Create one from the main page.
        </div>
      )}
    </div>
  );
};

export default MyDecksPage;
