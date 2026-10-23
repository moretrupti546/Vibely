import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

export const ArtistCard = ({ artist }) => {
  return (
    <Link
      to={`/artist/${artist.id}`}
      className="group p-4 rounded-2xl bg-vibely-surface/50 hover:bg-vibely-surface border border-vibely-border hover:border-purple-500/30 transition-all duration-300 shadow-lg hover:shadow-purple-500/10 flex flex-col items-center text-center"
    >
      <div className="relative w-32 h-32 rounded-full overflow-hidden mb-3.5 shadow-xl bg-slate-900">
        <img
          src={artist.image}
          alt={artist.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>

      <div className="flex items-center gap-1 font-semibold text-sm text-slate-100 group-hover:text-purple-300 transition-colors">
        <span>{artist.name}</span>
        {artist.verified && <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />}
      </div>
      <span className="text-xs text-slate-400 mt-0.5">Artist</span>
    </Link>
  );
};
