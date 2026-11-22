import { Link } from "react-router";
import UpdateUserModal from "./UpdateUserModal";
import { useState } from "react";
import { useUpdateUser } from "../hooks/useUsers";
import { FaPlay } from "react-icons/fa";

const ProfilePageComponent = ({
  userId,
  user,
  recentDecks,
}: {
  userId: string;
  user: any;
  recentDecks: any;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const { mutate: updateUser, isPending } = useUpdateUser();

  const initials = user.name
    .split(" ")
    .map((part: string) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
      <section className="relative overflow-hidden rounded-lg border border-border-color bg-bg-surface">
        <div className="relative flex flex-col items-center gap-5 rounded-md bg-bg-surface p-5 md:p-8">
          <div className="flex min-w-0 flex-col items-center gap-4 text-center md:flex-row md:justify-center">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-accent-primary to-accent-hover text-xl font-semibold text-white sm:size-20 sm:text-2xl">
              {initials}
            </div>

            <div className="min-w-0">
              <p className="text-sm uppercase tracking-[0.25em] text-accent-primary">
                Profile
              </p>
              <h1 className="break-words text-xl font-semibold sm:text-2xl">
                {user.name}
              </h1>
              <p className="mt-1 break-all text-sm text-text-muted">
                {user.email}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="whitespace-nowrap rounded-full border border-white/10 bg-bg-background/70 px-3 py-2 text-xs font-medium text-text-muted">
              Joined{" "}
              {new Date(
                user.createdAt?.toString() || Date.now().toString(),
              ).toLocaleDateString(undefined, {
                month: "short",
                year: "numeric",
              })}
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="min-h-11 rounded-full bg-accent-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-accent-hover"
            >
              Edit profile
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-white/10 bg-bg-surface/90 p-4 sm:p-6">
        <div className="mb-5 flex flex-col gap-3 text-center md:flex-row md:items-center md:justify-between md:text-left">
          <div className="flex-1">
            <h2 className="text-xl font-semibold">Recent decks</h2>
            <p className="mt-1 text-sm text-text-muted">Last three decks</p>
          </div>

          <Link
            to={`/profile/${userId}/decks`}
            className="inline-flex min-h-11 self-center items-center justify-center rounded-full border border-white/10 bg-bg-background/80 px-4 py-2.5 text-sm font-medium transition hover:border-accent-primary/40 hover:bg-bg-surface-hover md:self-auto"
          >
            All my decks
          </Link>
        </div>

        {recentDecks.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {recentDecks.map((deck: any) => (
              <div
                key={deck.id}
                className="flex min-w-0 flex-col items-center justify-center gap-2 rounded-3xl border border-white/10 bg-bg-background/80 p-4 backdrop-blur-sm transition-colors duration-200 hover:border-accent-primary/40 sm:p-5"
              >
                <div className="flex w-full flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        deck.isCompleted
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-rose-500/15 text-rose-400"
                      }`}
                    >
                      {deck.isCompleted ? "Completed" : "Not completed"}
                    </span>
                    {deck.isCompleted && (
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          deck.isCompleted
                            ? "bg-emerald-500/15 text-emerald-400"
                            : "bg-rose-500/15 text-rose-400"
                        }`}
                      >
                        {deck.completionHistory[0].correctAnswersCompleted +
                          "/" +
                          deck._count.cards}
                      </span>
                    )}
                  </div>
                  <span className="whitespace-nowrap text-xs text-text-muted">
                    {deck._count.cards} cards
                  </span>
                </div>

                <div className="flex h-full w-full min-w-0 flex-col items-center justify-center">
                  <Link
                    to={`/deck/${deck.id}`}
                    className="w-full break-words text-center text-base font-semibold hover:underline"
                  >
                    {deck.title}
                  </Link>
                  <p className="text-center text-sm text-text-muted">
                    Created {new Date(deck.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <Link
                  to={`/deck/${deck.id}/take`}
                  className="mt-auto inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-accent-primary px-3 py-2 text-sm font-medium text-white transition hover:bg-accent-hover"
                >
                  <FaPlay className="text-xs" />
                  Take quiz
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-white/10 bg-bg-background/70 p-8 text-center text-text-muted">
            You have no decks yet.
          </div>
        )}
      </section>
      <UpdateUserModal
        isOpen={isOpen}
        initialName={user.name}
        initialEmail={user.email}
        onClose={() => {
          setIsOpen(false);
          setModalError(null);
        }}
        onSave={(name, email) => {
          if (!isOpen) return;
          if (!name.trim()) {
            setModalError("Title cannot be empty.");
            return;
          }

          updateUser(
            { name, email },
            {
              onSuccess: () => {
                setIsOpen(false);
                setModalError(null);
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
export default ProfilePageComponent;
