import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { FiX } from "react-icons/fi";
import UpdateModal from "./UpdateModal";

export interface UpdateUserModalProps {
  isOpen: boolean;
  initialName: string;
  initialEmail: string;
  onClose: () => void;
  onSave: (name: string, email: string) => void;
  loading?: boolean;
  error?: string;
}

const UpdateUserModal = ({
  isOpen,
  initialName,
  initialEmail,
  onClose,
  onSave,
  loading,
  error,
}: UpdateUserModalProps) => {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
    }
  }, [initialName, isOpen]);

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
    onSave(name.trim(), email.trim());
  };

  return (
    <UpdateModal
      isDeck={false}
      isOpen={isOpen}
      name={name}
      email={email}
      setName={setName}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
      onClose={onClose}
      loading={loading}
      error={error}
    />
  );
};

export default UpdateUserModal;
