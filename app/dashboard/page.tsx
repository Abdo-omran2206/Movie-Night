"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaHeart, FaHistory } from "react-icons/fa";
import { useUserStore } from "@/store/useUserStore";
import DashboardMovieCard from "@/components/cards/DashboardMovieCard";

export default function DashboardPage() {
  const router = useRouter();
  const userStore = useUserStore((state) => state.user);
  const [loadingData, setLoadingData] = useState(true);
  const [status, setStatus] = useState<Record<string, number>>({});
  const [newBookmarks, setNewBookmarks] = useState<any[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch("/api/dashboard", {
          signal: controller.signal,
          credentials:"include",
          method:"GET"
        });

        if (!res.ok) throw new Error("Failed to fetch data");

        const data = await res.json();

        setStatus(data?.status || {});
        setNewBookmarks(data?.newBookmarks || []);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        console.error(err);
      } finally {
        setLoadingData(false);
      }
    })();
    return () => controller.abort();
  }, [router]);

  if (loadingData) {
    return (
      <>
        <style>{`
          @keyframes dash-shimmer {
            0%   { background-position: -800px 0; }
            100% { background-position: 800px 0; }
          }
          .dash-sk {
            background: linear-gradient(
              90deg,
              rgba(255,255,255,0.03) 0%,
              rgba(255,255,255,0.09) 45%,
              rgba(255,255,255,0.03) 90%
            );
            background-size: 800px 100%;
            animation: dash-shimmer 1.7s infinite linear;
          }
        `}</style>

        <div className="flex flex-col gap-5">

          {/* ── Hero Banner Skeleton ── */}
          <div
            className="rounded-3xl p-8 min-h-[200px] flex flex-col justify-center gap-4 relative overflow-hidden"
            style={{ background: "rgba(14,14,14,0.7)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            {/* Red glow placeholder */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(229,9,20,0.04) 0%, transparent 70%)" }} />
            {/* "WELCOME BACK, NAME" */}
            <div className="dash-sk rounded-xl" style={{ width: "55%", height: "2.5rem", background: "rgba(45,45,45,0.9)", animationDelay: "0s" }} />
            {/* Subtitle line 1 */}
            <div className="dash-sk rounded-lg" style={{ width: "75%", height: "1rem", background: "rgba(35,35,35,0.9)", animationDelay: "0.1s" }} />
            {/* Subtitle line 2 */}
            <div className="dash-sk rounded-lg" style={{ width: "55%", height: "1rem", background: "rgba(35,35,35,0.9)", animationDelay: "0.2s" }} />
          </div>

          {/* ── Stat Cards Skeleton ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { w: "60%", delay: "0s" },
              { w: "45%", delay: "0.08s" },
            ].map((card, i) => (
              <div
                key={i}
                className="rounded-2xl p-6"
                style={{
                  background: "rgba(14,14,14,0.7)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {/* Icon + label row */}
                <div className="flex items-center gap-4 mb-5">
                  <div
                    className="dash-sk w-10 h-10 rounded-full shrink-0"
                    style={{ background: "rgba(229,9,20,0.12)", animationDelay: card.delay }}
                  />
                  <div
                    className="dash-sk rounded-lg h-5"
                    style={{ width: card.w, background: "rgba(45,45,45,0.9)", animationDelay: card.delay }}
                  />
                </div>
                {/* Big number */}
                <div
                  className="dash-sk rounded-xl mb-2"
                  style={{ width: "3rem", height: "2.25rem", background: "rgba(50,50,50,0.9)", animationDelay: card.delay }}
                />
                {/* Sub-label */}
                <div
                  className="dash-sk rounded"
                  style={{ width: "7rem", height: "0.75rem", background: "rgba(35,35,35,0.8)", animationDelay: card.delay }}
                />
              </div>
            ))}
          </div>

          {/* ── Recent Activity Skeleton ── */}
          <div
            className="rounded-3xl px-3 py-8 lg:p-8"
            style={{ background: "rgba(14,14,14,0.7)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            {/* Section heading */}
            <div
              className="dash-sk rounded-lg mb-6"
              style={{ width: "11rem", height: "1.75rem", background: "rgba(45,45,45,0.9)", animationDelay: "0s" }}
            />

            {/* Movie card rows */}
            <div className="flex flex-col gap-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="flex gap-4 p-3 rounded-2xl"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    opacity: 1 - i * 0.15,
                  }}
                >
                  {/* Poster */}
                  <div
                    className="dash-sk shrink-0 rounded-xl"
                    style={{
                      width: "4.5rem",
                      height: "6.75rem",
                      background: "rgba(45,45,45,0.9)",
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                  {/* Text block */}
                  <div className="flex flex-col flex-1 justify-center gap-3 py-1">
                    {/* Badge */}
                    <div
                      className="dash-sk rounded-full"
                      style={{ width: "3.5rem", height: "0.75rem", background: "rgba(45,45,45,0.9)", animationDelay: `${i * 0.1 + 0.05}s` }}
                    />
                    {/* Title */}
                    <div
                      className="dash-sk rounded-lg"
                      style={{ width: `${55 + (i % 3) * 15}%`, height: "1.25rem", background: "rgba(50,50,50,0.9)", animationDelay: `${i * 0.1 + 0.1}s` }}
                    />
                    {/* Description lines */}
                    <div className="space-y-2">
                      <div
                        className="dash-sk rounded"
                        style={{ width: "100%", height: "0.625rem", background: "rgba(35,35,35,0.8)", animationDelay: `${i * 0.1 + 0.15}s` }}
                      />
                      <div
                        className="dash-sk rounded"
                        style={{ width: "80%", height: "0.625rem", background: "rgba(35,35,35,0.8)", animationDelay: `${i * 0.1 + 0.2}s` }}
                      />
                    </div>
                    {/* Status pill */}
                    <div
                      className="dash-sk rounded-full"
                      style={{ width: "5rem", height: "1.25rem", background: "rgba(45,45,45,0.9)", animationDelay: `${i * 0.1 + 0.25}s` }}
                    />
                  </div>
                  {/* Action icons */}
                  <div className="flex flex-col justify-center gap-3 pr-1">
                    <div
                      className="dash-sk rounded-full w-7 h-7"
                      style={{ background: "rgba(45,45,45,0.9)", animationDelay: `${i * 0.1}s` }}
                    />
                    <div
                      className="dash-sk rounded-full w-7 h-7"
                      style={{ background: "rgba(45,45,45,0.9)", animationDelay: `${i * 0.1 + 0.12}s` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </>
    );
  }

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
              {userStore?.name || "".toUpperCase()}
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
          onClick={() => router.push("/dashboard/watchlist")}
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

        <div
          onClick={() => router.push("/dashboard/bookmark")}
          className="bg-neutral-900/40 backdrop-blur-xl border border-neutral-800 rounded-2xl p-6 hover:border-red-600/30 transition-all group cursor-pointer"
        >
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
