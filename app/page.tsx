import Navbar from "./components/Navbar";
import Banner from "./components/Banner";
import Section from "./components/sections";
import Footer from "./components/Footer";
import { headers } from "next/headers";

export default async function Home() {
  const headersList = await headers();
  const locale = headersList.get("accept-language")?.split(",")[0] || "en-US";
  const [lang, region] = locale.split("-");

  const regions: Record<string, string> = {
    EG: "Egypt",
    US: "USA",
    GB: "UK",
    SA: "Saudi Arabia",
    AE: "UAE",
    FR: "France",
    DE: "Germany",
  };

  const locationName = region
    ? regions[region.toUpperCase()] || region.toUpperCase()
    : "Global";

  const sections = [
    {
      endpoint: "/movie/top_rated",
      title: "Top Rated Movies",
      slug: "top_rated",
    },
    { endpoint: "/movie/popular", title: "Popular Now", slug: "popular" },
    { endpoint: "/movie/upcoming", title: "Coming Soon", slug: "upcoming" },
    {
      endpoint: "/movie/now_playing",
      title: "Now Playing",
      slug: "now_playing",
    },
    {
      endpoint: "/discover/movie?vote_average.gte=7.5&vote_count.gte=1000",
      title: "Critically Acclaimed",
      slug: "top_rated",
    },
    {
      endpoint: "/discover/movie?with_genres=28",
      title: "Action Movies",
      slug: "action",
    },
    {
      endpoint: "/discover/movie?with_genres=35",
      title: "Comedy Movies",
      slug: "comedy",
    },
    {
      endpoint: `/discover/movie?region=${region || "US"}&sort_by=popularity.desc&with_original_language=${lang || "en"}`,
      title: `Trending in ${locationName}`,
      slug: "trending",
    },
  ];

  return (
    <div className="overflow-x-hidden bg-black">
      <Navbar />
      <main className="min-h-screen pt-[5vh]">
        <Banner />
        {sections.map((section) => (
          <Section
            key={section.endpoint}
            endpoint={section.endpoint}
            title={section.title}
            categorySlug={section.slug}
          />
        ))}
      </main>
      <Footer />
    </div>
  );
}
