import axios from "axios";

const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

// end points
// /trending/movie/week
// /movie/top_rated
// /movie/popular
// /movie/upcoming
// /movie/now_playing

export async function fetchMovies(endpoint: string , page = 1) {

  try {
    const res = await axios.get(
      `${BASE_URL}${endpoint}?api_key=${API_KEY}&language=en-US&page=${page}`,
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
      `${BASE_URL}/movie/${movieID}?api_key=${API_KEY}&language=en-US&append_to_response=credits,similar,videos`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
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

export interface Movie {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  media_type: "movie" | "tv" | string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
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