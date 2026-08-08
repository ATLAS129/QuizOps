import { useEffect, useState } from "react";
import { useDeleteOneDeck, useUpdateDeck } from "../hooks/useDecks";
import { getAllMyDecks } from "../api/decks";
import type { deckInterface } from "./MainPage";
import { FaPlay } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import UpdateDeckModal from "./UpdateDeckModal";

const DecksSection = () => {
  const [currentLimit, setCurrentLimit] = useState(5);
  const [decks, setDecks] = useState<deckInterface[] | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingDeck, setEditingDeck] = useState<deckInterface | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  const { mutate: deleteDeck } = useDeleteOneDeck();
  const { mutate: updateDeck, isPending } = useUpdateDeck();

  const fetchDecks = async (limit: number) => {
    setIsFetching(true);
    try {
      const res = (await getAllMyDecks(limit)) as deckInterface[];
      setDecks(res);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchDecks(currentLimit);
  }, []);

  useEffect(() => {
    if (!openMenuId) return;

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      const activeMenu = document.querySelector('[data-menu-open="true"]');

      if (activeMenu && !activeMenu.contains(target)) {
        setOpenMenuId(null);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [openMenuId]);

  if (!decks) {
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
              className="w-full rounded-xl border border-white/10 bg-bg-background px-5 py-4 shadow-sm transition hover:border-accent-primary/40 hover:shadow-md"
            >
              <div className="grid w-full gap-4 sm:grid-cols-[auto_1fr_auto] sm:items-center">
                <div className="flex items-center gap-2 justify-start">
                  <span className="rounded-full bg-bg-surface px-3 py-1 text-xs text-text-muted">
                    {deck._count.cards}{" "}
                    {deck._count.cards === 1 ? "card" : "cards"}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      deck.isCompleted
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-rose-500/15 text-rose-400"
                    }`}
                  >
                    {deck.isCompleted ? "Completed" : "Not completed"}
                  </span>
                </div>

                <div className="flex min-w-0 justify-center">
                  <h2 className="truncate text-sm font-semibold text-white">
                    {deck.title}
                  </h2>
                </div>

                <div className="flex items-center gap-3 justify-end">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-lg bg-accent-primary px-3 py-2 text-sm font-medium text-white transition hover:bg-accent-hover"
                  >
                    <FaPlay className="text-xs" />
                    Take quiz
                  </button>

                  <div
                    className="relative"
                    data-menu-open={openMenuId === deck.id}
                    onClick={(event) => event.stopPropagation()}
                  >
                    <button
                      type="button"
                      aria-label="Open deck actions"
                      aria-expanded={openMenuId === deck.id}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-bg-surface/80 text-text-muted transition hover:border-accent-primary/40 hover:bg-bg-surface hover:text-white"
                      onClick={() =>
                        setOpenMenuId((prev) =>
                          prev === deck.id ? null : deck.id,
                        )
                      }
                    >
                      <BsThreeDots className="size-4" />
                    </button>

                    {openMenuId === deck.id && (
                      <div className="absolute right-0 top-full z-20 mt-2 w-44 rounded-xl border border-white/10 bg-bg-background p-1 shadow-xl">
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-text-muted transition hover:bg-bg-surface hover:text-white"
                          onClick={() => setOpenMenuId(null)}
                        >
                          <FaPlay className="size-3.5" />
                          Take quiz
                        </button>
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-text-muted transition hover:bg-bg-surface hover:text-white"
                          onClick={() => {
                            setEditingDeck(deck);
                            setOpenMenuId(null);
                          }}
                        >
                          <FiEdit2 className="size-3.5" />
                          Edit deck
                        </button>
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-text-muted transition hover:bg-bg-surface hover:text-white"
                          onClick={() => {
                            deleteDeck(deck.id, {
                              onSuccess: () => fetchDecks(currentLimit),
                            });
                            setOpenMenuId(null);
                          }}
                        >
                          <FiTrash2 className="size-3.5" />
                          Delete quiz
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>No decks found</div>
      )}

      {decks && decks.length >= currentLimit && (
        <button
          type="button"
          onClick={async () => {
            const nextLimit = currentLimit + 5;
            setIsFetching(true);
            try {
              const res = (await getAllMyDecks(nextLimit)) as deckInterface[];
              setDecks(res);
              setCurrentLimit(nextLimit);
            } finally {
              setIsFetching(false);
            }
          }}
          disabled={isFetching}
          className="mt-4 rounded-full bg-accent-primary px-5 py-2 text-sm font-medium text-white transition hover:bg-accent-hover disabled:cursor-wait disabled:opacity-50"
        >
          {isFetching ? "Loading more..." : "Load more"}
        </button>
      )}
      <UpdateDeckModal
        isOpen={Boolean(editingDeck)}
        initialTitle={editingDeck?.title ?? ""}
        onClose={() => {
          setEditingDeck(null);
          setModalError(null);
        }}
        onSave={(title) => {
          if (!editingDeck) return;
          if (!title.trim()) {
            setModalError("Title cannot be empty.");
            return;
          }

          updateDeck(
            {
              deckId: editingDeck.id,
              data: { title },
            },
            {
              onSuccess: () => {
                setEditingDeck(null);
                setModalError(null);
                void fetchDecks(currentLimit);
              },
              onError: (error: any) => {
                setModalError(error?.message || "Unable to update deck.");
              },
            },
          );
        }}
        loading={isPending}
        error={modalError ?? undefined}
      />
    </div>
  );
};

export default DecksSection;
