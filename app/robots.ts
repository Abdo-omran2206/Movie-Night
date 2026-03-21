import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'],
    },
    sitemap: 'https://mymovienight.vercel.app/sitemap.xml',
    host: 'https://mymovienight.vercel.app',
  };
}
