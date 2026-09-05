import { Link, useParams } from "react-router";
import {
  FaArrowRight,
  FaCalendar,
  FaCheck,
  FaClock,
  FaPlay,
  FaTrophy,
} from "react-icons/fa";
import { formatTime } from "../lib/formatTime";
import LoadingSpinner from "../components/LoadingSpinner";
import { useGetDeckHistory, useGetOneDeck } from "../hooks/useDecks";

type Completion = {
  id?: string;
  completedAt: string;
  completionDuration: number;
  correctAnswersCompleted: number;
  totalQuestions?: number;
};

type Deck = {
  id: string;
  title: string;
  createdAt: string;
  isCompleted: boolean;
  _count?: { cards: number };
  completionHistory?: Completion[];
};

const getPercentage = (score: number, total: number) =>
  total > 0 ? Math.round((score / total) * 100) : 0;

const getScoreTone = (percentage: number) => {
  if (percentage >= 80) return "text-emerald-500";
  if (percentage >= 50) return "text-yellow-300";
  if (percentage >= 30) return "text-amber-600";
  return "text-rose-500";
};

const DeckPage = () => {
  const { deckId } = useParams();
  const {
    data: deck,
    isLoading: isDeckLoading,
    isError: isDeckError,
  } = useGetOneDeck(deckId ?? "");
  const { data: fetchedHistory = [], isError: isHistoryError } =
    useGetDeckHistory(deckId ?? "");

  if (isDeckLoading) return <LoadingSpinner />;

  if (isDeckError || !deck) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center gap-3 text-center">
        <p className="text-lg font-semibold">This deck is unavailable</p>
        <p className="text-sm text-text-muted">
          It may have been deleted or you may no longer have access to it.
        </p>
        <Link
          to="/"
          className="rounded-xl bg-accent-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-hover"
        >
          Back to home
        </Link>
      </div>
    );
  }

  const typedDeck = deck as Deck;
  const history: Completion[] = fetchedHistory.length
    ? fetchedHistory
    : (typedDeck.completionHistory ?? []);
  const latestCompletion = history[0];
  const cardCount =
    typedDeck._count?.cards ?? latestCompletion?.totalQuestions ?? 0;
  const bestScore = history.length
    ? Math.max(
        ...history.map((completion) => completion.correctAnswersCompleted),
      )
    : 0;
  const bestPercentage = getPercentage(bestScore, cardCount);
  const latestPercentage = latestCompletion
    ? getPercentage(
        latestCompletion.correctAnswersCompleted,
        latestCompletion.totalQuestions ?? cardCount,
      )
    : 0;

  return (
    <div className="flex flex-col gap-5 pb-8 text-left">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-bg-surface p-5 shadow-xl shadow-black/5 sm:p-8">
        <div className="absolute right-0 top-0 h-40 w-40 translate-x-1/3 -translate-y-1/3 rounded-full bg-accent-primary/10 blur-2xl" />
        <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-medium text-text-muted">
              <Link to="/" className="transition hover:text-accent-primary">
                Home
              </Link>
              <span>/</span>
              <span>Deck</span>
            </div>
            <h1 className="max-w-3xl wrap-break-word text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
              {typedDeck.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-text-muted">
              <span className="rounded-full bg-bg-background px-3 py-1.5">
                {cardCount} {cardCount === 1 ? "card" : "cards"}
              </span>
              <span className="rounded-full bg-bg-background px-3 py-1.5">
                Created {new Date(typedDeck.createdAt).toLocaleDateString()}
              </span>
              {typedDeck.isCompleted && (
                <span className="rounded-full bg-emerald-500/10 px-3 py-1.5 font-medium text-emerald-500">
                  Completed
                </span>
              )}
            </div>
          </div>

          <Link
            to={`/deck/${typedDeck.id}/take`}
            className="inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-accent-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-primary/20 transition hover:-translate-y-0.5 hover:bg-accent-hover sm:w-auto"
          >
            <FaPlay className="text-xs" />
            {typedDeck.isCompleted ? "Retake quiz" : "Start quiz"}
            <FaArrowRight className="ml-1 text-xs" />
          </Link>
        </div>
      </section>

      {isHistoryError && (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-amber-600">
          Progress history could not be loaded. Your deck is still available.
        </div>
      )}

      {latestCompletion ? (
        <section className="rounded-3xl border border-white/10 bg-bg-surface p-5 shadow-xl shadow-black/5 sm:p-7">
          <div className="flex flex-col gap-2 border-b border-border-color pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-primary">
                Your progress
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                Keep your momentum
              </h2>
            </div>
            <p className="text-sm text-text-muted">
              {history.length} {history.length === 1 ? "attempt" : "attempts"}
            </p>
          </div>

          <div className="grid gap-3 py-5 sm:grid-cols-3">
            <div className="rounded-2xl bg-bg-background p-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="flex size-9 items-center justify-center rounded-xl bg-accent-primary/10 text-accent-primary">
                  <FaTrophy className="text-sm" />
                </span>
                <span
                  className={`text-2xl font-semibold ${getScoreTone(bestPercentage)}`}
                >
                  {bestPercentage}%
                </span>
              </div>
              <p className="text-xs text-text-muted">Best result</p>
              <p className="mt-1 font-semibold">
                {bestScore}{" "}
                <span className="font-normal text-text-muted">
                  / {cardCount}
                </span>
              </p>
            </div>

            <div className="rounded-2xl bg-bg-background p-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                  <FaCheck className="text-sm" />
                </span>
                <span
                  className={`text-2xl font-semibold ${getScoreTone(latestPercentage)}`}
                >
                  {latestPercentage}%
                </span>
              </div>
              <p className="text-xs text-text-muted">Latest result</p>
              <p className="mt-1 font-semibold">
                {latestCompletion.correctAnswersCompleted}{" "}
                <span className="font-normal text-text-muted">
                  / {latestCompletion.totalQuestions ?? cardCount}
                </span>
              </p>
            </div>

            <div className="rounded-2xl bg-bg-background p-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="flex size-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500">
                  <FaClock className="text-sm" />
                </span>
                <span className="text-2xl font-semibold text-text-primary">
                  {formatTime(latestCompletion.completionDuration)}
                </span>
              </div>
              <p className="text-xs text-text-muted">Latest time</p>
              <p className="mt-1 font-semibold text-text-primary">
                Time spent studying
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border-color bg-bg-background/60 p-4">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-medium">Latest accuracy</span>
              <span className="text-text-muted">{latestPercentage}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-bg-surface-hover">
              <div
                className="h-full rounded-full bg-accent-primary transition-all"
                style={{ width: `${latestPercentage}%` }}
              />
            </div>
          </div>
        </section>
      ) : (
        <section className="flex flex-col items-center rounded-3xl border border-dashed border-accent-primary/30 bg-accent-primary/5 px-6 py-10 text-center">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-accent-primary/10 text-accent-primary">
            <FaPlay className="ml-0.5 text-sm" />
          </span>
          <h2 className="mt-4 text-xl font-semibold">
            Ready for your first attempt?
          </h2>
          <p className="mt-2 max-w-md text-sm text-text-muted">
            Take the quiz once to start building your progress history.
          </p>
        </section>
      )}

      {history.length > 0 && (
        <section className="rounded-3xl border border-white/10 bg-bg-surface p-5 shadow-xl shadow-black/5 sm:p-7">
          <div className="mb-5 flex items-end justify-between border-b border-border-color pb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
                History
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                Recent attempts
              </h2>
            </div>
            <span className="text-sm text-text-muted">Newest first</span>
          </div>

          <div className="flex flex-col gap-2">
            {history.map((completion, index) => {
              const totalQuestions = completion.totalQuestions ?? cardCount;
              const score = completion.correctAnswersCompleted;
              const percentage = getPercentage(score, totalQuestions);

              return (
                <div
                  key={completion.id ?? `${completion.completedAt}-${index}`}
                  className="flex flex-col gap-4 rounded-2xl border border-border-color bg-bg-background/60 p-4 transition hover:border-accent-primary/30 sm:flex-row sm:items-center"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div
                      className={`flex size-10 shrink-0 items-center justify-center rounded-full bg-bg-surface text-sm font-semibold ${percentage >= 80 ? "text-accent-primary" : "text-text-muted"}`}
                    >
                      {percentage >= 80 ? (
                        <FaTrophy className="text-xs" />
                      ) : (
                        history.length - index
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium">
                        Attempt {history.length - index}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-text-muted">
                        <FaCalendar className="text-[10px]" />
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

                  <div className="grid grid-cols-3 gap-5 border-t border-border-color pt-3 text-xs sm:min-w-72 sm:border-t-0 sm:pt-0">
                    <div>
                      <p className="text-text-muted">Score</p>
                      <p
                        className={`mt-1 font-semibold ${getScoreTone(percentage)}`}
                      >
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
