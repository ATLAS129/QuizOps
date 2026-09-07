import { useState } from "react";
import { FaCompass, FaLightbulb, FaUser } from "react-icons/fa";
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

  return (
    <header className="h-14 w-full bg-bg-surface flex items-center justify-between px-6">
      <div className="flex justify-center items-center gap-2">
        <Link to={"/"}>
          <img
            rel="preload"
            src={`/QuizOps_logo_${theme == "system" ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "light" : "dark") : theme == "dark" ? "light" : "dark"}.png`}
            alt="logo"
            height={170}
            width={256}
          />
        </Link>
        <Link to="/main">
          <div className="px-5 py-2 bg-accent-primary/10 cursor-pointer rounded-lg">
            Main page
          </div>
        </Link>
        <Link to="/explore">
          <div className="px-5 py-2 rounded-lg transition hover:bg-accent-primary/10">
            Explore
          </div>
        </Link>
      </div>

      {userId && username ? (
        <div className="flex items-center justify-center gap-6 text-sm">
          <Link to={`/profile/${userId}/decks`}>
            <div className="py-2 px-3 bg-accent-primary rounded-lg text-white">
              All my decks
            </div>
          </Link>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="size-8 rounded-full bg-accent-primary flex items-center justify-center text-xs font-semibold text-white select-none cursor-pointer"
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
                  to="/explore"
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
        <div className="flex items-center justify-center gap-6 text-sm">
          <Link to="login">
            <button className="px-5 py-3 rounded-lg bg-accent-primary/10">
              Login
            </button>
          </Link>
          <Link to="signup">
            <button className="px-5 py-3 rounded-lg bg-accent-primary/10">
              Sign up
            </button>
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
