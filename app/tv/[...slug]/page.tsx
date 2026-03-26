import { fetchTvDetails } from "@/app/lib/tmdb";
import { Metadata } from "next";
import TvDetailsClient from "../TvDetailsClient";
import { slugify } from "@/app/lib/slugify";
import { permanentRedirect, notFound } from "next/navigation";
import { decodeId } from "@/app/lib/hash";
import { siteUrl, posterUrl, posterUrl780 } from "@/app/constant/main";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const encodedId = slug[0];
  const id = decodeId(encodedId);
  if (!id) return { title: "TV Show Not Found" };
  try {
    const data = await fetchTvDetails(id);
    if (!data) return { title: "TV Show Not Found" };

    return {
      title: `${data.name} (${data.first_air_date?.split("-")[0] || ""}) - Movie Night`,
      description: data.overview || "No description available.",

      alternates: {
        canonical: `${siteUrl}/tv/${data.id}/${slugify(
          data.name + "-" + (data.first_air_date?.split("-")[0] || ""),
        )}`,
      },

      openGraph: {
        title: data.name,
        description: data.overview,
        url: `${siteUrl}/tv/${data.id}/${slugify(
          data.name + "-" + (data.first_air_date?.split("-")[0] || ""),
        )}`,
        images: data.poster_path
          ? [
              {
                url: `${posterUrl780}${data.poster_path}`,
                width: 780,
                height: 1170,
                alt: data.name,
              },
            ]
          : undefined,
      },

      twitter: {
        card: "summary_large_image",
        title: data.name,
        description: data.overview,
        images: data.poster_path
          ? [`${posterUrl780}${data.poster_path}`]
          : [],
      },
    };
  } catch {
    return { title: "TV Show Details - Movie Night" };
  }
}

export default async function TvPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  const encodedId = slug[0];
  const id = decodeId(encodedId);
  if (!id) notFound();
  const data = await fetchTvDetails(id);
  if (!data) notFound();

  if (slug.length === 1) {
    const expectedSlug = slugify(
      data.name +
        "-" +
        (data.first_air_date ? data.first_air_date.split("-")[0] : ""),
    );

    permanentRedirect(`/tv/${encodedId}/${expectedSlug}`);
  }

  if (slug.length === 2) {
    const [, name] = slug;
    const expectedSlug = slugify(
      data.name +
        "-" +
        (data.first_air_date ? data.first_air_date.split("-")[0] : ""),
    );
    if (name !== expectedSlug) {
      permanentRedirect(`/tv/${encodedId}/${expectedSlug}`);
    }

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "TVSeries",
      name: data.name,
      description: data.overview,
      image: data.poster_path
        ? `${posterUrl}${data.poster_path}`
        : undefined,
      datePublished: data.first_air_date,
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: data.vote_average,
        bestRating: 10,
        ratingCount: data.vote_count,
      },
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <TvDetailsClient />
      </>
    );
  }

  notFound();
}
