import { fetchMovieDetails } from "@/app/lib/tmdb";
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
  const id = decodeId(encodedId);
  if (!id) return { title: "Movie Not Found" };

  try {
    const data = await fetchMovieDetails(id.toString());
    if (!data) return { title: "Movie Not Found" };

    return {
      title: `Watch ${data.title} - Movie Night`,
      description: `Stream ${data.title} online for free on Movie Night.`,
      openGraph: {
        title: `Watch ${data.title}`,
        description: data.overview,
        images: data.backdrop_path
          ? [{ url: `https://image.tmdb.org/t/p/w1280${data.backdrop_path}` }]
          : undefined,
      },
    };
  } catch {
    return { title: "Watch Movie - Movie Night" };
  }
}

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const encodedId = slug[0];
  const id = decodeId(encodedId);
  if (!id) notFound();

  const data = await fetchMovieDetails(id.toString());
  if (!data) notFound();

  const expectedSlug = slugify(data.title);

  // Handle /movie/player/[id]
  if (slug.length === 1) {
    permanentRedirect(`/movie/player/${encodedId}/${expectedSlug}`);
  }

  // Handle /movie/player/[id]/[name]
  if (slug.length === 2) {
    const [, name] = slug;
    if (name !== expectedSlug) {
      permanentRedirect(`/movie/player/${encodedId}/${expectedSlug}`);
    }

    return <PlayerClient />;
  }

  notFound();
}
