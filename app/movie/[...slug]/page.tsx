import { fetchMovieDetails } from "@/app/lib/tmdb";
import { Metadata } from "next";
import MovieDetailsClient from "../MovieDetailsClient";
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
      title: `${data.title} (${data.release_date?.split("-")[0] || ""}) - Movie Night`,
      description: data.overview || "No description available.",
      openGraph: {
        title: data.title,
        description: data.overview,
        images: data.poster_path
          ? [{ url: `https://image.tmdb.org/t/p/w500${data.poster_path}` }]
          : undefined,
      },
    };
  } catch {
    return { title: "Movie Details - Movie Night" };
  }
}

export default async function MoviePage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  // Handle /movie/[id]
  if (slug.length === 1) {
    const id = slug[0];
    const data = await fetchMovieDetails(id);
    if (!data) notFound();

    const expectedSlug = slugify(data.title);
    permanentRedirect(`/movie/${expectedSlug}/${id}`);
  }

  // Handle /movie/[name]/[id]
  if (slug.length === 2) {
    const [name, id] = slug;
    const data = await fetchMovieDetails(id);
    if (!data) notFound();

    const expectedSlug = slugify(data.title);
    if (name !== expectedSlug) {
      permanentRedirect(`/movie/${expectedSlug}/${id}`);
    }

    return <MovieDetailsClient />;
  }

  notFound();
}
