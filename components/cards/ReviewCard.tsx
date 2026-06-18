'use client'
import { IoClose } from "react-icons/io5";
import Image from "next/image";
import { reviewUrl } from "@/constant/main";
import generateMovieAvatar from "@/lib/generateMovieAvatar";
import { useEffect, useState } from "react";
import { Review } from "@/constant/types";

/* -------------------- Modal -------------------- */

export default function ReviewsCard({
  data,
  isLoading,
  onClose,
}: {
  data: Review[];
  isLoading: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    // Prevent background scroll while open
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <div
        // Mobile: bottom sheet — full width, slides up, rounded top corners only
        // sm+: centered modal — max width, rounded all corners
        className="
          w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl
          max-h-[85dvh] sm:max-h-[80vh]
          flex flex-col
          bg-neutral-900
          rounded-t-2xl sm:rounded-2xl
          p-4 sm:p-6
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle — visible on mobile only */}
        <div className="sm:hidden flex justify-center mb-3 shrink-0">
          <div className="w-10 h-1 rounded-full bg-neutral-600" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-4 shrink-0">
          <h3 className="text-base sm:text-lg font-semibold">Reviews</h3>
          <button
            onClick={onClose}
            aria-label="Close reviews"
            className="text-gray-400 hover:text-white transition-colors p-1 -mr-1"
          >
            <IoClose size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 pr-1 scroll-smooth scrollbar-thin scrollbar-thumb-red-800">
          {isLoading ? (
            <p className="text-gray-400 text-sm">Loading reviews…</p>
          ) : !data.length ? (
            <p className="text-gray-400 text-sm">No reviews yet 😢</p>
          ) : (
            data.map((review) => <ReviewItem key={review.id} review={review} />)
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------- Helpers -------------------- */

function getAvatarSrc(review: Review): string {
  const avatarPath = review.author_details?.avatar_path;

  if (!avatarPath) return generateMovieAvatar(review.author);

  if (avatarPath.startsWith("/https") || avatarPath.startsWith("/http")) {
    return avatarPath.replace(/^\//, "");
  }

  return `${reviewUrl}/${avatarPath}`;
}

const TRUNCATE_LENGTH = 300;

/* -------------------- Review Item -------------------- */

function ReviewItem({ review }: { review: Review }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = review.content.length > TRUNCATE_LENGTH;
  const displayedContent =
    expanded || !isLong
      ? review.content
      : review.content.slice(0, TRUNCATE_LENGTH) + "…";

  return (
    <div className="mb-6 last:mb-0">
      <div className="flex items-center gap-3 mb-2">
        <Image
          src={getAvatarSrc(review)}
          alt={review.author}
          width={40}
          height={40}
          unoptimized
          className="rounded-full object-cover shrink-0 w-10 h-10"
        />
        <h4 className="font-bold tracking-widest text-sm sm:text-base truncate">
          {review.author}
        </h4>
      </div>

      <p className="text-sm text-gray-300 text-left leading-relaxed">
        {displayedContent}
      </p>

      {isLong && (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-1 text-xs text-blue-400 hover:underline"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}
