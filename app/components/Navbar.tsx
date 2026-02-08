import { FaSearch } from "react-icons/fa";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-black/80 backdrop-blur-lg border-b border-neutral-800/50">
      {/* Logo */}
      <h1 className="text-red-600 text-3xl tracking-widest font-bold select-none">
        MOVIE NIGHT
      </h1>

      {/* Search */}
      <form className="flex items-center gap-2 bg-neutral-900/80 border border-neutral-700 rounded-lg px-3 py-2 w-full max-w-md">
        <input
          type="search"
          placeholder="Search movies..."
          className="flex-1 bg-transparent outline-none text-white placeholder-neutral-500"
        />
        <button
          type="submit"
          className="text-red-600 hover:text-red-500 transition"
        >
          <FaSearch />
        </button>
      </form>
    </nav>
  );
}
