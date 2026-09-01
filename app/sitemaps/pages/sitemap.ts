import { MetadataRoute } from "next";
import { siteUrl } from "@/constant/main";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const categories = [
      "trending",
      "popular",
      "top_rated",
      "upcoming",
      "now_playing",
      "action",
      "adventure",
      "animation",
      "comedy",
      "crime",
      "documentary",
      "drama",
      "family",
      "fantasy",
      "history",
      "horror",
      "music",
      "mystery",
      "romance",
      "science-fiction",
      "tv-movie",
      "thriller",
      "war",
      "western",
    ];
    const pages = [1, 2, 3, 4, 5];

    const staticPages: MetadataRoute.Sitemap = [
      {
        url: siteUrl,
        lastModified: new Date(),
        changeFrequency: "always",
        priority: 1.0,
      },
      {
        url: `${siteUrl}/explore`,
        lastModified: new Date(),
        changeFrequency: "always",
        priority: 0.9,
      },
      {
        url: `${siteUrl}/nightguide`,
        lastModified: new Date(),
        changeFrequency: "always",
        priority: 0.9,
      },
      {
        url: `${siteUrl}/search`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.8,
      },
      {
        url: `${siteUrl}/about`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      },
      {
        url: `${siteUrl}/install`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      },
      {
        url: `${siteUrl}/account/login`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.4,
      },
      {
        url: `${siteUrl}/account/signup`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.4,
      },
    ];

    const categoryPages: MetadataRoute.Sitemap = categories.flatMap((cat) =>
      pages.map((page) => ({
        url: `${siteUrl}/category/${cat}${page > 1 ? `?page=${page}` : ""}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: page === 1 ? 0.8 : 0.6,
      }))
    );

    return [...staticPages, ...categoryPages];
  } catch (error) {
    console.error("Error generating pages sitemap:", error);
    return [
      {
        url: siteUrl,
        lastModified: new Date(),
        changeFrequency: "always",
        priority: 1.0,
      },
    ];
  }
}

