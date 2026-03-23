import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { Metadata } from "next";
import { siteUrl, socialMedia } from "@/app/constant/main";
import Link from "next/link";
import {
  FaFilm,
  FaStar,
  FaTv,
  FaUsers,
  FaRocket,
  FaHeart,
  FaGithub,
} from "react-icons/fa";
import { MdMovieFilter, MdOutlineExplore, MdSupportAgent } from "react-icons/md";

export const metadata: Metadata = {
  title: "About Movie Night",
  description:
    "Learn about Movie Night — a cinematic platform for discovering trending movies, binge-worthy series, actor profiles, and more.",
  alternates: { canonical: `${siteUrl}/about` },
  openGraph: {
    title: "About Movie Night",
    description:
      "Learn about Movie Night — a cinematic platform for discovering trending movies, binge-worthy series, actor profiles, and more.",
    url: `${siteUrl}/about`,
    siteName: "Movie Night",
    type: "website",
    images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Movie Night",
    description:
      "A cinematic platform for discovering trending movies, binge-worthy series, and more.",
  },
};

const features = [
  {
    icon: MdMovieFilter,
    title: "Vast Movie Library",
    desc: "Explore thousands of films across every genre, era, and language — all powered by the TMDB database.",
  },
  {
    icon: FaTv,
    title: "TV Shows & Series",
    desc: "Dive deep into TV shows with full season breakdowns, episode guides, and cast details.",
  },
  {
    icon: FaStar,
    title: "Ratings & Reviews",
    desc: "See community ratings and aggregate scores to decide what's worth your time.",
  },
  {
    icon: FaUsers,
    title: "Actor Profiles",
    desc: "Discover full filmographies and biographies for any actor with a single click.",
  },
  {
    icon: MdOutlineExplore,
    title: "Smart Discovery",
    desc: "Genre-based categories, trending feeds, and curated lists help you always find something great.",
  },
  {
    icon: MdSupportAgent,
    title: "Night Guide AI",
    desc: "Get personalized movie & TV recommendations powered by our built-in AI assistant.",
  },
];

const stats = [
  { value: "1M+", label: "Movies & TV Shows" },
  { value: "500K+", label: "Actors & Crew" },
  { value: "20+", label: "Genre Categories" },
  { value: "100%", label: "Free to Use" },
];

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About Movie Night",
    "description": "Learn about Movie Night — a cinematic platform for discovering trending movies, binge-worthy series, and actor profiles.",
    "url": `${siteUrl}/about`,
    "mainEntity": {
      "@type": "Organization",
      "name": "Movie Night",
      "url": siteUrl,
      "logo": `${siteUrl}/favicon.png`,
      "sameAs": [
        "https://github.com/Abdo-omran2206",
        "https://www.linkedin.com/in/abdalla-omran-388572361/",
        "https://www.reddit.com/r/myMovieNight/",
        "https://discord.gg/yep7xvZj"
      ]
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="grow pt-24 pb-16">
        {/* ── Hero ─────────────────────────────── */}
        <section className="relative py-20 overflow-hidden">
          {/* Glow blobs */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-red-700/20 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-red-900/15 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
            <span className="inline-flex items-center gap-2 text-red-500 text-xs font-bold uppercase tracking-[0.2em] mb-6 px-4 py-1.5 rounded-full border border-red-800/60 bg-red-950/30">
              <FaFilm size={12} />
              About Us
            </span>

            <h1 className="text-5xl md:text-7xl font-bold font-bebas tracking-wider mb-6 leading-tight">
              Where Cinema
              <br />
              <span className="text-red-600">Comes Alive</span>
            </h1>

            <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
              Movie Night is a free, cinematic discovery platform built for film lovers. We bring together
              up-to-date movie data, rich actor profiles, and smart recommendations — all wrapped in a
              beautiful, dark-themed experience.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/"
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-bold text-base transition-all hover:scale-105 active:scale-95 shadow-lg shadow-red-900/40"
              >
                Start Exploring
              </Link>
              <Link
                href="/nightguide"
                className="border border-neutral-700 hover:border-red-600 text-gray-300 hover:text-white px-8 py-3 rounded-full font-bold text-base transition-all"
              >
                Try Night Guide AI
              </Link>
            </div>
          </div>
        </section>

        {/* ── Stats ─────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 my-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 text-center hover:border-red-800/50 transition-colors"
              >
                <p className="text-4xl font-bold font-bebas text-red-500 tracking-wide mb-1">
                  {s.value}
                </p>
                <p className="text-gray-500 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Mission ─────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 my-16">
          <div className="bg-linear-to-br from-red-950/30 via-neutral-900/50 to-neutral-900/80 border border-red-900/30 rounded-3xl p-8 md:p-14 flex flex-col md:flex-row gap-8 items-center">
            <div className="shrink-0 w-20 h-20 rounded-2xl bg-red-600/20 border border-red-700/40 flex items-center justify-center">
              <FaHeart size={36} className="text-red-500" />
            </div>
            <div>
              <h2 className="text-3xl font-bold font-bebas tracking-wide text-white mb-3">
                Our Mission
              </h2>
              <p className="text-gray-400 leading-relaxed text-lg">
                We believe great cinema deserves a great platform. Our mission is to make movie discovery
                effortless, beautiful, and deeply informative. Whether you&apos;re hunting for tonight&apos;s
                blockbuster or a hidden gem from the 80s, Movie Night helps you find it instantly — with
                all the context you need to love it.
              </p>
            </div>
          </div>
        </section>

        {/* ── Features ─────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 my-16">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-bold font-bebas tracking-wide text-white mb-3">
              Everything You Need
            </h2>
            <p className="text-gray-500 text-base max-w-xl mx-auto">
              A complete cinematic toolkit, built around you.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="group bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 hover:border-red-800/60 hover:bg-neutral-900/80 transition-all duration-300"
                >
                  <div className="w-11 h-11 rounded-xl bg-red-600/15 border border-red-800/30 flex items-center justify-center mb-4 group-hover:bg-red-600/25 transition-colors">
                    <Icon size={20} className="text-red-500" />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Tech Stack ─────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 my-16">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-bold font-bebas tracking-wide text-white mb-3">
              Built With
            </h2>
            <p className="text-gray-500 text-base">
              Powered by modern, open technologies.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Next.js 15",
              "React 19",
              "TypeScript",
              "Tailwind CSS",
              "TMDB API",
              "Supabase",
              "Vercel",
            ].map((tech) => (
              <span
                key={tech}
                className="px-5 py-2 rounded-full border border-neutral-700 text-gray-400 text-sm hover:border-red-700/60 hover:text-white transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* ── Join our Community ─────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 my-16">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-bold font-bebas tracking-wide text-white mb-3">
              Join Our Community
            </h2>
            <p className="text-gray-500 text-base max-w-xl mx-auto">
              Follow us, join the discussion, and contribute to the project.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {socialMedia.map((social) => {
              const Icon = social.icon;
              return (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-neutral-900/40 border border-neutral-800 rounded-2xl p-6 flex flex-col items-center text-center hover:border-red-600/50 hover:bg-neutral-900/80 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-2xl bg-neutral-800 flex items-center justify-center mb-4 group-hover:bg-red-600/20 group-hover:text-red-500 transition-colors">
                    <Icon size={28} />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-1 group-hover:text-red-500 transition-colors">
                    {social.label}
                  </h3>
                  <p className="text-gray-500 text-xs">Connect with us on {social.label}</p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ── CTA ─────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-4 my-16 text-center">
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-10 md:p-16">
            <FaRocket size={36} className="text-red-500 mx-auto mb-5" />
            <h2 className="text-4xl md:text-5xl font-bold font-bebas tracking-wide text-white mb-4">
              Ready to Watch?
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto">
              Jump in and start discovering movies and TV shows you&apos;ll love. Completely free, forever.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/"
                className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-xl shadow-red-900/40"
              >
                Browse Movies
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
