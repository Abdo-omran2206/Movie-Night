export default function Sitemap() {
  return [
    {
      url: 'https://movie-night-app.vercel.app',
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: 'https://movie-night-app.vercel.app/movie/popular',
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: 'https://movie-night-app.vercel.app/movie/top_rated',
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: 'https://movie-night-app.vercel.app/movie/upcoming',
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: 'https://movie-night-app.vercel.app/movie/now_playing',
      lastModified: new Date(),
      priority: 0.8,
    },
  ];
}
