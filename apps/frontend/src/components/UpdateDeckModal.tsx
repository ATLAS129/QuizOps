import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import UpdateModal from "./UpdateModal";

export interface UpdateDeckModalProps {
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
    <UpdateModal
      isDeck={true}
      isOpen={isOpen}
      title={title}
      setTitle={setTitle}
      handleSubmit={handleSubmit}
      onClose={onClose}
      loading={loading}
      error={error}
    />
  );
};

export default UpdateDeckModal;
