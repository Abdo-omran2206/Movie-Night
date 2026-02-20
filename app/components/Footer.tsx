import Link from "next/link";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const genres = [
    { href: "/category/action", label: "Action" },
    { href: "/category/comedy", label: "Comedy" },
    { href: "/category/drama", label: "Drama" },
    { href: "/category/sci-fi", label: "Sci-Fi" },
    { href: "/category/horror", label: "Horror" },
    { href: "/category/romance", label: "Romance" },
  ];

  const navigationLinks = [
    { href: "/", label: "Home" },
    { href: "/category/trending", label: "Trending" },
    { href: "/category/top_rated", label: "Top Rated" },
    { href: "/category/popular", label: "Popular" },
    { href: "/category/upcoming", label: "Upcoming" },
    { href: "/category/now_playing", label: "Now Playing" },
  ];

  const socialMedia = [
    {
      href: "/",
      icon: FaFacebookF,
      label: "Facebook",
    },
    {
      href: "/",
      icon: FaTwitter,
      label: "Twitter",
    },
    {
      href: "/",
      icon: FaInstagram,
      label: "Instagram",
    },
    {
      href: "/",
      icon: FaYoutube,
      label: "YouTube",
    },
  ];

  return (
    <footer className="bg-neutral-950 border-t border-neutral-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h2 className="text-red-600 text-3xl font-bold tracking-widest">
              MOVIE NIGHT
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your ultimate destination for movie enthusiasts. Discover, watch,
              and enjoy cinema like never before.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              Navigation
            </h3>
            <ul className="space-y-2">
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-red-600 transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {genres.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-red-600 transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Follow Us</h3>
            <div className="flex gap-4">
              {socialMedia.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-neutral-800 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors duration-300"
                    aria-label={social.label}
                  >
                    <Icon className="text-white text-lg" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {currentYear} Movie Night. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm">
            Powered by{" "}
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 hover:text-red-500 font-semibold transition-colors"
            >
              TMDB API
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
