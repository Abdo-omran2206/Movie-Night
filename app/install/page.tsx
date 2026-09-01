import Image from "next/image";
import Link from "next/link";
import {
  FaDownload,
  FaArrowLeft,
  FaMobileAlt,
  FaApple,
  FaAndroid,
  FaDesktop,
  FaBolt,
  FaShieldAlt,
  FaSyncAlt,
  FaCheckCircle,
  FaFileCode,
  FaStar,
  FaFilm,
  FaInfoCircle,
} from "react-icons/fa";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { supabaseClient } from "@/lib/supabase";
import { Metadata } from "next";
import { siteUrl } from "@/constant/main";

export const metadata: Metadata = {
  title: "Download Movie Night Android APK — Official Mobile App",
  description:
    "Download the official Movie Night Android APK file for mobile devices or install the Progressive Web App (PWA) directly on iOS and Desktop.",
  keywords: [
    "Movie Night APK",
    "Download Movie Night Android",
    "Movie Night Android App",
    "Movie Night PWA",
    "Movie Night app download",
    "cinema apk free",
  ],
  alternates: { canonical: `${siteUrl}/install` },
  openGraph: {
    title: "Download Movie Night Android App (.APK)",
    description:
      "Get the official Movie Night Android APK application for your phone or install as a PWA across iOS and Desktop.",
    url: `${siteUrl}/install`,
    siteName: "Movie Night",
    type: "website",
    images: [{ url: `${siteUrl}/favicon.png`, width: 1200, height: 630, alt: "Movie Night App Download" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Download Movie Night Android App (.APK)",
    description: "Official Android APK download and Web App installation guide.",
    images: [`${siteUrl}/favicon.png`],
  },
};

export default async function InstallPage() {
  let app_version = "v1.0.0";
  let app_link = "https://github.com/Abdo-omran2206/Movie-Night/releases";

  try {
    const { data, error } = await supabaseClient
      .from("app_config")
      .select("latest_app_version, app_link_update")
      .single();

    if (!error && data) {
      if (data.latest_app_version) app_version = data.latest_app_version;
      if (data.app_link_update) app_link = data.app_link_update;
    }
  } catch (err) {
    console.error("Error fetching app config in InstallPage:", err);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Movie Night Android App",
    operatingSystem: "Android",
    fileFormat: "application/vnd.android.package-archive",
    applicationCategory: "EntertainmentApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Official Android APK application and Progressive Web App for discovering movies, TV series, cast details, and AI recommendations.",
    url: `${siteUrl}/install`,
    softwareVersion: app_version,
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-red-600 selection:text-white relative">
      {/* ── Active Full-Page Background Image ── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <Image
          src="/install_page_background.png"
          alt="Cinematic Background"
          fill
          className="object-cover object-center opacity-65 filter brightness-90 contrast-105"
          priority
        />
        {/* Soft Ambient Overlay (Keeps artwork visible while ensuring high contrast for text) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/85 z-10" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-red-600/25 rounded-full blur-[140px] z-10" />
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
      <main className="grow relative z-20 pt-28 pb-20 px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* ── Top Hero Banner ── */}
          <div className="text-center space-y-4">
            <span className="inline-flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-[0.3em] px-4 py-1.5 rounded-full border border-red-800/60 bg-black/70 backdrop-blur-md shadow-lg shadow-red-950/40">
              <FaFilm size={12} /> Official Mobile Release
            </span>

            <h1 className="text-5xl md:text-7xl font-extrabold font-bebas tracking-wider text-white leading-none drop-shadow-md">
              Cinema In Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-rose-400">Pocket</span>
            </h1>

            <p className="text-gray-200 text-base md:text-lg max-w-xl mx-auto font-light leading-relaxed drop-shadow">
              Download the official <strong>Movie Night Android app (.apk)</strong> for native performance, or install as a Web App on iOS and PC.
            </p>
          </div>

          {/* ── Main Android APK Hero Card ── */}
          <div className="relative group bg-neutral-900/80 border border-red-600/40 hover:border-red-500/70 p-8 md:p-12 rounded-3xl backdrop-blur-xl shadow-2xl shadow-red-950/60 transition-all duration-500 overflow-hidden">
            {/* Background Red Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 text-green-400 text-xs font-bold uppercase tracking-widest px-3.5 py-1 rounded-full border border-green-500/40 bg-green-950/60 mb-6 backdrop-blur-sm">
                <FaAndroid size={14} className="animate-pulse" /> Direct Android APK Download
              </div>

              {/* App Icon Container */}
              <div className="relative mb-6">
                <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-red-600 to-rose-600 opacity-60 blur-md group-hover:opacity-100 transition-opacity" />
                <div className="relative w-28 h-28 bg-black rounded-2xl p-2 border border-white/20 shadow-2xl flex items-center justify-center">
                  <Image
                    src="/favicon.png"
                    alt="Movie Night Logo"
                    width={96}
                    height={96}
                    className="object-contain w-full h-full rounded-xl"
                    priority
                  />
                </div>
              </div>

              {/* Title & Version */}
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-2 font-bebas tracking-wide">
                Movie Night Android App
              </h2>
              <p className="text-red-500 text-sm font-semibold tracking-wider uppercase mb-6">
                Version {app_version} • Free & Ad-Free
              </p>

              {/* Description */}
              <p className="text-gray-200 text-sm md:text-base max-w-lg mb-8 font-light leading-relaxed">
                Enjoy instant access to movie trailers, Night Guide AI recommendations, trending TV shows, and cast details with native mobile performance.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center">
                <Link
                  href={app_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-gradient-to-r from-red-600 via-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white px-10 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-3 transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-red-950/80 cursor-pointer"
                >
                  <FaDownload size={20} />
                  Download Android APK ({app_version})
                </Link>

                <Link
                  href="/"
                  className="w-full sm:w-auto border border-neutral-600 hover:border-neutral-400 text-gray-200 hover:text-white px-8 py-4 rounded-full font-bold text-base flex items-center justify-center gap-2 transition-colors bg-black/60 backdrop-blur-sm"
                >
                  <FaArrowLeft size={14} />
                  Back to Home
                </Link>
              </div>

              {/* Spec Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full mt-10 pt-6 border-t border-white/10 text-xs text-gray-300 font-medium">
                <div className="bg-black/60 py-2.5 px-3 rounded-xl border border-white/10 flex items-center justify-center gap-2">
                  <FaAndroid className="text-green-500" /> Android 6.0+
                </div>
                <div className="bg-black/60 py-2.5 px-3 rounded-xl border border-white/10 flex items-center justify-center gap-2">
                  <FaFileCode className="text-red-500" /> Direct APK Package
                </div>
                <div className="bg-black/60 py-2.5 px-3 rounded-xl border border-white/10 flex items-center justify-center gap-2">
                  <FaShieldAlt className="text-blue-400" /> 100% Safe & Clean
                </div>
                <div className="bg-black/60 py-2.5 px-3 rounded-xl border border-white/10 flex items-center justify-center gap-2">
                  <FaStar className="text-yellow-400" /> Premium UI
                </div>
              </div>
            </div>
          </div>

          {/* ── APK Installation Instructions ── */}
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-8 md:p-10 backdrop-blur-xl shadow-xl">
            <h3 className="text-2xl font-bold font-bebas text-white mb-6 flex items-center gap-3">
              <FaInfoCircle className="text-red-500" /> How to Install the APK File on Android
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-black/60 border border-neutral-800 rounded-2xl p-5 text-left space-y-2">
                <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-500 font-bold font-bebas flex items-center justify-center text-lg mb-1">
                  1
                </div>
                <h4 className="text-white font-bold text-base">Download APK</h4>
                <p className="text-xs text-gray-300 font-light leading-relaxed">
                  Click the red download button above to save the latest Movie Night APK file to your device.
                </p>
              </div>

              <div className="bg-black/60 border border-neutral-800 rounded-2xl p-5 text-left space-y-2">
                <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-500 font-bold font-bebas flex items-center justify-center text-lg mb-1">
                  2
                </div>
                <h4 className="text-white font-bold text-base">Allow Unknown Sources</h4>
                <p className="text-xs text-gray-300 font-light leading-relaxed">
                  If prompted by your browser or Android OS, tap <em>Settings</em> and allow installing apps from this source.
                </p>
              </div>

              <div className="bg-black/60 border border-neutral-800 rounded-2xl p-5 text-left space-y-2">
                <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-500 font-bold font-bebas flex items-center justify-center text-lg mb-1">
                  3
                </div>
                <h4 className="text-white font-bold text-base">Install & Launch</h4>
                <p className="text-xs text-gray-300 font-light leading-relaxed">
                  Open the downloaded file, tap <strong>Install</strong>, and launch Movie Night directly from your home screen.
                </p>
              </div>
            </div>
          </div>

          {/* ── Feature Cards ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: FaBolt,
                title: "Sub-Second Loading",
                desc: "Lightning fast catalog browsing and seamless trailers.",
              },
              {
                icon: FaShieldAlt,
                title: "Zero Ad Tracker Bloat",
                desc: "Clean, privacy-first mobile experience with no popups.",
              },
              {
                icon: FaSyncAlt,
                title: "Always Up To Date",
                desc: "Real-time updates for trending movies, actors, and TV guides.",
              },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="bg-neutral-900/70 border border-neutral-800 backdrop-blur-xl p-6 rounded-2xl text-center hover:border-red-700/60 transition-colors"
                >
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-red-600/15 border border-red-800/40 flex items-center justify-center text-red-500">
                    <Icon size={22} />
                  </div>
                  <h4 className="font-bold text-white text-base mb-1">{f.title}</h4>
                  <p className="text-xs text-gray-300 font-light leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>

          {/* ── PWA Alternative Option ── */}
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-8 md:p-12 backdrop-blur-xl shadow-xl">
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-widest mb-2">
                <FaMobileAlt /> Alternative Install Method
              </span>
              <h2 className="text-3xl md:text-4xl font-bold font-bebas tracking-wide text-white mb-3">
                Install as a Web App (PWA)
              </h2>
              <p className="text-gray-300 text-sm max-w-lg mx-auto font-light leading-relaxed">
                If you are on <strong>iOS</strong>, <strong>Desktop</strong>, or prefer not downloading an APK, you can add Movie Night to your home screen directly via your browser.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Android Web */}
              <div className="bg-black/60 border border-neutral-800 rounded-2xl p-6 flex flex-col items-center text-center hover:border-green-500/40 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-neutral-800 flex items-center justify-center text-green-500 mb-4">
                  <FaAndroid size={26} />
                </div>
                <h3 className="text-white font-bold text-lg mb-3">Android (Chrome)</h3>
                <ul className="text-xs text-gray-300 text-left space-y-2.5 font-light w-full">
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-red-500 shrink-0 mt-0.5" />
                    <span>Open Movie Night in <strong>Chrome</strong>.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-red-500 shrink-0 mt-0.5" />
                    <span>Tap the <strong>3 dots menu</strong> in the top right.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-red-500 shrink-0 mt-0.5" />
                    <span>Tap <strong>Install App</strong> or <strong>Add to Home Screen</strong>.</span>
                  </li>
                </ul>
              </div>

              {/* iOS Safari */}
              <div className="bg-black/60 border border-neutral-800 rounded-2xl p-6 flex flex-col items-center text-center hover:border-white/40 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-neutral-800 flex items-center justify-center text-white mb-4">
                  <FaApple size={26} />
                </div>
                <h3 className="text-white font-bold text-lg mb-3">iPhone / iPad (Safari)</h3>
                <ul className="text-xs text-gray-300 text-left space-y-2.5 font-light w-full">
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-red-500 shrink-0 mt-0.5" />
                    <span>Open Movie Night in <strong>Safari</strong>.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-red-500 shrink-0 mt-0.5" />
                    <span>Tap the <strong>Share</strong> button in the bottom bar.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-red-500 shrink-0 mt-0.5" />
                    <span>Scroll down and tap <strong>Add to Home Screen</strong>.</span>
                  </li>
                </ul>
              </div>

              {/* Desktop */}
              <div className="bg-black/60 border border-neutral-800 rounded-2xl p-6 flex flex-col items-center text-center hover:border-blue-500/40 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-neutral-800 flex items-center justify-center text-blue-400 mb-4">
                  <FaDesktop size={26} />
                </div>
                <h3 className="text-white font-bold text-lg mb-3">Desktop (Chrome / Edge)</h3>
                <ul className="text-xs text-gray-400 text-left space-y-2.5 font-light w-full">
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-red-500 shrink-0 mt-0.5" />
                    <span>Open Movie Night in Chrome or Edge.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-red-500 shrink-0 mt-0.5" />
                    <span>Click the <strong>Install icon</strong> in the address bar.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-red-500 shrink-0 mt-0.5" />
                    <span>Click <strong>Install</strong> to launch as a desktop app.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Wrapper */}
      <div className="relative z-20">
        <Footer />
      </div>
    </div>
  );
}



