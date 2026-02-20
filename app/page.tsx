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
    // Trending / Popular
    { endpoint: "/movie/popular", title: "Popular Movies", slug: "popular" },
    { endpoint: "/tv/popular", title: "Popular TV Shows", slug: "popular" },
    {
      endpoint: `/discover/movie?region=${region || "US"}&sort_by=popularity.desc&with_original_language=${lang || "en"}`,
      title: `Trending in ${locationName}`,
      slug: "trending",
    },
    // Top Rated
    {
      endpoint: "/movie/top_rated",
      title: "Top Rated Movies",
      slug: "top_rated",
    },
    {
      endpoint: "/tv/top_rated",
      title: "Top Rated TV Shows",
      slug: "top_rated",
    },

    // Recently Released / Now Playing
    {
      endpoint: "/movie/now_playing",
      title: "Now Playing Movies",
      slug: "now_playing",
    },
    {
      endpoint: "/tv/now_playing",
      title: "Now Playing TV Shows",
      slug: "now_playing",
    },
    {
      endpoint: "/tv/airing_today",
      title: "Airing Today TV Shows",
      slug: "airing_today",
    },
    {
      endpoint: "/movie/upcoming",
      title: "Coming Soon Movies",
      slug: "upcoming",
    },
    {
      endpoint: "/tv/on_the_air",
      title: "Coming Soon TV Shows",
      slug: "on_the_air",
    },

    // Critically Acclaimed
    {
      endpoint: "/discover/movie?vote_average.gte=7.5&vote_count.gte=1000",
      title: "Critically Acclaimed Movies",
      slug: "top_rated",
    },

    // Genres
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
