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
    <div className="flex flex-col gap-4 py-1">
      <section className="relative flex items-center justify-end gap-3 rounded-2xl border border-white/10 bg-bg-surface/80 px-3 py-3">
        <h1 className="absolute left-1/2 -translate-x-1/2 text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
          Community feed
        </h1>
        <Link
          to="/create"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-accent-primary px-3.5 py-2 text-xs font-medium text-white shadow-lg shadow-accent-primary/20 transition hover:bg-accent-hover sm:text-sm"
        >
          Create deck <FaArrowRight className="text-[10px]" />
        </Link>
      </section>
      <section className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-bg-surface/80 p-3 shadow-[0_10px_30px_rgba(0,0,0,0.03)] sm:flex-row sm:items-center">
        <label className="relative min-w-0 flex-1">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-text-muted" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search decks or creators"
            className="w-full rounded-xl border border-transparent bg-bg-background py-3 pl-10 pr-4 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-accent-primary/40"
          />
        </label>
        <div className="flex items-center gap-1 text-sm">
          <FaSlidersH className="ml-2 mr-1 text-text-muted" />
          <button
            type="button"
            onClick={() => setSort("newest")}
            className={`rounded-lg px-3 py-2 transition ${sort === "newest" ? "bg-accent-primary/12 font-medium text-accent-primary" : "text-text-muted hover:bg-bg-background"}`}
          >
            Latest
          </button>
          <button
            type="button"
            onClick={() => setSort("largest")}
            className={`rounded-lg px-3 py-2 transition ${sort === "largest" ? "bg-accent-primary/12 font-medium text-accent-primary" : "text-text-muted hover:bg-bg-background"}`}
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
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {visibleDecks.map((deck) => {
            const creator = deck.user?.name ?? "QuizOps creator";
            const cardCount = deck._count?.cards ?? 0;
            const isOwnDeck = deck.user?.id === currentUser?.id;

            return (
              <article
                key={deck.id}
                className={`group flex min-h-[235px] flex-col justify-between rounded-2xl border bg-bg-surface/90 p-3.5 shadow-[0_10px_24px_rgba(0,0,0,0.03)] transition duration-200 hover:-translate-y-0.5 hover:border-accent-primary/35 hover:shadow-[0_14px_32px_rgba(124,58,237,0.08)] ${isOwnDeck ? "border-accent-primary/45 ring-1 ring-accent-primary/10" : "border-white/10"}`}
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      to={deck.user?.id ? `/profile/${deck.user.id}` : "#"}
                      className="flex min-w-0 items-center gap-2.5"
                    >
                      <span
                        className={`flex size-9 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${isOwnDeck ? "bg-accent-primary text-white" : "bg-accent-primary/12 text-accent-primary"}`}
                      >
                        {deck.user ? getInitials(creator) : <FaUser />}
                      </span>
                      <span className="min-w-0">
                        <span className="flex items-center gap-1.5">
                          <span className="truncate text-sm font-medium text-text-primary">
                            {isOwnDeck ? "You" : creator}
                          </span>
                          {isOwnDeck && (
                            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-accent-primary/10 px-1.5 py-0.5 text-[9px] font-semibold text-accent-primary">
                              <FaCheck /> Yours
                            </span>
                          )}
                        </span>
                        <span className="mt-0.5 block text-[10px] text-text-muted">
                          {formatRelativeDate(deck.createdAt)}
                        </span>
                      </span>
                    </Link>

                    <span className="shrink-0 pt-1 text-[10px] text-text-muted">
                      {formatDate(deck.createdAt)}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    <Link
                      to={`/deck/${deck.id}`}
                      className="block text-[1.02rem] font-semibold leading-5 text-text-primary transition group-hover:text-accent-primary"
                    >
                      {deck.title}
                    </Link>

                    <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
                      <FaLayerGroup className="text-[11px] text-accent-primary" />
                      <span>
                        {cardCount} {cardCount === 1 ? "card" : "cards"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-end border-t border-white/10 pt-2.5">
                  <Link
                    to={`/deck/${deck.id}/take`}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-accent-primary px-3 py-2 text-[11px] font-semibold text-white shadow-lg shadow-accent-primary/15 transition hover:bg-accent-hover"
                  >
                    Practice <FaArrowRight className="text-[9px]" />
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
