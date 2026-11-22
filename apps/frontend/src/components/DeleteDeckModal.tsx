import { useEffect } from "react";
import { CiWarning } from "react-icons/ci";

interface DeleteModalProps {
  isOpen: boolean;
  deckTitle: string;
  deckId: string;
  onConfirm: (deckId: string) => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export default function DeleteDeckModal({
  isOpen,
  deckTitle,
  deckId,
  onConfirm,
  onCancel,
  isDeleting = false,
}: DeleteModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isDeleting) {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isDeleting, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-9999 flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-md sm:items-center"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !isDeleting) {
          onCancel();
        }
      }}
    >
      <div className="relative my-auto w-full max-w-105 overflow-hidden rounded-2xl border border-white/8 bg-[#111113] animate-in fade-in zoom-in-95 duration-200">
        <div className="relative flex flex-col items-center justify-center p-5 sm:p-6">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10">
            <CiWarning className="text-2xl text-red-400" />
          </div>

          <h2 className="max-w-full break-words text-center text-lg font-semibold tracking-tight text-white">
            Delete {deckTitle}?
          </h2>

          <p className="mt-2 text-center text-sm leading-6 text-zinc-400">
            Are you sure you want to delete this deck? All of its data will be
            permanently removed.
          </p>

          <div className="mt-7 flex w-full items-center justify-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isDeleting}
              className="min-h-11 min-w-0 flex-1 rounded-xl border border-white/8 bg-white/4 px-3 py-2.5 text-sm font-medium text-zinc-300 transition-colors duration-200 hover:bg-white/8 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:px-4"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => onConfirm(deckId)}
              disabled={isDeleting}
              className="flex min-h-11 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 px-3 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60 sm:px-4"
            >
              {isDeleting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Deleting
                </>
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
