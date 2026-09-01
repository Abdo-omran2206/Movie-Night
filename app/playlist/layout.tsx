import type { Metadata } from "next";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

export const metadata: Metadata = {
  title: "Playlists",
  description: "Browse movie & show collections created by users.",
};

export default function PlaylistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col justify-between selection:bg-red-500/30 overflow-x-hidden">
      <Navbar />
      <main className="flex-1 w-full pt-28 pb-16 px-4 max-w-7xl mx-auto">
        {children}
      </main>
      <Footer />
    </div>
  );
}
