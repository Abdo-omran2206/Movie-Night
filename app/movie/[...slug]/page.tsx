import { fetchMovieDetails } from "@/app/lib/tmdb";
import { Metadata } from "next";
import MovieDetailsClient from "../MovieDetailsClient";
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

  // Expect first segment to be the encoded movie ID
  const encodedId = slug[0];
  const id = decodeId(encodedId);
  if (!id) notFound();
  const data = await fetchMovieDetails(id);
  if (!data) notFound();

  // If only the encoded ID is present, redirect to full slug URL
  if (slug.length === 1) {
    const expectedSlug = slugify(
      data.title +
        "-" +
        (data.release_date ? data.release_date.split("-")[0] : ""),
    );
    permanentRedirect(`/movie/${encodedId}/${expectedSlug}`);
  }

  // If both encoded ID and slug are present, validate slug
  if (slug.length === 2) {
    const [, name] = slug;
    const expectedSlug = slugify(
      data.title +
        "-" +
        (data.release_date ? data.release_date.split("-")[0] : ""),
    );
    if (name !== expectedSlug) {
      permanentRedirect(`/movie/${encodedId}/${expectedSlug}`);
    }
    return <MovieDetailsClient />;
  }

  notFound();
}
