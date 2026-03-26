import { MetadataRoute } from "next";
import { fetchMovies, fetchTvGenres } from "../../lib/tmdb";
import { MovieSummary } from "../../constant/types";
import { slugify } from "../../lib/slugify";
import { encodeId } from "../../lib/hash";
import { siteUrl } from "../../constant/main";

async function getAllTvIds() {
  const pages = [1, 2, 3, 4, 5];
  const endpoints = [
    "/trending/tv/week",
    "/tv/top_rated",
    "/tv/popular",
    "/tv/on_the_air",
    "/tv/airing_today",
  ];

  const results = await Promise.all(
    endpoints.flatMap((endpoint) =>
      pages.map((page) => fetchMovies(endpoint, page))
    )
  );

  const allTv = results.flatMap((res) => res.results);
  const uniqueTv = Array.from(new Map(allTv.map((t: MovieSummary) => [t.id, t])).values());
  return uniqueTv.map((t: MovieSummary) => {
    const year = t.first_air_date ? t.first_air_date.split("-")[0] : "";
    return {
      id: t.id,
      name: t.name || t.original_name || "tv",
      slug: slugify(`${t.name || t.original_name || "tv"}-${year}`)
    };
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [tvIds, tvGenres] = await Promise.all([
    getAllTvIds(),
    fetchTvGenres(),
  ]);

  const tvGenrePages: MetadataRoute.Sitemap = tvGenres.flatMap((genre: { id: number; name: string }) => 
    [1, 2, 3, 4, 5].map(page => ({
      url: `${siteUrl}/category/${slugify(genre.name)}${page > 1 ? `?page=${page}` : ""}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: page === 1 ? 0.7 : 0.5,
    }))
  );

  const tvPages: MetadataRoute.Sitemap = tvIds.map(({ id, slug }: { id: number; slug: string }) => ({
    url: `${siteUrl}/tv/${encodeId(id)}/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const tvPlayerPages: MetadataRoute.Sitemap = tvIds.map(({ id, name }: { id: number; name: string }) => ({
    url: `${siteUrl}/tv/player/${encodeId(id)}/${slugify(name + "-s1-e1")}/1/1`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  const tvCastPages: MetadataRoute.Sitemap = tvIds.map(({ id }: { id: number }) => ({
    url: `${siteUrl}/tv/cast/${encodeId(id)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.4,
  }));

  return [
    ...tvGenrePages,
    ...tvPages,
    ...tvPlayerPages,
    ...tvCastPages,
  ];
}
