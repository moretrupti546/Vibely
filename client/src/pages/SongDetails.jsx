import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Pause, Heart, Plus, Disc, User, Sparkles, Loader2, ArrowLeft } from 'lucide-react';
import api from '../services/api';
import { usePlayer } from '../context/PlayerContext';
import { SongCard } from '../components/cards/SongCard';
import { AddToPlaylistModal } from '../components/modals/AddToPlaylistModal';

const formatSeconds = (secs) => {
  if (!secs) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

export const SongDetails = () => {
  const { id } = useParams();
  const { currentSong, isPlaying, playSong, togglePlay, isSongLiked, toggleLike } = usePlayer();

  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addToPlaylistOpen, setAddToPlaylistOpen] = useState(false);

  useEffect(() => {
    const fetchSong = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/songs/${id}`);
        if (res.data.success) {
          setSong(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load song:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSong();
  }, [id]);

  if (loading) {
    return (
      <div className="py-24 flex items-center justify-center text-purple-400">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!song) {
    return (
      <div className="py-24 text-center text-slate-400">
        <p>Song not found.</p>
        <Link to="/" className="text-purple-400 hover:underline mt-2 inline-block">
          Return Home
        </Link>
      </div>
    );
  }

  const isCurrent = currentSong?.id === song.id;
  const isLiked = isSongLiked(song.id);

  return (
    <div className="space-y-10 pb-24">
      {/* Back button */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </Link>

      {/* Main Track Header */}
      <section className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 p-6 md:p-8 rounded-3xl bg-vibely-surface border border-vibely-border">
        <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden shadow-2xl shrink-0 bg-slate-900 border border-white/10">
          <img src={song.coverArt} alt={song.title} className="w-full h-full object-cover" />
        </div>

        <div className="flex-1 space-y-3 text-center md:text-left">
          <div className="inline-block px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider">
            {song.genre}
          </div>

          <h1 className="font-display text-3xl md:text-5xl font-extrabold text-white leading-tight">
            {song.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-sm text-slate-300">
            <Link to={`/artist/${song.artist?.id}`} className="font-semibold text-white hover:underline">
              {song.artist?.name}
            </Link>
            {song.album && (
              <>
                <span>•</span>
                <Link to={`/album/${song.album.id}`} className="hover:underline text-slate-300">
                  {song.album.title}
                </Link>
              </>
            )}
            <span>•</span>
            <span>{formatSeconds(song.duration)}</span>
            <span>•</span>
            <span className="text-purple-400 font-mono font-medium">{song.plays?.toLocaleString() || 0} plays</span>
          </div>

          {/* Action Row */}
          <div className="pt-3 flex items-center justify-center md:justify-start gap-4">
            <button
              onClick={() => {
                if (isCurrent) togglePlay();
                else playSong(song);
              }}
              className="flex items-center gap-2.5 px-7 py-3 rounded-full font-bold text-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-xl shadow-purple-600/30 hover:scale-105 transition-all"
            >
              {isCurrent && isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current" />
              )}
              <span>{isCurrent && isPlaying ? 'Pause' : 'Play Track'}</span>
            </button>

            <button
              onClick={() => toggleLike(song)}
              className={`p-3 rounded-full border border-vibely-border transition-all hover:scale-105 ${
                isLiked
                  ? 'bg-pink-500/20 border-pink-500/40 text-pink-500'
                  : 'bg-vibely-surface text-slate-300 hover:text-white'
              }`}
              title="Save to Liked Songs"
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-pink-500' : ''}`} />
            </button>

            <button
              onClick={() => setAddToPlaylistOpen(true)}
              className="p-3 rounded-full bg-vibely-surface border border-vibely-border text-slate-300 hover:text-white transition-all hover:scale-105"
              title="Add to playlist"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Artist Spotlight section */}
      {song.artist && (
        <section className="p-6 rounded-3xl bg-vibely-surface border border-vibely-border space-y-4">
          <h3 className="font-display font-bold text-lg text-white">About the Artist</h3>
          <div className="flex items-center gap-4">
            <img
              src={song.artist.image}
              alt={song.artist.name}
              className="w-16 h-16 rounded-full object-cover shadow-lg"
            />
            <div>
              <Link to={`/artist/${song.artist.id}`} className="font-bold text-lg text-white hover:underline">
                {song.artist.name}
              </Link>
              <p className="text-xs text-slate-400 mt-0.5 line-clamp-2 max-w-xl">
                {song.artist.bio || 'Verified Vibely artist creating next-generation sound.'}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Related Songs */}
      {song.relatedSongs && song.relatedSongs.length > 0 && (
        <section className="space-y-4">
          <h3 className="font-display font-bold text-xl text-white">Recommended / Related Vibes</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {song.relatedSongs.map((rel) => (
              <SongCard key={rel.id} song={rel} queueList={song.relatedSongs} />
            ))}
          </div>
        </section>
      )}

      {/* Add To Playlist Modal */}
      <AddToPlaylistModal
        isOpen={addToPlaylistOpen}
        onClose={() => setAddToPlaylistOpen(false)}
        song={song}
      />
    </div>
  );
};
