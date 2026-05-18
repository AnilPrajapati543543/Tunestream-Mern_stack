import React from 'react';

/**
 * 1. Shimmering Sidebar Skeleton Loader
 */
export const SidebarSkeleton = () => {
  return (
    <div className="space-y-3.5 w-full animate-pulse p-1">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 py-1.5 px-2 rounded-md bg-white/[0.02]">
          {/* Avatar / Cover */}
          <div className="w-12 h-12 rounded-lg bg-white/10 flex-shrink-0" />
          {/* Details */}
          <div className="flex-1 space-y-2 min-w-0">
            <div className="h-3 bg-white/10 rounded-full w-2/3" />
            <div className="h-2.5 bg-white/5 rounded-full w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * 2. Shimmering Quick Tiles Skeleton Loader (Good Afternoon Section)
 */
export const QuickTilesSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 animate-pulse">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="flex items-center bg-white/5 rounded-md overflow-hidden h-20">
          <div className="w-20 h-20 bg-white/10 flex-shrink-0" />
          <div className="flex-1 pl-4 space-y-2 pr-2">
            <div className="h-3 bg-white/10 rounded-full w-3/4" />
            <div className="h-2.5 bg-white/5 rounded-full w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * 3. Shimmering Music Shelf Loader (Featured Charts, Today's Biggest Hits)
 */
export const MusicShelfSkeleton = () => {
  return (
    <div className="flex gap-4 overflow-x-hidden pb-4 snap-x snap-mandatory scrollbar-hide animate-pulse">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="min-w-[150px] sm:min-w-[180px] bg-white/[0.03] p-4 rounded-xl space-y-3.5 border border-white/[0.02] flex-shrink-0">
          <div className="aspect-square w-full bg-white/10 rounded-lg shadow-md" />
          <div className="space-y-2">
            <div className="h-3 bg-white/10 rounded-full w-4/5" />
            <div className="h-2.5 bg-white/5 rounded-full w-3/5" />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * 4. Shimmering Album Header Banner Loader
 */
export const AlbumHeaderSkeleton = () => {
  return (
    <div className="flex flex-col md:flex-row gap-6 md:items-end pb-8 animate-pulse">
      <div className="w-48 h-48 md:w-56 md:h-56 bg-white/10 rounded-xl shadow-2xl flex-shrink-0 mx-auto md:mx-0" />
      <div className="flex-1 space-y-4 text-center md:text-left">
        <div className="h-3.5 bg-white/10 rounded-full w-24 mx-auto md:mx-0" />
        <div className="h-10 bg-white/10 rounded-lg w-3/4 mx-auto md:mx-0" />
        <div className="h-4 bg-white/5 rounded-full w-1/2 mx-auto md:mx-0" />
        <div className="flex items-center gap-2 justify-center md:justify-start">
          <div className="w-5 h-5 rounded-full bg-white/10" />
          <div className="h-3 bg-white/10 rounded-full w-32" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
          <div className="h-3 bg-white/5 rounded-full w-20" />
        </div>
      </div>
    </div>
  );
};

/**
 * 5. Shimmering Track Rows Loader (List View Placeholders)
 */
export const TrackRowsSkeleton = () => {
  return (
    <div className="space-y-2 w-full animate-pulse mt-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02]">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <div className="w-4 h-4 bg-white/10 rounded" />
            <div className="w-11 h-11 bg-white/10 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2 min-w-0">
              <div className="h-3 bg-white/10 rounded-full w-1/3" />
              <div className="h-2.5 bg-white/5 rounded-full w-1/4" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="h-3 bg-white/5 rounded-full w-20 hidden md:block" />
            <div className="h-3 bg-white/10 rounded-full w-8" />
          </div>
        </div>
      ))}
    </div>
  );
};
