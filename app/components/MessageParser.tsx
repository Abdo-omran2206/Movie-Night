"use client";

import React, { useEffect, useState } from "react";
import { search, Movie } from "../lib/tmdb";
import ChatMovieCard from "./ChatMovieCard";

interface MessageParserProps {
  content: string;
  customCss?: string;
}

/**
 * Parses AI response text and:
 * 1. Renders **bold** text + plain text nicely
 * 2. Scans for 🎬 **Title** (Year) / 📺 **Title** (Year) patterns
 * 3. Searches TMDB locally for each and renders a MovieCard row
 */
export function MessageParser({ content, customCss = "" }: MessageParserProps) {
  const [moviesData, setMoviesData] = useState<Movie[]>([]);

  useEffect(() => {
    // Match patterns: emoji **Title** (Year)
    const regex = /(🎬|📺)\s*\*\*(.*?)\*\*\s*\((\d{4})\)/g;
    const matches = [...content.matchAll(regex)];

    if (matches.length === 0) {
      setMoviesData([]);
      return;
    }

    const fetchAll = async () => {
      const results = await Promise.all(
        matches.map(async (match) => {
          const isTv = match[1] === "📺";
          const title = match[2].trim();
          const year  = match[3];

          try {
            const res = await search(title, 1);
            const items = res.results ?? [];

            // 1st priority: exact year match
            let found = items.find((m) => {
              const date = isTv ? m.first_air_date : m.release_date;
              return date?.startsWith(year);
            });

            // 2nd priority: first result
            if (!found) found = items[0];

            if (found) {
              return {
                ...found,
                media_type: isTv ? "tv" : "movie",
              } as Movie;
            }
          } catch (error) {
            console.error(`[MessageParser] Search failed for "${title}":`, error);
          }
          return null;
        })
      );

      const unique = results
        .filter(Boolean)
        .filter((v, i, a) => a.findIndex((t) => t?.id === v?.id) === i) as Movie[];

      setMoviesData(unique);
    };

    fetchAll();
  }, [content]);

  // Clean raw IDs (legacy fallback, shouldn't appear with new prompt)
  const cleanContent = content.replace(/\[(?:movie|tv):\s*\d+\]/g, "");

  // Render: split on **bold** markers
  const boldParts = cleanContent.split(/\*\*(.*?)\*\*/g);

  return (
    <div className={`flex flex-col gap-4 w-full ${customCss}`}>
      {/* Text with bold formatting */}
      <span className="whitespace-pre-wrap break-words leading-[1.6]">
        {boldParts.map((part, index) =>
          index % 2 === 1 ? (
            <strong key={index} className="font-semibold text-white">
              {part}
            </strong>
          ) : (
            <React.Fragment key={index}>{part}</React.Fragment>
          )
        )}
      </span>

      {/* Movie Cards row */}
      {moviesData.length > 0 && (
        <>
          <style dangerouslySetInnerHTML={{
            __html: `.ng-scroll::-webkit-scrollbar{display:none}.ng-scroll{-ms-overflow-style:none;scrollbar-width:none}`,
          }} />
          <div className="flex overflow-x-auto gap-3 pt-3 pb-3 w-full ng-scroll px-1">
            {moviesData.map((movie) => (
              <ChatMovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
