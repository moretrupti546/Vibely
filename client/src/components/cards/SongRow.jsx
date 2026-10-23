import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, Heart, MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

const formatSeconds = (secs) => {
  if (!secs) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

export const SongRow = ({
  song,
  index,
  queueList = [],
  showAlbum = true,
  onRemove = null,
  onAddToPlaylist = null
}) => {
  const { currentSong, isPlaying, playSong, togglePlay, isSongLiked, toggleLike } = usePlayer();

  const isCurrent = currentSong?.id === song.id;
  const isLiked = isSongLiked(song.id);

  const handlePlayToggle = () => {
    if (isCurrent) {
      togglePlay();
    } else {
      playSong(song, queueList.length > 0 ? queueList : [song]);
    }
  };

  return (
    <div
      className={`group flex items-center gap-3.5 px-4 py-2.5 rounded-xl transition-colors ${
        isCurrent
          ? 'bg-purple-950/30 text-purple-300'
          : 'hover:bg-slate-800/50 text-slate-300 hover:text-white'
      }`}
    >
      {/* Index or Play Button */}
      <div className="w-6 text-center text-xs font-mono shrink-0">
        <span className="group-hover:hidden">{isCurrent && isPlaying ? '🔊' : index + 1}</span>
        <button
          onClick={handlePlayToggle}
          className="hidden group-hover:flex items-center justify-center text-white hover:text-purple-400"
        >
          {isCurrent && isPlaying ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current" />
          )}
        </button>
      </div>

      {/* Artwork */}
      {song.coverArt && (
        <img
          src={song.coverArt}
          alt={song.title}
          className="w-10 h-10 rounded-lg object-cover shrink-0"
        />
      )}

      {/* Title & Artist */}
      <div className="flex-1 min-w-0 pr-2">
        <Link
          to={`/song/${song.id}`}
          className={`block font-semibold text-sm truncate hover:underline ${
            isCurrent ? 'text-purple-400 font-bold' : 'text-slate-100'
          }`}
        >
          {song.title}
        </Link>
        <Link
          to={`/artist/${song.artist?.id}`}
          className="block text-xs text-slate-400 hover:text-purple-300 truncate"
        >
          {song.artist?.name}
        </Link>
      </div>

      {/* Album name */}
      {showAlbum && (
        <div className="hidden md:block w-1/3 truncate text-xs text-slate-400 hover:text-slate-200">
          {song.album?.id ? (
            <Link to={`/album/${song.album.id}`} className="hover:underline">
              {song.album.title}
            </Link>
          ) : (
            'Single'
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => toggleLike(song)}
          className={`p-1.5 transition-colors ${
            isLiked ? 'text-pink-500' : 'text-slate-400 opacity-0 group-hover:opacity-100 hover:text-white'
          }`}
          title={isLiked ? 'Remove like' : 'Like'}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-pink-500' : ''}`} />
        </button>

        {onAddToPlaylist && (
          <button
            onClick={() => onAddToPlaylist(song)}
            className="p-1.5 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-purple-400 transition-colors"
            title="Add to playlist"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}

        {onRemove && (
          <button
            onClick={() => onRemove(song.id)}
            className="p-1.5 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-rose-400 transition-colors"
            title="Remove from playlist"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}

        <span className="font-mono text-xs text-slate-400 w-10 text-right">
          {formatSeconds(song.duration)}
        </span>
      </div>
    </div>
  );
};
