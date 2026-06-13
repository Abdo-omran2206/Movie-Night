import { RatingStarsProps } from "@/constant/types";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

export function Ships({ ship }: { ship: React.ReactNode }) {
  return (
    <div className="px-3 py-2 bg-red-800/20 rounded-full ring-1 ring-red-700">
      <span className="text-sm flex items-center gap-1">{ship}</span>
    </div>
  );
}

export function GenresShips({ ship }: { ship: React.ReactNode }) {
  return (
    <div className="px-3 py-2 bg-neutral-200/10 rounded-full ring-1 ring-neutral-200/50">
      <span className="text-sm flex items-center gap-1">{ship}</span>
    </div>
  );
}

export function RatingStars({ rating }: RatingStarsProps) {
  const fullStars = Math.round(rating / 2); // 10 → 5

  return (
    <span className="flex items-center gap-1 text-neutral-200">
      {[...Array(5)].map((_, i) =>
        i < fullStars ? <FaStar key={i} /> : <FaRegStar key={i} />,
      )}
    </span>
  );
}

export function ShipsBanner({ ship }: { ship: React.ReactNode }) {
  return (
    <div className="px-2 py-1 md:py-2 md:px-3 bg-red-800/20 rounded-full ring-1 ring-red-700">
      <span className="text-xs md:text-sm flex items-center gap-1">{ship}</span>
    </div>
  );
}

export function StarRatingBanner({ rating }: { rating: number }) {
  const stars = [];
  const score = rating / 2; // Convert 0-10 to 0-5

  for (let i = 1; i <= 5; i++) {
    if (i <= score) {
      stars.push(<FaStar key={i} className="text-yellow-400" />);
    } else if (i === Math.ceil(score) && score % 1 >= 0.5) {
      stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
    } else {
      stars.push(<FaRegStar key={i} className="text-gray-400" />);
    }
  }

  return (
    <div className="flex gap-1 items-center">
      <div className="hidden md:flex items-center gap-1">
        <span className="ml-1 text-xs md:text-sm">{rating.toFixed(1)}/10</span>
        {stars}
      </div>
      <div className="flex md:hidden items-center gap-1">
        <span className="ml-1 text-xs md:text-sm">{rating.toFixed(1)}</span>
        <FaStar className="text-yellow-400" />
      </div>
    </div>
  );
}
