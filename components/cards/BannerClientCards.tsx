"use client";
import Image from "next/image";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Link from "next/link";
import { slugify } from "../../lib/slugify";
import { encodeId } from "../../lib/hash";
import { Genre, Movie } from "../../constant/types";
import { backdropUrl } from "../../constant/main";
import { ShipsBanner, StarRatingBanner } from "../ships";

type Props = {
  data: Movie[];
  genres: Genre[];
};

export default function BannerClientCard({ data, genres }: Props) {
  const getGenreNames = (ids: number[]) => {
    return ids
      .map((id) => genres.find((g) => g.id === id)?.name)
      .filter((name): name is string => !!name);
  };
  return (
    <>
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
                fetchPriority="high"
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />

              <div className="absolute inset-0 flex flex-col justify-end pb-12 items-start md:justify-center md:items-start px-4 sm:px-8 md:pb-0 md:px-16 lg:px-24">
                <div className="max-w-3xl space-y-0 md:space-y-5 flex flex-col items-start md:items-start gap-4 md:gap-10">
                  <div className="flex flex-col items-start md:items-start gap-2 md:gap-5">
                    <h1 className="text-3xl md:text-6xl font-bold text-white drop-shadow-lg leading-tight text-center">
                      {item.title || item.name}
                    </h1>

                    <div className="flex flex-wrap justify-center gap-2 md:gap-4 items-start md:items-center text-xs sm:text-sm md:text-base text-gray-200">
                      <ShipsBanner
                        ship={<StarRatingBanner rating={item.vote_average} />}
                      />
                      <ShipsBanner ship={`(${item.vote_count} Votes)`} />
                      <div className="hidden md:flex">
                        <ShipsBanner ship={item.release_date} />
                      </div>
                      <div className="flex md:hidden">
                        <ShipsBanner ship={item.release_date?.split("-")[0]} />
                      </div>
                    </div>

                    <div className="hidden md:flex flex-wrap justify-center gap-2 md:gap-4 items-center text-xs sm:text-sm md:text-base text-gray-200">
                      {getGenreNames(item.genre_ids)
                        .slice(0, 4)
                        .map((name, idx) => (
                          <ShipsBanner key={idx} ship={name} />
                        ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-start md:items-start gap-4 md:gap-8">
                    <div className="space-y-1  flex-col text-left md:text-left">
                      <h2 className="hidden md:flex text-xl md:text-3xl font-semibold text-red-700">
                        OVERVIEW
                      </h2>
                      <p className="text-gray-300 line-clamp-3 md:line-clamp-4 max-w-xl md:max-w-2xl text-xs sm:text-sm md:text-base">
                        {item.overview}
                      </p>
                    </div>

                    <div>
                      <Link
                        href={`/movie/${encodeId(item.id)}/${slugify((item.title || item.name) + "-" + (item.release_date ? item.release_date.split("-")[0] : item.first_air_date ? item.first_air_date.split("-")[0] : ""))}`}
                        className="inline-block px-6 py-2 md:px-8 md:py-3 bg-neutral-100/10 ring ring-neutral-500 hover:bg-red-700 hover:ring-red-800 text-white text-xs md:text-base font-semibold rounded-lg transition-colors duration-300 shadow-lg hover:shadow-red-600/30"
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
    </>
  );
}
