import axios from "axios";

const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

// end points
// /trending/movie/week
// /movie/top_rated
// /movie/popular
// /movie/upcoming
// /movie/now_playing

export async function fetchMovies(endpoint: string , page = 1 , language = "en-US") {

  try {
    const separator = endpoint.includes("?") ? "&" : "?";
    const res = await axios.get(
      `${BASE_URL}${endpoint}${separator}api_key=${API_KEY}&language=${language}&page=${page}`,
    );
    // axios بيرجع البيانات هنا في res.data
    return {
      results: res.data.results || [],
      total_pages: res.data.total_pages || 0,
    };
  } catch (err) {
    console.error(`Error fetching ${endpoint}:`, err);
    return { results: [], total_pages: 0 };
  }
}

export async function fetchGenres() {
  try {
    const response = await axios.get(
      `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`,
    );

    return response.data.genres || [];
  } catch (error) {
    console.error("Error fetching genres:", error);
    return [];
  }
}

// Fetch movie details
export async function fetchMovieDetails(movieID: string) {
  try {
    const response = await axios.get(
      `${BASE_URL}/movie/${movieID}?api_key=${API_KEY}&language=en-US&append_to_response=credits,similar,videos,recommendations,keywords`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
}

// Fetch tv details
export async function fetchTvDetails(tvID: string) {
  try {
    const response = await axios.get(
      `${BASE_URL}/tv/${tvID}?api_key=${API_KEY}&language=en-US&append_to_response=credits,similar,videos,recommendations,keywords`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching tv details:", error);
    return null;
  }
}

export async function fetchTvGenres() {
  try {
    const response = await axios.get(
      `${BASE_URL}/genre/tv/list?api_key=${API_KEY}&language=en-US`,
    );

    return response.data.genres || [];
  } catch (error) {
    console.error("Error fetching tv genres:", error);
    return [];
  }
}

export async function getActorById(actorId: string) {
  try {
    const response = await axios.get(
      `${BASE_URL}/person/${actorId}?api_key=${API_KEY}&language=en-US&append_to_response=movie_credits,images`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching actor details:", error);
    return null;
  }
}

export interface MovieSummary {
  id: number;
  original_title?: string;
  title?: string;
  name?: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
}

export interface Movie extends MovieSummary {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  media_type: "movie" | "tv" | string;
  original_language: string;
  overview: string;
  popularity: number;
  video: boolean;
  vote_count: number;
}

export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

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

export interface TvDetail {
  adult: boolean;
  backdrop_path: string | null;
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
  origin_country?: string[];
  original_language: string;
  original_name: string;
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
  first_air_date: string;
  number_of_seasons: number;
  number_of_episodes: number;
  status: string;
  tagline: string | null;
  name: string;
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
  similar?: {
    results: Movie[];
  };
  recommendations?: {
    results: Movie[];
  };
  vote_average: number;
  vote_count: number;
}

export const GENRE_MAP: Record<string, number> = {
  action: 28,
  adventure: 12,
  animation: 16,
  comedy: 35,
  crime: 80,
  documentary: 99,
  drama: 18,
  family: 10751,
  fantasy: 14,
  history: 36,
  horror: 27,
  music: 10402,
  mystery: 9648,
  romance: 10749,
  science_fiction: 878,
  "sci-fi": 878,
  tv_movie: 10770,
  thriller: 53,
  war: 10752,
  western: 37,
};

export function getGenreSlug(id: number): string | undefined {
  return Object.keys(GENRE_MAP).find((key) => GENRE_MAP[key] === id);
}

export async function search(query: string, page: number): Promise<TMDBResponse<Movie>> {
  try {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
        query
      )}&page=${page}&include_adult=false`
    );
    const data = await response.json();
    return data || { results: [], total_pages: 0, total_results: 0, page: 1 };
  } catch (error) {
    console.error(`Error searching movies:`, error);
    return { results: [], total_pages: 0, total_results: 0, page: 1 };
  }
}