import Footer from "@/components/ui/Footer";
import Navbar from "@/components/ui/Navbar";
import CastList from "@/components/cards/CastCard";
import Link from "next/link";
import { MovieDetail } from "@/constant/types";

type Props = {
  data:MovieDetail
}

export default function CastClient({data}:Props) {
  if (!data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white text-xl">Movie not found.</p>
        <Link href="/" className="text-red-500 hover:underline mt-4">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white py-20 px-4 md:px-10 lg:px-20">
        <div className="container mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Full Cast</h1>
            <div className="flex items-center gap-4 text-gray-400">
              <h2 className="text-2xl font-semibold text-red-600">
                {data.title}
              </h2>
              <span>({data.release_date.split("-")[0]})</span>
            </div>
            <div className="w-32 h-1.5 bg-red-600 rounded-full mt-6" />
          </div>

          <div className="bg-neutral-900/20 p-8 rounded-3xl ring-1 ring-white/5">
            <CastList cast={data.credits?.cast || []} navig="movie" />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
