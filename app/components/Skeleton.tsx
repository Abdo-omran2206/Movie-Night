"use client";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export function MovieCardSkeleton() {
  return (
    <div className="flex flex-col mx-1 md:mx-0 w-[250px] md:min-w-[250px]">
      <div className="relative aspect-2/3 overflow-hidden rounded-2xl mb-3">
        <Skeleton height="100%" className="absolute inset-0" />
      </div>
      <div className="flex flex-col gap-2 px-1">
        <Skeleton height={20} width="80%" />
        <div className="flex flex-col gap-1">
          <Skeleton height={15} width="60%" />
          <Skeleton height={15} width="40%" />
        </div>
      </div>
    </div>
  );
}

export function MovieMiniCardSkeleton() {
  return (
    <div className="bg-neutral-900/40 ring-1 ring-white/10 rounded-2xl overflow-hidden">
      <div className="relative aspect-2/3 w-full">
        <Skeleton height="100%" className="absolute inset-0" />
      </div>
      <div className="p-3 text-left">
        <Skeleton height={16} width="80%" className="mb-1" />
        <Skeleton height={14} width="40%" />
      </div>
    </div>
  );
}

export function CastCardSkeleton() {
  return (
    <div className="bg-neutral-900/40 ring-1 ring-white/10 rounded-2xl overflow-hidden">
      <div className="relative aspect-2/3 w-full">
        <Skeleton height="100%" className="absolute inset-0" />
      </div>
      <div className="p-3 text-center">
        <Skeleton height={16} width="70%" className="mx-auto" />
        <Skeleton height={14} width="50%" className="mx-auto mt-1" />
      </div>
    </div>
  );
}

export function SectionSkeleton() {
  return (
    <section className="py-4 md:py-8 px-2 sm:px-4 relative">
      <div className="flex items-center justify-between gap-3 mb-4 md:mb-6">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-1 md:w-1.5 h-8 md:h-16 bg-red-700/20 rounded-full" />
          <Skeleton height={40} width={200} />
        </div>
        <Skeleton height={20} width={80} />
      </div>
      <div className="flex gap-2 sm:gap-4 overflow-x-hidden pb-6 sm:pb-10 pt-2 sm:pt-5">
        {[...Array(6)].map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}
export function StreamButtonSkeleton() {
  return (
    <div className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg bg-neutral-800/50 w-32 animate-pulse">
      <Skeleton circle width={24} height={24} />
      <Skeleton width={60} height={16} />
    </div>
  );
}
