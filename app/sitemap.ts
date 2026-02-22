import { MetadataRoute } from "next";
import { fetchMovies, fetchGenres, fetchTvGenres } from "./lib/tmdb";
import { slugify } from "./lib/slugify";

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
  // Remove duplicates and return id and slug
  const uniqueMovies = Array.from(new Map(allMovies.map((m) => [m.id, m])).values());
  return uniqueMovies.map(m => ({
    id: m.id,
    slug: slugify(m.title || m.original_title || "movie")
  }));
}

async function getAllTvIds() {
  const endpoints = [
    "/trending/tv/week",
    "/tv/top_rated",
    "/tv/popular",
    "/tv/on_the_air",
    "/tv/airing_today",
  ];

  const results = await Promise.all(
    endpoints.map((endpoint) => fetchMovies(endpoint, 1))
  );

  const allTv = results.flatMap((res) => res.results);
  // Remove duplicates and return id and slug
  const uniqueTv = Array.from(new Map(allTv.map((t) => [t.id, t])).values());
  return uniqueTv.map(t => ({
    id: t.id,
    slug: slugify(t.name || t.original_name || "tv")
  }));
}

async function getPopularActorIds() {
  const { results } = await fetchMovies("/person/popular", 1);
  return results.map((actor: { id: number; name: string }) => ({
    id: actor.id,
    slug: slugify(actor.name)
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [movieIds, tvIds, actorIds, movieGenres, tvGenres] = await Promise.all([
    getAllMovieIds(),
    getAllTvIds(),
    getPopularActorIds(),
    fetchGenres(),
    fetchTvGenres(),
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

  // Movie Genre Pages
  const movieGenrePages: MetadataRoute.Sitemap = movieGenres.map((genre: { id: number }) => ({
    url: `${BASE_URL}/category/${genre.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // TV Genre Pages (Mapping might be different, but keeping consistent with category/[id])
  const tvGenrePages: MetadataRoute.Sitemap = tvGenres.map((genre: { id: number }) => ({
    url: `${BASE_URL}/category/${genre.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Movie Details Pages
  const moviePages: MetadataRoute.Sitemap = movieIds.map(({ id, slug }: { id: number; slug: string }) => ({
    url: `${BASE_URL}/movie/${slug}/${id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // TV Details Pages
  const tvPages: MetadataRoute.Sitemap = tvIds.map(({ id, slug }: { id: number; slug: string }) => ({
    url: `${BASE_URL}/tv/${slug}/${id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // Movie Player Pages
  const moviePlayerPages: MetadataRoute.Sitemap = movieIds.map(({ id }: { id: number; slug: string }) => ({
    url: `${BASE_URL}/movie/player/${id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  // TV Player Pages (Defaulting to S1 E1)
  const tvPlayerPages: MetadataRoute.Sitemap = tvIds.map(({ id, slug }: { id: number; slug: string }) => ({
    url: `${BASE_URL}/tv/player/${slug}/${id}/1/1`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  // Actor Details Pages
  const actorPages: MetadataRoute.Sitemap = actorIds.map(({ id, slug }: { id: number; slug: string }) => ({
    url: `${BASE_URL}/actor/${slug}/${id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [
    ...mainPages,
    ...movieGenrePages,
    ...tvGenrePages,
    ...moviePages,
    ...tvPages,
    ...moviePlayerPages,
    ...tvPlayerPages,
    ...actorPages,
  ];
}
