"use client";

import { GrClose } from "react-icons/gr";

type Props = {
  url: string;
  onClose: () => void;
};

export default function TrailerModal({ url, onClose }: Props) {
  const baceUrl = "https://www.youtube.com/embed/"
  return (
    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
      {/* Container */}
      <div className="relative w-11/12 md:w-3/4 lg:w-2/3 bg-black rounded-xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white text-2xl hover:text-red-600 z-50"
        >
          <GrClose />
        </button>

        {/* Video */}
        <div className="aspect-video w-full">
          <iframe
            src={`${baceUrl}${url}`}
            title="Trailer"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}
