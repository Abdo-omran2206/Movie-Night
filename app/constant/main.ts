import { 
  FaFistRaised, 
  FaTheaterMasks, 
  FaUserFriends, 
  FaGhost, 
  FaMountain, 
  FaLaughSquint, 
  FaMask, 
  FaFileAlt, 
  FaMagic, 
  FaHistory, 
  FaMusic, 
  FaHeart, 
  FaRocket, 
  FaTv, 
  FaSkull, 
  FaFlag, 
  FaHatCowboy, 
  FaSearch,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube
} from "react-icons/fa";
import { FaArrowTrendUp } from "react-icons/fa6";
import { IoFlame, IoStar, IoCalendar, IoPlay } from "react-icons/io5";
import { MdAnimation } from "react-icons/md";

// ─── Site URL ────────────────────────────────────────────────────────────────
export const siteUrl = "https://mymovienight.vercel.app";

// ─── TMDB Base URLs ───────────────────────────────────────────────────────────
export const tmdbBaseUrl = "https://api.themoviedb.org/3";
export const backdropUrl = "https://image.tmdb.org/t/p/w1280";
export const posterUrl = "https://image.tmdb.org/t/p/w500";
export const posterUrl780 = "https://image.tmdb.org/t/p/w780";
export const profileUrl = "https://image.tmdb.org/t/p/h632";
export const thumbnailUrl = "https://image.tmdb.org/t/p/w92";

// ─── YouTube Embed ────────────────────────────────────────────────────────────
export const youtubeEmbedUrl = "https://www.youtube.com/embed/";

// ─── IP Geolocation Providers ────────────────────────────────────────────────
export const ipProviders = {
  ipwho: "https://ipwho.is/",
  ipapi: "https://ipapi.co/json/",
  extremeIp: "https://extreme-ip-lookup.com/json/",
  cloudflare: "https://cloudflare.com/cdn-cgi/trace",
} as const;

// ─── Regions ──────────────────────────────────────────────────────────────────
export const regions: Record<string, string> = {
  EG: "Egypt",
  US: "USA",
  GB: "UK",
  SA: "Saudi Arabia",
  AE: "UAE",
  FR: "France",
  DE: "Germany",
  CA: "Canada",
  AU: "Australia",
  IT: "Italy",
  ES: "Spain",
};

// ─── Genre Map ────────────────────────────────────────────────────────────────
export const GENRE_MAP: Record<string, number> = {
  action: 28,
  adventure: 12,
  animation: 16,
  comedy: 35,
  crime: 80,
  documentary: 99,
  drama: 18,
  family: 10751,
  fantasy: 14,
  history: 36,
  horror: 27,
  music: 10402,
  mystery: 9648,
  romance: 10749,
  science_fiction: 878,
  "sci-fi": 878,
  tv_movie: 10770,
  thriller: 53,
  war: 10752,
  western: 37,
};

export const navigationLinks = [
  { href: "/", label: "Home" },
  { href: "/category/trending", label: "Trending" },
  { href: "/category/top_rated", label: "Top Rated" },
  { href: "/category/popular", label: "Popular" },
  { href: "/category/upcoming", label: "Upcoming" },
  { href: "/category/now_playing", label: "Now Playing" },
];

export const socialMedia = [
  { href: "/", icon: FaFacebookF, label: "Facebook" },
  { href: "/", icon: FaTwitter, label: "Twitter" },
  { href: "/", icon: FaInstagram, label: "Instagram" },
  { href: "/", icon: FaYoutube, label: "YouTube" },
];

export const categories = [
  { name: "Trending", icon: FaArrowTrendUp, href: "/category/trending" },
  { name: "Popular", icon: IoFlame, href: "/category/popular" },
  { name: "Top Rated", icon: IoStar, href: "/category/top_rated" },
  { name: "Upcoming", icon: IoCalendar, href: "/category/upcoming" },
  { name: "Now Playing", icon: IoPlay, href: "/category/now_playing" },
];

export const genres = [
  { name: "Action", icon: FaFistRaised, href: "/category/action" },
  { name: "Adventure", icon: FaMountain, href: "/category/adventure" },
  { name: "Animation", icon: MdAnimation, href: "/category/animation" },
  { name: "Comedy", icon: FaLaughSquint, href: "/category/comedy" },
  { name: "Crime", icon: FaMask, href: "/category/crime" },
  { name: "Documentary", icon: FaFileAlt, href: "/category/documentary" },
  { name: "Drama", icon: FaTheaterMasks, href: "/category/drama" },
  { name: "Family", icon: FaUserFriends, href: "/category/family" },
  { name: "Fantasy", icon: FaMagic, href: "/category/fantasy" },
  { name: "History", icon: FaHistory, href: "/category/history" },
  { name: "Horror", icon: FaGhost, href: "/category/horror" },
  { name: "Music", icon: FaMusic, href: "/category/music" },
  { name: "Mystery", icon: FaSearch, href: "/category/mystery" },
  { name: "Romance", icon: FaHeart, href: "/category/romance" },
  { name: "Science Fiction", icon: FaRocket, href: "/category/science-fiction" },
  { name: "TV Movie", icon: FaTv, href: "/category/tv-movie" },
  { name: "Thriller", icon: FaSkull, href: "/category/thriller" },
  { name: "War", icon: FaFlag, href: "/category/war" },
  { name: "Western", icon: FaHatCowboy, href: "/category/western" },
];