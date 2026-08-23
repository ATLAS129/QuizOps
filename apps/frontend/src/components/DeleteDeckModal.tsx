import { useEffect, type FormEvent } from "react";
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

  //   const handleConfirm = (event: FormEvent<HTMLFormElement>) => {
  //     event.preventDefault();
  //     onConfirm(deckId);
  //   };

  return (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !isDeleting) {
          onCancel();
        }
      }}
    >
      <div className="relative w-full max-w-105 overflow-hidden rounded-2xl border border-white/8 bg-[#111113] shadow-[0_25px_80px_rgba(0,0,0,0.55)] animate-in fade-in zoom-in-95 duration-200">
        {/* Red glow */}
        <div className="relative p-6 flex items-center justify-center flex-col">
          {/* Icon */}
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10">
            <CiWarning className="text-2xl text-red-400" />
          </div>

          {/* Title */}
          <h2 className="text-lg font-semibold tracking-tight text-white">
            Delete {deckTitle}?
          </h2>

          {/* Description */}
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Are you sure you want to delete this deck? All of its data will be
            permanently removed.
          </p>

          {/* Buttons */}
          <div className="w-full mt-7 flex justify-center items-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isDeleting}
              className="flex-1 rounded-xl border border-white/8 bg-white/4 px-4 py-2.5 text-sm font-medium text-zinc-300 transition-all duration-200 hover:bg-white/8 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => onConfirm(deckId)}
              disabled={isDeleting}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-red-500/10 transition-all duration-200 hover:bg-red-400 hover:shadow-red-500/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
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
