"use client";
import { useState } from "react";
import { GrClose } from "react-icons/gr";
import { FaCirclePlay } from "react-icons/fa6";
import { youtubeEmbedUrl } from "@/constant/main";

type Props = {
  url: string;
  onClose: () => void;
};

export default function TrailerButtonModel({ trailerKey }: { trailerKey?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  if (!trailerKey) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-red-700 hover:bg-red-800 text-white px-8 py-3 rounded-full font-bold flex items-center gap-3 transition-all hover:cursor-pointer hover:scale-105 active:scale-95 shadow-lg shadow-red-900/40 relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity" />
        <FaCirclePlay size={20} />
        Watch Trailer
      </button>

      {isOpen && <TrailerModal url={trailerKey} onClose={() => setIsOpen(false)} />}
    </>
  );
}

function TrailerModal({ url, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
      {/* Container */}
      <div className="relative w-11/12 md:w-3/4 lg:w-3/5 bg-black rounded-xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white text-2xl hover:text-red-600 z-50"
        >
          <GrClose />
        </button>

        {/* Video */}
        <div className="aspect-video w-full">
          <iframe
            src={`${youtubeEmbedUrl}${url}`}
            title="Trailer"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}
