import React, { useState } from 'react';
import { X, Sparkles, Image, Loader2 } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const CreatePlaylistModal = ({ isOpen, onClose, onCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverArt, setCoverArt] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Please enter a playlist title.', 'error');
      return;
    }

    setLoading(true);
    const newPlaylistObj = {
      id: `playlist-user-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || 'Curated personal playlist',
      coverArt: coverArt.trim() || '/assets/playlists/default-playlist.svg',
      songCount: 0,
      songs: [],
      tracks: [],
      isOwner: true
    };

    try {
      const res = await api.post('/playlists', {
        title: title.trim(),
        description: description.trim(),
        coverArt: coverArt.trim() || undefined
      });

      const savedPl = (res.data?.success && res.data.data) ? { ...res.data.data, isOwner: true } : newPlaylistObj;
      
      // Save locally to user playlists
      try {
        const saved = localStorage.getItem('vibely_user_playlists');
        const list = saved ? JSON.parse(saved) : [];
        const updated = [savedPl, ...list.filter((p) => p.id !== savedPl.id)];
        localStorage.setItem('vibely_user_playlists', JSON.stringify(updated));
      } catch (e) {}

      window.dispatchEvent(new CustomEvent('vibely_playlist_updated', { detail: savedPl }));
      showToast('Playlist created successfully! ✨', 'success');
      onCreated && onCreated(savedPl);
    } catch (err) {
      // Local fallback for Vercel static preview
      try {
        const saved = localStorage.getItem('vibely_user_playlists');
        const list = saved ? JSON.parse(saved) : [];
        const updated = [newPlaylistObj, ...list.filter((p) => p.id !== newPlaylistObj.id)];
        localStorage.setItem('vibely_user_playlists', JSON.stringify(updated));
      } catch (e) {}

      window.dispatchEvent(new CustomEvent('vibely_playlist_updated', { detail: newPlaylistObj }));
      showToast('Playlist created successfully! ✨', 'success');
      onCreated && onCreated(newPlaylistObj);
    } finally {
      setTitle('');
      setDescription('');
      setCoverArt('');
      setLoading(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl bg-vibely-surface border border-vibely-border p-6 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-vibely-border">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h3 className="font-display font-bold text-lg text-white">Create New Playlist</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Playlist Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Late Night Drives"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-vibely-border text-white text-sm focus:outline-none focus:border-purple-500"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell others what vibe this playlist is..."
              rows="3"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-vibely-border text-white text-sm focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Cover Image URL (optional)
            </label>
            <div className="relative">
              <input
                type="url"
                value={coverArt}
                onChange={(e) => setCoverArt(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-vibely-border text-white text-sm focus:outline-none focus:border-purple-500"
              />
              <Image className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Create</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
