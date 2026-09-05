import {
  useDeleteOneDeck,
  useGetAllMyDecks,
  useUpdateDeck,
} from "../hooks/useDecks";
import LoadingSpinner from "../components/LoadingSpinner";
import { Link } from "react-router";
import { FaPlay, FaRegEdit } from "react-icons/fa";
import { formatTime } from "../lib/formatTime";
import { FiTrash2 } from "react-icons/fi";
import UpdateDeckModal from "../components/UpdateDeckModal";
import { useState } from "react";
import type { deckInterface } from "../components/MainPage";
import DeleteDeckModal from "../components/DeleteDeckModal";

const MyDecksPage = () => {
  const { data: decks, isLoading: isDecksLoading } = useGetAllMyDecks();

  const [editingDeck, setEditingDeck] = useState<deckInterface | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  const [deletingDeck, setDeletingDeck] = useState<deckInterface | null>(null);

  const { mutate: deleteDeck, isPending: isDeleting } = useDeleteOneDeck();
  const { mutate: updateDeck, isPending } = useUpdateDeck();

  if (isDecksLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-3xl border border-white/10 bg-bg-surface p-8 shadow-xl shadow-black/10">
        <div className="flex flex-col justify-center items-center gap-2">
          <p className="text-sm uppercase tracking-[0.2em] text-text-muted">
            Your decks
          </p>
          <h1 className="text-4xl font-semibold px-3 py-2 rounded-xl text-white bg-accent-primary">
            All active decks
          </h1>
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
                  <p className="text-xs text-text-muted">
                    Created {new Date(deck.createdAt).toLocaleDateString()}
                  </p>
                  <Link
                    to={`/deck/${deck.id}`}
                    className="text-xl font-semibold hover:underline"
                  >
                    {deck.title}
                  </Link>
                </div>
              </div>

              <div className="relative flex items-center justify-between text-xs">
                <div className="flex justify-center items-center gap-3">
                  <span className="rounded-full bg-bg-surface px-3 py-2 text-left">
                    {deck._count?.cards ?? 0} cards
                  </span>
                  {deck.isCompleted &&
                    deck.completionHistory &&
                    (() => {
                      const completion = Array.isArray(deck.completionHistory)
                        ? deck.completionHistory[0]
                        : deck.completionHistory;

                      return completion ? (
                        <>
                          <p>Last completion:</p>
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
                <div className="flex justify-center items-center gap-2">
                  <Link
                    to={`/deck/${deck.id}/take`}
                    className="flex justify-center items-center gap-2 rounded-lg text-white bg-accent-primary px-3 py-2 text-sm font-medium transition hover:bg-accent-hover"
                  >
                    <FaPlay className="text-xs" />
                    Take quiz
                  </Link>
                  <button
                    onClick={() => setEditingDeck(deck)}
                    className="cursor-pointer flex justify-center items-center gap-2 rounded-lg text-white bg-accent-primary px-3 py-2 text-sm font-medium transition hover:bg-accent-hover"
                  >
                    <FaRegEdit className="text-xs" />
                    Edit deck
                  </button>
                  <button
                    className="cursor-pointer p-3 border border-red-500/70 rounded-lg"
                    onClick={() => setDeletingDeck(deck)}
                  >
                    <FiTrash2 className="text-xs" />
                  </button>
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
                // void fetchDecks(currentLimit);
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
      <DeleteDeckModal
        isOpen={Boolean(deletingDeck)}
        deckTitle={deletingDeck ? deletingDeck.title : ""}
        deckId={deletingDeck ? deletingDeck.id : ""}
        onCancel={() => setDeletingDeck(null)}
        isDeleting={isDeleting}
        onConfirm={(deckId) => {
          if (!deletingDeck) return;

          deleteDeck(deckId, {
            onSuccess: () => {
              setDeletingDeck(null);
              setModalError(null);
            },
            onError: (error: any) => {
              setModalError(error?.message || "Unable to delete deck.");
            },
          });
        }}
      />
    </div>
  );
};

export default MyDecksPage;
