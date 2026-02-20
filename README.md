<p align="center">
  <img src="./public/favicon.png" width="160" height="160" alt="Movie Night Logo" />
</p>

# 🎬 Movie Night

**Movie Night** is a premium, high-performance web application designed for cinema lovers. Discover trending films, explore detailed movie analytics, and watch the latest trailers through a stunning, cinematic interface built with **Next.js 15**, **Tailwind CSS**, and the **TMDB API**.

**Live Demo:** [https://movie-night-self.vercel.app](https://movie-night-self.vercel.app)

**📱 Mobile App:** Check out the React Native version of this project here: [Movie Night App](https://github.com/Abdo-omran2206/Movie-Night-App)

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel)](https://movie-night-self.vercel.app)

---

## 📝 Description

**Movie Night** brings the magic of cinema directly to your browser. It offers an intuitive and immersive interface for discovering, searching, and exploring the world of film. Whether you're hunting for the latest trending blockbusters, critically acclaimed masterpieces, or upcoming releases, Movie Night provides a comprehensive experience. Powered by the TMDB API, the app delivers detailed movie specifications, cast listings, ratings, and plot summaries in a beautiful, Netflix-inspired responsive UI.

---

## ✨ Features

### 🏠 Home Page

- **Cinematic Hero Slider**: Trending movies featured with high-quality backdrops.
- **Dynamic Categories**: Instant access to Top Rated, Popular, Upcoming, and Now Playing sections.
- **Glassmorphic UI**: Modern backdrop blur effects and premium typography.

### 🔍 Search & Discovery

- **Global Search**: Find any movie in the TMDB database instantly.
- **Real-time Results**: Fast API integration with dedicated loading states.
- **Pagination**: Seamlessly browse through thousands of search results.

### 📱 Movie Details

- **Full Analytics**: Ratings, runtime, release dates, and localized genre tags.
- **Interactive Trailers**: Integrated YouTube player for the latest movie clips.
- **Similar Recommendations**: AI-driven suggestions based on the current film.

### 👥 Cast & Crew

- **Actor Profiles**: Explore full biographies and personal facts.
- **Filmography**: Interactive lists of an actor's past and upcoming works.

### 🎨 Design & Experience

- **Skeleton Loading**: Enhanced UX with cinematic loading states across the app.
- **Fluid Responsiveness**: Optimized for Mobile, Tablet, and Desktop.
- **Animated Sidebar**: Premium slide-in menu with smooth backdrop transitions.
- **Micro-interactions**: Hover effects and icon animations using Tailwind and Swiper.js.
- **SEO Optimized**: Dynamic sitemaps, robots.txt, and structured metadata for maximum visibility.

---

## 🛠 Tech Stack

- **Core**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Interactions**: [Swiper.js](https://swiperjs.com/) & [React Icons](https://react-icons.github.io/react-icons/)
- **Data Architecture**: [The Movie Database (TMDB) API](https://www.themoviedb.org/)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 🚀 Getting Started

### 1. Prerequisites

- Node.js 18.x or later
- A TMDB API Key (Get one [here](https://www.themoviedb.org/documentation/api))

### 2. Installation

```bash
git clone https://github.com/Abdo-omran2206/Movie-Night.git
cd movie-night
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_API_KEY=your_tmdb_api_key
NEXT_PUBLIC_STREAM_API=your_streaming_api_url
```

### 4. Launch

```bash
npm run dev
```

---

## 🎨 Design System

### Color Palette

- **Background**: `#000000` (Pitch Black)
- **Primary Accent**: `#e50914` (Netflix Red)
- **Secondary**: `#b3b3b3` (Slate Gray)
- **Transitions**: 300ms ease-in-out

### Typography

- **Headers**: `Bebas Neue` (Cinematic, bold, and authoritative)
- **Body**: `Roboto Slab` (Readable, elegant, and modern)

---

## 🎯 Key Features Breakdown

### **API Integration**

- **Dynamic Fetching**: Custom hooks/utilities for handling TMDB endpoints.
- **Endpoints**: trending, top-rated, popular, upcoming, now-playing, search.
- **Error Boundaries**: Graceful handling of network failures and empty states.

### **URL Structure**

- Home: `/`
- Search: `/search?q=Inception&page=1`
- Category: `/category/top_rated?page=1`
- Genre: `/category/28` (Action), `/category/12` (Adventure), etc.
- Movie Details: `/movie/[slug]/[id]`
- TV Details: `/tv/[slug]/[id]`
- Actor Details: `/actor/[slug]/[id]`
- Player: `/player/[id]`

---

## 🚀 Future Enhancements

- [ ] User Authentication & Personalized Watchlists.
- [ ] Multi-language support (i18n).
- [ ] Offline caching with Service Workers.
- [ ] Enhanced social sharing features.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## 👤 Author

**Akira Omran**

- GitHub: [@Abdo-omran2206](https://github.com/Abdo-omran2206)
- Project Link: [Movie-Night](https://github.com/Abdo-omran2206/Movie-Night)

---

**Made with ❤️ for movie lovers everywhere** 🍿

_Powered by [The Movie Database (TMDB) API](https://www.themoviedb.org/)._
