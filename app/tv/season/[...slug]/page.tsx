import { fetchTvDetails, fetchTvSeasonDetails } from "@/app/lib/tmdb";
import { Metadata } from "next";
import SeasonDetailsClient from "../SeasonDetailsClient";
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
  const seasonNumber = slug[1];
  const seriesId = decodeId(encodedId);
  if (!seriesId) return { title: "TV Show Not Found" };

  try {
    const series = await fetchTvDetails(seriesId);
    if (!series) return { title: "TV Show Not Found" };

    const season = await fetchTvSeasonDetails(seriesId, seasonNumber);
    if (!season) return { title: "Season Not Found" };

    return {
      title: `${series.name} - ${season.name} - Movie Night`,
      description: season.overview || series.overview,
      openGraph: {
        title: `${series.name} - ${season.name}`,
        description: season.overview || series.overview,
        images: season.poster_path
          ? [{ url: `https://image.tmdb.org/t/p/w500${season.poster_path}` }]
          : undefined,
      },
    };
  } catch {
    return { title: "Season Details - Movie Night" };
  }
}

export default async function SeasonPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const encodedId = slug[0];
  const id = decodeId(encodedId);
  if (!id) notFound();

  const seasonNum = slug[1];
  if (!seasonNum) notFound();

  const series = await fetchTvDetails(id);
  if (!series) notFound();

  const season = await fetchTvSeasonDetails(id, seasonNum);
  if (!season) notFound();

  const expectedSlug = slugify(series.name + "-season-" + seasonNum);

  // Handle /tv/season/[id]/[seasonNum]
  if (slug.length === 2) {
    permanentRedirect(`/tv/season/${encodedId}/${seasonNum}/${expectedSlug}`);
  }

  // Handle /tv/season/[id]/[seasonNum]/[name]
  if (slug.length === 3) {
    const name = slug[2];
    if (name !== expectedSlug) {
      permanentRedirect(`/tv/season/${encodedId}/${seasonNum}/${expectedSlug}`);
    }

    return <SeasonDetailsClient series={series} season={season} />;
  }

  notFound();
}
