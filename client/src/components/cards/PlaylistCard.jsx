import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

export const PlaylistCard = ({ playlist }) => {
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayer();

  const isPlaylistPlaying = isPlaying && playlist.tracks?.some((t) => t.id === currentSong?.id);

  const handlePlayClick = (e) => {
    if (playlist.tracks && playlist.tracks.length > 0) {
      e.preventDefault();
      e.stopPropagation();
      if (isPlaylistPlaying) {
        togglePlay();
      } else {
        playSong(playlist.tracks[0], playlist.tracks);
      }
    }
  };

  return (
    <Link
      to={`/playlist/${playlist.id}`}
      className="group relative p-3.5 rounded-2xl bg-vibely-surface/60 hover:bg-vibely-surface border border-vibely-border music-card-hover flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-within:border-purple-500/50"
    >
      <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3 bg-slate-900 shadow-md">
        <img
          src={playlist.coverArt || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80'}
          alt={playlist.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Hover & Keyboard Focus Overlay */}
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-all duration-300 flex items-center justify-center ${
            isPlaylistPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100'
          }`}
        >
          <button
            onClick={handlePlayClick}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center shadow-xl shadow-purple-600/40 transform translate-y-2 group-hover:translate-y-0 group-focus-within:translate-y-0 hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-300 transition-all duration-300"
            title={isPlaylistPlaying ? `Pause ${playlist.title}` : `Play ${playlist.title}`}
            aria-label={isPlaylistPlaying ? `Pause ${playlist.title}` : `Play ${playlist.title}`}
          >
            {isPlaylistPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>
        </div>

        {/* Playing Equalizer Indicator Badge (bottom-left) */}
        {isPlaylistPlaying && (
          <div className="absolute bottom-2.5 left-2.5 px-2 py-1 rounded-md bg-black/70 backdrop-blur-md flex items-end gap-0.5 h-4 pointer-events-none">
            <span className="w-0.5 bg-purple-400 rounded-full eq-bar-1 h-3" />
            <span className="w-0.5 bg-pink-400 rounded-full eq-bar-2 h-4" />
            <span className="w-0.5 bg-indigo-400 rounded-full eq-bar-3 h-2.5" />
          </div>
        )}
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
