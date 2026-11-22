import { useMemo, useState } from "react";
import { Link } from "react-router";
import { FaSearch } from "react-icons/fa";
import { useGetAllDecks } from "../hooks/useDecks";
import LoadingSpinner from "../components/LoadingSpinner";
import { useCurrentUser } from "../hooks/useAuth";

type ExploreDeck = {
  id: string;
  title: string;
  createdAt: string;
  user?: { id: string; name: string };
  _count?: { cards: number };
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const ExplorePage = () => {
  const [currentLimit, setCurrentLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"newest" | "largest">("newest");
  const {
    data: fetchedDecks,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetAllDecks(currentLimit);
  const { data: currentUser } = useCurrentUser();

  const decks = Array.isArray(fetchedDecks)
    ? (fetchedDecks as ExploreDeck[])
    : [];
  const visibleDecks = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = query
      ? decks.filter(
          (deck) =>
            deck.title.toLowerCase().includes(query) ||
            deck.user?.name.toLowerCase().includes(query),
        )
      : decks;

    return [...filtered].sort((first, second) =>
      sort === "largest"
        ? (second._count?.cards ?? 0) - (first._count?.cards ?? 0)
        : new Date(second.createdAt).getTime() -
          new Date(first.createdAt).getTime(),
    );
  }, [decks, search, sort]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 py-6 text-left">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-semibold leading-tight tracking-tight text-text-primary sm:text-4xl">
          Explore quizzes
        </h1>
        <Link
          to="/create"
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-accent-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
        >
          Create quiz
        </Link>
      </header>

      <section
        aria-label="Find quizzes"
        className="flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <label className="relative min-w-0 flex-1">
          <FaSearch
            aria-hidden="true"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-text-muted"
          />
          <span className="sr-only">Search by quiz title or creator</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search quizzes or creators"
            className="h-11 w-full rounded-lg border border-bg-surface-hover bg-bg-surface py-2 pl-10 pr-3 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-accent-primary"
          />
        </label>
        <label className="flex w-full shrink-0 items-center justify-between gap-3 text-sm text-text-muted sm:w-auto sm:justify-start">
          <span>Sort by</span>
          <select
            value={sort}
            onChange={(event) =>
              setSort(event.target.value as "newest" | "largest")
            }
            className="h-11 min-w-0 flex-1 rounded-lg border border-bg-surface-hover bg-bg-surface px-3 text-sm text-text-primary outline-none focus:border-accent-primary sm:flex-none"
          >
            <option value="newest">Newest</option>
            <option value="largest">Most questions</option>
          </select>
        </label>
      </section>

      {isError ? (
        <section className="rounded-md border border-bg-surface-hover bg-bg-surface p-5 sm:p-6">
          <p className="font-medium text-text-primary">
            Quizzes couldn’t be loaded.
          </p>
          <p className="mt-1 text-sm text-text-muted">
            Check your connection and try again.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 inline-flex min-h-11 items-center justify-center rounded-lg bg-accent-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
          >
            Try again
          </button>
        </section>
      ) : visibleDecks.length === 0 ? (
        <section className="rounded-md border border-bg-surface-hover bg-bg-surface p-5">
          <p className="font-medium text-text-primary">
            {search
              ? "No matching quizzes."
              : "No quizzes have been shared yet."}
          </p>
          <p className="mt-1 text-sm text-text-muted">
            {search
              ? "Try another title or creator name."
              : "Check back later, or create a quiz to get started."}
          </p>
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-3 inline-flex min-h-11 items-center justify-center rounded-lg border border-bg-surface-hover px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:border-accent-primary/50 hover:bg-bg-background"
            >
              Clear search
            </button>
          )}
          {!search && (
            <Link
              to="/create"
              className="mt-4 inline-flex min-h-11 items-center justify-center rounded-lg bg-accent-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
            >
              Create a quiz
            </Link>
          )}
        </section>
      ) : (
        <section aria-label="Quiz results">
          <div className="mb-3 flex min-h-11 items-center justify-between gap-3">
            <p className="text-sm text-text-muted" aria-live="polite">
              {visibleDecks.length}{" "}
              {visibleDecks.length === 1 ? "quiz" : "quizzes"}
              {search ? " found" : ""}
            </p>
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg px-3 text-sm font-medium text-accent-primary transition-colors hover:bg-accent-primary/5"
              >
                Clear search
              </button>
            )}
          </div>
          <ul className="overflow-hidden rounded-md border border-bg-surface-hover bg-bg-surface">
            {visibleDecks.map((deck) => {
              const creator =
                deck.user?.id === currentUser?.id
                  ? "You"
                  : (deck.user?.name ?? "Community member");
              const cardCount = deck._count?.cards ?? 0;

              return (
                <li
                  key={deck.id}
                  className="flex flex-col gap-3 border-b border-bg-surface-hover px-4 py-4 last:border-b-0 transition-colors hover:bg-bg-background/60 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-5"
                >
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/deck/${deck.id}`}
                      className="block wrap-break-word text-base font-semibold leading-6 text-text-primary hover:text-accent-primary"
                    >
                      {deck.title}
                    </Link>
                    <div className="mt-2 flex min-w-0 items-center gap-2">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent-primary/10 text-xs font-semibold text-accent-primary">
                        {creator.charAt(0).toUpperCase()}
                      </span>
                      <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5 text-xs text-text-muted">
                        {deck.user?.id ? (
                          <Link
                            to={`/profile/${deck.user.id}`}
                            className="truncate font-medium text-text-primary hover:text-accent-primary hover:underline"
                          >
                            {creator}
                          </Link>
                        ) : (
                          <span className="truncate font-medium text-text-primary">
                            {creator}
                          </span>
                        )}
                        <span>{formatDate(deck.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center justify-between gap-4 sm:justify-end sm:gap-5">
                    <span className="whitespace-nowrap text-xs text-text-muted sm:text-sm">
                      {cardCount} {cardCount === 1 ? "question" : "questions"}
                    </span>
                    <Link
                      to={`/deck/${deck.id}/take`}
                      className="inline-flex min-h-11 min-w-24 items-center justify-center rounded-lg bg-accent-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
                    >
                      Practice
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {!isError && decks.length >= currentLimit && (
        <div className="text-center">
          {search && (
            <p className="mb-2 text-sm text-text-muted">
              Searching the latest {decks.length} quizzes. Load more to check
              older quizzes too.
            </p>
          )}
          <button
            type="button"
            disabled={isFetching}
            onClick={() => setCurrentLimit((limit) => limit + 10)}
            className="min-h-11 rounded-lg border border-bg-surface-hover px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:border-accent-primary hover:bg-bg-surface disabled:cursor-wait disabled:opacity-60"
          >
            {isFetching ? "Loading…" : "Load more quizzes"}
          </button>
        </div>
      )}
    </main>
  );
};

export default ExplorePage;
