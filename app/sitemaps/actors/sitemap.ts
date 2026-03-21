import { MetadataRoute } from "next";
import { fetchMovies, MovieSummary } from "../../lib/tmdb";
import { slugify } from "../../lib/slugify";
import { encodeId } from "../../lib/hash";

const BASE_URL = "https://mymovienight.vercel.app";

async function getPopularActorIds() {
  const pages = [1, 2, 3, 4, 5];
  const endpoints = ["/person/popular", "/trending/person/week"];

  const results = await Promise.all(
    endpoints.flatMap((endpoint) =>
      pages.map((page) => fetchMovies(endpoint, page))
    )
  );

  const allActors = results.flatMap((res) => res.results);
  const uniqueActors = Array.from(new Map(allActors.map((actor: MovieSummary) => [actor.id, actor])).values());

  return uniqueActors.map((actor: MovieSummary) => ({
    id: actor.id,
    slug: slugify(actor.name || actor.original_name || "actor")
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const actorIds = await getPopularActorIds();

  const actorPages: MetadataRoute.Sitemap = actorIds.map(({ id, slug }: { id: number; slug: string }) => ({
    url: `${BASE_URL}/actor/${encodeId(id)}/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return actorPages;
}
