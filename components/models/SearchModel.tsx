import { Movie } from "@/constant/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { SearchItem } from "../cards/SearchCard";

export default function SearchModal({
  setIsSearchModelOpen,
}: {
  setIsSearchModelOpen: (open: boolean) => void;
}) {
  const router = useRouter();
  const [localQuery, setLocalQuery] = useState("");
  const [localResults, setLocalResults] = useState<Movie[]>([]);

  useEffect(() => {
    async function syncSearch() {
      try {
        const res = await fetch(`/api/search?query=${encodeURIComponent(localQuery)}&page=1&type=multi`);
        const data = await res.json();
        setLocalResults(data.results || []);
      } catch (err) {
        console.error("Search API error:", err);
        setLocalResults([]);
      }
    }
    const timer = setTimeout(() => {
      if (localQuery.trim()) {
        syncSearch();
      } else {
        setLocalResults([]);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [localQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localQuery.trim()) return;
    router.push(`/search?q=${encodeURIComponent(localQuery.trim())}`);
    setIsSearchModelOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-start justify-center z-100 pt-[15vh] px-4">
      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 w-full max-w-xl shadow-[0_0_50px_-12px_rgba(220,38,38,0.3)] relative animate-in fade-in zoom-in duration-300">
        <button
          onClick={() => setIsSearchModelOpen(false)}
          className="absolute right-6 top-6 text-neutral-400 hover:text-white transition-colors"
          aria-label="Close search modal"
        >
          <span className="text-2xl">✕</span>
        </button>

        <h2 className="text-white text-2xl font-bold mb-6 pr-10 tracking-tight">
          Search Movies & TV
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex relative items-center gap-3 mb-6"
        >
          <div className="relative flex-1">
            {/* <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" /> */}
            <input
              type="search"
              placeholder="Search for movies, actors, tv shows..."
              autoFocus
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              className="w-full bg-neutral-900 rounded-xl pr-16 pl-3 py-2 outline-none text-white placeholder-neutral-500 text-md border border-neutral-800 focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all shadow-inner"
            />
          </div>
          <button
            type="submit"
            className="absolute right-0 bg-red-600 hover:bg-red-700 p-3 px-5 rounded-xl text-white font-semibold transition-all shadow-lg shadow-red-600/20 active:scale-95"
            aria-label="Submit search"
          >
            <FaSearch className="text-white text-lg " />
          </button>
        </form>

        <div className="max-h-[50vh] overflow-y-auto custom-scrollbar rounded-xl bg-neutral-900/50 border border-neutral-800/50">
          {localResults.length > 0 ? (
            <div className="divide-y divide-neutral-800/50">
              {localResults
                .filter(
                  (item) =>
                    item.media_type === "movie" || item.media_type === "tv",
                )
                .slice(0, 8)
                .map((item) => (
                  <div
                    key={`${item.media_type}-${item.id}`}
                    onClick={() => setIsSearchModelOpen(false)}
                  >
                    <SearchItem item={item} />
                  </div>
                ))}
            </div>
          ) : localQuery.trim() ? (
            <div className="flex flex-col items-center justify-center py-12 text-neutral-500">
              <FaSearch size={40} className="mb-4 opacity-20" />
              <p className="text-lg">
                No matches found for &quot;{localQuery}&quot;
              </p>
            </div>
          ) : (
            <div className="py-12 text-center text-neutral-500 italic">
              Try searching for &quot;Inception&quot; or &quot;Breaking
              Bad&quot;
            </div>
          )}
        </div>
      </div>
    </div>
  );
}