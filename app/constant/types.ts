export interface SectionData {
  id?: number;
  endpoint: string;
  title: string;
  slug?: string;
  type?: string;
  created_at?: string;
}

export interface SectionProps {
  endpoint: string;
  title: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface CastSectionProps {
  cast: Cast[];
  limit?: number;
  movieId?: string;
  navig: string;
}

export interface MovieSummary {
  id: number;
  original_title?: string;
  original_name?: string;
  title?: string;
  name?: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
}

export interface Movie extends MovieSummary {
  known_for_department?: string;
  profile_path: string;
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

export interface Collection {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  parts: MovieSummary[];
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

export interface Season {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  vote_average: number;
}

export interface Episode {
  air_date: string;
  episode_number: number;
  id: number;
  name: string;
  overview: string;
  production_code: string;
  runtime: number;
  season_number: number;
  show_id: number;
  still_path: string | null;
  vote_average: number;
  vote_count: number;
  crew: Array<{
    id: number;
    name: string;
    job: string;
    profile_path: string | null;
  }>;
  guest_stars: Array<{
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
  }>;
}

export interface SeasonDetail extends Season {
  _id: string;
  episodes: Episode[];
  videos?: {
    results: Array<{
      key: string;
      site: string;
      type: string;
      name: string;
    }>;
  };
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
}

export interface TvDetail {
  seasons: Season[];
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

export interface ActorDetail {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  place_of_birth: string | null;
  profile_path: string | null;
  known_for_department: string;
  movie_credits?: {
    cast: MovieSummary[];
  };
  tv_credits?: {
    cast: MovieSummary[];
  };
}

export interface IPResponse {
  country_code?: string;
  countryCode?: string;
}

export interface Provider {
  url: string;
  parse: (d: string | IPResponse) => string | null | undefined;
  isText?: boolean;
}

export interface StreamSource {
  id?: number;
  name: string;
  full_url?: string;
  full_url_tv?: string;
  is_active?: boolean;
  added_at?: string;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface RatingStarsProps {
  rating: number;
}

export interface TrailerModelProps {
  trailerKey: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface TvSeasonCardProps {
  season: Season;
  seriesId: string;
  seriesName: string;
}

export interface MovieMiniCardProps {
  movie: MovieSummary;
}

export interface MovieCardProps {
  movie: Movie;
  size?: "small"| "medium" | "large";
}

export interface MessageParserProps {
  content: string;
}

export interface LoadingModelProps {
  message?: string;
}

export interface CategoryDetailsClientProps {
  initialMovies?: Movie[];
  initialTotalPages?: number;
}

export interface SeasonDetailsClientProps {
  initialSeason?: SeasonDetail;
}
