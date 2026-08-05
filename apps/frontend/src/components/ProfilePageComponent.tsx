import { Link } from "react-router";
import UpdateUserModal from "./UpdateUserModal";
import { useState } from "react";
import { useUpdateUser } from "../hooks/useUsers";

const ProfilePageComponent = ({
  userId,
  user,
  recentDecks,
}: {
  userId: string;
  user: any;
  recentDecks: any;
}) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const { mutate: updateUser, isPending } = useUpdateUser();

  const initials = user.name
    .split(" ")
    .map((part: string) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex flex-col gap-5">
      <section className="relative overflow-hidden rounded-lg border border-border-color bg-bg-surface">
        <div className="relative flex flex-col gap-6 rounded-md bg-bg-surface p-7 sm:p-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-accent-primary to-accent-hover text-2xl font-semibold text-white">
              {initials}
            </div>

            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-accent-primary">
                Profile
              </p>
              <h1 className="text-2xl font-semibold text-white">{user.name}</h1>
              <p className="mt-1 text-sm text-text-muted">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-full border border-white/10 bg-bg-background/70 px-3 py-2 text-xs font-medium text-text-muted lg:absolute lg:right-4 lg:top-4">
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
              className="rounded-full bg-accent-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-accent-hover cursor-pointer"
            >
              Edit profile
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-white/10 bg-bg-surface/90 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.2)]">
        <div className="mb-5 flex flex-col gap-3 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-white">Recent decks</h2>
            <p className="mt-1 text-sm text-text-muted">Last three decks</p>
          </div>

          <Link
            to={`/profile/${userId}/decks`}
            className="rounded-full border border-white/10 bg-bg-background/80 px-4 py-2.5 text-sm font-medium text-white transition hover:border-accent-primary/40 hover:bg-bg-surface-hover"
          >
            All my decks
          </Link>
        </div>

        {recentDecks.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-3">
            {recentDecks.map((deck: any) => (
              <div
                key={deck.id}
                className="rounded-3xl border border-white/10 bg-bg-background/80 p-5 backdrop-blur-sm transition duration-200 hover:-translate-y-1 hover:border-accent-primary/40 hover:shadow-lg hover:shadow-accent-primary/10"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      deck.isCompleted
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-rose-500/15 text-rose-400"
                    }`}
                  >
                    {deck.isCompleted ? "Completed" : "Not completed"}
                  </span>
                  <span className="text-xs text-text-muted">
                    {deck._count.cards} cards
                  </span>
                </div>

                <h3 className="text-base font-semibold text-white">
                  {deck.title}
                </h3>
                <p className="mt-2 text-sm text-text-muted">
                  Created {new Date(deck.createdAt).toLocaleDateString()}
                </p>
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
