"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/app/lib/supabase";
import Navbar from "@/app/components/ui/Navbar";
import Footer from "@/app/components/ui/Footer";
import {
  FaUserCircle,
  FaSignOutAlt,
  FaHeart,
  FaCog,
  FaHistory,
  FaStar,
} from "react-icons/fa";
import { fetchNewBookmarks, fetchStatusCount } from "@/app/api/BookmarkManager";
import DashboardMovieCard from "../components/cards/DashboardMovieCard";
import Watchlist from "../components/layout/watchlist";
import { generateUserAvatar } from "../lib/generateMovieAvatar";

export default function DashboardPage() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<Record<string, number>>({});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [newBookmarks, setNewBookmarks] = useState<any[]>([]);

  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();

      if (!session) {
        router.replace("/account/login");
        return;
      }

      setUser(session.user);

      // Save auth status in cookies as requested
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 7); // 7 days
      document.cookie = `movie_night_auth=true; path=/; expires=${expirationDate.toUTCString()};`;

      setLoading(false);

      setStatus(await fetchStatusCount(session.user.id));
      setNewBookmarks(await fetchNewBookmarks(session.user.id));
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    await supabaseClient.auth.signOut();
    document.cookie =
      "movie_night_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    router.push("/account/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
        <Navbar />
        <main className="container mx-auto px-4 lg:px-20 pt-32 pb-20 grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-6 h-[400px] animate-pulse flex flex-col items-center">
              <div className="w-24 h-24 bg-neutral-800 rounded-full mb-4" />
              <div className="w-32 h-6 bg-neutral-800 rounded mb-2" />
              <div className="w-48 h-4 bg-neutral-800 rounded mb-8" />
              <div className="w-full flex-1 border-t border-neutral-800/80 mb-6" />
              <div className="w-full space-y-3">
                <div className="w-full h-12 bg-neutral-800 rounded-xl" />
                <div className="w-full h-12 bg-neutral-800 rounded-xl" />
                <div className="w-full h-12 bg-neutral-800 rounded-xl" />
              </div>
            </div>
          </div>
          {/* Main skeleton */}
          <div className="lg:col-span-3 space-y-8">
            <div className="h-[200px] bg-neutral-900/40 border border-neutral-800 rounded-3xl animate-pulse p-8 flex flex-col justify-center">
              <div className="w-1/2 h-8 bg-neutral-800 rounded mb-4" />
              <div className="w-3/4 h-4 bg-neutral-800 rounded" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-neutral-900/40 border border-neutral-800 rounded-2xl animate-pulse p-6">
                  <div className="flex gap-4 mb-4">
                    <div className="w-10 h-10 bg-neutral-800 rounded-full" />
                    <div className="w-20 h-6 bg-neutral-800 rounded mt-2" />
                  </div>
                  <div className="w-12 h-6 bg-neutral-800 rounded" />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Placeholder for user name parsing
  const userName =
    user?.user_metadata?.username ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "User";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden selection:bg-red-500/30">
      <Navbar />

      <main className="container mx-auto px-4 lg:px-20 pt-32 pb-20 relative z-10">
        {/* Ambient Effects */}
        <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-red-600/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-red-900/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar / Profile Card */}
          <div className="lg:col-span-1 sticky top-0 self-start">
            <div className="bg-neutral-900/60 backdrop-blur-2xl border border-neutral-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-linear-to-b from-red-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-neutral-800 border-2 border-red-600/50 rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(220,38,38,0.2)]">
                  <Image src={generateUserAvatar(userName)} alt={userName} width={150} height={150} className="w-full h-full object-cover" />
                </div>
                <h2
                  className="text-xl font-bold tracking-wider mb-1"
                  style={{ fontFamily: "var(--font-bebas)" }}
                >
                  {userName}
                </h2>
                <p className="text-sm text-neutral-400 mb-6 truncate w-full px-2">
                  {user?.email}
                </p>

                <div className="w-full flex-1 border-t border-neutral-800/80 mb-6"></div>

                <nav className="w-full space-y-2">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                      activeTab === "overview"
                        ? "bg-red-600/10 text-red-500 font-medium border border-red-600/20"
                        : "hover:bg-neutral-800 text-neutral-400 hover:text-white border border-transparent"
                    }`}
                  >
                    <FaUserCircle className="text-lg" />
                    <span>Profile Overview</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("watchlist")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                      activeTab === "watchlist"
                        ? "bg-red-600/10 text-red-500 font-medium border border-red-600/20"
                        : "hover:bg-neutral-800 text-neutral-400 hover:text-white border border-transparent"
                    }`}
                  >
                    <FaHeart className="text-lg" />
                    <span>Watchlist</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors border border-transparent">
                    <FaCog className="text-lg" />
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-600/10 text-neutral-400 hover:text-red-500 transition-colors mt-4 border border-transparent"
                  >
                    <FaSignOutAlt className="text-lg" />
                    <span>Log Out</span>
                  </button>
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-8">
            {activeTab === "overview" && (
              <>
                {/* Welcome Banner */}
                <div className="bg-neutral-900/40 backdrop-blur-xl border border-neutral-800 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-center min-h-[200px] animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-[80px] pointer-events-none" />
                  <div className="relative z-10">
                    <h1
                      className="text-4xl font-black tracking-widest text-shadow-black mb-3"
                      style={{ fontFamily: "var(--font-bebas)" }}
                    >
                      WELCOME BACK,{" "}
                      <span className="text-red-600">{userName.toUpperCase()}</span>
                    </h1>
                    <p className="text-neutral-400 text-lg max-w-xl">
                      Ready for your next cinematic adventure? Pick up right where
                      you left off or explore new trending titles.
                    </p>
                  </div>
                </div>

                {/* Quick Stats/Widgets Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                  <div 
                    onClick={() => setActiveTab("watchlist")}
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

                  <div className="bg-neutral-900/40 backdrop-blur-xl border border-neutral-800 rounded-2xl p-6 hover:border-red-600/30 transition-all group cursor-pointer">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 rounded-full bg-red-600/10 flex items-center justify-center">
                        <FaStar className="text-red-500" />
                      </div>
                      <h3 className="font-semibold text-lg">Reviews</h3>
                    </div>
                    <p
                      className="text-3xl font-black"
                      style={{ fontFamily: "var(--font-bebas)" }}
                    >
                      4
                    </p>
                    <p className="text-sm text-neutral-500 mt-1">
                      Ratings submitted
                    </p>
                  </div>
                </div>

                {/* Recent Activity Mock */}
                <div className="bg-neutral-900/40 backdrop-blur-xl border border-neutral-800 rounded-3xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                  <h2
                    className="text-2xl font-bold tracking-widest mb-6"
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
                      <div className="w-full flex flex-wrap flex-col justify-center items-center gap-6 p-4">
                        {newBookmarks.map((bookmark) => (
                          <div
                            key={bookmark.created_at}
                            className="w-full md:w-auto justify-center items-center"
                          >
                            <DashboardMovieCard {...bookmark.movies} status={bookmark.status} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {activeTab === "watchlist" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Watchlist userId={user.id} />
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
