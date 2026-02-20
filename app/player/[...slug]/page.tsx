import { fetchMovieDetails } from "@/app/lib/tmdb";
import { Metadata } from "next";
import PlayerClient from "../PlayerClient";
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
    const data = await fetchMovieDetails(id);
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

  // Handle /player/[id]
  if (slug.length === 1) {
    const id = slug[0];
    const data = await fetchMovieDetails(id);
    if (!data) notFound();

    const expectedSlug = slugify(data.title);
    permanentRedirect(`/player/${expectedSlug}/${id}`);
  }

  // Handle /player/[name]/[id]
  if (slug.length === 2) {
    const [name, id] = slug;
    const data = await fetchMovieDetails(id);
    if (!data) notFound();

    const expectedSlug = slugify(data.title);
    if (name !== expectedSlug) {
      permanentRedirect(`/player/${expectedSlug}/${id}`);
    }

    return <PlayerClient />;
  }

  notFound();
}
