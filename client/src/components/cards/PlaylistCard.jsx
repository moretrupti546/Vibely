import React from 'react';
import { Link } from 'react-router-dom';
import { ListMusic, Play } from 'lucide-react';

export const PlaylistCard = ({ playlist }) => {
  return (
    <Link
      to={`/playlist/${playlist.id}`}
      className="group relative p-3.5 rounded-2xl bg-vibely-surface/60 hover:bg-vibely-surface border border-vibely-border hover:border-purple-500/30 transition-all duration-300 shadow-lg hover:shadow-purple-500/10 flex flex-col"
    >
      <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3 bg-slate-900">
        <img
          src={playlist.coverArt || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80'}
          alt={playlist.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center shadow-xl shadow-purple-600/40 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
        </div>
      </div>

      <h4 className="font-semibold text-sm text-slate-100 truncate group-hover:text-purple-300 transition-colors">
        {playlist.title}
      </h4>
      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
        {playlist.description || `By ${playlist.user?.name || 'Vibely'}`}
      </p>
    </Link>
  );
};
