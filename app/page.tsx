import Navbar from "./components/Navbar";
import Banner from "./components/Banner";
import Section from "./components/sections";
import Footer from "./components/Footer";
import { supabaseClient } from "./lib/supabase";
import { getRegion } from "./lib/getRegion";
import NightGuide from "./components/NightGuide";
import { SectionData } from "./constant/types";
import { regions } from "./constant/main";

export default async function Home() {
  const region = await getRegion();
  // Ensure we use a region code that we have a name for, or fallback to US
  const regionCode = (region && regions[region.region]) ? region.region : "US";
  const countryName = regions[regionCode];

  const { data, error } = await supabaseClient
    .from("sections_content")
    .select("*")
    .eq("is_active", true)
    .order("id", { ascending: true });

  if (error) {
    console.error("Error fetching sections:", error);
  }

  // Determine which sections to use: from DB if available, or hardcoded fallback
  const sectionsList: SectionData[] = (data && data.length > 0) ? (data as SectionData[]) : [
    // Trending / Popular
    {
      endpoint: "/movie/popular",
      title: "Popular Movies",
      slug: "popular",
    },
    {
      endpoint: "/tv/popular",
      title: "Popular TV Shows",
      slug: "popular",
    },
    {
      endpoint: `/discover/movie?with_origin_country=${regionCode}&sort_by=popularity.desc`,
      title: `Trending in ${countryName}`,
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

  // Process sections to replace placeholders with real values (useful for DB content)
  const sections = sectionsList.map((section: SectionData) => ({
    ...section,
    title: section.title
      .replace("${countryName}", countryName || "USA")
      .replace("{countryName}", countryName || "USA"),
    endpoint: section.endpoint
      .replace("${region}", regionCode)
      .replace("{region}", regionCode),
  }));

  return (
    <div className="overflow-x-hidden bg-black">
      <Navbar />
      <main className="min-h-screen pt-[5vh]">
        <Banner />
        {sections.map((section: SectionData) => (
          <Section
            key={section.endpoint}
            endpoint={section.endpoint}
            title={section.title}
          />
        ))}
      </main>
      <NightGuide/>
      <Footer />
    </div>
  );
}
