import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Play, Shuffle, Edit3, Trash2, ArrowLeft, Loader2, Music2 } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import { useToast } from '../context/ToastContext';
import { SongRow } from '../components/cards/SongRow';
import { EditPlaylistModal } from '../components/modals/EditPlaylistModal';
import { DeletePlaylistModal } from '../components/modals/DeletePlaylistModal';
import { DEFAULT_PLAYLISTS, DEFAULT_SONGS } from '../data/catalog';

const formatSeconds = (secs) => {
  if (!secs) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

export const PlaylistDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { playSong } = usePlayer();
  const { showToast } = useToast();

  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const fetchPlaylist = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/playlists/${id}`);
      if (res.data?.success && res.data.data) {
        setPlaylist(res.data.data);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn('Backend playlist fetch notice, checking local storage:', err?.message);
    }

    // Check user created playlists in localStorage
    try {
      const saved = localStorage.getItem('vibely_user_playlists');
      if (saved) {
        const userPlaylists = JSON.parse(saved);
        const match = userPlaylists.find((p) => p.id === id);
        if (match) {
          setPlaylist({
            ...match,
            tracks: match.tracks || match.songs || [],
            isOwner: true
          });
          setLoading(false);
          return;
        }
      }
    } catch (e) {}

    const found = DEFAULT_PLAYLISTS.find((p) => p.id === id || p.title.toLowerCase().includes(id.toLowerCase())) || DEFAULT_PLAYLISTS[0];
    setPlaylist(found);
    setLoading(false);
  };

  useEffect(() => {
    fetchPlaylist();

    const handleUpdate = () => {
      fetchPlaylist();
    };

    window.addEventListener('vibely_playlist_updated', handleUpdate);
    return () => {
      window.removeEventListener('vibely_playlist_updated', handleUpdate);
    };
  }, [id]);

  const handlePlayAll = () => {
    if (playlist?.tracks?.length > 0) {
      playSong(playlist.tracks[0], playlist.tracks);
    }
  };

  const handleShuffle = () => {
    if (playlist?.tracks?.length > 0) {
      const shuffled = [...playlist.tracks].sort(() => Math.random() - 0.5);
      playSong(shuffled[0], shuffled);
    }
  };

  const handleRemoveTrack = async (songId) => {
    const updatedTracks = (playlist.tracks || []).filter((s) => s.id !== songId);
    const updatedPl = {
      ...playlist,
      tracks: updatedTracks,
      songCount: updatedTracks.length
    };
    setPlaylist(updatedPl);

    // Save to localStorage
    try {
      const saved = localStorage.getItem('vibely_user_playlists');
      if (saved) {
        const list = JSON.parse(saved).map((p) => (p.id === playlist.id ? updatedPl : p));
        localStorage.setItem('vibely_user_playlists', JSON.stringify(list));
      }
    } catch (e) {}

    showToast('Track removed from playlist.', 'info');
    window.dispatchEvent(new CustomEvent('vibely_playlist_updated', { detail: updatedPl }));

    try {
      await api.delete(`/playlists/${playlist.id}/tracks/${songId}`);
    } catch (err) {
      console.warn('Backend remove track notice:', err?.message);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex items-center justify-center text-purple-400">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="py-24 text-center text-slate-400">
        <p>Playlist not found.</p>
        <Link to="/library" className="text-purple-400 hover:underline mt-2 inline-block">
          Return to Library
        </Link>
      </div>
    );
  }

  const isOwner = playlist.isOwner || (playlist.id && String(playlist.id).startsWith('playlist-user')) || (user && playlist.userId === user.id);

  return (
    <div className="space-y-8 pb-24">
      <Link
        to="/library"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Library</span>
      </Link>

      {/* Playlist Header */}
      <section className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 p-6 md:p-8 rounded-3xl bg-vibely-surface border border-vibely-border">
        <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden shadow-2xl shrink-0 bg-slate-900 border border-white/10">
          <img
            src={playlist.coverArt || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80'}
            alt={playlist.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 space-y-3 text-center md:text-left">
          <div className="inline-block px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider">
            Playlist
          </div>

          <h1 className="font-display text-3xl md:text-5xl font-black text-white leading-tight">
            {playlist.title}
          </h1>

          {playlist.description && (
            <p className="text-sm text-slate-300 max-w-2xl">{playlist.description}</p>
          )}

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-sm text-slate-300">
            <span className="font-semibold text-white">Created by {playlist.user?.name || 'Vibely'}</span>
            <span>•</span>
            <span>{playlist.trackCount || 0} songs</span>
            <span>•</span>
            <span className="text-slate-400 font-mono">{formatSeconds(playlist.totalDuration)}</span>
          </div>

          {/* Action Row */}
          <div className="pt-3 flex flex-wrap items-center justify-center md:justify-start gap-4">
            {playlist.tracks?.length > 0 && (
              <>
                <button
                  onClick={handlePlayAll}
                  className="flex items-center gap-2.5 px-7 py-3 rounded-full font-bold text-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-xl shadow-purple-600/30 hover:scale-105 transition-all"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>Play</span>
                </button>

                <button
                  onClick={handleShuffle}
                  className="p-3 rounded-full bg-vibely-surface border border-vibely-border text-slate-300 hover:text-white transition-all hover:scale-105"
                  title="Shuffle Playlist"
                >
                  <Shuffle className="w-5 h-5" />
                </button>
              </>
            )}

            {isOwner && (
              <>
                <button
                  onClick={() => setEditModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-3 rounded-full bg-vibely-surface border border-vibely-border text-slate-300 hover:text-white transition-all hover:scale-105 text-sm font-semibold"
                  title="Edit details"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => setDeleteModalOpen(true)}
                  className="p-3 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-all hover:scale-105"
                  title="Delete playlist"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Tracklist Table */}
      <section className="p-4 md:p-6 rounded-3xl bg-vibely-surface border border-vibely-border space-y-2">
        {playlist.tracks?.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <Music2 className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="font-display font-bold text-lg text-white">This playlist is empty</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Browse tracks on the Home or Explore page, click the '+' icon on any track, and add it right into this playlist!
            </p>
            <Link
              to="/explore"
              className="inline-block px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-lg shadow-purple-600/30"
            >
              Explore Music
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between pb-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-vibely-border">
              <div className="flex items-center gap-4">
                <span className="w-6 text-center">#</span>
                <span>Title</span>
              </div>
              <span className="w-10 text-right">Time</span>
            </div>

            <div className="space-y-1">
              {playlist.tracks.map((song, idx) => (
                <SongRow
                  key={`${song.id}-${idx}`}
                  song={song}
                  index={idx}
                  queueList={playlist.tracks}
                  showAlbum={true}
                  onRemove={isOwner ? handleRemoveTrack : null}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* Modals */}
      <EditPlaylistModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        playlist={playlist}
        onUpdated={(updated) => setPlaylist((prev) => ({ ...prev, ...updated }))}
      />

      <DeletePlaylistModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        playlist={playlist}
        onDeleted={() => navigate('/library')}
      />
    </div>
  );
};
