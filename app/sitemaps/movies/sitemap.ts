import { MetadataRoute } from "next";
import { fetchMovies, fetchGenres } from "../../lib/tmdb";
import { MovieSummary } from "../../constant/types";
import { slugify } from "../../lib/slugify";
import { encodeId } from "../../lib/hash";
import { siteUrl } from "../../constant/main";

async function getAllMovieIds() {
  const pages = [1, 2, 3, 4, 5];
  const endpoints = [
    "/trending/movie/week",
    "/movie/top_rated",
    "/movie/popular",
    "/movie/upcoming",
    "/movie/now_playing",
  ];

  const results = await Promise.all(
    endpoints.flatMap((endpoint) =>
      pages.map((page) => fetchMovies(endpoint, page))
    )
  );

  const allMovies = results.flatMap((res) => res.results);
  const uniqueMovies = Array.from(new Map(allMovies.map((m: MovieSummary) => [m.id, m])).values());
  return uniqueMovies.map((m: MovieSummary) => {
    const year = m.release_date ? m.release_date.split("-")[0] : "";
    return {
      id: m.id,
      slug: slugify(`${m.title || m.original_title || "movie"}-${year}`)
    };
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [movieIds, movieGenres] = await Promise.all([
    getAllMovieIds(),
    fetchGenres(),
  ]);

  const movieGenrePages: MetadataRoute.Sitemap = movieGenres.flatMap((genre: { id: number; name: string }) => 
    [1, 2, 3, 4, 5].map(page => ({
      url: `${siteUrl}/category/${slugify(genre.name)}${page > 1 ? `?page=${page}` : ""}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: page === 1 ? 0.7 : 0.5,
    }))
  );

  const moviePages: MetadataRoute.Sitemap = movieIds.map(({ id, slug }: { id: number; slug: string }) => ({
    url: `${siteUrl}/movie/${encodeId(id)}/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const moviePlayerPages: MetadataRoute.Sitemap = movieIds.map(({ id, slug }: { id: number; slug: string }) => ({
    url: `${siteUrl}/movie/player/${encodeId(id)}/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  const movieCastPages: MetadataRoute.Sitemap = movieIds.map(({ id }: { id: number }) => ({
    url: `${siteUrl}/movie/cast/${encodeId(id)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.4,
  }));

  return [
    ...movieGenrePages,
    ...moviePages,
    ...moviePlayerPages,
    ...movieCastPages,
  ];
}
