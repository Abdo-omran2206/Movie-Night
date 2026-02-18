import { MetadataRoute } from "next";
import { fetchMovies, fetchGenres } from "./lib/tmdb";

const BASE_URL = "https://movie-night-self.vercel.app";

async function getAllMovieIds() {
  const endpoints = [
    "/trending/movie/week",
    "/movie/top_rated",
    "/movie/popular",
    "/movie/upcoming",
    "/movie/now_playing",
  ];

  const results = await Promise.all(
    endpoints.map((endpoint) => fetchMovies(endpoint, 1))
  );

  const allMovies = results.flatMap((res) => res.results);
  // Remove duplicates
  const uniqueIds = Array.from(new Set(allMovies.map((m) => m.id)));
  return uniqueIds;
}

async function getPopularActorIds() {
  const { results } = await fetchMovies("/person/popular", 1);
  return results.map((actor: { id: number }) => actor.id);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [movieIds, genres, actorIds] = await Promise.all([
    getAllMovieIds(),
    fetchGenres(),
    getPopularActorIds(),
  ]);

  const categories = ["trending", "popular", "top_rated", "upcoming", "now_playing"];

  // Static and Category Pages
  const mainPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1,
    },
    ...categories.map((cat) => ({
      url: `${BASE_URL}/category/${cat}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  ];

  // Genre Pages
  const genrePages: MetadataRoute.Sitemap = genres.map((genre: { id: number }) => ({
    url: `${BASE_URL}/category/${genre.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Movie Details Pages
  const moviePages: MetadataRoute.Sitemap = movieIds.map((id) => ({
    url: `${BASE_URL}/movie/${id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // Actor Details Pages
  const actorPages: MetadataRoute.Sitemap = actorIds.map((id: number) => ({
    url: `${BASE_URL}/actor/${id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...mainPages, ...genrePages, ...moviePages, ...actorPages];
}
