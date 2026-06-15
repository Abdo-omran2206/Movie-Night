"use client";
import DashboardMovieCard from "@/components/cards/DashboardMovieCard";
import { FaHeart, FaHistory } from "react-icons/fa";
type Props = {
  status: Record<string, number>;
  newBookmarks: any[];
  userName?:string;
};
export default function Home({ status, newBookmarks,userName }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <div className="bg-neutral-900/40 backdrop-blur-xl border border-neutral-800 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-center min-h-[200px] animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative z-10">
          <h1
            className="text-4xl font-black tracking-widest text-shadow-black mb-3"
            style={{ fontFamily: "var(--font-bebas)" }}
          >
            WELCOME BACK,{" "}
            <span className="text-red-600">
              {userName || "".toUpperCase()}
            </span>
          </h1>
          <p className="text-neutral-400 text-lg max-w-xl">
            Ready for your next cinematic adventure? Pick up right where you
            left off or explore new trending titles.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
        <div
          className="bg-neutral-900/40 backdrop-blur-xl border border-neutral-800 rounded-2xl p-6 hover:border-red-600/30 transition-all group cursor-pointer"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-red-600/10 flex items-center justify-center">
              <FaHeart className="text-red-500" />
            </div>
            <h3 className="font-semibold text-lg">Watchlist</h3>
          </div>
          <p
            className="text-3xl font-black"
            style={{ fontFamily: "var(--font-bebas)" }}
          >
            {status["Watch Later"] || 0}
          </p>
          <p className="text-sm text-neutral-500 mt-1">Saved for later</p>
        </div>

        <div className="bg-neutral-900/40 backdrop-blur-xl border border-neutral-800 rounded-2xl p-6 hover:border-red-600/30 transition-all group cursor-pointer">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-red-600/10 flex items-center justify-center">
              <FaHistory className="text-red-500" />
            </div>
            <h3 className="font-semibold text-lg">History</h3>
          </div>
          <p
            className="text-3xl font-black"
            style={{ fontFamily: "var(--font-bebas)" }}
          >
            {status["Completed"] || 0}
          </p>
          <p className="text-sm text-neutral-500 mt-1">Titles watched</p>
        </div>
      </div>

      <div className="bg-neutral-900/40 backdrop-blur-xl border border-neutral-800 rounded-3xl px-3 py-8 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
        <h2
          className="text-2xl font-bold tracking-widest mb-6 px-2 lg:p-0"
          style={{ fontFamily: "var(--font-bebas)" }}
        >
          Recent Activity
        </h2>
        <div className="flex flex-col items-center justify-center py-12 text-neutral-600 border-2 border-dashed border-neutral-800 rounded-xl">
          {newBookmarks.length === 0 ? (
            <>
              <FaHistory className="text-4xl mb-4 opacity-50" />
              <p>No recent activity yet.</p>
              <button className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-red-600/20">
                Explore Movies
              </button>
            </>
          ) : (
            <div className="w-full flex flex-wrap flex-col justify-center items-center gap-6 p-1 lg:p-4">
              {newBookmarks.map((bookmark) => (
                <div
                  key={bookmark.created_at}
                  className="w-full md:w-auto justify-center items-center"
                >
                  <DashboardMovieCard
                    {...bookmark.movies}
                    status={bookmark.status}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
