import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, Heart, Plus, Trash2, ListPlus, FastForward, Download, Crown } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { useAuth } from '../../context/AuthContext';

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
  const { currentSong, isPlaying, playSong, togglePlay, isSongLiked, toggleLike, addToQueue, playNextInQueue, downloadTrack } = usePlayer();
  const { isPro } = useAuth();

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
      <div className="w-6 text-center text-xs font-mono shrink-0 flex items-center justify-center">
        <div className="group-hover:hidden flex items-center justify-center">
          {isCurrent && isPlaying ? (
            <div className="flex items-end justify-center gap-0.5 h-3.5 w-4" title="Playing">
              <span className="w-0.5 bg-purple-400 rounded-full eq-bar-1 h-3" />
              <span className="w-0.5 bg-pink-400 rounded-full eq-bar-2 h-3.5" />
              <span className="w-0.5 bg-cyan-400 rounded-full eq-bar-3 h-2" />
            </div>
          ) : (
            <span>{index + 1}</span>
          )}
        </div>
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
          className="w-10 h-10 rounded-lg object-cover shrink-0 select-none"
          onError={(e) => {
            e.currentTarget.src = '/assets/covers/default-cover.svg';
          }}
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
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Play Next */}
        <button
          onClick={() => playNextInQueue(song)}
          className="p-1.5 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-purple-400 hover:scale-110 active:scale-95 transition-all"
          title="Play next in queue"
        >
          <FastForward className="w-4 h-4" />
        </button>

        {/* Add to Queue */}
        <button
          onClick={() => addToQueue(song)}
          className="p-1.5 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-purple-400 hover:scale-110 active:scale-95 transition-all"
          title="Add to queue"
        >
          <ListPlus className="w-4 h-4" />
        </button>

        {/* Download with VIP status */}
        <button
          onClick={() => downloadTrack(song)}
          className="p-1.5 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-amber-400 hover:scale-110 active:scale-95 transition-all relative"
          title={isPro ? `Download "${song.title}" (320kbps MP3)` : 'Download Track (VIP Subscription)'}
        >
          <Download className="w-4 h-4" />
          {!isPro && (
            <Crown className="w-2.5 h-2.5 text-amber-400 fill-amber-400 absolute -top-0.5 -right-0.5" />
          )}
        </button>

        {/* Like */}
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
