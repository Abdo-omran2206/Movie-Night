<p align="center">
  <img src="./public/favicon.png" width="160" height="160" alt="Movie Night Logo" />
</p>

# 🎬 Movie Night

**Movie Night** is a premium, high-performance web application designed for cinema lovers. Discover trending films, explore detailed movie analytics, and watch the latest trailers through a stunning, cinematic interface built with **Next.js 15**, **Tailwind CSS**, and the **TMDB API**. You can also install Movie Night as a web app for a faster, app-like experience from the dedicated install page.

**Live Demo:** [https://movienighthub.vercel.app/](https://movienighthub.vercel.app/)

**📱 Mobile App:** Check out the React Native version of this project here: [Movie Night App](https://github.com/Abdo-omran2206/Movie-Night-App)

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel)](https://mymovienight.vercel.app)

---

## 📝 Description

**Movie Night** brings the magic of cinema directly to your browser. It offers an intuitive and immersive interface for discovering, searching, and exploring the world of film. Whether you're hunting for the latest trending blockbusters, critically acclaimed masterpieces, or upcoming releases, Movie Night provides a comprehensive experience. Powered by the TMDB API, the app delivers detailed movie specifications, cast listings, ratings, and plot summaries in a beautiful, Netflix-inspired responsive UI.

---

## ✨ Features

### 🏠 Home Page & Categories

- **Cinematic Hero Slider**: Trending titles featured with high-quality backdrops.
- **Dynamic Categories**: Instant access to Top Rated, Popular, Upcoming, and Now Playing sections with a dynamic filter to seamlessly toggle between **Movies** and **TV Shows**.
- **Global Genres**: Explore specialized categories via our **Explore** and **Genres** desktop navigation dropdowns.
- **Regional Content**: Uses IP Geolocation (`ipwho.is`) to show regional trending content.
- **Remote Configuration**: Home page sections are dynamically driven by a **Supabase** backend.
- **Glassmorphic UI**: Modern backdrop blur effects, premium typography, and an interactive Sidebar & Desktop Navigation.

### 🧭 Explore Hub & Advanced Discovery

- **Premium Dual-Pane Layout**: A high-end discovery experience featuring a sticky, glassmorphic filter sidebar on desktop and a slide-over drawer for mobile.
- **Deep Filtering & Sorting**:
  - **Release Year & Rating**: Custom-styled range sliders for precise year and minimum vote average filtering.
  - **Global Library**: Discovery by **Production Region** (US, UK, JP, EG, etc.) and item **Original Language**.
  - **Enhanced Sorting**: Sort instantly by Popularity, Premiere Date, Vote Average, or Vote Count.
  - **Genre Precision**: Multi-select animated checkboxes for granular genre exploration.
- **Micro-animations**: Interactive hover states for checkboxes and sliders with dynamic gradient tracks.
- **Live Database Status**: Real-time feedback on discovery results and pulsing live status indicators.
- **Mobile Optimized**: A dedicated floating "Refine" button that triggers a full-screen filter overlay on small screens.

### 🔍 Search

- **Global Multi-Search**: Search seamlessly for movies, TV shows, and actors with real-time pagination and type filters.
- **Interactive Search Modal**: Premium inline search modal overlay for lightning-fast queries and visual results preview using mini-cards without leaving the current view.

### 📱 Movie & TV Show Details

- **Full Analytics**: Ratings, runtime, release dates, and localized genre tags.
- **Interactive Trailers**: Integrated YouTube player for the latest clips.
- **Immersive Posters**: Full-screen Image Viewer modal for inspecting posters and high-res promotional backdrops.
- **TV Series Support**: Full support for TV Seasons and Episodes with an interactive, seamless episode controller that updates the stream instantly without page reloads.
- **User Reviews**: Integrated reviews directly on details pages utilizing TMDB reviews API, displaying detailed feedback in custom reviews overlays (`ReviewCard`, `ReviewsModel`).
- **Similar Recommendations**: AI-driven suggestions based on the current film or show.

### 🔐 User Authentication & Dashboard

- **Secure Login & Registration**: Account registration and login flows (`/account/signup`, `/account/login`) utilizing secure custom authentication API routes.
- **Personalized Dashboard**: A dedicated `/dashboard` containing profile overviews, recent activity, and customized statistics (watchlist, completed titles).
- **Watchlist & History (Bookmarks)**: Save titles to "Watch Later" or mark them as "Completed" (History), persisted in Supabase and synchronized on your dashboard.
- **DiceBear Avatars**: Generates customized user avatars based on usernames.

### 🤖 NightGuide AI Assistant

- **Conversational Recommendations**: Ask for movie or TV show suggestions naturally via a floating widget on any page or through a dedicated fullscreen chat interface (`/nightguide`).
- **Smart Local Search**: The AI securely generates precise titles and release years, which are seamlessly matched with real TMDB data on the client‑side to guarantee valid links and posters, eliminating AI hallucinations.
- **Built-in Resilience**: Implements an advanced model fallback chain (automatically switching between `gemini-2.5-flash`, `gemini-2.5-flash-lite`, and `gemini-1.5-flash`) ensuring 100% uptime even during rate limits.
- **Premium Chat UI**: Glassmorphic, tailored chat bubbles with embedded movie mini-cards and interactive suggestions.

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
- **Backend & Database**: [Supabase](https://supabase.com/) & [ipwho.is](https://ipwho.is/)
- **AI Integration**: [Google Generative AI (Gemini)](https://ai.google.dev/)
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
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_KEY=your_supabase_anon_key
NEXT_PUBLIC_HASH_SALT=your_custom_hash_salt
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

### 4. Launch

```bash
npm run dev
```

### 5. Install the Mobile App

- Visit `/install` on the deployed site (`https://mymovienight.vercel.app/install`).
- Click the **Install App** button to be redirected to the latest download/store URL configured in Supabase.
- On supported browsers/devices, you can also use the native "Add to Home Screen" / install prompts for an app-like experience.

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

### **File Structure Tree (App Router)**

```
app/
├── about/
│   └── page.tsx                      # About page
├── account/
│   ├── login/
│   │   └── page.tsx                  # Login page
│   └── signup/
│       └── page.tsx                  # Signup page
├── actor/
│   ├── [...slug]/
│   │   └── page.tsx                  # Actor details (/actor/[hash]/[slug])
│   └── ActorDetailsClient.tsx
├── api/                              # Backend route handlers
│   ├── account/                      # Login, signup, logout API
│   ├── bookmark/                     # Watchlist & history bookmark API
│   ├── dashboard/                    # Stats and activity API
│   └── ...                           # Other metadata fetch routes
├── category/
│   ├── [category]/
│   │   └── page.tsx                  # Category/Genre grid (/category/[slug])
│   └── CategoryDetailsClient.tsx
├── dashboard/
│   └── page.tsx                      # User profile & watchlist dashboard
├── explore/
│   ├── page.tsx                      # Explore Hub page
│   └── ExploreClient.tsx
├── install/
│   └── page.tsx                      # Install guide page
├── movie/
│   ├── [...slug]/
│   │   └── page.tsx                  # Movie details (/movie/[hash]/[slug])
│   ├── cast/
│   │   └── [id]/
│   │       └── page.tsx              # Movie cast list (/movie/cast/[id])
│   ├── player/
│   │   ├── [...slug]/
│   │   │   └── page.tsx              # Movie player (/movie/player/[hash]/[slug])
│   │   └── PlayerClient.tsx
│   └── MovieDetailsClient.tsx
├── nightguide/
│   └── page.tsx                      # NightGuide AI Chat page
├── search/
│   └── page.tsx                      # Search results page
├── tv/
│   ├── [...slug]/
│   │   └── page.tsx                  # TV details (/tv/[hash]/[slug])
│   ├── cast/
│   │   └── [id]/
│   │       └── page.tsx              # TV cast list (/tv/cast/[id])
│   ├── player/
│   │   ├── [...slug]/
│   │   │   └── page.tsx              # TV Player (/tv/player/[hash]/[slug])
│   │   └── PlayerClient.tsx
│   ├── season/
│   │   ├── [...slug]/
│   │   │   └── page.tsx              # TV Season (/tv/season/[hash]/[seasonNum]/[slug])
│   │   └── SeasonDetailsClient.tsx
│   └── TvDetailsClient.tsx
├── layout.tsx                        # Root layout
├── page.tsx                          # Home page
└── globals.css                       # Global styles
```

---

## 🚀 Future Enhancements

- [x] User Authentication & Personalized Watchlists.
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
