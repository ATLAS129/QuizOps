import { useMemo, useState } from "react";
import { Link } from "react-router";
import {
  FaArrowRight,
  FaBookOpen,
  FaCalendarAlt,
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
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 pb-8 text-left">
      <section className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-primary">
            Explore
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            All decks
          </h1>
          <p className="mt-2 max-w-xl text-sm text-text-muted">
            Fresh decks from the community.
          </p>
        </div>
        <Link
          to="/main"
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-accent-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-accent-hover"
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
        <div className="flex items-center gap-2 text-sm">
          <FaSlidersH className="ml-2 text-text-muted" />
          <button
            type="button"
            onClick={() => setSort("newest")}
            className={`rounded-lg px-3 py-2 transition ${sort === "newest" ? "bg-accent-primary/15 font-medium text-accent-primary" : "text-text-muted hover:bg-bg-background"}`}
          >
            Newest
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
        <div className="grid gap-4 md:grid-cols-2">
          {visibleDecks.map((deck, index) => {
            const creator = deck.user?.name ?? "QuizOps creator";
            const cardCount = deck._count?.cards ?? 0;
            const isOwnDeck = deck.user?.id === currentUser?.id;

            return (
              <article
                key={deck.id}
                className={`group flex min-h-55 flex-col justify-between rounded-3xl border bg-bg-surface p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg ${isOwnDeck ? "border-accent-primary/60 ring-1 ring-accent-primary/15" : "border-white/10 hover:border-accent-primary/40"}`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-bg-background px-3 py-1.5 text-xs font-medium text-text-muted">
                      <FaLayerGroup className="text-accent-primary" />
                      {cardCount} {cardCount === 1 ? "card" : "cards"}
                    </span>
                    {isOwnDeck ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-primary/10 px-2.5 py-1.5 text-xs font-semibold text-accent-primary">
                        <FaCheck className="text-[10px]" /> Your deck
                      </span>
                    ) : (
                      <span className="text-xs text-text-muted">
                        #{index + 1}
                      </span>
                    )}
                  </div>
                  <Link
                    to={`/deck/${deck.id}`}
                    className="mt-5 block line-clamp-2 text-xl font-semibold leading-7 transition group-hover:text-accent-primary"
                  >
                    {deck.title}
                  </Link>
                </div>

                <div className="mt-7 flex items-end justify-between gap-3 border-t border-white/10 pt-4">
                  <Link
                    to={deck.user?.id ? `/profile/${deck.user.id}` : "#"}
                    className="flex min-w-0 items-center gap-2.5"
                  >
                    <span
                      className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${isOwnDeck ? "bg-accent-primary text-white" : "bg-accent-primary/15 text-accent-primary"}`}
                    >
                      {deck.user ? getInitials(creator) : <FaUser />}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">
                        {creator}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-text-muted">
                        <FaCalendarAlt className="text-[10px]" />
                        {formatDate(deck.createdAt)}
                      </span>
                    </span>
                  </Link>
                  <Link
                    to={`/deck/${deck.id}/take`}
                    className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-accent-primary px-3 py-2 text-xs font-semibold text-white transition hover:bg-accent-hover"
                  >
                    Take quiz <FaArrowRight className="text-[10px]" />
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
