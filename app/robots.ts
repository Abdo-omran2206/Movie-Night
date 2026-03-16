import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'],
    },
    sitemap: 'https://movie-night-self.vercel.app/sitemap.xml',
    host: 'https://movie-night-self.vercel.app',
  };
}
