import { Link } from "react-router";

const Header = () => {
  return (
    <header className="h-14 w-full bg-bg-surface flex items-center justify-between px-6">
      <div>
        <Link to={"/"}>Logo QuizOps</Link>
      </div>

      <div className="flex items-center justify-center gap-6 text-sm">
        <Link to={"/profile"}>All my decks</Link>
        <div className="size-8 bg-purple-400 rounded-full flex justify-center items-center text-sm select-none cursor-pointer">
          ME
        </div>
      </div>
    </header>
  );
};

export default Header;
