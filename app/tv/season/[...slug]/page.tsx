import { fetchTvDetails, fetchTvSeasonDetails } from "@/app/lib/tmdb";
import { Metadata } from "next";
import SeasonDetailsClient from "../SeasonDetailsClient";
import { slugify } from "@/app/lib/slugify";
import { permanentRedirect, notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;

  // Expecting [series-id, season-number] or [series-name, series-id, season-number]
  const seriesId = slug[slug.length - 2];
  const seasonNumber = slug[slug.length - 1];

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

  // Handle /tv/season/[id]/[seasonNumber]
  if (slug.length === 2) {
    const [id, seasonNum] = slug;
    const series = await fetchTvDetails(id);
    if (!series) notFound();

    const expectedSlug = slugify(series.name);
    permanentRedirect(`/tv/season/${expectedSlug}/${id}/${seasonNum}`);
  }

  // Handle /tv/season/[name]/[id]/[seasonNumber]
  if (slug.length === 3) {
    const [name, id, seasonNum] = slug;
    const series = await fetchTvDetails(id);
    if (!series) notFound();

    const season = await fetchTvSeasonDetails(id, seasonNum);
    if (!season) notFound();

    const expectedSlug = slugify(series.name);
    if (name !== expectedSlug) {
      permanentRedirect(`/tv/season/${expectedSlug}/${id}/${seasonNum}`);
    }

    return <SeasonDetailsClient series={series} season={season} />;
  }

  notFound();
}
