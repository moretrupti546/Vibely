import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, UserPlus, UserCheck } from 'lucide-react';
import { useFollowedArtists } from '../../hooks/useFollowedArtists';

export const ArtistCard = ({ artist }) => {
  const { isFollowing, toggleFollow } = useFollowedArtists();
  const followed = isFollowing(artist.id);

  const handleFollowClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFollow(artist);
  };

  return (
    <Link
      to={`/artist/${artist.id}`}
      className="group p-4 rounded-2xl bg-vibely-surface/50 hover:bg-vibely-surface border border-vibely-border hover:border-purple-500/30 transition-all duration-300 shadow-lg hover:shadow-purple-500/10 flex flex-col items-center text-center relative"
    >
      <div className="relative w-32 h-32 rounded-full overflow-hidden mb-3.5 shadow-xl bg-slate-900 border-2 border-transparent group-hover:border-purple-500/40 transition-colors">
        <img
          src={artist.image}
          alt={artist.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 select-none"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = '/assets/artists/default-artist.svg';
          }}
        />
      </div>

      <div className="flex items-center justify-center gap-1 font-semibold text-sm text-slate-100 group-hover:text-purple-300 transition-colors max-w-full px-1">
        <span className="truncate">{artist.name}</span>
        {artist.verified && <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />}
      </div>

      <span className="text-[11px] text-slate-400 mt-0.5">
        {artist.monthlyListeners
          ? `${(artist.monthlyListeners / 1000000).toFixed(1)}M listeners`
          : 'Artist'}
      </span>

      {/* Interactive Follow Button */}
      <button
        type="button"
        onClick={handleFollowClick}
        className={`mt-3 px-3.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
          followed
            ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/40'
            : 'bg-vibely-surface border border-vibely-border hover:border-purple-400 text-slate-300 hover:text-white hover:bg-slate-800'
        }`}
        title={followed ? `Unfollow ${artist.name}` : `Follow ${artist.name}`}
      >
        {followed ? (
          <>
            <UserCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>Following</span>
          </>
        ) : (
          <>
            <UserPlus className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-400" />
            <span>Follow</span>
          </>
        )}
      </button>
    </Link>
  );
};
