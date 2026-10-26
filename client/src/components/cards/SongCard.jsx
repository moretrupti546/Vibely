import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, Heart } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

export const SongCard = ({ song, queueList = [] }) => {
  const { currentSong, isPlaying, playSong, togglePlay, isSongLiked, toggleLike } = usePlayer();
  const [imgSrc, setImgSrc] = useState(song.coverArt || '/assets/covers/default-cover.svg');

  // Keep imgSrc updated if song changes
  React.useEffect(() => {
    setImgSrc(song.coverArt || '/assets/covers/default-cover.svg');
  }, [song.coverArt]);

  const isCurrent = currentSong?.id === song.id;
  const isLiked = isSongLiked(song.id);

  const handlePlayClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isCurrent) {
      togglePlay();
    } else {
      playSong(song, queueList.length > 0 ? queueList : [song]);
    }
  };

  const handleLikeClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleLike(song);
  };

  return (
    <div
      className={`group relative p-3.5 rounded-2xl bg-vibely-surface/60 hover:bg-vibely-surface border music-card-hover flex flex-col focus-within:border-purple-500/50 focus-within:ring-1 focus-within:ring-purple-500/40 transition-all ${
        isCurrent && isPlaying
          ? 'border-purple-500/70 shadow-lg shadow-purple-600/30 ring-1 ring-purple-500/40 bg-purple-950/20'
          : 'border-vibely-border'
      }`}
    >
      {/* Artwork with floating play button */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3 bg-slate-900 shadow-md">
        <img
          src={imgSrc}
          alt={song.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 select-none"
          loading="lazy"
          onError={() => setImgSrc('/assets/covers/default-cover.svg')}
        />

        {/* Hover & Keyboard Focus Overlay & Play button */}
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center transition-all duration-300 ${
            isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100'
          }`}
        >
          <button
            onClick={handlePlayClick}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center shadow-xl shadow-purple-600/40 hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-300 focus-visible:scale-110 transition-all"
            title={isCurrent && isPlaying ? 'Pause' : 'Play'}
            aria-label={isCurrent && isPlaying ? `Pause ${song.title}` : `Play ${song.title}`}
          >
            {isCurrent && isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>
        </div>

        {/* Playing Equalizer Indicator Badge (bottom-left) */}
        {isCurrent && isPlaying && (
          <div className="absolute bottom-2.5 left-2.5 px-2 py-1 rounded-md bg-black/60 backdrop-blur-md flex items-end gap-0.5 h-4.5 pointer-events-none">
            <span className="w-0.5 bg-purple-400 rounded-full eq-bar-1 h-3" />
            <span className="w-0.5 bg-pink-400 rounded-full eq-bar-2 h-4" />
            <span className="w-0.5 bg-indigo-400 rounded-full eq-bar-3 h-2.5" />
          </div>
        )}

        {/* Like badge */}
        <button
          onClick={handleLikeClick}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full bg-black/50 backdrop-blur-md transition-opacity ${
            isLiked ? 'opacity-100 text-pink-500' : 'opacity-0 group-hover:opacity-100 text-slate-300 hover:text-white'
          }`}
          title="Save to Liked Songs"
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-pink-500' : ''}`} />
        </button>
      </div>

      {/* Meta */}
      <Link
        to={`/song/${song.id}`}
        className={`font-semibold text-sm truncate hover:underline ${
          isCurrent ? 'text-purple-400' : 'text-slate-100'
        }`}
      >
        {song.title}
      </Link>
      <Link
        to={`/artist/${song.artist?.id}`}
        className="text-xs text-slate-400 hover:text-purple-300 truncate mt-0.5"
      >
        {song.artist?.name}
      </Link>
    </div>
  );
};
