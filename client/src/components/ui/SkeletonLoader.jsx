import React from 'react';

export const CardSkeleton = () => (
  <div className="p-4 rounded-2xl bg-vibely-surface/80 border border-vibely-border animate-shimmer flex flex-col gap-3">
    <div className="w-full aspect-square bg-gradient-to-tr from-slate-800/80 via-purple-950/20 to-slate-800/80 rounded-xl" />
    <div className="h-4 bg-slate-800/80 rounded w-3/4" />
    <div className="h-3 bg-slate-800/50 rounded w-1/2" />
  </div>
);

export const SongRowSkeleton = () => (
  <div className="flex items-center gap-4 px-4 py-3 rounded-xl bg-vibely-surface/50 border border-vibely-border animate-shimmer">
    <div className="w-6 h-4 bg-slate-800/60 rounded" />
    <div className="w-12 h-12 bg-gradient-to-tr from-slate-800/80 via-purple-950/20 to-slate-800/80 rounded-lg shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-slate-800/80 rounded w-1/3" />
      <div className="h-3 bg-slate-800/50 rounded w-1/4" />
    </div>
    <div className="w-12 h-4 bg-slate-800/60 rounded" />
  </div>
);

export const HeroSkeleton = () => (
  <div className="w-full h-72 rounded-3xl bg-vibely-surface/80 border border-vibely-border animate-shimmer p-8 flex items-end">
    <div className="space-y-4 w-1/2">
      <div className="h-6 bg-slate-800/80 rounded w-1/4" />
      <div className="h-10 bg-slate-800/80 rounded w-3/4" />
      <div className="h-4 bg-slate-800/50 rounded w-1/2" />
    </div>
  </div>
);

