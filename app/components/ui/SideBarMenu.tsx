import { IoClose, IoHome } from "react-icons/io5";
import { FaDownload, FaRobot, FaInfoCircle, FaCompass } from "react-icons/fa";
import Link from "next/link";
import { useState, useEffect } from "react";
import { categories, genres } from "@/app/constant/main";

export default function SideBarMenu({
  setIsMenuOpen,
}: {
  setIsMenuOpen: (isOpen: boolean) => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    const timeout = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(timeout);
  }, []);

  const handleClose = () => {
    setMounted(false);
    setTimeout(() => setIsMenuOpen(false), 300); // Wait for animation to finish
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full bg-black/70 backdrop-blur-sm z-50 transition-opacity duration-300 ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      <div
        className={`w-[60vw] sm:w-80 h-full bg-neutral-900 text-white flex flex-col shadow-2xl transition-transform duration-300 ease-out border-r border-neutral-800 ${
          mounted ? "translate-x-0" : "-translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center bg-black py-6 px-5 shrink-0 border-b border-neutral-800">
          <h2 className="font-bold text-2xl sm:text-3xl tracking-wide uppercase text-red-600">
            Menu
          </h2>
          <IoClose
            className="cursor-pointer text-3xl hover:text-red-600 transition-colors"
            onClick={handleClose}
          />
        </div>

        <div className="px-6 sm:px-8 py-6 text-xl text-neutral-400 overflow-y-auto flex-1 custom-scrollbar">
          <Link
            href="/"
            className="flex items-center gap-3 mb-4 hover:text-red-500 transition-colors group"
            onClick={handleClose}
          >
            <IoHome className="group-hover:scale-110 transition-transform" />
            <span>Home</span>
          </Link>
          <Link
            href="/explore"
            className="flex items-center gap-3 mb-4 hover:text-red-500 transition-colors group"
            onClick={handleClose}
          >
            <FaCompass className="group-hover:scale-110 transition-transform" />
            <span>Explore</span>
          </Link>

          <p className="text-gray-500 text-[10px] sm:text-xs font-bold tracking-widest mb-3 uppercase">
            Categories
          </p>
          <hr className="border-neutral-800 mb-4" />
          <div className="flex flex-col gap-2 mb-8">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="flex items-center gap-3 py-1 hover:text-red-500 transition-colors group"
                onClick={handleClose}
              >
                <span className="group-hover:scale-110 transition-transform">
                  <cat.icon />
                </span>
                <span className="text-base sm:text-lg">{cat.name}</span>
              </Link>
            ))}
          </div>

          <p className="text-gray-500 text-[10px] sm:text-xs font-bold tracking-widest mb-3 uppercase">
            Genres
          </p>
          <hr className="border-neutral-800 mb-4" />
          <div className="flex flex-col gap-2 pb-10">
            {genres.map((g) => (
              <Link
                key={g.name}
                href={g.href}
                className="flex items-center gap-3 py-1 hover:text-red-500 transition-colors group"
                onClick={handleClose}
              >
                <span className="shrink-0 group-hover:scale-110 transition-transform">
                  <g.icon />
                </span>
                <span className="truncate text-base sm:text-lg">{g.name}</span>
              </Link>
            ))}
          </div>
          <hr className="border-neutral-800 mb-4" />
          <Link
            href="/about"
            className="flex items-center gap-3 mb-4 hover:text-red-500 transition-colors group"
            onClick={handleClose}
          >
            <FaInfoCircle className="group-hover:scale-110 transition-transform" />
            <span>About</span>
          </Link>
          <Link
            href="/nightguide"
            className="flex items-center gap-3 mb-4 hover:text-red-500 transition-colors group"
            onClick={handleClose}
          >
            <FaRobot className="group-hover:scale-110 transition-transform" />
            <span>Night Guide</span>
          </Link>

          <Link
            href="/install"
            className="flex items-center gap-3 mb-8 hover:text-red-500 transition-colors group"
            onClick={handleClose}
          >
            <FaDownload className="group-hover:scale-110 transition-transform text-red-600" />
            <span>Install App</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
