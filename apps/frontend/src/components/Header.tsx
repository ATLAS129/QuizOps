import { useState } from "react";
import { FaLightbulb, FaUser } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { Link, useNavigate } from "react-router";
import { useLogout } from "../hooks/useAuth";

const Header = ({ username, userId }: { username: string; userId: string }) => {
  const navigate = useNavigate();
  const { mutate: logout } = useLogout();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="h-14 w-full bg-bg-surface flex items-center justify-between px-6">
      <div>
        <Link to={"/"}>Logo QuizOps</Link>
      </div>

      <div className="flex items-center justify-center gap-6 text-sm">
        <div className="py-2 px-3 bg-accent-primary rounded-lg">
          <Link to={`/profile/${userId}/decks`}>All my decks</Link>
        </div>

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
                className="flex items-center gap-2 rounded-xl p-2 text-sm text-text-muted transition hover:bg-bg-surface-hover hover:text-white"
              >
                <FaUser />
                Profile
              </Link>
              <Link
                to={`/profile/${userId}/decks`}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 rounded-xl p-2 text-sm text-text-muted transition hover:bg-bg-surface-hover hover:text-white"
              >
                <FaLightbulb />
                My decks
              </Link>
              <Link
                to="/settings"
                onClick={() => setIsMenuOpen(false)}
                className="flex w-full items-center  gap-2 rounded-xl p-2 text-left text-sm text-text-muted transition hover:bg-bg-surface-hover hover:text-white"
              >
                <IoMdSettings />
                Settings
              </Link>
              <button
                onClick={async () => {
                  setIsMenuOpen(false);
                  logout(undefined, {
                    onSuccess: () => navigate("/login", { replace: true }),
                  });
                }}
                className="flex w-full items-center  gap-2 rounded-xl p-2 text-left text-sm text-text-muted transition hover:bg-bg-surface-hover hover:text-white"
              >
                <IoLogOut />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
