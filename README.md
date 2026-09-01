<p align="center">
  <img src="./public/favicon.png" width="160" height="160" alt="Movie Night Logo" />
</p>

# 🎬 Movie Night

**Movie Night** is a premium, high-performance web application for cinema lovers. Discover trending films, binge-worthy TV series, and explore actor filmographies through a stunning cinematic interface. Powered by **Next.js 16**, **React 19**, **Tailwind CSS 4**, **TMDB API**, and **Google Gemini AI** — installable as an Android APK or a Progressive Web App (PWA).

**Live Site:** [https://movienighthub.vercel.app](https://movienighthub.vercel.app)

**📱 Android App:** Available via the [Install Page](https://movienighthub.vercel.app/install) — download the native `.apk` or install as a PWA.

**📱 React Native Version:** [Movie Night App](https://github.com/Abdo-omran2206/Movie-Night-App)

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-NightGuide-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)

---

## 📝 Description

**Movie Night** brings the full magic of cinema to your browser — and your home screen. It provides an immersive interface for discovering, searching, and exploring movies, TV shows, and actors. Whether you want tonight's trending blockbuster, a classic series, or a niche indie gem, Movie Night delivers. Powered by TMDB API, Google Gemini AI, and Supabase, it offers a Netflix-inspired dark UI with advanced filtering, AI recommendations, personal watchlists, community playlists, and native Android APK support.

---

## ✨ Features

### 🏠 Home Page & Categories

- **Cinematic Hero Slider**: Trending titles featured with high-quality TMDB backdrops using Swiper.js (autoplay, infinite loop, navigation).
- **Dynamic Sections**: IP-geolocated sections (e.g., "Trending in Egypt") powered by Supabase `sections_content` table with per-region configuration.
- **Category Navigation**: Instant access to Top Rated, Popular, Upcoming, Airing Today, Now Playing — toggling seamlessly between Movies and TV Shows.
- **Genre Shortcuts**: 19 genre categories accessible via glassmorphic navbar dropdowns and the sidebar.
- **Remote Configuration**: Sections are configurable per-region from Supabase; hardcoded fallback ensures resilience.

### 🧭 Explore Hub & Advanced Discovery (`/explore`)

- **Dual-Pane Layout**: Sticky glassmorphic sidebar on desktop; slide-over drawer with floating "Refine" button on mobile.
- **Deep Filtering**:
  - Release Year & Min Rating via custom range sliders
  - Genre multi-select with animated checkboxes
  - Production Region & Content Language dropdowns
  - Sorting by Popularity, Release Date, Vote Average, Vote Count
- **Live Status**: Pulsing "Live Database" indicator and dynamic result count.
- **Responsive Grid**: 2 columns mobile → 5 columns on large screens.

### 🔍 Search (`/search`)

- **Multi-mode Search**: Search for Movies, TV Shows, Actors, or All — selectable via dropdown.
- **URL-synced State**: `?q=`, `?page=`, `?type=` query params — back/forward navigation works.
- **Interactive Modal**: Inline search overlay for instant results without leaving the current page.

### 📱 Movie & TV Show Details

- **Full Analytics**: Ratings, runtime, release dates, genre tags, vote count, overview.
- **Interactive Trailers**: YouTube embed modal triggered by "Watch Trailer" CTA.
- **Immersive Viewer**: Full-screen image viewer for posters and promotional backdrops.
- **TV Series Support**: Full season/episode breakdown with an interactive episode controller — episodes switch without page reload via `replaceState`.
- **User Reviews**: TMDB reviews rendered in `ReviewCard` / `ReviewsModel` overlays on detail pages.
- **Similar & Recommended**: Mini-card carousels for recommended and similar titles.

### 📺 Streaming Player

- **Movie Player** (`/movie/player/[hash]/[slug]`): Embeds stream from multiple providers pulled from Supabase `stream_urls`.
- **TV Player** (`/tv/player/[hash]/[slug]/[season]/[episode]`): 4-part slug routing; interactive season/episode picker with `replaceState` URL updates.
- **Multi-source Switching**: Row of provider buttons — users switch streams without reloading.
- **Dynamic Titles**: Browser tab title updates to `Watch {Title} S{season} E{episode} – Movie Night`.

### 🎵 Playlists (`/playlist`)

- **Public Playlists**: Community playlist discovery page — browse curated movie/TV lists from other users.
- **Personal Playlists** (`/playlist/[id]`): Individual playlist detail view with shareable link.
- **Share Feature** (`/playlist/share`): Share playlists with unique URLs.
- **Dashboard Integration**: Create, manage, and classify playlists directly from the user dashboard.

### 📦 Install Page (`/install`)

- **Android APK**: Primary download — native `.apk` file for Android with version info, specs, and 3-step install guide (Allow Unknown Sources → Download → Install).
- **PWA Alternative**: Step-by-step PWA install guides for iOS (Safari), Android Chrome, and Desktop (Chrome/Edge).
- **Dynamic Version**: App version and download URL pulled live from Supabase `app_config`.
- **Cinematic Background**: Styled with `install_page_background.png` as a full-screen fixed backdrop.

### 🤖 NightGuide AI Assistant

- **Floating Widget**: Globally available on all pages (hidden on `/nightguide` full-screen page).
- **Dedicated Page** (`/nightguide`): Full-screen glassmorphic chat experience.
- **Hallucination-Free**: AI returns only Titles + Years; client-side TMDB lookup resolves actual posters and links via `ChatMovieCard`.
- **Model Fallback Chain**: `gemini-2.5-flash` → `gemini-2.5-flash-lite` → `gemini-1.5-flash` for 100% uptime under rate limits.

### 🔐 User Authentication & Dashboard

- **Auth**: Secure sign-up (`/account/signup`) and login (`/account/login`) via custom API routes.
- **Dashboard** (`/dashboard`): Profile overview, watchlist stats, recent activity feed.
- **Watchlist Status Tracking**: 4 states — `Watch Later`, `Watching`, `Completed`, `Dropped`.
- **Bookmark API**: `/api/bookmark` persists all watchlist state to Supabase.
- **DiceBear Avatars**: Auto-generated from username.
- **Playlist Management**: Create and manage personal playlists from the dashboard.

### 🧑‍🎤 Cast & Crew (`/actor`, `/movie/cast`, `/tv/cast`)

- **Actor Profiles**: Full bio, birthday, birthplace, department, profile image.
- **Filmography**: Interactive `MovieMiniCard` grid of all known credits.

### 🛡️ Maintenance Mode

- **Remote Control**: `force_stop` flag in Supabase `app_config` triggers a full-site maintenance page.
- **Platform Targeting**: Can target `"website"` or `"all"` platforms.
- **Branded Screen**: Animated NightGuide mascot (floating + pulse ring), shimmer headline, film-strip top/bottom bars, and custom `force_message` from Supabase.

### 🎨 Design System & UX

- **Fonts**: `Bebas Neue` (cinematic headers) + `Roboto Slab` (body text) via Google Fonts.
- **Dark Aesthetic**: Near-black `#070707` base with red accent (`#e50914` / Tailwind `red-600`).
- **Glassmorphism**: `backdrop-blur`, semi-transparent panels, and border highlights throughout.
- **Skeleton Loading**: Cinematic loading states on every async page.
- **Micro-animations**: Hover lifts, scale transforms, glow pulses, and shimmer effects.
- **Responsive**: Mobile-first, scales across all screen sizes.

### 🔍 SEO & Sitemaps

- **Dynamic Sitemaps**: Segmented sitemap index with `/sitemaps/pages`, `/sitemaps/movies`, `/sitemaps/tv`, `/sitemaps/actors`.
- **Robots.txt**: Configured to disallow `/api/`, `/account/`, `/dashboard/`.
- **Structured Data**: JSON-LD `WebSite` + `SearchAction` schema in root layout.
- **Metadata API**: Full per-page OpenGraph, Twitter cards, canonical URLs, and keyword sets.
- **About Page**: Fully structured `AboutPage` + `Organization` JSON-LD schema.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) — App Router, Server Components |
| UI Library | [React 19](https://react.dev/) |
| Language | [TypeScript 5](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) |
| Database & Auth | [Supabase](https://supabase.com/) (`@supabase/supabase-js`, `@supabase/ssr`) |
| AI | [Google Generative AI — Gemini](https://ai.google.dev/) (`@google/generative-ai`) |
| Data | [TMDB API](https://www.themoviedb.org/) |
| State | [Zustand 5](https://zustand-demo.pmnd.rs/) |
| Carousel | [Swiper.js 12](https://swiperjs.com/) |
| Icons | [React Icons 5](https://react-icons.github.io/react-icons/) |
| Skeletons | [react-loading-skeleton](https://github.com/dvtng/react-loading-skeleton) |
| Toasts | [react-toastify](https://fkhadra.github.io/react-toastify/) |
| Avatars | [DiceBear](https://www.dicebear.com/) (`@dicebear/core`, `@dicebear/collection`) |
| Hashing | [hashids](https://hashids.org/) + [slugify](https://github.com/simov/slugify) |
| Geolocation | [ipwho.is](https://ipwho.is/) + fallbacks (`ipapi.co`, Cloudflare) |
| Deployment | [Vercel](https://vercel.com/) |

---

## 🚀 Getting Started

### 1. Prerequisites

- Node.js 18.x or later
- A TMDB API Key — [Get one here](https://www.themoviedb.org/documentation/api)
- A Supabase project — [supabase.com](https://supabase.com/)
- A Google Gemini API Key — [ai.google.dev](https://ai.google.dev/)

### 2. Clone & Install

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

### 4. Launch Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Install the App

- **Android APK**: Visit `/install` on the live site → download the `.apk` → allow unknown sources → install.
- **PWA (iOS Safari)**: Tap Share → "Add to Home Screen".
- **PWA (Android Chrome / Desktop)**: Tap the install prompt or the address bar install icon.

---

## 🗂 File Structure (App Router)

```
app/
├── about/                            # About page (JSON-LD, team info, FAQ)
├── account/
│   ├── login/                        # Login page
│   └── signup/                       # Registration page
├── actor/
│   └── [...slug]/                    # Actor details (/actor/[hash]/[slug])
├── api/
│   ├── account/                      # Login, signup, logout API routes
│   ├── bookmark/                     # Watchlist & history bookmark API
│   ├── dashboard/
│   │   └── playlist/                 # Playlist CRUD & public listing API
│   └── ...                           # Other data fetch routes
├── category/
│   └── [category]/                   # Category/Genre grid (/category/[slug])
├── dashboard/                        # User profile, watchlist, playlists
├── explore/                          # Explore Hub with advanced filters
├── install/                          # Android APK + PWA install guide
├── movie/
│   ├── [...slug]/                    # Movie details (/movie/[hash]/[slug])
│   ├── cast/[id]/                    # Full cast page
│   └── player/[...slug]/             # Movie player (/movie/player/[hash]/[slug])
├── nightguide/                       # NightGuide AI full-screen chat
├── playlist/
│   ├── page.tsx                      # Public playlists listing
│   ├── [id]/                         # Individual playlist view
│   └── share/                        # Shareable playlist link handler
├── search/                           # Search results page
├── sitemaps/
│   ├── pages/sitemap.ts              # Static pages sitemap
│   ├── movies/sitemap.ts             # Dynamic movies sitemap
│   ├── tv/sitemap.ts                 # Dynamic TV shows sitemap
│   └── actors/sitemap.ts             # Dynamic actors sitemap
├── tv/
│   ├── [...slug]/                    # TV details (/tv/[hash]/[slug])
│   ├── cast/[id]/                    # TV full cast page
│   ├── player/[...slug]/             # TV player (/tv/player/[hash]/[slug]/[s]/[e])
│   └── season/[...slug]/             # TV season detail page
├── globals.css                       # Global styles
├── layout.tsx                        # Root layout — maintenance mode, metadata, fonts
├── loading.tsx                       # Global loading state
├── not-found.tsx                     # 404 page
├── page.tsx                          # Home page
└── robots.ts                         # robots.txt configuration
```

---

## 🗄 Supabase Tables

| Table | Purpose |
|---|---|
| `app_config` | Global config: `force_stop`, `force_message`, `platform`, `latest_app_version`, `app_release_url` |
| `sections_content` | Per-region home page section configuration |
| `stream_urls` | Streaming provider domains and URL templates |
| `bookmarks` | User watchlist & history entries |
| `playlists` | User-created public/private movie/TV playlists |

---

## 🎨 Design System

### Color Palette

| Token | Value |
|---|---|
| Background | `#070707` |
| Primary Accent | `#dc2626` (Tailwind `red-600`) |
| Red Glow | `rgba(239, 68, 68, 0.2)` |
| Card Surface | `neutral-900/70` + `backdrop-blur-xl` |
| Text Primary | `#ffffff` |
| Text Secondary | `gray-300` / `gray-400` |

### Typography

- **Headers**: `Bebas Neue` — cinematic, wide, authoritative
- **Body**: `Roboto Slab` — clean, readable, elegant

---

## 🚀 Future Enhancements

- [x] User Authentication & Personalized Watchlists
- [x] NightGuide AI Chat Assistant
- [x] Community Playlists
- [x] Android APK + PWA Install Page
- [x] Dynamic Sitemaps & SEO Metadata
- [x] Remote Maintenance Mode (Supabase-driven)
- [ ] Multi-language support (i18n)
- [ ] Offline caching with Service Workers
- [ ] Enhanced social sharing features

---

## 🤝 Contributing

Contributions are always welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👤 Author

**Akira Omran**

- GitHub: [@Abdo-omran2206](https://github.com/Abdo-omran2206)
- LinkedIn: [abdalla-omran](https://www.linkedin.com/in/abdalla-omran-388572361/)
- Reddit: [r/myMovieNight](https://www.reddit.com/r/myMovieNight/)
- Discord: [Join Server](https://discord.gg/yep7xvZj)
- Project: [Movie-Night](https://github.com/Abdo-omran2206/Movie-Night)

---

**Made with ❤️ for movie lovers everywhere** 🍿

_Powered by [The Movie Database (TMDB) API](https://www.themoviedb.org/)_
