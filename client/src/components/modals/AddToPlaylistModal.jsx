import React, { useState, useEffect } from 'react';
import { X, Plus, Check, ListMusic, Loader2 } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { DEFAULT_PLAYLISTS } from '../../data/catalog';

export const AddToPlaylistModal = ({ isOpen, onClose, song }) => {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [playlists, setPlaylists] = useState(() => {
    try {
      const saved = localStorage.getItem('vibely_user_playlists');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  });
  const [loading, setLoading] = useState(false);
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    if (isOpen) {
      let local = [];
      try {
        const saved = localStorage.getItem('vibely_user_playlists');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) local = parsed;
        }
      } catch (e) {}
      setPlaylists(local);

      if (isAuthenticated) {
        setLoading(true);
        api.get('/users/me/library')
          .then((res) => {
            if (res.data?.success && Array.isArray(res.data.data?.playlists)) {
              const serverPlaylists = res.data.data.playlists;
              const merged = [...local];
              serverPlaylists.forEach((sp) => {
                if (!merged.some((p) => p.id === sp.id)) {
                  merged.push(sp);
                }
              });
              setPlaylists(merged);
              try {
                localStorage.setItem('vibely_user_playlists', JSON.stringify(merged));
              } catch (e) {}
            }
          })
          .catch(() => {})
          .finally(() => setLoading(false));
      }
    }
  }, [isOpen, isAuthenticated]);

  if (!isOpen || !song) return null;

  const handleAdd = async (playlistId, playlistTitle) => {
    setAddingId(playlistId);
    showToast(`Added "${song.title}" to "${playlistTitle}" ✨`, 'success');

    // Add song to playlist in localStorage
    try {
      const saved = localStorage.getItem('vibely_user_playlists');
      if (saved) {
        const list = JSON.parse(saved);
        const target = list.find((p) => p.id === playlistId);
        if (target) {
          const currentTracks = target.tracks || target.songs || [];
          if (!currentTracks.some((t) => t.id === song.id)) {
            target.tracks = [...currentTracks, song];
            target.songCount = target.tracks.length;
            localStorage.setItem('vibely_user_playlists', JSON.stringify(list));
            window.dispatchEvent(new CustomEvent('vibely_playlist_updated', { detail: target }));
          }
        }
      }
    } catch (e) {}

    onClose();

    try {
      await api.post(`/playlists/${playlistId}/tracks`, { songId: song.id });
    } catch (err) {
      console.warn('Backend add to playlist notice:', err?.message);
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-3xl bg-vibely-surface border border-vibely-border p-6 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-vibely-border">
          <div className="flex items-center gap-2">
            <ListMusic className="w-5 h-5 text-purple-400" />
            <h3 className="font-display font-bold text-lg text-white">Add to Playlist</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-vibely-border">
          <img src={song.coverArt} alt={song.title} className="w-10 h-10 rounded-lg object-cover" />
          <div className="min-w-0">
            <p className="font-semibold text-sm text-white truncate">{song.title}</p>
            <p className="text-xs text-slate-400 truncate">{song.artist?.name}</p>
          </div>
        </div>

        <div className="mt-4 max-h-60 overflow-y-auto space-y-1">
          {loading ? (
            <div className="py-8 flex justify-center text-purple-400">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : playlists.length === 0 ? (
            <div className="py-6 text-center text-sm text-slate-400">
              No playlists found. Create one in Your Library first!
            </div>
          ) : (
            playlists.map((pl) => (
              <button
                key={pl.id}
                onClick={() => handleAdd(pl.id, pl.title)}
                disabled={addingId === pl.id}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/60 transition-colors text-left group"
              >
                <div className="min-w-0 pr-2">
                  <p className="font-medium text-sm text-slate-200 group-hover:text-white truncate">
                    {pl.title}
                  </p>
                  <p className="text-xs text-slate-400">
                    {pl._count?.tracks || 0} songs
                  </p>
                </div>
                {addingId === pl.id ? (
                  <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4 text-slate-400 group-hover:text-purple-400" />
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
