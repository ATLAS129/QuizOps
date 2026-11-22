import { useEffect, type ReactNode } from "react";
import { FiX } from "react-icons/fi";
import { MdLightMode, MdDarkMode } from "react-icons/md";
import { HiAdjustmentsVertical } from "react-icons/hi2";
import type { Theme } from "../hooks/useTheme";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const SettingsModal = ({
  isOpen,
  onClose,
  theme,
  onThemeChange,
}: SettingsModalProps) => {
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

  const themeOptions: { value: Theme; label: string; icon: ReactNode }[] = [
    {
      value: "system",
      label: "System",
      icon: <HiAdjustmentsVertical className="size-5" />,
    },
    {
      value: "light",
      label: "Light",
      icon: <MdLightMode className="size-5" />,
    },
    {
      value: "dark",
      label: "Dark",
      icon: <MdDarkMode className="size-5" />,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-4 backdrop-blur-sm sm:items-center sm:py-6"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="my-auto max-h-full w-full max-w-md overflow-y-auto rounded-3xl border border-white/10 bg-bg-background p-5 backdrop-blur-xl sm:p-8">
        {/* Header */}
        <div className="relative mb-8">
          <button
            type="button"
            aria-label="Close modal"
            className="absolute right-0 top-0 flex size-11 items-center justify-center rounded-full border border-border-color bg-bg-surface/90 text-text-muted transition-colors hover:bg-bg-surface-hover hover:text-text-primary"
            onClick={onClose}
          >
            <FiX className="size-5" />
          </button>
          <div className="text-center">
            <div className="mb-3 inline-block rounded-2xl bg-accent-primary/10 p-3">
              <HiAdjustmentsVertical className="size-6 text-accent-primary" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary">Settings</h2>
            <p className="mt-2 text-sm text-text-muted">
              Customize your experience
            </p>
          </div>
        </div>

        {/* Settings Content */}
        <div className="space-y-6">
          {/* Theme Selection Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wide opacity-80">
              Appearance
            </h3>
            <div className="grid w-full grid-cols-3 items-stretch gap-2 sm:gap-3">
              {themeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={theme === option.value}
                  onClick={() => onThemeChange(option.value)}
                  className={`group relative flex min-w-0 flex-col items-center gap-2 rounded-2xl border-2 p-3 transition-colors duration-200 sm:p-5 ${
                    theme === option.value
                      ? "border-accent-primary bg-accent-primary/10"
                      : "border-border-color bg-bg-surface/50 hover:border-accent-primary/40 hover:bg-bg-surface-hover"
                  }`}
                >
                  <div
                    className={`rounded-lg p-2 transition-colors ${
                      theme === option.value
                        ? "bg-accent-primary/20 text-accent-primary"
                        : "bg-bg-surface text-text-muted group-hover:bg-bg-surface-hover group-hover:text-text-primary"
                    }`}
                  >
                    {option.icon}
                  </div>
                  <span
                    className={`text-xs font-medium transition-colors ${
                      theme === option.value
                        ? "text-text-primary"
                        : "text-text-muted group-hover:text-text-primary"
                    }`}
                  >
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-border-color bg-bg-surface px-6 py-3 text-sm font-medium text-text-primary transition-all hover:bg-bg-surface-hover"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
