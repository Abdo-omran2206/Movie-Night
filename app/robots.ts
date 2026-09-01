import { MetadataRoute } from "next";
import { siteUrl } from "@/constant/main";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/account/", "/dashboard/"],
      },
    ],
    sitemap: [
      `${siteUrl}/sitemap.xml`,
      `${siteUrl}/sitemaps/pages/sitemap.xml`,
      `${siteUrl}/sitemaps/movies/sitemap.xml`,
      `${siteUrl}/sitemaps/tv/sitemap.xml`,
      `${siteUrl}/sitemaps/actors/sitemap.xml`,
    ],
    host: siteUrl,
  };
}

