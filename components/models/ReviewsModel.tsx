'use client'
import { useEffect, useState } from "react";
import { FaRegCommentDots } from "react-icons/fa";
import ReviewsCard from "../cards/ReviewCard";
import { Review } from "@/constant/types";
type Props = {
  id: string;
  type: "tv" | "movie";
};

export default function ReviewsModal({ id, type }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    async function loadData() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/reviews/${type}/${id}`);
        const data = await res.json();
        setReviews(data?.results ?? []);
      } catch (err) {
        console.error("Failed to load reviews", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [id, type, isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open reviews"
        className="flex justify-center items-center"
      >
        <FaRegCommentDots
          size={30}
          className="hover:scale-125 transition-all duration-100 cursor-pointer"
        />
      </button>

      {isOpen && (
        <ReviewsCard
          data={reviews}
          isLoading={isLoading}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
