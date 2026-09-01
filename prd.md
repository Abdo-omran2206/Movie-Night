## Product Requirements Document (PRD) – Movie Night Web App

**Last Updated:** September 2026  
**Version:** 2.0

---

### 1. Overview

- **Product name**: Movie Night
- **Platform**: Web (Next.js 16 App Router) + Android APK + PWA
- **Live URL**: `https://movienighthub.vercel.app`
- **Primary purpose**: Help movie and TV show enthusiasts discover, explore, and watch content through a cinematic, Netflix-style interface powered by TMDB and third-party streaming providers.
- **Target users**:
  - Casual viewers who want quick AI-powered recommendations and trending titles for movies and TV shows.
  - Enthusiasts who care about cast, crew, analytics, ratings, and filmography.
  - Users who want to watch content directly via integrated streaming providers.
  - Community users who want to create and share movie playlists with others.
  - Mobile users who want a native Android APK or installable PWA experience.

---

### 2. Objectives & Success Metrics

- **Objectives**
  - Provide a fast, delightful browsing and discovery experience for movies and TV shows.
  - Offer rich movie/TV/actor detail pages with trailers, cast, recommendations, reviews, and filmography.
  - Enable users to watch selected movies and TV episodes via embedded streaming providers.
  - Allow users to manage personal watchlists (Watch Later, Watching, Completed, Dropped) and community playlists.
  - Maintain strong SEO and shareability to attract organic traffic.
  - Provide an Android APK and PWA download to extend reach to mobile-native users.
  - Allow remote maintenance control via Supabase without code deployments.

- **Success metrics**
  - Time to first meaningful interaction (home page fully interactive) ≤ 3s on modern devices.
  - Search to result display ≤ 2s p95 under normal network conditions.
  - ≥ 60% of sessions include at least one detail page view.
  - Bounce rate on movie detail pages < 40%.
  - Uptime of external API calls (TMDB + Supabase) ≥ 99% over a rolling 30 days.
  - NightGuide AI uptime ≥ 99% (enforced by model fallback chain).

---

### 3. Core User Flows

1. **Browse home & trending**
   - User lands on `/`.
   - Sees hero banner slider of trending movies (TMDB `/trending/movie/week`).
   - IP geolocation (`ipwho.is` with fallbacks to `ipapi.co`, Cloudflare) determines regional section displayed (e.g., "Trending in Egypt").
   - Scrolls through horizontally scrollable `MovieCard` sections configured via Supabase `sections_content`.

2. **View movie or TV details**
   - User visits `/movie/[hash]/[slug]` or `/tv/[hash]/[slug]`.
   - App fetches TMDB details with `append_to_response=credits,similar,videos,recommendations,keywords`.
   - Page shows poster/backdrop, title, release date, runtime, rating, genres, overview.
   - User can open trailers, full cast, reviews, recommendations, and "Watch Now".

3. **Watch content**
   - User clicks "Watch Now" → navigated to `/movie/player/[hash]/[slug]` or `/tv/player/[hash]/[slug]/[season]/[episode]`.
   - Streaming sources fetched from Supabase `stream_urls` table; multiple providers available.
   - TV shows have an interactive season/episode picker — switching episodes updates URL via `replaceState` without page reload.

4. **Search content**
   - User types query; results appear on `/search?q=...&type=multi&page=1`.
   - Supports movie, TV, actor, or multi-search mode.
   - URL is fully synced — supports browser back/forward.

5. **Explore Hub discovery**
   - User visits `/explore`.
   - Adjusts filters: Year range, Min Rating, Genres (multi-select), Region, Language, Sort Order.
   - Results update live in a responsive grid.
   - On mobile, "Refine" floating button opens a full-screen filter drawer.

6. **Ask NightGuide AI**
   - User opens floating NightGuide widget or navigates to `/nightguide`.
   - Types a prompt (e.g., "Recommend a dark thriller from 2015").
   - Gemini AI returns `🎬 **Title** (Year)` formatted recommendations.
   - Client parses and fetches TMDB data to render `ChatMovieCard` — no hallucinated IDs.
   - If the primary model (`gemini-2.5-flash`) fails, automatically falls back through `gemini-2.5-flash-lite` → `gemini-1.5-flash`.

7. **User authentication & watchlist**
   - User registers/logs in via `/account/signup` or `/account/login`.
   - Dashboard at `/dashboard` shows stats, recent activity, and watchlist tabs.
   - Bookmarks save via `/api/bookmark` with status: `Watch Later`, `Watching`, `Completed`, `Dropped`.
   - DiceBear avatars auto-generated from username.

8. **Community playlists**
   - User browses public playlists at `/playlist`.
   - Views a specific playlist at `/playlist/[id]`.
   - Shares a playlist via `/playlist/share` unique URL.
   - Authenticated users can create and manage personal playlists from `/dashboard`.

9. **Install the app**
   - User visits `/install`.
   - **Primary option**: Downloads the Android `.apk` — version number and download URL are pulled from Supabase `app_config` (`latest_app_version`, `app_release_url`).
   - **Alternative option**: Step-by-step PWA installation guides for iOS (Safari), Android Chrome, and Desktop (Chrome/Edge).

10. **Maintenance mode**
    - Admin sets `force_stop = true` and `platform = "website"` or `"all"` in Supabase `app_config`.
    - Root layout detects this at render time and replaces the entire site with a branded maintenance screen.
    - Screen shows: NightGuide mascot (animated float + pulse ring), shimmer headline, custom `force_message`, film strip bars.

---

### 4. Functional Requirements

#### 4.1 Navigation & Layout

- **Navbar** — fixed at top on all primary pages:
  - Mobile hamburger → animated sidebar.
  - Logo linking to `/`.
  - Desktop nav links: Home, Discover (`/explore`), Night Guide (`/nightguide`), Install App (`/install`), About (`/about`).
  - Glassmorphic dropdowns for **Explore** (Trending, Top Rated, Popular, Upcoming, Now Playing) and **Genres** (19 categories).
  - Search input navigating to `/search`.
- **Sidebar** — slide-in menu with key nav links and genre shortcuts.
- **Footer** — present on main content pages; contains TMDB attribution, social media links, and `/install` link.

#### 4.2 Home Page (`/`)

- Hero banner Swiper carousel with autoplay (~5s), loop, arrows, pagination dots.
- Sections dynamically loaded from Supabase `sections_content` filtered by user's detected region.
- Each section: horizontal `MovieCard` list + "View all" link → `/category/[slug]`.
- Geolocation: `ipwho.is` primary, `ipapi.co` + Cloudflare as fallbacks.
- Skeleton loading states during data fetch.

#### 4.3 Search (`/search`)

- URL params: `q`, `page` (default 1), `type` (default `"multi"`).
- Search modes: `multi`, `movie`, `tv`, `person`.
- URL-synced state: back/forward navigation preserved.
- Responsive grid of `MovieCard`s or `SearchItem`s.
- Pagination with Prev/Next and page indicator.

#### 4.4 Category & Genre (`/category/[category]`)

- Slug resolvers: `trending` → `/trending/{mediaType}/week`, `top_rated`, `popular`, `upcoming`, `now_playing`.
- Numeric slug → genre ID → `/discover/{mediaType}?with_genres={id}`.
- `type` query param toggles between `movie` and `tv`.
- Pagination synced with URL, smooth scroll-to-top on change.
- Media type dropdown filter in page header.

#### 4.5 Movie Details (`/movie/[hash]/[slug]`)

- Single TMDB fetch with `append_to_response=credits,similar,videos,recommendations,keywords`.
- Hero: backdrop/poster background, dark overlay, foreground content (poster, title, date, runtime, rating, genres, overview).
- CTAs: "Watch Now" (`/movie/player/...`) or "Coming Soon" if `runtime === 0`; "Watch Trailer" modal.
- Cast carousel (top N cast) + "Full Cast" link → `/movie/cast/[id]`.
- Reviews modal via TMDB reviews API.
- Recommendations and Similar Movies mini-card grids.

#### 4.6 TV Details (`/tv/[hash]/[slug]`)

- Same structure as movie details.
- TV player navigates to `/tv/player/[hash]/[slug]/[season]/[episode]`.
- Full season/episode structure; cast and crew breakdowns.

#### 4.7 Full Cast (`/movie/cast/[id]` and `/tv/cast/[id]`)

- Fetches `credits` from TMDB.
- `CastList` component in scrollable container.
- Title, subtitle (media title + year), accent divider.

#### 4.8 Actor Details (`/actor/[hash]/[slug]`)

- Fetches `/person/{id}?append_to_response=movie_credits,images`.
- Profile portrait + personal info card (known for, birthday, birthplace).
- Biography text.
- Filmography grid via `MovieMiniCard` from `movie_credits.cast`.

#### 4.9 Movie Player (`/movie/player/[hash]/[slug]`)

- Fetches movie details; sets browser tab title dynamically.
- Stream sources from Supabase `stream_urls` (`{id}` template substitution).
- Provider buttons row; active source highlighted.
- 16:9 iframe with `allowFullScreen`.
- Source switching updates iframe `src` via React state — no page reload.

#### 4.10 TV Player (`/tv/player/[hash]/[slug]/[season]/[episode]`)

- 4-part catch-all slug: `[encodedId]/[expectedSlug]/[season]/[episode]`.
- Stream URLs use `{id}`, `{s}`, `{e}` template substitution from Supabase.
- Interactive Episodes controller: horizontal season tabs + responsive episode grid.
- Clicking an episode calls `window.history.replaceState` to update the URL without reload.
- Browser title: `Watch {Title} S{season} E{episode} – Movie Night`.

#### 4.11 NightGuide AI Assistant

- **Floating Widget**: Globally rendered via `DynamicNightGuide` (lazy-loaded, hidden on `/nightguide`).
- **Full-screen Page** (`/nightguide`): Glassmorphic chat input, slide-in message animations, `ChatMovieCard` for visual results.
- **AI Prompt**: Strictly constrained to output `(🎬|📺) **Title** (Year)` format; no TMDB IDs.
- **MessageParser**: Regex parses AI output; triggers TMDB search; renders `ChatMovieCard` per match.
- **Fallback Chain**: `gemini-2.5-flash` → `gemini-2.5-flash-lite` → `gemini-1.5-flash`.

#### 4.12 Explore Hub (`/explore`)

- TMDB `/discover/{mediaType}` endpoint with live filter state.
- Filter state: `mediaType`, `year`, `minRating`, `genreIds[]`, `region`, `language`, `sortBy`.
- Desktop: dual-pane with sticky `<aside>` sidebar.
- Mobile: floating "Refine" button at `z-45` → full-screen drawer overlay.
- Closing the drawer auto-dismisses on media toggle or reset.
- Result grid: 2 → 5 columns responsive, `MovieCard` components.

#### 4.13 User Authentication (`/account/login`, `/account/signup`)

- Custom API routes: `/api/account/login`, `/api/account/signup`, `/api/account/logout`.
- Sessions stored via Supabase; protected routes check auth state.
- DiceBear avatar generated client-side from username.

#### 4.14 User Dashboard (`/dashboard`)

- Tabs: **Profile Overview** and **Watchlist**.
- Stats: count of Watch Later, Watching, Completed, Dropped items.
- Recent Activity feed using `DashboardMovieCard`.
- Watchlist manager with status filter (All / Completed / Watching / Watch Later / Dropped).
- **Playlist Management**: Create, edit, and delete personal playlists; toggle public/private.

#### 4.15 Playlists (`/playlist`, `/playlist/[id]`, `/playlist/share`)

- **Public Listing** (`/playlist`): Fetches all public playlists from `/api/dashboard/playlist/public`. Skeleton loading + empty state. `PlaylistCard` grid (3 columns on desktop).
- **Playlist Detail** (`/playlist/[id]`): Full list of movies/TV shows in the playlist with their cards, title, description, visibility.
- **Shareable Links** (`/playlist/share`): Unique sharable URL for any playlist; accessible without authentication.
- **Dashboard API**: `/api/dashboard/playlist/` handles CRUD operations for authenticated users.

#### 4.16 Install Page (`/install`)

- **Android APK (Primary)**:
  - Version number and download URL from Supabase `app_config.latest_app_version` and `app_config.app_release_url`.
  - Displays Android version requirements, APK size specs.
  - 3-step guide: Allow Unknown Sources → Download APK → Install.
  - Direct download + direct link buttons.
- **PWA Guides (Alternative)**:
  - iOS Safari: step-by-step Share → Add to Home Screen.
  - Android Chrome: Install prompt or address bar icon.
  - Desktop Chrome/Edge: address bar install icon or `...` menu.
- **Background**: `install_page_background.png` as full-screen fixed cinematic backdrop.
- Supabase fetch wrapped in try/catch; falls back to `v1.0.0` and GitHub releases URL.

#### 4.17 About Page (`/about`)

- Metadata: `title`, `description`, `keywords`, canonical URL, OpenGraph, Twitter card.
- JSON-LD: `AboutPage` + `Organization` schema.
- Sections: Hero, Stats (1M+ movies, 500K+ actors, 25+ genres, 100% free), Mission, Features Grid (6 cards), How It Works (3 steps), Tech Stack badges, FAQ (4 items), Community (social media links), CTA.
- Same cinematic background as install page.

#### 4.18 Maintenance Mode (Root Layout)

- Supabase `app_config` query on every root layout render.
- Condition: `force_stop === true && (platform === "website" || platform === "all")`.
- Wrapped in `try/catch`; network failures render the app normally (fail open).
- Maintenance screen replaces entire site:
  - Film strip bars (top & bottom).
  - Floating NightGuide mascot (`NightGuide.png`) with CSS `float` animation + `pulse-ring` pseudo-element.
  - MN logo (`favicon.png`) brand anchor at top.
  - Shimmer text headline ("We'll Be Back Soon!").
  - Dynamic `force_message` from Supabase.
  - Animated live status badge.
  - Footer with auto-updating copyright year.
- `<meta name="robots" content="noindex, nofollow">` injected during maintenance.

#### 4.19 SEO & Sitemaps

- **`robots.ts`**: Disallows `/api/`, `/account/`, `/dashboard/`. References all 5 sitemap URLs.
- **`/sitemaps/pages/sitemap.ts`**: Static pages including `/`, `/about`, `/install`, `/nightguide`, `/explore`, `/account/login`, `/account/signup`, all genre categories.
- **`/sitemaps/movies/sitemap.ts`**: Dynamic TMDB popular movies → `/movie/player/[hash]/[slug]` URLs.
- **`/sitemaps/tv/sitemap.ts`**: Dynamic TMDB popular TV → `/tv/player/[hash]/[slug]/1/1` URLs.
- **`/sitemaps/actors/sitemap.ts`**: Dynamic TMDB popular persons → `/actor/[hash]/[slug]` URLs.
- All sitemaps wrapped in `try/catch` for resilience.
- **`public/sitemap.xml`**: Master sitemap index pointing to all sub-sitemaps on production domain.

---

### 5. Non-Functional Requirements

#### 5.1 Performance

- Server Components for all static/data-fetching pages; Client Components only for interactive features.
- `next/image` for all TMDB images with `w500`/`w1280` sizes, lazy loading, responsive srcset.
- Skeleton loaders on every async page/component.
- Horizontal lists scroll smoothly on mid-range mobile (no jank).
- `<link rel="preconnect">` for TMDB API and image CDN in root layout `<head>`.

#### 5.2 Reliability & Error Handling

- All TMDB requests use `NEXT_PUBLIC_API_KEY`; guard against missing key.
- All Supabase calls use `try/catch`; maintenance mode fails open (renders normal app) if Supabase is unreachable.
- Server Component async pages always return JSX with fallback values — never `undefined` (prevents React rendering crash).
- Install page falls back to `"v1.0.0"` and GitHub releases URL if Supabase fetch fails.
- UI never shows raw error objects to end users.

#### 5.3 Security & Privacy

- No secrets exposed via non-`NEXT_PUBLIC_` environment variables to the client.
- All external streaming iframes are from pre-configured trusted domains (Supabase `stream_urls`).
- TMDB API usage complies with terms (attribution in footer, no excessive requests).
- Auth sessions managed server-side via Supabase SSR.

#### 5.4 SEO & Metadata

- Next.js Metadata API for per-page `title`, `description`, `keywords`, canonical, OpenGraph, Twitter.
- JSON-LD structured data: `WebSite` + `SearchAction` (root), `AboutPage` + `Organization` (about), `MoviePage` (detail pages).
- Segmented sitemaps for scalability; `robots.ts` prevents indexing of private routes.
- Clean, keyword-rich URL patterns across all routes.

#### 5.5 Accessibility & UX

- Sufficient color contrast (white/light gray text on near-black backgrounds).
- Primary flows (search, navigation, playback) usable with keyboard.
- Focus states on all interactive elements.
- Icons paired with labels where space permits.
- `selection:bg-red-600` text selection accent throughout for brand consistency.

---

### 6. External Dependencies & Configuration

- **APIs**
  - TMDB REST API (`https://api.themoviedb.org/3`)
  - Google Generative AI — Gemini (`@google/generative-ai`)
  - IP Geolocation: `ipwho.is` → `ipapi.co` → Cloudflare fallback chain
  - Supabase: `app_config`, `sections_content`, `stream_urls`, `bookmarks`, `playlists`

- **Environment Variables**

  | Variable | Purpose |
  |---|---|
  | `NEXT_PUBLIC_API_KEY` | TMDB API key |
  | `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
  | `NEXT_PUBLIC_SUPABASE_KEY` | Supabase anon key |
  | `NEXT_PUBLIC_HASH_SALT` | hashids salt for obfuscating TMDB IDs in URLs |
  | `NEXT_PUBLIC_GEMINI_API_KEY` | Google Gemini AI API key |

- **Key Libraries**

  | Package | Version | Purpose |
  |---|---|---|
  | `next` | 16.1.6 | Framework + App Router |
  | `react` / `react-dom` | 19.2.3 | UI library |
  | `tailwindcss` | ^4.3.1 | Styling |
  | `@supabase/supabase-js` | ^2.97.0 | Database client |
  | `@supabase/ssr` | ^0.12.5 | SSR auth helpers |
  | `@google/generative-ai` | ^0.24.1 | Gemini AI |
  | `swiper` | ^12.1.0 | Hero carousel |
  | `zustand` | ^5.0.14 | Global state (NightGuide chat, UI) |
  | `hashids` | ^2.3.0 | ID encoding/decoding for URLs |
  | `slugify` | ^1.6.6 | Slug generation for SEO URLs |
  | `react-icons` | ^5.5.0 | Icon library |
  | `react-loading-skeleton` | ^3.5.0 | Skeleton loading states |
  | `react-toastify` | ^11.1.0 | Toast notifications |
  | `@dicebear/core` + `@dicebear/collection` | ^9.3.1 | User avatar generation |

---

### 7. Out of Scope (Current Version)

- Multi-language/i18n.
- Offline mode or Service Worker caching.
- Social features (user-to-user comments, ratings, following).
- Push notifications.

---

### 8. Future Enhancements

- Multi-language support and region-based content localization (i18n).
- Offline caching for recently visited pages and common lists.
- Enhanced analytics dashboard (top searches, most-watched, engagement funnels).
- Social features: follow users, comment on playlists, rating system.
- Notification system for new episodes or upcoming releases.
