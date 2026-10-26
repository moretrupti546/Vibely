import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, Music, Disc3 } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

const PLAYLIST_ARTWORK_MAP = {
  "Trupti's Bollywood Gold": '/assets/playlists/bollywood-gold.svg',
  'Late Night Synthwave & Neon Lights': '/assets/playlists/synthwave-nights.svg',
  'Wanderlust: Highway & Road Trips': '/assets/playlists/wanderlust.svg',
  'Sufi & Soulful Divinity': '/assets/playlists/sufi-divinity.svg',
  'Desi Party & Dhol Anthems': '/assets/playlists/desi-party.svg',
  'Arijit Singh Soulful Anthems': '/assets/playlists/arijit-anthems.svg',
  'Bollywood Romance: Dil Ki Baatein': '/assets/playlists/bollywood-romance.svg',
};

const resolvePlaylistCover = (playlist) => {
  if (playlist?.title && PLAYLIST_ARTWORK_MAP[playlist.title]) {
    return PLAYLIST_ARTWORK_MAP[playlist.title];
  }
  if (playlist?.coverArt && !playlist.coverArt.includes('unsplash.com')) {
    return playlist.coverArt;
  }
  return '/assets/playlists/default-playlist.svg';
};

export const PlaylistCard = ({ playlist }) => {
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayer();
  const [imageError, setImageError] = useState(false);
  const [imgSrc, setImgSrc] = useState(() => resolvePlaylistCover(playlist));

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

  const handleImageError = () => {
    if (imgSrc !== '/assets/playlists/default-playlist.svg') {
      setImgSrc('/assets/playlists/default-playlist.svg');
    } else {
      setImageError(true);
    }
  };

  return (
    <Link
      to={`/playlist/${playlist.id}`}
      className={`group relative p-3.5 rounded-2xl bg-vibely-surface/70 hover:bg-vibely-surface border music-card-hover flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-within:border-purple-500/50 transition-all ${
        isPlaylistPlaying
          ? 'border-purple-500/70 shadow-lg shadow-purple-600/30 ring-1 ring-purple-500/40 bg-purple-950/20'
          : 'border-vibely-border hover:border-purple-500/40'
      }`}
    >
      {/* Artwork Container */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3 bg-gradient-to-br from-slate-900 via-purple-950/40 to-slate-900 shadow-md">
        {!imageError ? (
          <img
            src={imgSrc}
            alt={playlist.title}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out select-none"
            loading="lazy"
            onError={handleImageError}
          />
        ) : (
          /* Graceful Visual Fallback with Vibrant Gradient & Icon */
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-purple-900/60 via-pink-900/40 to-indigo-900/60 p-4 text-center">
            <Disc3 className="w-12 h-12 text-purple-400 animate-spin-slow mb-2 opacity-80" />
            <span className="text-xs font-bold text-white line-clamp-1">{playlist.title}</span>
            <span className="text-[10px] text-purple-300 uppercase tracking-widest mt-1">Vibely Mix</span>
          </div>
        )}

        {/* Floating Glassmorphic Play Button with Pulse & Glow */}
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-all duration-300 flex items-center justify-center ${
            isPlaylistPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100'
          }`}
        >
          <button
            onClick={handlePlayClick}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-indigo-500 text-white flex items-center justify-center shadow-xl shadow-purple-600/50 group-hover:shadow-pink-500/60 transform translate-y-2 group-hover:translate-y-0 group-focus-within:translate-y-0 hover:scale-115 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-300 transition-all duration-300"
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
          <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-purple-500/30 flex items-end gap-0.5 h-4.5 pointer-events-none shadow-lg">
            <span className="w-0.5 bg-purple-400 rounded-full eq-bar-1 h-3" />
            <span className="w-0.5 bg-pink-400 rounded-full eq-bar-2 h-4" />
            <span className="w-0.5 bg-cyan-400 rounded-full eq-bar-3 h-2.5" />
          </div>
        )}
      </div>

      {/* Playlist Meta */}
      <h4 className="font-semibold text-sm text-slate-100 truncate group-hover:text-purple-300 transition-colors">
        {playlist.title}
      </h4>
      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
        {playlist.description || `Curated by Vibely`}
      </p>
    </Link>
  );
};
