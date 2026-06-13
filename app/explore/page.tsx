import { Metadata } from "next";
import ExploreClient from "./ExploreClient";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

export const metadata: Metadata = {
  title: "Explore Movies & TV Shows - Movie Night",
  description: "Browse movies and TV shows by genre, category, and trending status. Discover your next favorite film on Movie Night.",
  openGraph: {
    title: "Explore Movies & TV Shows - Movie Night",
    description: "Browse movies and TV shows by genre, category, and trending status.",
    type: "website",
  },
};

export default function ExplorePage() {
  return (
    <div className="bg-black min-h-screen flex flex-col pt-24">
      <Navbar />
      <main className="grow">
        <ExploreClient />
      </main>
      <Footer />
    </div>
  );
}
