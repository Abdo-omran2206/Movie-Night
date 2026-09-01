import Image from "next/image";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { Metadata } from "next";
import { siteUrl, socialMedia } from "@/constant/main";
import Link from "next/link";
import {
  FaFilm,
  FaStar,
  FaTv,
  FaUsers,
  FaRocket,
  FaHeart,
  FaMobileAlt,
  FaQuestionCircle,
  FaPlayCircle,
  FaCompass,
  FaMagic,
  FaShieldAlt,
} from "react-icons/fa";
import { MdMovieFilter, MdOutlineExplore, MdSupportAgent } from "react-icons/md";

export const metadata: Metadata = {
  title: "About Movie Night — Premium Cinema & Discovery Hub",
  description:
    "Learn about Movie Night — a free, high-performance cinematic discovery platform for trending movies, TV series, actor filmographies, and AI-powered recommendations.",
  keywords: [
    "About Movie Night",
    "Movie Night platform",
    "cinema discovery app",
    "TMDB movie database",
    "AI movie guide",
    "free movie finder",
    "TV series tracker",
  ],
  alternates: { canonical: `${siteUrl}/about` },
  openGraph: {
    title: "About Movie Night — Cinematic Discovery Platform",
    description:
      "Explore thousands of movies and TV shows with rich actor profiles, real-time search, and Night Guide AI recommendations.",
    url: `${siteUrl}/about`,
    siteName: "Movie Night",
    type: "website",
    images: [{ url: `${siteUrl}/favicon.png`, width: 1200, height: 630, alt: "About Movie Night" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Movie Night",
    description:
      "A free, cinema-inspired platform for discovering trending movies, binge-worthy series, and actor details.",
    images: [`${siteUrl}/favicon.png`],
  },
};

const features = [
  {
    icon: MdMovieFilter,
    title: "Vast Film Library",
    desc: "Access thousands of movies spanning every genre, classic era, and regional release powered by TMDB data.",
  },
  {
    icon: FaTv,
    title: "TV Series & Season Guides",
    desc: "Comprehensive season breakdowns, episode guides, airing schedules, and complete cast information.",
  },
  {
    icon: FaStar,
    title: "Ratings & Audience Insights",
    desc: "Real-time community scores, ratings, and critical summaries to help you choose the best content.",
  },
  {
    icon: FaUsers,
    title: "Actor & Director Biographies",
    desc: "In-depth filmographies, bios, birthplaces, and related works for thousands of actors and crew members.",
  },
  {
    icon: MdOutlineExplore,
    title: "Smart Genre Discovery",
    desc: "Seamlessly filter content by popularity, top-rated status, upcoming releases, region, and language.",
  },
  {
    icon: MdSupportAgent,
    title: "Night Guide AI",
    desc: "Intelligent AI assistant tailored to recommend movies and TV shows according to your mood and taste.",
  },
];

const stats = [
  { value: "1M+", label: "Movies & TV Shows", icon: FaFilm },
  { value: "500K+", label: "Actor & Crew Profiles", icon: FaUsers },
  { value: "25+", label: "Genre Categories", icon: FaCompass },
  { value: "100%", label: "Free & Web App Ready", icon: FaMobileAlt },
];

const techStack = [
  { name: "Next.js 16", desc: "React Framework & App Router" },
  { name: "React 19", desc: "UI Library & Server Components" },
  { name: "TypeScript", desc: "Type Safety & Reliability" },
  { name: "Tailwind CSS", desc: "Cinematic Dark Styling" },
  { name: "TMDB API", desc: "Live Movie & TV Data" },
  { name: "Supabase", desc: "User Auth & Preferences" },
  { name: "Google Gemini AI", desc: "AI Assistant Powering Night Guide" },
];

const faqs = [
  {
    q: "Is Movie Night free to use?",
    a: "Yes! Movie Night is 100% free with no paywalls or mandatory subscriptions. You can browse, search, and discover content anytime.",
  },
  {
    q: "Can I install Movie Night as an app on my phone or PC?",
    a: "Absolutely! Movie Night is available as an Android APK or Progressive Web App (PWA). Visit our Install page to get started.",
  },
  {
    q: "How does the Night Guide AI assistant work?",
    a: "Night Guide uses advanced AI models to understand your watching mood, genre preferences, or prompt requests and suggests tailored recommendations.",
  },
  {
    q: "Where does the movie and TV show data come from?",
    a: "All metadata, images, and cast information are powered by The Movie Database (TMDB) API, ensuring accuracy and daily updates.",
  },
];

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Movie Night",
    description:
      "Learn about Movie Night — a cinematic platform for discovering trending movies, binge-worthy series, actor profiles, and AI-driven recommendations.",
    url: `${siteUrl}/about`,
    mainEntity: {
      "@type": "Organization",
      name: "Movie Night",
      url: siteUrl,
      logo: `${siteUrl}/favicon.png`,
      sameAs: [
        "https://github.com/Abdo-omran2206",
        "https://www.linkedin.com/in/abdalla-omran-388572361/",
        "https://www.reddit.com/r/myMovieNight/",
        "https://discord.gg/yep7xvZj",
      ],
    },
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-red-600 selection:text-white relative">
      {/* ── Active Full-Page Background Image ── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <Image
          src="/install_page_background.png"
          alt="Cinematic Background"
          fill
          className="object-cover object-center opacity-60 filter brightness-90 contrast-105"
          priority
        />
        {/* Soft Ambient Overlay (Ensures text readability while displaying the background artwork) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/85 z-10" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-red-600/20 rounded-full blur-[150px] z-10" />
        <div className="absolute bottom-10 right-10 w-[450px] h-[300px] bg-red-900/20 rounded-full blur-[130px] z-10" />
      </div>

      {/* Header */}
      <div className="relative z-30">
        <Navbar />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Main Content */}
      <main className="grow relative z-20 pt-28 pb-20">
        {/* ── Hero ─────────────────────────────── */}
        <section className="relative py-16 overflow-hidden">
          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
            <span className="inline-flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-[0.25em] mb-6 px-4 py-1.5 rounded-full border border-red-800/60 bg-black/70 backdrop-blur-md shadow-lg shadow-red-950/40">
              <FaFilm size={12} />
              About Movie Night
            </span>

            <h1 className="text-5xl md:text-7xl font-extrabold font-bebas tracking-wider mb-6 leading-tight drop-shadow-md">
              Where Cinema Meets <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-rose-400">
                Next-Gen Discovery
              </span>
            </h1>

            <p className="text-gray-200 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10 font-light drop-shadow">
              Movie Night is a free, cinema-inspired platform crafted for movie lovers.
              We unite live film data, actor filmographies, intelligent search, and AI-driven recommendations in a fast, modern interface.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/"
                className="bg-gradient-to-r from-red-600 via-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white px-8 py-3.5 rounded-full font-bold text-base transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-red-950/70 flex items-center gap-2"
              >
                <FaPlayCircle size={18} /> Start Exploring
              </Link>
              <Link
                href="/install"
                className="border border-neutral-600 hover:border-neutral-400 text-gray-200 hover:text-white px-8 py-3.5 rounded-full font-bold text-base transition-all bg-black/60 backdrop-blur-md flex items-center gap-2"
              >
                <FaMobileAlt size={16} /> Install App
              </Link>
            </div>
          </div>
        </section>

        {/* ── Stats ─────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 my-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-6 text-center hover:border-red-700/60 transition-all duration-300 backdrop-blur-xl shadow-lg"
                >
                  <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-red-600/15 border border-red-800/40 flex items-center justify-center text-red-500">
                    <Icon size={18} />
                  </div>
                  <p className="text-4xl font-bold font-bebas text-red-500 tracking-wide mb-1">
                    {s.value}
                  </p>
                  <p className="text-gray-300 text-sm font-medium">{s.label}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Mission ─────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 my-16">
          <div className="bg-neutral-900/80 border border-red-900/40 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center backdrop-blur-xl shadow-2xl">
            <div className="shrink-0 w-20 h-20 rounded-2xl bg-red-600/20 border border-red-700/50 flex items-center justify-center text-red-500 shadow-lg shadow-red-950/50">
              <FaHeart size={36} />
            </div>
            <div>
              <span className="text-red-400 text-xs font-bold uppercase tracking-widest mb-1 block">
                Our Purpose
              </span>
              <h2 className="text-3xl md:text-4xl font-bold font-bebas tracking-wide text-white mb-3">
                Built for Film Lovers, by Film Lovers
              </h2>
              <p className="text-gray-200 leading-relaxed text-base md:text-lg font-light">
                Finding something to watch shouldn&apos;t feel like a chore. Movie Night eliminates endless scrolling by presenting clean, rich movie data, instant trailers, actor details, and smart filters. Whether you are looking for tonight&apos;s blockbuster, a classic series, or a niche indie gem, Movie Night puts cinema right at your fingertips.
              </p>
            </div>
          </div>
        </section>

        {/* ── Key Features ─────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 my-16">
          <div className="text-center mb-12">
            <span className="text-red-400 text-xs font-bold uppercase tracking-widest block mb-2">
              Capabilities
            </span>
            <h2 className="text-4xl md:text-5xl font-bold font-bebas tracking-wide text-white mb-3">
              Everything You Need for Movie Night
            </h2>
            <p className="text-gray-300 text-base max-w-xl mx-auto font-light">
              A comprehensive suite of discovery tools designed for smooth browsing across all screens.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="group bg-neutral-900/70 border border-neutral-800 rounded-2xl p-6 hover:border-red-600/60 transition-all duration-300 backdrop-blur-xl transform hover:-translate-y-1 shadow-lg"
                >
                  <div className="w-12 h-12 rounded-xl bg-red-600/15 border border-red-800/40 flex items-center justify-center mb-4 group-hover:bg-red-600/30 transition-colors">
                    <Icon size={22} className="text-red-500" />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed font-light">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── How It Works ─────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 my-16">
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-8 md:p-12 backdrop-blur-xl shadow-xl">
            <div className="text-center mb-10">
              <span className="text-red-400 text-xs font-bold uppercase tracking-widest block mb-2">
                Simple Workflow
              </span>
              <h2 className="text-4xl font-bold font-bebas tracking-wide text-white">
                How Movie Night Works
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-red-600/20 border border-red-600/40 flex items-center justify-center text-red-500 font-bold text-xl mb-4 font-bebas">
                  1
                </div>
                <h4 className="text-white font-bold text-lg mb-2">Browse & Filter</h4>
                <p className="text-gray-300 text-sm leading-relaxed font-light">
                  Explore category feeds like Trending, Top Rated, Airing Today, or search by title and actor.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-red-600/20 border border-red-600/40 flex items-center justify-center text-red-500 font-bold text-xl mb-4 font-bebas">
                  2
                </div>
                <h4 className="text-white font-bold text-lg mb-2">Ask Night Guide AI</h4>
                <p className="text-gray-300 text-sm leading-relaxed font-light">
                  Use our interactive AI guide to get tailored movie suggestions matching your mood.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-red-600/20 border border-red-600/40 flex items-center justify-center text-red-500 font-bold text-xl mb-4 font-bebas">
                  3
                </div>
                <h4 className="text-white font-bold text-lg mb-2">Stream & Save</h4>
                <p className="text-gray-300 text-sm leading-relaxed font-light">
                  Watch trailers, read cast details, save titles to your personal watchlist, and start watching.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Tech Stack ─────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 my-16">
          <div className="text-center mb-10">
            <span className="text-red-400 text-xs font-bold uppercase tracking-widest block mb-2">
              Under the Hood
            </span>
            <h2 className="text-4xl md:text-5xl font-bold font-bebas tracking-wide text-white mb-3">
              Powered by Modern Technologies
            </h2>
            <p className="text-gray-300 text-base max-w-xl mx-auto font-light">
              Built using cutting-edge web tools to ensure sub-second page loads, responsive styling, and high availability.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-4 text-center hover:border-red-700/60 transition-colors backdrop-blur-md"
              >
                <p className="text-white font-bold text-base mb-1">{tech.name}</p>
                <p className="text-gray-400 text-xs font-light">{tech.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ Section ─────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 my-16">
          <div className="text-center mb-10">
            <span className="text-red-400 text-xs font-bold uppercase tracking-widest block mb-2">
              Common Questions
            </span>
            <h2 className="text-4xl md:text-5xl font-bold font-bebas tracking-wide text-white mb-3">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 backdrop-blur-md"
              >
                <h4 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
                  <FaQuestionCircle className="text-red-500 shrink-0" size={18} />
                  {faq.q}
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed pl-7 font-light">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Community ─────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 my-16">
          <div className="text-center mb-10">
            <span className="text-red-400 text-xs font-bold uppercase tracking-widest block mb-2">
              Stay Connected
            </span>
            <h2 className="text-4xl md:text-5xl font-bold font-bebas tracking-wide text-white mb-3">
              Join Our Community
            </h2>
            <p className="text-gray-300 text-base max-w-xl mx-auto font-light">
              Follow our developments, offer feedback, and join discussions across our platforms.
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
                  className="group bg-neutral-900/70 border border-neutral-800 rounded-2xl p-6 flex flex-col items-center text-center hover:border-red-600/60 transition-all duration-300 backdrop-blur-md"
                >
                  <div className="w-14 h-14 rounded-2xl bg-black/60 flex items-center justify-center mb-4 group-hover:bg-red-600/20 group-hover:text-red-500 transition-colors">
                    <Icon size={26} />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-1 group-hover:text-red-500 transition-colors">
                    {social.label}
                  </h3>
                  <p className="text-gray-400 text-xs">Connect with us on {social.label}</p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ── CTA ─────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-4 my-16 text-center">
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-10 md:p-14 shadow-2xl relative overflow-hidden backdrop-blur-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
            <FaRocket size={38} className="text-red-500 mx-auto mb-5" />
            <h2 className="text-4xl md:text-5xl font-bold font-bebas tracking-wide text-white mb-4">
              Ready for Movie Night?
            </h2>
            <p className="text-gray-200 text-lg mb-8 max-w-lg mx-auto font-light">
              Dive into our catalog, test Night Guide AI, or install the app on your phone for instant movie discovery.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/"
                className="bg-gradient-to-r from-red-600 via-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white px-10 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-red-950/70"
              >
                Browse Movies & TV
              </Link>
              <Link
                href="/install"
                className="border border-neutral-600 hover:border-neutral-400 text-gray-200 hover:text-white px-8 py-4 rounded-full font-bold text-lg transition-all bg-black/60 backdrop-blur-sm"
              >
                Install App
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Wrapper */}
      <div className="relative z-20">
        <Footer />
      </div>
    </div>
  );
}


