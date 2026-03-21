import { MetadataRoute } from "next";

const BASE_URL = "https://mymovienight.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const categories = ["trending", "popular", "top_rated", "upcoming", "now_playing"];
  const pages = [1, 2, 3, 4, 5];

  const mainPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1,
    },
    {
      url: `${BASE_URL}/search`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/install`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...categories.flatMap((cat) =>
      pages.map((page) => ({
        url: `${BASE_URL}/category/${cat}${page > 1 ? `?page=${page}` : ""}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: page === 1 ? 0.8 : 0.6,
      }))
    ),
  ];

  return mainPages;
}
