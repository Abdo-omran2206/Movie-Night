"use client";
import React from "react";

interface LoadingModelProps {
  message?: string;
}

export default function LoadingModel({
  message = "MOVIE NIGHT",
}: LoadingModelProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md">
      <div className="relative flex flex-col items-center">
        {/* Animated Outer Ring */}
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 rounded-full border-t-4 border-l-4 border-red-600 animate-spin" />
          <div className="absolute inset-2 rounded-full border-r-4 border-b-4 border-red-900/50 animate-spin-reverse" />

          {/* Pulsing Cinema Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(220,38,38,0.4)] animate-pulse">
              <svg
                viewBox="0 0 24 24"
                className="w-9 h-9 text-white fill-current"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M7 4H17C18.1046 4 19 4.89543 19 6V18C19 19.1046 18.1046 20 17 20H7C5.89543 20 5 19.1046 5 18V6C5 4.89543 5.89543 4 7 4ZM7 6V18H17V6H7ZM9 8H11V10H9V8ZM9 11H11V13H9V11ZM9 14H11V16H9V14ZM13 8H15V10H13V8ZM13 11H15V13H13V11ZM13 14H15V16H13V14Z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Text Animation */}
        <div className="mt-10 flex flex-col items-center gap-4">
          <h2 className="text-2xl font-bold tracking-[0.2em] text-white uppercase text-center max-w-xs">
            {message === "MOVIE NIGHT" ? (
              <>
                MOVIE <span className="text-red-600">NIGHT</span>
              </>
            ) : (
              message
            )}
          </h2>
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" />
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }
        .animate-spin-reverse {
          animation: spin-reverse 2.5s linear infinite;
        }
      `}</style>
    </div>
  );
}
