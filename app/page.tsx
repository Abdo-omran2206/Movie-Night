import Navbar from "./components/Navbar";
import Banner from "./components/Banner";
import Section from "./components/sections";
import Footer from "./components/Footer";

export default function Home() {
  const sections = [
    { endpoint: "/movie/top_rated", title: "Top Rated Movies" },
    { endpoint: "/movie/popular", title: "Popular Now" },
    { endpoint: "/movie/upcoming", title: "Coming Soon" },
    { endpoint: "/movie/now_playing", title: "Now Playing" },
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
          />
        ))}
      </main>
      <Footer />
    </div>
  );
}
