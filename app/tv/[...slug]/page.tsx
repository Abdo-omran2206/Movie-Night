import { fetchTvDetails } from "@/app/lib/tmdb";
import { Metadata } from "next";
import TvDetailsClient from "../TvDetailsClient";
import { slugify } from "@/app/lib/slugify";
import { permanentRedirect, notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const id = slug[slug.length - 1];

  try {
    const data = await fetchTvDetails(id);
    if (!data) return { title: "TV Show Not Found" };

    return {
      title: `${data.name} (${data.first_air_date?.split("-")[0] || ""}) - Movie Night`,
      description: data.overview || "No description available.",
      openGraph: {
        title: data.name,
        description: data.overview,
        images: data.poster_path
          ? [{ url: `https://image.tmdb.org/t/p/w500${data.poster_path}` }]
          : undefined,
      },
    };
  } catch {
    return { title: "TV Show Details - Movie Night" };
  }
}

export default async function TvPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  // Handle /tv/[id]
  if (slug.length === 1) {
    const id = slug[0];
    const data = await fetchTvDetails(id);
    if (!data) notFound();

    const expectedSlug = slugify(data.name);
    permanentRedirect(`/tv/${expectedSlug}/${id}`);
  }

  // Handle /tv/[name]/[id]
  if (slug.length === 2) {
    const [name, id] = slug;
    const data = await fetchTvDetails(id);
    if (!data) notFound();

    const expectedSlug = slugify(data.name);
    if (name !== expectedSlug) {
      permanentRedirect(`/tv/${expectedSlug}/${id}`);
    }

    return <TvDetailsClient />;
  }

  notFound();
}
