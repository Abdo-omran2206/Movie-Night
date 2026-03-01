## Product Requirements Document (PRD) – Movie Night Web App

### 1. Overview

- **Product name**: Movie Night
- **Platform**: Web (Next.js App Router)
- **Primary purpose**: Help movie and TV show lovers discover, explore, and watch content through a cinematic, Netflix-style interface powered by TMDB and third‑party streaming providers.
- **Target users**:
  - Casual viewers who want quick recommendations and trending titles for movies and TV shows.
  - Enthusiasts who care about cast, crew, analytics, and filmography.
  - Users who want to watch content directly via integrated streaming providers.

### 2. Objectives & Success Metrics

- **Objectives**
  - Provide a fast, delightful browsing and discovery experience for movies.
  - Offer rich movie and actor detail pages with trailers, cast, recommendations, and filmography.
  - Enable users to watch selected movies via embedded streaming providers.
  - Maintain strong SEO and shareability to attract organic traffic.
- **Success metrics**
  - Time to first meaningful interaction (home page fully interactive) ≤ 3s on modern devices.
  - Search to result display ≤ 2s p95 under normal network conditions.
  - ≥ 60% of sessions include at least one detail page view (`/movie/[id]/[slug]` or `/actor/[id]/[slug]`).
  - Bounce rate on movie detail pages < 40%.
  - Uptime of external API calls (TMDB + streaming providers) ≥ 99% over a rolling 30 days.

### 3. Core User Flows

1. **Browse home & trending**
   - User lands on `/`.
   - Sees hero banner slider of trending movies (TMDB `/trending/movie/week`).
     - Numeric genre ID: e.g. `/category/28` for Action via TMDB genres.
   - Movies are listed in a grid with pagination via `?page={n}`.

2. **View movie details**
   - User visits `/movie/[id]/[slug]`.
   - App fetches movie details with appended `credits`, `similar`, `videos`, `recommendations`, `keywords`.
   - Page shows poster/backdrop, title, release date, runtime, rating (with stars), genres, overview.
   - User can:
     - See cast carousel and open full cast page.
     - See recommended and similar movies in mini-card carousels.
     - Open trailer modal (YouTube) if available.
     - Click “Watch Now” to navigate to `/movie/player/[id]/[slug]` when `runtime > 0` (available).

3. **View full cast**
   - User clicks into `/movie/cast/[id]` from movie detail.
   - Page shows full cast list with actor thumbnails and roles.
   - User can click an actor to open `/actor/[id]/[slug]`.

4. **View actor details & filmography**
   - User visits `/actor/[id]/[slug]`.
   - App fetches actor details with `movie_credits` and `images`.
   - Page shows profile image, personal info (department, birthday, place of birth), biography, and filmography grid.
   - User can click any movie in filmography to open `/movie/[id]/[slug]`.

5. **Watch content via external streams**
   - User clicks “Watch Now” on `/movie/[id]/[slug]` or `/tv/[id]/[slug]` and is navigated to `/movie/player/[id]/[slug]` or `/tv/player/[id]/[slug]/1/1`.
   - App loads details and constructs an initial embed URL using TV Season/Episode routing or pure Movie ID routing through integrated streaming API tables.
   - User sees video player iframe and a row of stream source buttons.
   - User may switch streams without reloading the page; iframe `src` updates dynamically to selected provider URL via client-state mapping.
   - For TV Shows, users can pick different Seasons and Episodes via a custom scrolling selector, which dynamically updates the player URL and browser history via `replaceState` without a hard reload.
   - User watches content in fullscreen if supported by the provider.

### 4. Functional Requirements

#### 4.1 Navigation & Layout

- **Navbar**
  - Fixed at top on all primary pages.
  - Contains:
    - Menu toggle opening a sidebar with key navigation (Home, Trending, Categories, etc.).
    - Logo linking back to `/`.
    - Search input integrated with `/search` route.
  - On submit, empty or whitespace-only queries should be ignored.
- **Sidebar menu**
  - Provides quick navigation to:
    - Home.
    - Primary categories (Top Rated, Popular, Upcoming, Now Playing, Trending).
    - Selected genre shortcuts (via TMDB genre IDs).
- **Footer**
  - Present on main content pages (home, search, details, category, actor, cast).
  - Contains branding and basic links (e.g., attribution to TMDB).

#### 4.2 Home Page (`/`)

- **Hero banner**
  - Data source: TMDB `/trending/movie/week`.
  - Carousel using Swiper:
    - Autoplay with configurable delay (~5s).
    - Navigation arrows and pagination dots.
    - Infinite looping.
  - Each slide:
    - Background backdrop image.
    - Movie title, release date, rating with star visualization, vote count.
    - Genre chips based on TMDB genre IDs.
    - Overview snippet with truncation.
    - “View Movie” button linking to `/movie/[id]/[slug]`.
- **Sections**
  - Configured from **Supabase** `sections_content` table based on the user's IP-detected region.
  - Falls back to hardcoded default sections if no DB matching or failure:
    - `/movie/top_rated`, `/movie/popular`, `/movie/upcoming`, `/movie/now_playing`, etc.
  - Dynamically injects the current `{region}` and `{countryName}` (via `ipwho.is` Geolocation) into the "Trending in..." row (e.g., "Trending in Egypt").
  - Each section:
    - Title corresponding to category.
    - Horizontal scrollable list of `MovieCard`s (`size="large"`).
    - “View all” link to `/category/[categorySlug]`.
  - While loading, show skeleton UI instead of empty state.

#### 4.3 Search (`/search`)

- **Inputs & URL**
  - Accepts `q` (string) and `page` (optional, default 1) via query parameters.
  - If `q` is missing or empty, show prompt text instead of results.
- **Behavior**
  - On mount, parse `q` and `page` from URL.
  - Fetch results from TMDB `search/movie` with `include_adult=false`.
  - Sync component state with URL so that back/forward navigation works.
  - Auto-scroll to top on new searches or page changes.
- **UI**
  - Heading “Search results for "{query}"” when query present.
  - Movie results shown as `MovieCard`s in a responsive grid.
  - Loading state shows full-page loading component.
  - Empty state message when no results.
  - Pagination:
    - Prev/Next buttons, disabled at boundaries.
    - Current page and total pages displayed.

#### 4.4 Category & Genre (`/category/[category]`)

- **Category resolution**
  - Map known slugs to TMDB endpoints:
    - `trending` → `/trending/movie/week`
    - `top_rated` → `/movie/top_rated`
    - `popular`/`populer` → `/movie/popular`
    - `upcoming` → `/movie/upcoming`
    - `now_playing` → `/movie/now_playing`
  - Numeric `category` (all digits) is treated as genre ID:
    - Endpoint: `/discover/movie?with_genres={id}`.
    - Display title fetched dynamically from genre list.
  - For unknown slugs, default to `/movie/{slug}` and title derived from slug.
- **Pagination**
  - Use `page` query parameter.
  - Update URL and smooth scroll to top on change.
  - Display current and total pages with Prev/Next controls.
- **UI**
  - Page header with category/genre title and accent bar.
  - Movies displayed via `MovieCard` components (`size="small"`).
  - Loading skeleton grid while fetching.

#### 4.5 Movie Details (`/movie/[id]/[slug]`)

- **Data**
  - Use single TMDB call with `append_to_response=credits,similar,videos,recommendations,keywords`.
  - Handle null/undefined responses gracefully and show “Movie not found” with navigation back home.
- **Hero section**
  - Backdrop or poster as background with dark overlay.
    - Foreground content:
    - Poster card (with fallback avatar if no poster or image error).
      - Title, formatted release date, runtime (in hours/minutes), rating (stars and numeric).
      - Genre chips.
      - Overview text with length-limited truncation.
      - Primary CTA: “Watch Now” (or “Coming Soon” if runtime is undefined/0).
      - Secondary CTA: “Watch Trailer” that opens a YouTube modal when a video key is available.
- **Supporting sections**
  - **Cast**:
    - Horizontal list of top N cast (e.g., up to 11).
    - Each card links to `/actor/[id]/[slug]`.
    - Provide prominent “Full Cast” entry point to `/movie/cast/[id]`.
  - **Recommendations & Similar Movies**:
    - Each section displayed only if results are present.
    - Uses `MovieMiniCard` grid for compact cards.

#### 4.6 Full Cast (`/movie/cast/[id]` and `/tv/cast/[id]`)

- **Data**
  - Reuse `fetchMovieDetails` or `fetchTvDetails`, using `credits` from response.
  - Fallback if no media or credits are found.
- **UI**
  - Title: “Full Cast”.
  - Subtitle: movie title and year.
  - Accent divider for visual structure.
  - Cast list rendered in a scrollable container using `CastList`.

#### 4.7 Actor Details (`/actor/[id]/[slug]`)

- **Data**
  - Use TMDB `/person/{id}` with appended `movie_credits,images`.
  - Handle missing profile image with fallback asset.
- **UI**
  - Left column:
    - Portrait image.
    - Personal info card: known for, birthday, place of birth (when available).
  - Right column:
    - Actor name headline.
    - Biography text (multi-line).
  - Filmography section:
    - Heading “Filmography”.
    - `MovieMiniCard` grid from `movie_credits.cast`.

#### 4.8 Player (`/movie/player/[id]/[slug]` and `/tv/player/[id]/[slug]/[season]/[episode]`)

- **Data**
  - Fetch movie or TV details by ID for page title and context.
  - Set browser document title dynamically, e.g., `Watch {title} S{season} E{episode} - Movie Night`.
- **Streaming sources**
  - Pull multiple streaming domains directly from the Supabase `stream_urls` table (e.g., vidsrc, multiembed).
  - Construct stream URLs using predefined templates stored in the database, mapping `{id}`, `{s}`, and `{e}` slugs dynamically for TV shows.
  - UI:
    - Display helper text instructing users to switch sources if playback fails.
    - Show an array of stream buttons mapped to database entries; highlight active stream.
    - Update iframe `src` via React State rather than page refresh.
    - TV Shows display an 'Episodes' controller grid featuring horizontal season selection and a responsive episode grid. Clicking an episode uses `window.history.replaceState` to update the URL flawlessly without triggering a page reload.
  - Requirements:
    - Iframe must take full width of container and 16:9 aspect ratio.
    - `allowFullScreen` enabled.
    - Failures from a given domain should not break the page; users can try other sources.

### 5. Non‑Functional Requirements

#### 5.1 Performance

- Use client-side data fetching only where required for interactivity (e.g. search, category, player, movie details, actors) and avoid unnecessary re-renders.
- Use skeleton loaders and loading states for API-driven components.
- Ensure images use optimized TMDB sizes (`w500`, `w1280`) and `next/image` for lazy loading and responsive behavior.
- Horizontal and grid lists should scroll smoothly without jank on mid‑range mobile devices.

#### 5.2 Reliability & Error Handling

- All TMDB requests must:
  - Use the configured `NEXT_PUBLIC_API_KEY`.
  - Guard against missing API keys and log errors in development.
  - Fail gracefully with empty arrays or null values.
- UI should:
  - Avoid hard crashes on network errors.
  - Show appropriate empty states (“Movie not found.”, “Actor not found.”, “No movies found for this category.”).
  - Never show raw error objects to end users.

#### 5.3 Security & Privacy

- Do not expose any secrets other than required public TMDB/streaming keys prefixed with `NEXT_PUBLIC_`.
- Never log API keys or full URLs with sensitive query parameters in production.
- All external iframes must be from trusted, preconfigured domains.
- Respect TMDB API usage terms, including attributions and branding.

#### 5.4 SEO & Metadata

- Use Next.js metadata API to configure:
  - Site-wide title templates, descriptions, and keywords.
  - OpenGraph and Twitter cards using primary icon/thumbnail.
  - Robots configuration allowing indexing and rich previews.
  - Sitemap and robots endpoints.
- Provide structured data (JSON‑LD) for the website and site search action.
- Ensure clean, keyword-rich URL patterns:
  - `/`, `/search`, `/category/[category]`
  - `/movie/[id]/[slug]`, `/tv/[id]/[slug]`, `/actor/[id]/[slug]`
  - `/movie/cast/[id]`, `/movie/player/[id]/[slug]`, `/tv/player/[id]/[slug]/[season]/[episode]`

#### 5.5 Accessibility & UX

- Maintain sufficient color contrast for text and key UI elements against the dark background.
- Ensure primary flows (search, navigation to details, playback) are usable with keyboard.
- Provide focus states for interactive elements (buttons, links, tabs).
- Avoid text-only indicators for crucial actions; combine icons and labels when space allows.

### 6. External Dependencies & Configuration

- **APIs**
  - TMDB REST API (`https://api.themoviedb.org/3`).
  - Streaming providers via configurable environment variables or Supabase URL DB.
  - IP Geolocation API (`https://ipwho.is/`) for regional dynamic content.
  - Supabase database (`sections_content`, `stream_urls`, etc.).
- **Environment variables (public)**
  - `NEXT_PUBLIC_API_KEY` – TMDB API key.
  - `NEXT_PUBLIC_STREAM_API`, `NEXT_PUBLIC_STREAM2_API`, `NEXT_PUBLIC_STREAM3_API`, `NEXT_PUBLIC_STREAM4_API`, `NEXT_PUBLIC_STREAM5_API` – base URLs for streaming providers.
- **Libraries**
  - Next.js, React, TypeScript.
  - Axios / fetch for networking.
  - Swiper for hero carousel.
  - React Icons, react-loading-skeleton, DiceBear avatars for poster fallbacks.

### 7. Out of Scope (for this version)

- User authentication, profiles, and personalized watchlists.
- Persistence of viewing history or favorites.
- Multi-language/i18n.
- Offline mode or advanced caching.
- Social features (sharing, comments, ratings from users).

### 8. Future Enhancements (High‑Level)

- Add user accounts with synced watchlists and continue‑watching rows.
- Integrate multi-language support and region-based content.
- Offline caching for common lists and recently visited details.
- Enhanced analytics (top searches, most-watched categories, engagement funnels).
