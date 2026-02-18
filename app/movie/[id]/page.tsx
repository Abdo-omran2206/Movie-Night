import { fetchMovieDetails } from "@/app/lib/tmdb";
import { Metadata } from "next";
import MovieDetailsClient from "./MovieDetailsClient";

export interface MovieDetail {
  adult: boolean;
  backdrop_path: string | null;
  belongs_to_collection: {
    id: number;
    name: string;
    poster_path: string | null;
    backdrop_path: string | null;
  } | null;
  budget: number;
  credits?: {
    cast: Array<{
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }>;
    crew: Array<{
      id: number;
      name: string;
      job: string;
      profile_path: string | null;
    }>;
  };
  genres: {
    id: number;
    name: string;
  }[];
  homepage: string | null;
  id: number;
  imdb_id: string | null;
  origin_country?: string[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  production_companies: {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  release_date: string;
  revenue: number;
  runtime: number | null;
  similar?: {
    page: number;
    results: MovieDetail[];
    total_pages: number;
    total_results: number;
  };
  recommendations?: {
    page: number;
    results: MovieDetail[];
    total_pages: number;
    total_results: number;
  };
  spoken_languages: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[];
  status: string;
  tagline: string | null;
  title: string;
  video: boolean;
  videos?: {
    results: {
      iso_639_1: string;
      iso_3166_1: string;
      name: string;
      key: string;
      site: string;
      size: number;
      type: string;
      official: boolean;
      published_at: string;
      id: string;
    }[];
  };
  vote_average: number;
  vote_count: number;
  keywords?: {
    keywords: Array<{
      id: number;
      name: string;
    }>;
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  try {
    const { id } = await params;
    const data = await fetchMovieDetails(id);
    return {
      title: `${data.title} (${data.release_date.split("-")[0]}) - Movie Night`,
      description: data.overview || "No description available.",
      keywords:
        data.keywords?.keywords
          ?.map((k: { name: string }) => k.name)
          .join(", ") || "",
      openGraph: {
        title: `${data.title} (${data.release_date.split("-")[0]}) - Movie Night`,
        description: data.overview || "No description available.",
        images: data.poster_path
          ? [
              {
                url: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
                width: 500,
                height: 750,
                alt: data.title || "Movie poster",
              },
            ]
          : undefined,
      },
    };
  } catch (error) {
    console.error("Failed to fetch movie details for metadata:", error);
    return {
      title: "Movie Details - Movie Night",
      description: "Details about the selected movie.",
    };
  }
}

export default function MoviePage() {
  return <MovieDetailsClient />;
}
