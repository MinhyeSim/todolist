import Link from "next/link";

const Header = () => {
  return (
    <header className="bg-slate-900 text-white py-4 shadow">
      <div className="max-w-3xl mx-auto px-4">
        <Link
          href="/"
          className="text-xl font-bold hover:text-violet-400 transition"
        >
          📝 Todo List
        </Link>
      </div>
    </header>
  );
};

export default Header;
