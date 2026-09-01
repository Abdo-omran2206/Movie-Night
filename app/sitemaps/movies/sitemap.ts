import { MetadataRoute } from "next";
import { fetchMovies, fetchGenres } from "@/lib/services/tmdb";
import { MovieSummary } from "@/constant/types";
import { slugify } from "@/lib/slugify";
import { encodeId } from "@/lib/hash";
import { siteUrl } from "@/constant/main";

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
      pages.map((page) => fetchMovies(endpoint, page).catch(() => ({ results: [] })))
    )
  );

  const allMovies = results.flatMap((res) => res?.results || []);
  const uniqueMovies = Array.from(
    new Map(allMovies.filter((m) => m && m.id).map((m: MovieSummary) => [m.id, m])).values()
  );

  return uniqueMovies.map((m: MovieSummary) => {
    const title = m.title || m.original_title || "movie";
    const year = m.release_date ? m.release_date.split("-")[0] : "";
    return {
      id: m.id,
      titleSlug: slugify(title),
      fullSlug: slugify(`${title}-${year}`),
    };
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const [movieIds, movieGenres] = await Promise.all([
      getAllMovieIds(),
      fetchGenres().catch(() => []),
    ]);

    const movieGenrePages: MetadataRoute.Sitemap = movieGenres.flatMap(
      (genre: { id: number; name: string }) =>
        [1, 2, 3, 4, 5].map((page) => ({
          url: `${siteUrl}/category/${slugify(genre.name)}${page > 1 ? `?page=${page}` : ""}`,
          lastModified: new Date(),
          changeFrequency: "weekly" as const,
          priority: page === 1 ? 0.7 : 0.5,
        }))
    );

    const moviePages: MetadataRoute.Sitemap = movieIds.map(
      ({ id, fullSlug }: { id: number; fullSlug: string }) => ({
        url: `${siteUrl}/movie/${encodeId(id)}/${fullSlug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })
    );

    const moviePlayerPages: MetadataRoute.Sitemap = movieIds.map(
      ({ id, titleSlug }: { id: number; titleSlug: string }) => ({
        url: `${siteUrl}/movie/player/${encodeId(id)}/${titleSlug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })
    );

    const movieCastPages: MetadataRoute.Sitemap = movieIds.map(
      ({ id }: { id: number }) => ({
        url: `${siteUrl}/movie/cast/${encodeId(id)}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.4,
      })
    );

    return [
      ...movieGenrePages,
      ...moviePages,
      ...moviePlayerPages,
      ...movieCastPages,
    ];
  } catch (error) {
    console.error("Error generating movies sitemap:", error);
    return [];
  }
}

