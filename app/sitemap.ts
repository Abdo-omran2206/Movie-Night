import { MetadataRoute } from "next";
import { fetchMovies, fetchGenres, fetchTvGenres } from "./lib/tmdb";
import { slugify } from "./lib/slugify";
import { encodeId } from "./lib/hash";

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
  const uniqueMovies = Array.from(new Map(allMovies.map((m) => [m.id, m])).values());
  return uniqueMovies.map(m => {
    const year = m.release_date ? m.release_date.split("-")[0] : "";
    return {
      id: m.id,
      slug: slugify(`${m.title || m.original_title || "movie"}-${year}`)
    };
  });
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
  const uniqueTv = Array.from(new Map(allTv.map((t) => [t.id, t])).values());
  return uniqueTv.map(t => {
    const year = t.first_air_date ? t.first_air_date.split("-")[0] : "";
    return {
      id: t.id,
      name: t.name || t.original_name || "tv",
      slug: slugify(`${t.name || t.original_name || "tv"}-${year}`)
    };
  });
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

  const movieGenrePages: MetadataRoute.Sitemap = movieGenres.map((genre: { id: number }) => ({
    url: `${BASE_URL}/category/${genre.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const tvGenrePages: MetadataRoute.Sitemap = tvGenres.map((genre: { id: number }) => ({
    url: `${BASE_URL}/category/${genre.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const moviePages: MetadataRoute.Sitemap = movieIds.map(({ id, slug }: { id: number; slug: string }) => ({
    url: `${BASE_URL}/movie/${encodeId(id)}/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const tvPages: MetadataRoute.Sitemap = tvIds.map(({ id, slug }: { id: number; slug: string }) => ({
    url: `${BASE_URL}/tv/${encodeId(id)}/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const moviePlayerPages: MetadataRoute.Sitemap = movieIds.map(({ id, slug }: { id: number; slug: string }) => ({
    url: `${BASE_URL}/movie/player/${encodeId(id)}/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  const tvPlayerPages: MetadataRoute.Sitemap = tvIds.map(({ id, name }: { id: number; name: string }) => ({
    url: `${BASE_URL}/tv/player/${encodeId(id)}/${slugify(name + "-s1-e1")}/1/1`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  const actorPages: MetadataRoute.Sitemap = actorIds.map(({ id, slug }: { id: number; slug: string }) => ({
    url: `${BASE_URL}/actor/${encodeId(id)}/${slug}`,
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
