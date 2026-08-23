import { FiX } from "react-icons/fi";
import type { FormEvent } from "react";

interface UpdateModalProps {
  isDeck: boolean;
  isOpen: boolean;
  title?: string;
  setTitle?: (title: string) => void;
  name?: string;
  email?: string;
  setName?: (name: string) => void;
  setEmail?: (email: string) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  loading?: boolean;
  error?: string;
}

const UpdateModal = ({
  isDeck,
  onClose,
  handleSubmit,
  title,
  setTitle,
  name,
  email,
  setName,
  setEmail,
  error,
  loading,
}: UpdateModalProps) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-bg-background p-6 shadow-2xl backdrop-blur-xl">
        <div className="relative mb-5">
          <button
            type="button"
            aria-label="Close modal"
            className="absolute right-0 top-0 rounded-full border border-white/10 bg-bg-surface/90 p-2 text-text-muted transition hover:bg-bg-surface"
            onClick={onClose}
          >
            <FiX className="size-5" />
          </button>
          <div className="text-center">
            <h2 className="text-lg font-semibold">
              Edit {isDeck ? "deck" : "user"}
            </h2>
            <p className="text-sm text-text-muted">
              Update {isDeck ? "deck title" : "user profile info"}.
            </p>
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {isDeck ? (
            <label className="block text-sm font-medium text-text-muted">
              Deck title
              <input
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle ? setTitle(event.target.value) : null
                }
                className="mt-2 w-full rounded-2xl border border-white/10 bg-bg-surface px-4 py-3 outline-none transition focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20"
                placeholder="Enter deck title"
              />
            </label>
          ) : (
            <>
              <label className="block text-sm font-medium text-text-muted">
                Your email
                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail ? setEmail(event.target.value) : null
                  }
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-bg-surface px-4 py-3 outline-none transition focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20"
                  placeholder="Enter new email"
                />
              </label>

              <label className="block text-sm font-medium text-text-muted">
                Your name
                <input
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName ? setName(event.target.value) : null
                  }
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-bg-surface px-4 py-3 outline-none transition focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20"
                  placeholder="Enter new username"
                />
              </label>
            </>
          )}

          {error ? <p className="text-sm text-rose-400">{error}</p> : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-text-muted transition hover:bg-white/10"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-accent-primary px-5 py-3 text-sm font-medium text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateModal;
