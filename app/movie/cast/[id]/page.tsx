import CastClient from "../CastClient";
import { fetchMovieDetails } from "@/lib/services/tmdb";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { decodeId } from "@/lib/hash";
import { siteUrl } from "@/constant/main";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id: encodedId } = await params;

  const id = decodeId(encodedId);

  if (!id) return { title: "Cast Not Found" };

  const movie = await fetchMovieDetails(id);

  if (!movie) return { title: "Cast Not Found" };

  return {
    title: `${movie.title} Cast & Actors`,
    description: `Full cast list of ${movie.title}`,
    alternates: {
      canonical: `${siteUrl}/movie/cast/${encodedId}`,
    },
  };
}

export default async function CastPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: encodedId } = await params;

  const id = decodeId(encodedId);

  if (!id) notFound();

  const movie = await fetchMovieDetails(id);
  if (!movie) notFound();


  return (
    <CastClient data={movie} />
  );
}