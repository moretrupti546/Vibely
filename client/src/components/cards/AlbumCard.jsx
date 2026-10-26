import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Disc3, Play } from 'lucide-react';

export const AlbumCard = ({ album }) => {
  const [imgSrc, setImgSrc] = useState(album.coverArt || '/assets/playlists/default-playlist.svg');

  return (
    <Link
      to={`/album/${album.id}`}
      className="group relative p-3.5 rounded-2xl bg-vibely-surface/60 hover:bg-vibely-surface border border-vibely-border music-card-hover flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-within:border-purple-500/50"
    >
      <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3 bg-slate-900 shadow-md">
        <img
          src={imgSrc}
          alt={album.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 select-none"
          loading="lazy"
          onError={() => setImgSrc('/assets/playlists/default-playlist.svg')}
        />

        <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-indigo-500 text-white flex items-center justify-center shadow-xl shadow-purple-600/40 transform translate-y-2 group-hover:translate-y-0 group-focus-within:translate-y-0 hover:scale-110 active:scale-95 transition-all duration-300">
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
        </div>
      </div>

      <h4 className="font-semibold text-sm text-slate-100 truncate group-hover:text-purple-300 transition-colors">
        {album.title}
      </h4>
      <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
        <span>{album.releaseYear}</span>
        <span>•</span>
        <span className="truncate">{album.artist?.name}</span>
      </div>
    </Link>
  );
};
