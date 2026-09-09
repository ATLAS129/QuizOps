import { useMemo, useState } from "react";
import { Link } from "react-router";
import {
  FaArrowRight,
  FaBookOpen,
  FaCheck,
  FaLayerGroup,
  FaSearch,
  FaSlidersH,
  FaUser,
} from "react-icons/fa";
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

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const formatRelativeDate = (value: string) => {
  const age = Date.now() - new Date(value).getTime();
  const minutes = Math.floor(age / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(value);
};

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
    <div className="flex flex-col gap-3">
      <section className="grid gap-4 border-b border-white/10 pb-2 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
        <div className="hidden sm:block" aria-hidden="true" />
        <div className="flex flex-col items-center justify-center text-center sm:col-start-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-primary">
            Explore
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Community feed
          </h1>
          <p className="mt-2 max-w-xl text-sm text-text-muted">
            Fresh quizzes from people learning alongside you.
          </p>
        </div>
        <Link
          to="/main"
          className="inline-flex w-fit items-center gap-2 justify-self-end rounded-xl bg-accent-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-accent-hover sm:col-start-3"
        >
          Create a deck <FaArrowRight className="text-xs" />
        </Link>
      </section>
      <section className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-bg-surface p-3 shadow-sm sm:flex-row sm:items-center">
        <label className="relative min-w-0 flex-1">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-text-muted" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search decks or creators"
            className="w-full rounded-xl border border-transparent bg-bg-background py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-text-muted focus:border-accent-primary/50"
          />
        </label>
        <div className="flex items-center gap-1 text-sm">
          <FaSlidersH className="ml-2 mr-1 text-text-muted" />
          <button
            type="button"
            onClick={() => setSort("newest")}
            className={`rounded-lg px-3 py-2 transition ${sort === "newest" ? "bg-accent-primary/15 font-medium text-accent-primary" : "text-text-muted hover:bg-bg-background"}`}
          >
            Latest
          </button>
          <button
            type="button"
            onClick={() => setSort("largest")}
            className={`rounded-lg px-3 py-2 transition ${sort === "largest" ? "bg-accent-primary/15 font-medium text-accent-primary" : "text-text-muted hover:bg-bg-background"}`}
          >
            Most cards
          </button>
        </div>
      </section>
      {isError ? (
        <section className="rounded-3xl border border-dashed border-white/10 bg-bg-surface/70 p-10 text-center">
          <p className="font-medium">The community feed is taking a break.</p>
          <p className="mt-2 text-sm text-text-muted">
            Check your connection and try loading it again.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-5 rounded-xl bg-accent-primary px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
          >
            Try again
          </button>
        </section>
      ) : visibleDecks.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-white/10 bg-bg-surface/70 p-10 text-center">
          <FaBookOpen className="mx-auto text-2xl text-accent-primary" />
          <p className="mt-4 font-medium">
            {search
              ? "No decks match that search."
              : "The feed is empty for now."}
          </p>
          <p className="mt-2 text-sm text-text-muted">
            {search
              ? "Try a different title or creator."
              : "Be the first to publish a deck from the main page."}
          </p>
        </section>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {visibleDecks.map((deck) => {
            const creator = deck.user?.name ?? "QuizOps creator";
            const cardCount = deck._count?.cards ?? 0;
            const isOwnDeck = deck.user?.id === currentUser?.id;

            return (
              <article
                key={deck.id}
                className={`group rounded-2xl border bg-bg-surface p-5 shadow-sm transition duration-200 hover:border-accent-primary/40 hover:shadow-md sm:p-6 ${isOwnDeck ? "border-accent-primary/60 ring-1 ring-accent-primary/15" : "border-white/10"}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <Link
                    to={deck.user?.id ? `/profile/${deck.user.id}` : "#"}
                    className="flex min-w-0 items-center gap-3"
                  >
                    <span
                      className={`flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${isOwnDeck ? "bg-accent-primary text-white" : "bg-accent-primary/15 text-accent-primary"}`}
                    >
                      {deck.user ? getInitials(creator) : <FaUser />}
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium">
                          {isOwnDeck ? "You" : creator}
                        </span>
                        {isOwnDeck && (
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-accent-primary/10 px-2 py-0.5 text-[10px] font-semibold text-accent-primary">
                            <FaCheck /> Your deck
                          </span>
                        )}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-text-muted">
                        {formatRelativeDate(deck.createdAt)}
                      </span>
                    </span>
                  </Link>
                  <span className="shrink-0 text-xs text-text-muted">
                    {formatDate(deck.createdAt)}
                  </span>
                </div>

                <div className="mt-5">
                  <Link
                    to={`/deck/${deck.id}`}
                    className="block text-xl font-semibold leading-7 transition group-hover:text-accent-primary"
                  >
                    {deck.title}
                  </Link>
                  <div className="mt-3 flex items-center gap-2 text-sm text-text-muted">
                    <FaLayerGroup className="text-accent-primary" />
                    {cardCount} {cardCount === 1 ? "card" : "cards"} to practice
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-end border-t border-white/10 pt-4">
                  <Link
                    to={`/deck/${deck.id}/take`}
                    className="inline-flex items-center gap-2 rounded-xl bg-accent-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover"
                  >
                    Practice this deck <FaArrowRight className="text-xs" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
      {!search && decks.length >= currentLimit && (
        <button
          type="button"
          disabled={isFetching}
          onClick={() => setCurrentLimit((limit) => limit + 10)}
          className="mx-auto inline-flex items-center gap-2 rounded-xl border border-white/10 bg-bg-surface px-5 py-2.5 text-sm font-medium transition hover:border-accent-primary/40 hover:bg-bg-surface-hover disabled:cursor-wait disabled:opacity-60"
        >
          {isFetching ? "Loading more..." : "Load more decks"}
        </button>
      )}
    </div>
  );
};

export default ExplorePage;
