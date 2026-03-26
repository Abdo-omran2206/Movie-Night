import { fetchMovies, getCategoryInfo } from "@/app/lib/tmdb";
import { Movie } from "@/app/constant/types";
import { Metadata } from "next";
import { encodeId } from "@/app/lib/hash";
import { slugify } from "@/app/lib/slugify";
import CategoryDetailsClient from "../CategoryDetailsClient";
import { siteUrl, posterUrl } from "@/app/constant/main";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const sParams = await searchParams;
  const currentPage = sParams.page ? parseInt(sParams.page) : 1;
  const { title: displayTitle } = getCategoryInfo(category);

  const title = `${displayTitle} - Page ${currentPage} - Movie Night`;
  const description = `Explore the best ${displayTitle} on Movie Night. Browse a wide selection of movies in the ${displayTitle} category, updated with the latest ratings and releases.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/category/${encodeURIComponent(category)}${currentPage > 1 ? `?page=${currentPage}` : ""}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/category/${encodeURIComponent(category)}`,
      type: "website",
      siteName: "Movie Night",
      images: [
        {
          url: `${siteUrl}/og-image.png`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { category } = await params;
  const sParams = await searchParams;
  const pageParam = sParams.page;
  const currentPage = pageParam ? parseInt(pageParam) : 1;

  const { endpoint, title: displayTitle } = getCategoryInfo(category);

  // Fetch data on the server for JSON-LD and initial render (SSR)
  const { results: movies, total_pages: totalPages } = await fetchMovies(
    endpoint,
    currentPage
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: displayTitle,
    description: `Explore ${displayTitle} on Movie Night.`,
    url: `${siteUrl}/category/${encodeURIComponent(category)}`,
    mainEntity: {
      "@type": "ItemList",
      name: displayTitle,
      numberOfItems: movies?.length || 0,
      itemListElement: (movies || []).map((movie: Movie, index: number) => {
        const title = movie.title || movie.name || movie.original_title || "Movie";
        const year = (movie.release_date || movie.first_air_date || "").split("-")[0];
        const slug = slugify(`${title}${year ? `-${year}` : ""}`);
        return {
          "@type": "ListItem",
          position: index + 1,
          url: `${siteUrl}/movie/${encodeId(movie.id)}/${slug}`,
          name: title,
          image: movie.poster_path
            ? `${posterUrl}${movie.poster_path}`
            : undefined,
        };
      }),
    },
  };

  return (
    <div className="overflow-x-hidden bg-black min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* CategoryDetailsClient handles the actual UI (CSR) just like MovieDetailsClient */}
      <CategoryDetailsClient initialMovies={movies} initialTotalPages={totalPages} />
    </div>
  );
}
