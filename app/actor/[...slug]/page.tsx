import { getActorById, MovieSummary } from "@/app/lib/tmdb";
import { Metadata } from "next";
import ActorDetailsClient from "../ActorDetailsClient";
import { slugify } from "@/app/lib/slugify";
import { permanentRedirect, notFound } from "next/navigation";

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
  const id = slug[slug.length - 1];
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
  if (slug.length === 1) {
    const id = slug[0];
    const data = await getActorById(id);
    if (!data) notFound();
    const expectedSlug = slugify(data.name);
    if (slug[0] !== expectedSlug) {
      permanentRedirect(`/actor/${expectedSlug}/${id}`);
    }
  }
  // Handle /movie/[name]/[id]
  if (slug.length === 2) {
    const [name, id] = slug;
    const data = await getActorById(id);
    if (!data) notFound();

    const expectedSlug = slugify(data.name);
    if (name !== expectedSlug) {
      permanentRedirect(`/actor/${expectedSlug}/${id}`);
    }

    return <ActorDetailsClient />;
  }
  notFound();
}
