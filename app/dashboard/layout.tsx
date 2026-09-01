"use client";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { generateUserAvatar } from "@/lib/generateMovieAvatar";
import Image from "next/image";
import { FaHeart, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { CgPlayList } from "react-icons/cg";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userStore = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (pathname === "/dashboard") {
      setActiveTab("overview");
    } else if (pathname === "/dashboard/bookmark") {
      setActiveTab("bookmark");
    } else if (pathname.startsWith("/dashboard/playlist")) {
      setActiveTab("playlist");
    } else {
      setActiveTab("overview");
    }
  }, [pathname]);

  useEffect(() => {
    document.title = "Dashboard - Movie Night";
    setLoading(false);
  }, [router]);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/account/logout", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        console.error("Logout failed:", data);
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
    clearUser();
    router.push("/account/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
        <style>{`
          @keyframes layout-shimmer {
            0%   { background-position: -600px 0; }
            100% { background-position: 600px 0; }
          }
          .lay-sk {
            background: linear-gradient(
              90deg,
              rgba(255,255,255,0.03) 0%,
              rgba(255,255,255,0.09) 45%,
              rgba(255,255,255,0.03) 90%
            );
            background-size: 600px 100%;
            animation: layout-shimmer 1.7s infinite linear;
          }
        `}</style>

        <main className="container mx-auto px-4 lg:px-20 pt-32 pb-20 grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Skeleton */}
          <div className="lg:col-span-1">
            <div
              className="rounded-3xl p-6 flex flex-col items-center"
              style={{
                background: "rgba(14,14,14,0.7)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {/* Avatar circle with red ring */}
              <div
                className="lay-sk w-24 h-24 rounded-full mb-4 shrink-0"
                style={{
                  background: "rgba(45,45,45,0.9)",
                  boxShadow: "0 0 0 2px rgba(229,9,20,0.25)",
                }}
              />
              {/* Name */}
              <div
                className="lay-sk rounded-lg mb-2"
                style={{ width: "8rem", height: "1.375rem", background: "rgba(50,50,50,0.9)", animationDelay: "0.1s" }}
              />
              {/* Email */}
              <div
                className="lay-sk rounded mb-6"
                style={{ width: "11rem", height: "0.875rem", background: "rgba(40,40,40,0.9)", animationDelay: "0.18s" }}
              />

              {/* Divider */}
              <div className="w-full h-px mb-6" style={{ background: "rgba(255,255,255,0.05)" }} />

              {/* Nav button skeletons */}
              <div className="w-full space-y-2.5">
                {[
                  { w: "65%", delay: "0.05s" },
                  { w: "55%", delay: "0.12s" },
                  { w: "50%", delay: "0.19s" },
                  { w: "45%", delay: "0.26s" },
                ].map((btn, i) => (
                  <div
                    key={i}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl"
                    style={{
                      background: i === 0 ? "rgba(229,9,20,0.06)" : "rgba(255,255,255,0.02)",
                      border: i === 0 ? "1px solid rgba(229,9,20,0.12)" : "1px solid rgba(255,255,255,0.04)",
                    }}
                  >
                    {/* Icon */}
                    <div
                      className="lay-sk w-5 h-5 rounded-md shrink-0"
                      style={{ background: "rgba(50,50,50,0.9)", animationDelay: btn.delay }}
                    />
                    {/* Label */}
                    <div
                      className="lay-sk rounded"
                      style={{ width: btn.w, height: "0.875rem", background: "rgba(45,45,45,0.9)", animationDelay: btn.delay }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main content skeleton placeholder */}
          <div className="lg:col-span-3 flex flex-col gap-5">
            <div
              className="rounded-3xl p-8 min-h-[200px] lay-sk"
              style={{ background: "rgba(14,14,14,0.7)", border: "1px solid rgba(255,255,255,0.06)" }}
            />
            <div className="grid grid-cols-2 gap-4">
              <div
                className="rounded-2xl h-32 lay-sk"
                style={{ background: "rgba(14,14,14,0.7)", border: "1px solid rgba(255,255,255,0.06)", animationDelay: "0.1s" }}
              />
              <div
                className="rounded-2xl h-32 lay-sk"
                style={{ background: "rgba(14,14,14,0.7)", border: "1px solid rgba(255,255,255,0.06)", animationDelay: "0.18s" }}
              />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden selection:bg-red-500/30">
      <Navbar />

      <div className="container mx-auto px-4 lg:px-20 pt-32 pb-20 relative z-10">
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
                  <Image
                    src={generateUserAvatar(userStore?.name || "")}
                    alt={userStore?.name || ""}
                    width={150}
                    height={150}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2
                  className="text-xl font-bold tracking-wider mb-1"
                  style={{ fontFamily: "var(--font-bebas)" }}
                >
                  {userStore?.name || ""}
                </h2>
                <p className="text-sm text-neutral-400 mb-6 truncate w-full px-2">
                  {userStore?.email}
                </p>

                <div className="w-full flex-1 border-t border-neutral-800/80 mb-6"></div>

                <nav className="w-full space-y-2">
                  <button
                    onClick={() => {
                      router.push("/dashboard");
                      setActiveTab("overview");
                    }}
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
                    onClick={() => {
                      router.push("/dashboard/bookmark");
                      setActiveTab("bookmark");
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                      activeTab === "bookmark"
                        ? "bg-red-600/10 text-red-500 font-medium border border-red-600/20"
                        : "hover:bg-neutral-800 text-neutral-400 hover:text-white border border-transparent"
                    }`}
                  >
                    <FaHeart className="text-lg" />
                    <span>bookmark</span>
                  </button>

                  <button
                    onClick={() => {
                      router.push("/dashboard/playlist");
                      setActiveTab("playlist");
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                      activeTab === "playlist"
                        ? "bg-red-600/10 text-red-500 font-medium border border-red-600/20"
                        : "hover:bg-neutral-800 text-neutral-400 hover:text-white border border-transparent"
                    }`}
                  >
                    <CgPlayList className="text-2xl" />
                    <span>Playlist</span>
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
          <main className="lg:col-span-3 space-y-8">{children}</main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
