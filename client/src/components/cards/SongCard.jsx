import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, Heart } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

export const SongCard = ({ song, queueList = [] }) => {
  const { currentSong, isPlaying, playSong, togglePlay, isSongLiked, toggleLike } = usePlayer();

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
    <div className="group relative p-3.5 rounded-2xl bg-vibely-surface/60 hover:bg-vibely-surface border border-vibely-border hover:border-purple-500/30 transition-all duration-300 shadow-lg hover:shadow-purple-500/10 flex flex-col">
      {/* Artwork with floating play button */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3 bg-slate-900">
        <img
          src={song.coverArt}
          alt={song.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Hover overlay & Play button */}
        <div
          className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${
            isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          <button
            onClick={handlePlayClick}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center shadow-xl shadow-purple-600/40 hover:scale-110 transition-all"
            title={isCurrent && isPlaying ? 'Pause' : 'Play'}
          >
            {isCurrent && isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>
        </div>

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
