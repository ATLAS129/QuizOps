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
    <main className="mx-auto w-full max-w-4xl space-y-5 py-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
            Explore quizzes
          </h1>
        </div>
        <Link
          to="/create"
          className="inline-flex min-h-9 items-center justify-center rounded-lg border border-bg-surface-hover px-3 py-1.5 text-sm font-medium text-text-primary transition"
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
            className="h-10 w-full rounded-lg border border-bg-surface-hover bg-bg-surface py-2 pl-10 pr-3 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20"
          />
        </label>
        <label className="flex shrink-0 items-center gap-2 text-sm text-text-muted">
          <span>Sort by</span>
          <select
            value={sort}
            onChange={(event) =>
              setSort(event.target.value as "newest" | "largest")
            }
            className="h-10 rounded-lg border border-bg-surface-hover bg-bg-surface px-3 text-sm text-text-primary outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20"
          >
            <option value="newest">Newest</option>
            <option value="largest">Most questions</option>
          </select>
        </label>
      </section>

      {isError ? (
        <section className="rounded-xl border border-bg-surface-hover bg-bg-surface p-6">
          <p className="font-medium text-text-primary">
            Quizzes couldn’t be loaded.
          </p>
          <p className="mt-1 text-sm text-text-muted">
            Check your connection and try again.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 rounded-lg border border-bg-surface-hover px-3 py-2 text-sm font-medium text-text-primary transition hover:bg-bg-background"
          >
            Try again
          </button>
        </section>
      ) : visibleDecks.length === 0 ? (
        <section className="rounded-xl border border-bg-surface-hover bg-bg-surface p-5">
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
              className="mt-3 text-sm font-medium text-accent-primary hover:underline"
            >
              Clear search
            </button>
          )}
        </section>
      ) : (
        <section aria-label="Quiz results">
          <p className="mb-3 text-sm text-text-muted" aria-live="polite">
            {visibleDecks.length}{" "}
            {visibleDecks.length === 1 ? "quiz" : "quizzes"}
            {search ? " found" : ""}
          </p>
          <ul className="rounded-md border flex flex-col gap-10 border-bg-surface-hover bg-bg-surface">
            {visibleDecks.map((deck) => {
              const creator =
                deck.user?.id === currentUser?.id
                  ? "You"
                  : (deck.user?.name ?? "Community member");
              const cardCount = deck._count?.cards ?? 0;

              return (
                <li
                  key={deck.id}
                  className="flex flex-col items-stretch gap-3 border-b border-bg-surface-hover px-4 py-3 last:border-b-0 transition-colors hover:bg-bg-background/60 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent-primary/10 text-xs font-semibold text-accent-primary">
                        {creator.charAt(0).toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        {deck.user?.id ? (
                          <Link
                            to={`/profile/${deck.user.id}`}
                            className="block truncate text-sm font-medium text-text-primary hover:text-accent-primary hover:underline"
                          >
                            {creator}
                          </Link>
                        ) : (
                          <span className="block truncate text-sm font-medium text-text-primary">
                            {creator}
                          </span>
                        )}
                        <span className="block text-xs text-text-muted">
                          {formatDate(deck.createdAt)}
                        </span>
                      </div>
                    </div>
                    <Link
                      to={`/deck/${deck.id}`}
                      className="line-clamp-2 text-base font-semibold leading-6 text-text-primary hover:text-accent-primary"
                    >
                      {deck.title}
                    </Link>
                  </div>
                  <div className="flex shrink-0 items-center justify-between gap-3 sm:justify-end sm:gap-5">
                    <span className="w-16 whitespace-nowrap text-right text-xs text-text-muted sm:w-20 sm:text-sm">
                      {cardCount} {cardCount === 1 ? "question" : "questions"}
                    </span>
                    <Link
                      to={`/deck/${deck.id}/take`}
                      className="inline-flex min-h-9 w-20 items-center justify-center rounded-lg bg-accent-primary px-2 py-1.5 text-sm font-medium text-white transition hover:bg-accent-hover"
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
          {search && visibleDecks.length === 0 && (
            <p className="mb-2 text-sm text-text-muted">
              Searching the latest {decks.length} quizzes. Load more to check
              older quizzes too.
            </p>
          )}
          <button
            type="button"
            disabled={isFetching}
            onClick={() => setCurrentLimit((limit) => limit + 10)}
            className="min-h-10 rounded-lg border border-bg-surface-hover px-4 py-2 text-sm font-medium text-text-primary transition hover:border-accent-primary hover:bg-bg-surface disabled:cursor-wait disabled:opacity-60"
          >
            {isFetching ? "Loading…" : "Load more quizzes"}
          </button>
        </div>
      )}
    </main>
  );
};

export default ExplorePage;
