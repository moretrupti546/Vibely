import React from 'react';
import { X, Music2, Trash2, Play } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

export const QueueDrawer = ({ isOpen, onClose }) => {
  const { queue, queueIndex, currentSong, playSong, removeFromQueue, clearQueue } = usePlayer();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-80 sm:w-96 bg-vibely-surface/95 backdrop-blur-2xl border-l border-vibely-border z-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-5 border-b border-vibely-border flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Music2 className="w-5 h-5 text-purple-400" />
          <h3 className="font-display font-bold text-lg text-white">Play Queue</h3>
        </div>
        <div className="flex items-center gap-2">
          {queue.length > 1 && (
            <button
              onClick={clearQueue}
              className="text-xs text-slate-400 hover:text-rose-400 px-2 py-1 rounded-md transition-colors"
              title="Clear queue"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Now Playing section */}
      {currentSong && (
        <div className="p-4 border-b border-vibely-border/60 bg-purple-950/20">
          <div className="text-[11px] font-bold uppercase tracking-wider text-purple-400 mb-2">
            Now Playing
          </div>
          <div className="flex items-center gap-3">
            <img
              src={currentSong.coverArt}
              alt={currentSong.title}
              className="w-12 h-12 rounded-lg object-cover shadow"
            />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-white truncate">{currentSong.title}</div>
              <div className="text-xs text-slate-400 truncate">{currentSong.artist?.name}</div>
            </div>
            <div className="flex gap-0.5 items-end h-4">
              <span className="w-1 bg-purple-500 rounded-full animate-bounce h-3" />
              <span className="w-1 bg-purple-400 rounded-full animate-bounce delay-100 h-4" />
              <span className="w-1 bg-pink-500 rounded-full animate-bounce delay-200 h-2" />
            </div>
          </div>
        </div>
      )}

      {/* Up Next List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          Next In Queue ({Math.max(0, queue.length - 1)})
        </div>

        {queue.length <= 1 ? (
          <div className="text-center py-12 text-slate-400 text-sm">
            Queue is empty. Click any song to keep the vibe going!
          </div>
        ) : (
          queue.map((song, idx) => {
            if (song.id === currentSong?.id && idx === queueIndex) return null;
            return (
              <div
                key={`${song.id}-${idx}`}
                className="group flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800/50 transition-colors"
              >
                <img
                  src={song.coverArt}
                  alt={song.title}
                  className="w-10 h-10 rounded-lg object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-slate-200 truncate group-hover:text-white">
                    {song.title}
                  </div>
                  <div className="text-xs text-slate-400 truncate">{song.artist?.name}</div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => playSong(song)}
                    className="p-1.5 text-slate-400 hover:text-purple-400 transition-colors"
                    title="Play now"
                  >
                    <Play className="w-4 h-4 fill-current" />
                  </button>
                  <button
                    onClick={() => removeFromQueue(song.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Remove from queue"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
