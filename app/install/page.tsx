"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaDownload, FaArrowLeft } from "react-icons/fa";
import Navbar from "@/app/components/ui/Navbar";
import Footer from "@/app/components/ui/Footer";
import { supabaseClient } from "../lib/supabase";

export default function InstallPage() {
  const [appConfig, setAppConfig] = useState<{
    latest_app_version: string;
    app_link_update: string;
  } | null>(null);

  useEffect(() => {
    async function getAppDetailsForDownload() {
      const { data, error } = await supabaseClient
        .from("app_config")
        .select("latest_app_version, app_link_update")
        .single();

      if (error) {
        console.log("Error fetching app config:", error);
        return;
      }

      setAppConfig(data);
    }

    getAppDetailsForDownload();
  }, []);

  const handleInstall = () => {
    if (appConfig?.app_link_update) {
      window.open(appConfig.app_link_update, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />

      <main className="grow relative flex items-center justify-center py-50 px-4 overflow-hidden">
        {/* Cinematic Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/10 to-transparent z-10" />
          <Image
            src="/install_page_background.png"
            alt="Cinematic Background"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="relative z-10 max-w-2xl w-full">
          <div className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl flex flex-col items-center text-center">
            {/* App Icon / Logo Placeholder */}
            <div className="w-24 h-24 bg-transparent rounded-2xl flex items-center justify-center shadow-lg shadow-red-900/20 mb-6">
              <Image
                src="/favicon.png"
                alt="Cinematic Background"
                width={300}
                height={300}
                className="object-cover w-3xl rounded-2xl"
                priority
              />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold font-bebas tracking-wide mb-2">
              Get <span className="text-red-600">Movie Night</span>
            </h1>

            <p className="text-red-500 text-sm md:text-base font-semibold uppercase tracking-widest mb-4">
              Discover the magic of cinema. Anytime. Anywhere.
            </p>

            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Movie Night is a sleek, cinema-inspired experience for discovering
              trending movies, binge-worthy series, and hidden gems. Install the
              app for a faster, more immersive way to browse casts, ratings,
              genres, and detailed overviews across all your devices.
            </p>

            <div className="flex flex-col gap-4 w-full sm:w-auto sm:min-w-[300px]">
              <button
                onClick={handleInstall}
                className="bg-red-600 hover:cursor-pointer hover:bg-red-700 text-white px-10 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-red-900/40"
              >
                <FaDownload size={20} />
                Install App {appConfig?.latest_app_version}
              </button>

              <Link
                href="/"
                className="text-gray-500 hover:text-white transition-colors flex items-center justify-center gap-2 mt-4"
              >
                <FaArrowLeft size={14} />
                Back to Browsing
              </Link>
            </div>
          </div>

          {/* Feature List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              {
                title: "Discover Movies & TV",
                desc: "Trending, top rated, and upcoming titles at a glance.",
              },
              {
                title: "Rich Details",
                desc: "Cast, reviews, trailers, and streaming providers in one place.",
              },
              {
                title: "Sync Across Devices",
                desc: "Enjoy a premium, cinema-themed experience everywhere.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-zinc-900/40 backdrop-blur-sm border border-white/5 p-5 rounded-2xl text-center"
              >
                <h4 className="font-bold text-red-500 mb-1">{feature.title}</h4>
                <p className="text-xs text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
