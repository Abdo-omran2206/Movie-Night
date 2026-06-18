import TvCastPage from "../CastClient";
import { fetchTvDetails } from "@/lib/services/tmdb";
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

  const tv = await fetchTvDetails(id);

  if (!tv) return { title: "Cast Not Found" };

  return {
    title: `${tv.name} Cast & Actors`,
    description: `Full cast list of ${tv.name}`,
    alternates: {
      canonical: `${siteUrl}/tv/cast/${encodedId}`,
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

  const tv = await fetchTvDetails(id);
  if (!tv) notFound();

  return <TvCastPage data={tv} />;
}
