import React, { useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const DeletePlaylistModal = ({ isOpen, onClose, playlist, onDeleted }) => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  if (!isOpen || !playlist) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await api.delete(`/playlists/${playlist.id}`);
      if (res.data.success) {
        showToast(`Playlist "${playlist.title}" deleted.`, 'info');
        onDeleted && onDeleted();
        onClose();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete playlist.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-3xl bg-vibely-surface border border-rose-500/30 p-6 shadow-2xl animate-in zoom-in-95 text-center">
        <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <h3 className="font-display font-bold text-xl text-white">Delete Playlist?</h3>
        <p className="text-sm text-slate-300 mt-2">
          Are you sure you want to delete <span className="font-semibold text-white">"{playlist.title}"</span>? This action cannot be undone.
        </p>

        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 transition-all disabled:opacity-50"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
