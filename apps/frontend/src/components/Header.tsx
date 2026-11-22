import { useEffect, useRef, useState } from "react";
import { FaCompass, FaLightbulb, FaPlus, FaUser } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { Link, useNavigate } from "react-router";
import { useLogout } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import SettingsModal from "./SettingsModal";

const Header = ({ username, userId }: { username: string; userId: string }) => {
  const navigate = useNavigate();
  const { mutate: logout } = useLogout();
  const { theme, setTheme } = useTheme();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !menuRef.current?.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isMenuOpen]);

  return (
    <header className="flex min-h-14 w-full items-center justify-between gap-3 bg-bg-surface px-3 py-2 sm:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <Link to={"/"}>
          <img
            rel="preload"
            src={`/QuizOps_logo_${theme == "system" ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "light" : "dark") : theme == "dark" ? "light" : "dark"}.png`}
            alt="logo"
            height={170}
            width={256}
            className="h-auto w-20 shrink-0 sm:w-24"
          />
        </Link>
        <Link
          to="/create"
          aria-label="Create deck"
          className={`min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-accent-primary px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover sm:px-4 ${
            userId ? "inline-flex" : "hidden sm:inline-flex"
          }`}
        >
          <FaPlus aria-hidden="true" className="size-3.5" />
          <span className="hidden sm:inline">Create deck</span>
        </Link>
      </div>

      {userId && username ? (
        <div className="flex shrink-0 items-center justify-center gap-2 text-sm sm:gap-6">
          <Link
            to={`/profile/${userId}/decks`}
            className="hidden min-h-11 items-center justify-center whitespace-nowrap rounded-lg border border-bg-surface-hover px-4 py-2 font-medium text-text-primary transition-colors hover:border-accent-primary/50 hover:bg-bg-surface-hover sm:inline-flex"
          >
            All my decks
          </Link>

          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="flex size-10 cursor-pointer select-none items-center justify-center rounded-full bg-accent-primary text-xs font-semibold text-white sm:size-8"
            >
              {username
                .split(" ")
                .map((part: string) => part[0])
                .join("")
                .toUpperCase()}
            </button>

            {isMenuOpen && (
              <div className="z-100 absolute right-0 mt-2 w-44 rounded-2xl border border-white/10 bg-bg-background p-2">
                <Link
                  to={`/profile/${userId}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl p-2 text-sm text-text-muted transition hover:bg-bg-surface-hover"
                >
                  <FaUser />
                  Profile
                </Link>
                <Link
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl p-2 text-sm text-text-muted transition hover:bg-bg-surface-hover"
                >
                  <FaCompass />
                  Explore
                </Link>
                <Link
                  to={`/profile/${userId}/decks`}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl p-2 text-sm text-text-muted transition hover:bg-bg-surface-hover"
                >
                  <FaLightbulb />
                  My decks
                </Link>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsSettingsOpen(true);
                  }}
                  className="flex w-full items-center  gap-2 rounded-xl p-2 text-left text-sm text-text-muted transition hover:bg-bg-surface-hover"
                >
                  <IoMdSettings />
                  Settings
                </button>
                <button
                  onClick={async () => {
                    setIsMenuOpen(false);
                    logout(undefined, {
                      onSuccess: () => navigate("/login", { replace: true }),
                    });
                  }}
                  className="flex w-full items-center  gap-2 rounded-xl p-2 text-left text-sm text-text-muted transition hover:bg-bg-surface-hover"
                >
                  <IoLogOut />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex shrink-0 items-center justify-center gap-2 text-sm sm:gap-6">
          <Link
            to="login"
            className="inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-lg border border-bg-surface-hover px-3 py-2 font-medium transition-colors hover:border-accent-primary/50 hover:bg-bg-surface-hover sm:px-5"
          >
            Login
          </Link>
          <Link
            to="signup"
            className="inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-lg bg-accent-primary px-3 py-2 font-medium text-white transition-colors hover:bg-accent-hover sm:px-5"
          >
            Sign up
          </Link>
        </div>
      )}

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        onThemeChange={setTheme}
      />
    </header>
  );
};

export default Header;
