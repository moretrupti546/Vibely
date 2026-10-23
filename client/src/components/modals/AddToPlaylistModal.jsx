import React, { useState, useEffect } from 'react';
import { X, Plus, Check, ListMusic, Loader2 } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const AddToPlaylistModal = ({ isOpen, onClose, song }) => {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      setLoading(true);
      api.get('/users/me/library')
        .then((res) => {
          if (res.data.success) {
            setPlaylists(res.data.data.playlists || []);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [isOpen, isAuthenticated]);

  if (!isOpen || !song) return null;

  const handleAdd = async (playlistId, playlistTitle) => {
    setAddingId(playlistId);
    try {
      const res = await api.post(`/playlists/${playlistId}/tracks`, { songId: song.id });
      if (res.data.success) {
        showToast(`Added "${song.title}" to "${playlistTitle}" ✨`, 'success');
        onClose();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add track to playlist.', 'error');
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
