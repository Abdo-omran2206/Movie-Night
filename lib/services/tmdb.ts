import { 
  Movie,
  TMDBResponse,
  DiscoverParams
} from "@/constant/types";
import { GENRE_MAP, tmdbBaseUrl } from "@/constant/main";

const BASE_URL = tmdbBaseUrl;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export async function fetchMovies(endpoint: string , page = 1 , language = "en-US"): Promise<{ results: Movie[]; total_pages: number }> {
  try {
    const separator = endpoint.includes("?") ? "&" : "?";
    const res = await fetch(
      `${BASE_URL}${endpoint}${separator}api_key=${API_KEY}&language=${language}&page=${page}`,
      { next: { revalidate: 3600 } } // Cache lists for 1 hour
    );
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    const data = await res.json();
    return {
      results: data.results || [],
      total_pages: data.total_pages || 0,
    };
  } catch (err) {
    console.error(`Error fetching ${endpoint}:`, err);
    return { results: [], total_pages: 0 };
  }
}

export async function fetchGenres() {
  try {
    const response = await fetch(
      `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`,
      { next: { revalidate: 86400 } } // Cache genres for 24 hours
    );
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    const data = await response.json();
    return data.genres || [];
  } catch (error) {
    console.error("Error fetching genres:", error);
    return [];
  }
}

// Fetch movie details
export async function fetchMovieDetails(movieID: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieID}?api_key=${API_KEY}&language=en-US&append_to_response=credits,similar,videos,recommendations,keywords`,
      { next: { revalidate: 86400 } } // Cache details for 24 hours
    );
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
}

// Fetch tv details
export async function fetchTvDetails(tvID: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/tv/${tvID}?api_key=${API_KEY}&language=en-US&append_to_response=credits,similar,videos,recommendations,keywords`,
      { next: { revalidate: 86400 } }
    );
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching tv details:", error);
    return null;
  }
}

// Fetch tv season details
export async function fetchTvSeasonDetails(tvID: string, seasonNumber: string | number) {
  try {
    const response = await fetch(
      `${BASE_URL}/tv/${tvID}/season/${seasonNumber}?api_key=${API_KEY}&language=en-US&append_to_response=credits,videos,images`,
      { next: { revalidate: 86400 } }
    );
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching tv season details:", error);
    return null;
  }
}

export async function fetchTvGenres() {
  try {
    const response = await fetch(
      `${BASE_URL}/genre/tv/list?api_key=${API_KEY}&language=en-US`,
      { next: { revalidate: 86400 } }
    );
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    const data = await response.json();
    return data.genres || [];
  } catch (error) {
    console.error("Error fetching tv genres:", error);
    return [];
  }
}

export async function getActorById(actorId: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/person/${actorId}?api_key=${API_KEY}&language=en-US&append_to_response=movie_credits,tv_credits,images,external_ids`,
      { next: { revalidate: 86400 } }
    );
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching actor details:", error);
    return null;
  }
}

export async function getCollectionDetails(collectionId: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/collection/${collectionId}?api_key=${API_KEY}&language=en-US`,
      { next: { revalidate: 86400 } }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch collection for ID: ${collectionId}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching collection details:", error);
    return null;
  }
}

export function getGenreSlug(id: number): string | undefined {
  return Object.keys(GENRE_MAP).find((key) => GENRE_MAP[key] === id);
}

export async function search(query: string, page: number, type: string = "multi"): Promise<TMDBResponse<Movie>> {
  const endpoint = type === "all" || !type ? "multi" : type;
  try {
    const response = await fetch(
      `${BASE_URL}/search/${endpoint}?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
        query
      )}&page=${page}&include_adult=false`,
      { next: { revalidate: 300 } } // Cache searches for 5 minutes
    );
    const data = await response.json();
    return data || { results: [], total_pages: 0, total_results: 0, page: 1 };
  } catch (error) {
    console.error(`Error searching media:`, error);
    return { results: [], total_pages: 0, total_results: 0, page: 1 };
  }
}

export async function discover(
  type: "movie" | "tv" = "movie",
  params: DiscoverParams
) {
  const queryParams = new URLSearchParams({
    api_key: API_KEY as string,
    language: "en-US",
    include_adult: "false",
    ...Object.fromEntries(
      Object.entries(params)
        .filter(([key, value]) => key !== undefined && value !== undefined && value !== "")
        .map(([key, value]) => [key, String(value)])
    ),
  });

  try {
    const res = await fetch(`${BASE_URL}/discover/${type}?${queryParams.toString()}`, {
      next: { revalidate: 3600 } // Cache discoveries for 1 hour
    });
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    const data = await res.json();
    return {
      results: data.results || [],
      total_pages: data.total_pages || 0,
      total_results: data.total_results || 0,
    };
  } catch (err) {
    console.error(`Error in discover ${type}:`, err);
    return { results: [], total_pages: 0, total_results: 0 };
  }
}

export const getCategoryInfo = (cat: string, type: string = "movie") => {
  const slug = (cat || "").toLowerCase().replace(/-/g, "_");
  const isTv = type === "tv";
  const mediaType = isTv ? "tv" : "movie";

  switch (cat) {
    case "trending":
      return { 
        endpoint: `/trending/${mediaType}/week`, 
        title: isTv ? "Trending TV Shows" : "Trending Movies" 
      };
    case "top_rated":
      return { 
        endpoint: `/${mediaType}/top_rated`, 
        title: isTv ? "Top Rated TV Shows" : "Top Rated Movies" 
      };
    case "popular":
      return { 
        endpoint: `/${mediaType}/popular`, 
        title: isTv ? "Popular TV Shows" : "Popular Movies" 
      };
    case "upcoming":
      return { 
        endpoint: isTv ? "/tv/on_the_air" : "/movie/upcoming", 
        title: isTv ? "TV Shows On The Air" : "Upcoming Movies" 
      };
    case "now_playing":
      return { 
        endpoint: isTv ? "/tv/airing_today" : "/movie/now_playing", 
        title: isTv ? "TV Shows Airing Today" : "Now Playing" 
      };
    default: {
      const genreId = GENRE_MAP[slug] || GENRE_MAP[cat];
      if (genreId) {
        return {
          endpoint: `/discover/${mediaType}?with_genres=${genreId}`,
          title: cat
            .replace(/_/g, " ")
            .replace(/-/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase()),
        };
      }

      if (/^\d+$/.test(cat)) {
        return {
          endpoint: `/discover/${mediaType}?with_genres=${cat}`,
          title: "Movies",
        };
      }
      return {
        endpoint: `/${mediaType}/${cat}`,
        title: cat
          ? cat.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
          : "Movies",
      };
    }
  }
};