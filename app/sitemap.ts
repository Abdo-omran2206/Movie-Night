import { MetadataRoute } from "next";

const BASE_URL = "https://movie-night-self.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${BASE_URL}/sitemaps/pages/sitemap.xml`,
      lastModified: new Date(),
    },
    {
      url: `${BASE_URL}/sitemaps/movies/sitemap.xml`,
      lastModified: new Date(),
    },
    {
      url: `${BASE_URL}/sitemaps/tv/sitemap.xml`,
      lastModified: new Date(),
    },
    {
      url: `${BASE_URL}/sitemaps/actors/sitemap.xml`,
      lastModified: new Date(),
    },
  ];
}
