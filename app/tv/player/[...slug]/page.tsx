import { fetchTvDetails } from "@/app/lib/tmdb";
import { Metadata } from "next";
import PlayerClient from "../PlayerClient";
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
  const seriesId = decodeId(encodedId);
  const isNamed = slug.length === 4;
  const season = isNamed ? slug[2] : slug[1];
  const episode = isNamed ? slug[3] : slug[2];
  if (!seriesId) return { title: "TV Show Not Found" };

  try {
    const data = await fetchTvDetails(seriesId);
    if (!data) return { title: "TV Show Not Found" };

    return {
      title: `Watch ${data.name} S${season} E${episode} - Movie Night`,
      description: `Stream ${data.name} Season ${season} Episode ${episode} online for free on Movie Night.`,
      openGraph: {
        title: `Watch ${data.name} S${season} E${episode}`,
        description: data.overview,
        images: data.backdrop_path
          ? [{ url: `https://image.tmdb.org/t/p/w1280${data.backdrop_path}` }]
          : undefined,
      },
    };
  } catch {
    return { title: "Watch TV Show - Movie Night" };
  }
}

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  const isNamed = slug.length === 4;
  const encodedId = slug[0];
  const season = isNamed ? slug[2] : slug[1];
  const episode = isNamed ? slug[3] : slug[2];

  const id = decodeId(encodedId);
  if (!id || !season || !episode) notFound();

  const data = await fetchTvDetails(id);
  if (!data) notFound();

  const expectedSlug = slugify(data.name + "-s" + season + "-e" + episode);

  // Handle /tv/player/[encodedId]/[season]/[episode]
  if (slug.length === 3) {
    permanentRedirect(
      `/tv/player/${encodedId}/${expectedSlug}/${season}/${episode}`,
    );
  }

  // Handle /tv/player/[encodedId]/[slug]/[season]/[episode]
  if (slug.length === 4) {
    const name = slug[1];
    if (name !== expectedSlug) {
      permanentRedirect(
        `/tv/player/${encodedId}/${expectedSlug}/${season}/${episode}`,
      );
    }
    return <PlayerClient />;
  }

  return <PlayerClient />;
}
