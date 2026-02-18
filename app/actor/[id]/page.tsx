import { getActorById, MovieSummary } from "@/app/lib/tmdb";
import { Metadata } from "next";
import ActorDetailsClient from "./ActorDetailsClient";

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
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  try {
    const { id } = await params;
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

export default function ActorPage() {
  return <ActorDetailsClient />;
}
