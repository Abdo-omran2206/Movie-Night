import { fetchTvDetails } from "@/app/lib/tmdb";
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

  const id = slug.length >= 3 ? slug[slug.length - 3] : slug[slug.length - 1];
  const season = slug.length >= 3 ? slug[slug.length - 2] : "1";
  const episode = slug.length >= 3 ? slug[slug.length - 1] : "1";

  try {
    const data = await fetchTvDetails(id);
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

  // Expected format: /tv/player/[id]/[season]/[episode] (length = 3)

  if (slug.length < 3) {
    notFound();
  }

  // Handle /tv/player/[id]/[season]/[episode]
  if (slug.length === 3) {
    const [id, season, episode] = slug;

    // Validate that it exists
    const data = await fetchTvDetails(id);
    if (!data) notFound();

    const expectedSlug = slugify(data.name);
    permanentRedirect(`/tv/player/${expectedSlug}/${id}/${season}/${episode}`);
  }

  // Handle /tv/player/[name]/[id]/[season]/[episode]
  if (slug.length === 4) {
    const [name, id, season, episode] = slug;
    const data = await fetchTvDetails(id);
    if (!data) notFound();

    const expectedSlug = slugify(data.name);
    // You can enforce redirect to without name or with name. Let's redirect to without name or keep it
    if (name !== expectedSlug) {
      permanentRedirect(
        `/tv/player/${expectedSlug}/${id}/${season}/${episode}`,
      );
    }

    return <PlayerClient />;
  }

  return <PlayerClient />;
}
