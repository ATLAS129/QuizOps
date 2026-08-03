import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { FiX } from "react-icons/fi";

interface UpdateDeckModalProps {
  isOpen: boolean;
  initialTitle: string;
  onClose: () => void;
  onSave: (title: string) => void;
  loading?: boolean;
  error?: string;
}

const UpdateDeckModal = ({
  isOpen,
  initialTitle,
  onClose,
  onSave,
  loading,
  error,
}: UpdateDeckModalProps) => {
  const [title, setTitle] = useState(initialTitle);

  useEffect(() => {
    if (isOpen) {
      setTitle(initialTitle);
    }
  }, [initialTitle, isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave(title.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-bg-background p-6 shadow-2xl backdrop-blur-xl">
        <div className="relative mb-5">
          <button
            type="button"
            aria-label="Close modal"
            className="absolute right-0 top-0 rounded-full border border-white/10 bg-bg-surface/90 p-2 text-text-muted transition hover:bg-bg-surface hover:text-white"
            onClick={onClose}
          >
            <FiX className="size-5" />
          </button>
          <div className="text-center">
            <h2 className="text-lg font-semibold text-white">Edit deck</h2>
            <p className="text-sm text-text-muted">Update deck title.</p>
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-text-muted">
            Deck title
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-bg-surface px-4 py-3 text-white outline-none transition focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20"
              placeholder="Enter deck title"
            />
          </label>

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

export default UpdateDeckModal;
