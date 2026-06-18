import Footer from "@/components/ui/Footer";
import Navbar from "@/components/ui/Navbar";
import { SectionSkeleton } from "@/components/ui/Skeleton";
export default function Loading() {
  return (
    <>
      <Navbar />
      <div className="w-full h-screen bg-black flex items-center justify-center overflow-hidden">
        <div className="relative flex flex-col items-center">
          <div className="absolute inset-0 -m-8 rounded-full border-4 border-red-600/40 animate-ping"></div>
          <h1 className="text-6xl md:text-8xl font-bebas font-black text-red-700/70 tracking-widest">
            Movie Night
          </h1>
          <p className="mt-4 text-zinc-500 font-bold uppercase tracking-widest text-xs animate-pulse">
            Summoning Stars...
          </p>
        </div>
      </div>
      <div className="bg-black">
        {Array.from({ length: 6 }).map((_, i) => (
          <SectionSkeleton key={i} />
        ))}
      </div>
      <Footer />
    </>
  );
}
