import { fetchTvDetails } from "@/app/lib/tmdb";
import { Metadata } from "next";
import TvDetailsClient from "../TvDetailsClient";
import { slugify } from "@/app/lib/slugify";
import { permanentRedirect, notFound } from "next/navigation";
import { decodeId } from "@/app/lib/hash";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const encodedId = slug[0];
  const id = decodeId(encodedId);
  if (!id) return { title: "TV Show Not Found" };
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

  const encodedId = slug[0];
  const id = decodeId(encodedId);
  if (!id) notFound();
  const data = await fetchTvDetails(id);
  if (!data) notFound();

  if (slug.length === 1) {
    const expectedSlug = slugify(
      data.name +
        "-" +
        (data.first_air_date ? data.first_air_date.split("-")[0] : ""),
    );

    permanentRedirect(`/tv/${encodedId}/${expectedSlug}`);
  }

  if (slug.length === 2) {
    const [, name] = slug;
    const expectedSlug = slugify(
      data.name +
        "-" +
        (data.first_air_date ? data.first_air_date.split("-")[0] : ""),
    );
    if (name !== expectedSlug) {
      permanentRedirect(`/tv/${encodedId}/${expectedSlug}`);
    }

    return <TvDetailsClient />;
  }

  notFound();
}
