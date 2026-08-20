import { Link, useParams } from "react-router";
import { FaCalendar, FaCheck, FaClock, FaPlay, FaTrophy } from "react-icons/fa";
import { formatTime } from "../lib/formatTime";
import LoadingSpinner from "../components/LoadingSpinner";
import { useGetDeckHistory, useGetOneDeck } from "../hooks/useDecks";

const DeckPage = () => {
  const { deckId } = useParams();
  const {
    data: deck,
    isLoading: isDeckLoading,
    isError: isDeckError,
  } = useGetOneDeck(deckId ?? "");
  const { data: completionHistory = [] } = useGetDeckHistory(deckId ?? "");

  if (isDeckLoading) {
    return <LoadingSpinner />;
  }

  if (isDeckError || !deck) {
    return <div>Something went wrong</div>;
  }

  const history = completionHistory.length
    ? completionHistory
    : (deck.completionHistory ?? []);
  const latestCompletion = history[0];
  const cardCount = deck._count?.cards ?? latestCompletion?.totalQuestions ?? 0;
  const bestScore = history.length
    ? Math.max(
        ...history.map((completion: any) => completion.correctAnswersCompleted),
      )
    : 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between rounded-3xl border border-white/10 bg-bg-surface px-5 py-8 shadow-xl shadow-black/10">
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl text-accent-primary">{deck.title}</h1>
          <div className="flex gap-2 items-center justify-start">
            <p className="text-sm">
              By{" "}
              <Link to={`/profile/${deck.userId}`}>
                <span className="hover:underline">John Doe</span>
              </Link>
            </p>
            <Link
              to={`/profile/${deck.userId}`}
              className="size-5 flex items-center justify-center rounded-full overflow-hidden"
            >
              <div className="size-5 rounded-full bg-accent-primary flex items-center justify-center text-[10px] text-white">
                {"John Doe"
                  .split(" ")
                  .map((part: string) => part[0])
                  .join("")
                  .toUpperCase()}
              </div>
            </Link>
            <div className="bg-bg-background rounded-full px-4 py-2 text-xs">
              {deck._count.cards} cards
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between">
          <p className="mt-1 text-xs text-text-muted">
            Created {new Date(deck.createdAt).toLocaleDateString()}
          </p>
          <Link
            to={`/deck/${deck.id}/take`}
            className="inline-flex items-center gap-2 rounded-lg text-white bg-accent-primary px-6 py-2 text-sm font-medium transition hover:bg-accent-hover"
          >
            <FaPlay className="text-xs" />
            Take quiz
          </Link>
        </div>
      </div>

      {deck.isCompleted && latestCompletion && (
        <section className="rounded-3xl border border-white/10 bg-bg-surface p-5 shadow-xl shadow-black/10 sm:p-7">
          <div className="flex flex-col gap-2 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="text-left">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent-primary">
                Your progress
              </p>
              <h2 className="mt-1 text-2xl font-semibold">
                Completion history
              </h2>
            </div>
            <span className="w-fit rounded-full bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-emerald-400">
              {history.length} attempts
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 py-5 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-2xl bg-bg-background/70 p-4 text-left">
              <span className="rounded-xl bg-accent-primary/15 p-3 text-accent-primary">
                <FaTrophy />
              </span>
              <div>
                <p className="text-xs text-text-muted">Best score</p>
                <p className="text-lg font-semibold">
                  {bestScore}/{cardCount}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-bg-background/70 p-4 text-left">
              <span className="rounded-xl bg-emerald-500/15 p-3 text-emerald-400">
                <FaCheck />
              </span>
              <div>
                <p className="text-xs text-text-muted">Latest result</p>
                <p className="text-lg font-semibold">
                  {latestCompletion.correctAnswersCompleted}/{cardCount}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-bg-background/70 p-4 text-left">
              <span className="rounded-xl bg-sky-500/15 p-3 text-sky-400">
                <FaClock />
              </span>
              <div>
                <p className="text-xs text-text-muted">Latest time</p>
                <p className="text-lg font-semibold">
                  {formatTime(latestCompletion.completionDuration)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 text-left">
            {history.map((completion: any, index: number) => {
              const score = completion.correctAnswersCompleted;
              const totalQuestions = completion.totalQuestions ?? cardCount;
              const percentage = Math.round((score / totalQuestions) * 100);

              return (
                <div
                  key={completion.completedAt}
                  className="group flex flex-col gap-4 rounded-2xl border border-white/10 bg-bg-background/50 p-4 transition hover:border-accent-primary/40 sm:flex-row sm:items-center"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div
                      className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${bestScore === score ? "bg-accent-primary text-white" : "bg-bg-surface text-text-muted"}`}
                    >
                      {bestScore === score ? (
                        <FaTrophy className="text-xs" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium">
                        Attempt {history.length - index}
                      </p>
                      <p className="flex items-center gap-1 text-xs text-text-muted">
                        <FaCalendar className="text-[10px]" />{" "}
                        {new Date(completion.completedAt).toLocaleDateString(
                          undefined,
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 border-t border-white/10 pt-3 text-xs sm:min-w-67.5 sm:border-t-0 sm:pt-0">
                    <div>
                      <p className="text-text-muted">Score</p>
                      <p className="mt-1 font-semibold text-emerald-400">
                        {score}/{totalQuestions}
                      </p>
                    </div>
                    <div>
                      <p className="text-text-muted">Accuracy</p>
                      <p className="mt-1 font-semibold">{percentage}%</p>
                    </div>
                    <div>
                      <p className="text-text-muted">Duration</p>
                      <p className="mt-1 font-semibold">
                        {formatTime(completion.completionDuration)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};

export default DeckPage;
