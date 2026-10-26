import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  Heart,
  ListMusic,
  Loader2,
  Disc3,
  Sparkles
} from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { QueueDrawer } from './QueueDrawer';

const formatTime = (secs) => {
  if (isNaN(secs) || secs < 0) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

export const BottomPlayer = () => {
  const {
    currentSong,
    isPlaying,
    isAudioLoading,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    audioMode,
    toggleAudioMode,
    togglePlay,
    seek,
    setVolumeLevel,
    toggleMute,
    playNext,
    playPrev,
    toggleShuffle,
    toggleRepeat,
    isSongLiked,
    toggleLike
  } = usePlayer();

  const [queueOpen, setQueueOpen] = useState(false);

  if (!currentSong) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isLiked = isSongLiked(currentSong.id);

  return (
    <>
      <footer className="fixed bottom-0 left-0 right-0 h-20 md:h-22 bg-vibely-surface/95 backdrop-blur-2xl border-t border-vibely-border z-40 px-4 md:px-6 flex items-center justify-between shadow-2xl">
        {/* Left: Track Info */}
        <div className="flex items-center gap-3.5 w-1/4 min-w-[160px] md:min-w-[220px]">
          <Link to={`/song/${currentSong.id}`} className="shrink-0 group relative overflow-hidden rounded-xl">
            <img
              src={currentSong.coverArt}
              alt={currentSong.title}
              className="w-12 h-12 md:w-14 md:h-14 object-cover shadow-md group-hover:scale-105 transition-transform"
            />
          </Link>
          <div className="min-w-0 pr-2">
            <div className="flex items-center gap-1.5">
              <Link
                to={`/song/${currentSong.id}`}
                className="font-semibold text-sm md:text-base text-white hover:underline truncate"
              >
                {currentSong.title}
              </Link>
              {isPlaying && (
                <div className="hidden sm:flex items-end gap-0.5 h-3.5 shrink-0 px-1 py-0.5 rounded bg-purple-500/10" title="Audio playing">
                  <span className="w-0.5 bg-purple-400 rounded-full eq-bar-1 h-3" />
                  <span className="w-0.5 bg-pink-400 rounded-full eq-bar-2 h-2.5" />
                  <span className="w-0.5 bg-indigo-400 rounded-full eq-bar-3 h-3" />
                </div>
              )}
            </div>
            <Link
              to={`/artist/${currentSong.artist?.id}`}
              className="block text-xs text-slate-400 hover:text-purple-300 truncate"
            >
              {currentSong.artist?.name}
            </Link>
          </div>
          <button
            onClick={() => toggleLike(currentSong)}
            className="text-slate-400 hover:scale-110 transition-transform p-1.5 shrink-0"
            title={isLiked ? 'Remove from Liked Songs' : 'Save to Liked Songs'}
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isLiked ? 'text-pink-500 fill-pink-500' : 'hover:text-white'
              }`}
            />
          </button>
        </div>

        {/* Center: Controls & Seekbar */}
        <div className="flex flex-col items-center gap-1.5 flex-1 max-w-xl px-2">
          <div className="flex items-center gap-4 md:gap-6">
            <button
              onClick={toggleShuffle}
              className={`relative p-1.5 transition-colors ${
                isShuffle ? 'text-purple-400' : 'text-slate-400 hover:text-white'
              }`}
              title="Shuffle"
            >
              <Shuffle className="w-4 h-4 md:w-5 md:h-5" />
              {isShuffle && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-purple-400 rounded-full" />}
            </button>

            <button
              onClick={playPrev}
              className="p-1.5 text-slate-300 hover:text-white hover:scale-105 transition-transform"
              title="Previous"
            >
              <SkipBack className="w-5 h-5 fill-current" />
            </button>

            <button
              onClick={togglePlay}
              className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 hover:from-purple-500 hover:to-indigo-400 text-white flex items-center justify-center shadow-lg shadow-purple-600/30 hover:scale-105 transition-all"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isAudioLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            <button
              onClick={playNext}
              className="p-1.5 text-slate-300 hover:text-white hover:scale-105 transition-transform"
              title="Next"
            >
              <SkipForward className="w-5 h-5 fill-current" />
            </button>

            <button
              onClick={toggleRepeat}
              className={`relative p-1.5 transition-colors ${
                repeatMode !== 'off' ? 'text-purple-400' : 'text-slate-400 hover:text-white'
              }`}
              title="Repeat"
            >
              {repeatMode === 'one' ? (
                <Repeat1 className="w-4 h-4 md:w-5 md:h-5" />
              ) : (
                <Repeat className="w-4 h-4 md:w-5 md:h-5" />
              )}
              {repeatMode !== 'off' && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-purple-400 rounded-full" />}
            </button>

            <button
              onClick={toggleAudioMode}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
                audioMode === 'full'
                  ? 'bg-purple-600/20 text-purple-300 border-purple-500/30 hover:bg-purple-600/30'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30'
              }`}
              title={audioMode === 'full' ? 'Currently playing Full Song (click to switch to 30s Preview)' : 'Currently playing 30s Preview (click to switch to Full Song)'}
            >
              {audioMode === 'full' ? (
                <>
                  <Disc3 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Full Song</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>30s Preview</span>
                </>
              )}
            </button>
          </div>

          {/* Time & Slider */}
          <div className="w-full flex items-center gap-2.5 text-xs text-slate-400">
            <span className="w-10 text-right font-mono">{formatTime(currentTime)}</span>
            <div className="relative flex-1 flex items-center group">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={(e) => seek(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-full cursor-pointer appearance-none group-hover:h-2 transition-all"
                style={{
                  background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${progressPercent}%, #252840 ${progressPercent}%, #252840 100%)`
                }}
              />
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="w-10 font-mono">{formatTime(duration)}</span>
              <button
                onClick={toggleAudioMode}
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full transition-all border ${
                  audioMode === 'full'
                    ? 'bg-purple-600/20 text-purple-300 border-purple-500/30 hover:bg-purple-600/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30'
                }`}
                title={audioMode === 'full' ? 'Switch to 30s Preview' : 'Switch to Full Song'}
              >
                {audioMode === 'full' ? 'Full' : '30s'}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Volume & Queue */}
        <div className="hidden md:flex items-center justify-end gap-3 w-1/4">
          <button
            onClick={() => setQueueOpen(!queueOpen)}
            className={`p-2 rounded-lg transition-colors ${
              queueOpen ? 'text-purple-400 bg-purple-500/10' : 'text-slate-400 hover:text-white'
            }`}
            title="Play Queue"
          >
            <ListMusic className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="text-slate-400 hover:text-white transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-5 h-5 text-rose-400" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolumeLevel(parseFloat(e.target.value))}
              className="w-24 h-1.5 bg-slate-800 rounded-full cursor-pointer appearance-none"
              style={{
                background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${(isMuted ? 0 : volume) * 100}%, #252840 ${(isMuted ? 0 : volume) * 100}%, #252840 100%)`
              }}
            />
          </div>
        </div>
      </footer>

      {/* Slide-out Queue Drawer */}
      <QueueDrawer isOpen={queueOpen} onClose={() => setQueueOpen(false)} />
    </>
  );
};
