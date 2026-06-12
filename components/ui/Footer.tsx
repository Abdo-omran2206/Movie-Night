import Link from "next/link";
import { discoverLinks, genres, navigationLinks, socialMedia } from "../../constant/main";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-950 border-t border-neutral-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h2 className="text-red-600 text-3xl font-bold tracking-widest">
              MOVIE NIGHT
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your ultimate destination for movie enthusiasts. Discover, watch,
              and enjoy cinema like never before.
            </p>
            <div className="flex gap-4">
              {socialMedia.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-gray-300 hover:bg-red-500 hover:text-white transition-all"
                    aria-label={social.label}
                  >
                    <Icon size={18} />
                  </Link>
                );
              })}
            </div>
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
                    className="text-gray-300 hover:text-red-500 transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              Discover
            </h3>
            <ul className="space-y-2">
              {discoverLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-red-500 transition-colors duration-200 text-sm"
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
              {genres.slice(0, 5).map((link) => (
                <li key={link.href + link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-red-500 transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Install App */}
          {/* <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              Get the App
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Install Movie Night as an app for a faster, more immersive
              experience.
            </p>
            <Link
              href="/install"
              className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors duration-200"
            >
              Install App
            </Link>
          </div> */}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {currentYear} Movie Night. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm">
            Powered by{" "}
            <Link
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-500 underline underline-offset-4 hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              TMDB API
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
