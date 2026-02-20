"use client";
import { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { fetchGenres, fetchMovies, Movie } from "../lib/tmdb";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import Link from "next/link";
import { slugify } from "../lib/slugify";

interface Genre {
  id: number;
  name: string;
}
export default function Banner() {
  const [data, setData] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const backdropUrl = `https://image.tmdb.org/t/p/w1280`;

  useEffect(() => {
    async function fetchBanner() {
      const { results } = await fetchMovies("/trending/movie/week");
      const genresData = await fetchGenres();
      setData(results);
      setGenres(genresData);
      setLoading(false);
    }
    fetchBanner();
  }, []);

  const getGenreNames = (ids: number[]) => {
    return ids
      .map((id) => genres.find((g) => g.id === id)?.name)
      .filter((name): name is string => !!name);
  };

  if (loading) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center overflow-hidden">
        <div className="relative flex flex-col items-center">
          <div className="absolute inset-0 -m-8 rounded-full border-4 border-red-600/40 animate-ping"></div>
          <h1 className="text-6xl md:text-8xl font-bebas font-black text-red-700/70 tracking-widest">
            Movie Night
          </h1>
          <p className="mt-4 text-zinc-500 font-bold uppercase tracking-widest text-xs animate-pulse">
            Summoning Stars...
          </p>
        </div>
      </div>
    );
  }

  if (!data.length) return null;

  return (
    <div className="w-full min-h-[95vh] h-[95vh] max-sm:h-screen relative group">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        className="w-full h-full"
      >
        {data.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="relative w-full h-full">
              <Image
                src={item.backdrop_path ? backdropUrl + item.backdrop_path : ""}
                alt={item.title || item.name || "Movie Poster"}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />

              <div className="absolute inset-0 flex flex-col justify-center items-center md:items-start px-4 sm:px-8 md:px-16 lg:px-24">
                <div className="max-w-3xl space-y-3 md:space-y-5 flex flex-col items-center md:items-start gap-4 md:gap-10">
                  <div className="flex flex-col items-center md:items-start gap-2 md:gap-5">
                    <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white drop-shadow-lg leading-tight text-center">
                      {item.title || item.name}
                    </h1>

                    <div className="flex flex-wrap justify-center gap-2 md:gap-4 items-center text-xs sm:text-sm md:text-base text-gray-200">
                      <Ships ship={item.release_date} />
                      <Ships ship={<StarRating rating={item.vote_average} />} />
                      <Ships ship={`(${item.vote_count} Votes)`} />
                    </div>

                    <div className="flex flex-wrap justify-center gap-2 md:gap-4 items-center text-xs sm:text-sm md:text-base text-gray-200">
                      {getGenreNames(item.genre_ids).map((name, idx) => (
                        <Ships key={idx} ship={name} />
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-center md:items-start gap-4 md:gap-8">
                    <div className="space-y-1 text-center md:text-left">
                      <h2 className="text-xl md:text-3xl font-semibold text-red-700">
                        OVERVIEW
                      </h2>
                      <p className="text-gray-300 line-clamp-3 md:line-clamp-4 max-w-xl md:max-w-2xl text-xs sm:text-sm md:text-base">
                        {item.overview}
                      </p>
                    </div>

                    <div>
                      <Link
                        href={`/movie/${slugify(item.title || item.name)}/${item.id}`}
                        className="inline-block px-6 py-2 md:px-8 md:py-3 bg-neutral-100/10 ring ring-neutral-500 hover:bg-red-700 hover:ring-red-800 text-white text-sm md:text-base font-semibold rounded-lg transition-colors duration-300 shadow-lg hover:shadow-red-600/30"
                      >
                        View Movie
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

function Ships({ ship }: { ship: React.ReactNode }) {
  return (
    <div className="px-2 py-1 md:py-2 md:px-3 bg-red-800/20 rounded-full ring-1 ring-red-700">
      <span className="text-sm flex items-center gap-1">{ship}</span>
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
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
      <span className="ml-1 text-sm">{rating.toFixed(1)}/10</span>
      {stars}
    </div>
  );
}
