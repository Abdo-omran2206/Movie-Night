import { getActorById, MovieSummary } from "@/app/lib/tmdb";
import { Metadata } from "next";
import ActorDetailsClient from "../ActorDetailsClient";
import { slugify } from "@/app/lib/slugify";
import { permanentRedirect, notFound } from "next/navigation";
import { decodeId } from "@/app/lib/hash";

export interface ActorDetail {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  place_of_birth: string | null;
  profile_path: string | null;
  known_for_department: string;
  movie_credits?: {
    cast: MovieSummary[];
  };
  tv_credits?: {
    cast: MovieSummary[];
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const encodedId = slug[0];
  const id = decodeId(encodedId);
  if (!id) return { title: "Actor Not Found" };
  try {
    const data: ActorDetail = await getActorById(id);
    return {
      title: `${data.name} - Movie Night`,
      description: data.biography
        ? data.biography.slice(0, 160)
        : `Learn more about ${data.name} on Movie Night.`,
      openGraph: {
        title: `${data.name} - Movie Night`,
        description: data.biography
          ? data.biography.slice(0, 160)
          : `Learn more about ${data.name} on Movie Night.`,
        images: data.profile_path
          ? [
              {
                url: `https://image.tmdb.org/t/p/h632${data.profile_path}`,
                width: 632,
                height: 948,
                alt: data.name,
              },
            ]
          : undefined,
      },
    };
  } catch (error) {
    console.error("Failed to fetch actor details for metadata:", error);
    return {
      title: "Actor Profile - Movie Night",
      description: "Details about the selected actor.",
    };
  }
}

export default async function ActorPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const encodedId = slug[0];
  const id = decodeId(encodedId);
  if (!id) notFound();
  const data = await getActorById(id);
  if (!data) notFound();

  // Handle /actor/[id]
  if (slug.length === 1) {
    const expectedSlug = slugify(data.name);
    permanentRedirect(`/actor/${encodedId}/${expectedSlug}`);
  }

  // Handle /actor/[id]/[name]
  if (slug.length === 2) {
    const [, name] = slug;
    const expectedSlug = slugify(data.name);
    if (name !== expectedSlug) {
      permanentRedirect(`/actor/${encodedId}/${expectedSlug}`);
    }

    return <ActorDetailsClient />;
  }

  notFound();
}
