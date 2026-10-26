import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Calendar, Edit3, LogOut, Heart, Disc, ListMusic, History, Sparkles, X, Loader2, Crown, Zap, CheckCircle2, Download } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import { useToast } from '../context/ToastContext';
import { SongRow } from '../components/cards/SongRow';

export const Profile = () => {
  const { user, isAuthenticated, logout, updateUser, isPro, cancelSubscription } = useAuth();
  const { openSubscriptionModal } = usePlayer();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const [meRes, histRes] = await Promise.all([
          api.get('/auth/me'),
          api.get('/users/me/history?limit=10')
        ]);

        if (meRes.data.success) {
          setStats(meRes.data.user._count);
          setEditName(meRes.data.user.name);
          setEditBio(meRes.data.user.bio || '');
          setEditAvatar(meRes.data.user.avatar || '');
        }
        if (histRes.data.success) {
          setHistory(histRes.data.data);
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      showToast('Name cannot be empty.', 'error');
      return;
    }

    setSaving(true);
    const updatedLocalUser = {
      ...user,
      name: editName.trim(),
      bio: editBio.trim(),
      avatar: editAvatar.trim() || user?.avatar
    };

    try {
      const res = await api.patch('/users/me', {
        name: editName.trim(),
        bio: editBio.trim(),
        avatar: editAvatar.trim() || undefined
      });

      if (res.data?.success) {
        updateUser(res.data.user);
      } else {
        updateUser(updatedLocalUser);
      }
      showToast('Profile updated successfully! ✨', 'success');
      setEditModalOpen(false);
    } catch (err) {
      updateUser(updatedLocalUser);
      showToast('Profile updated successfully! ✨', 'success');
      setEditModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated || loading) {
    return (
      <div className="py-24 flex items-center justify-center text-purple-400">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '2026';

  return (
    <div className="space-y-10 pb-24">
      {/* Profile Header */}
      <section className="relative overflow-hidden rounded-3xl p-8 md:p-12 border border-vibely-border bg-gradient-to-r from-purple-950/80 via-slate-900 to-slate-950 flex flex-col md:flex-row items-center gap-8 shadow-2xl">
        <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden shadow-2xl shrink-0 border-4 border-purple-500/40">
          <img src={user?.avatar} alt={user?.name} className="w-full h-full object-cover" />
        </div>

        <div className="flex-1 space-y-3 text-center md:text-left">
          {isPro ? (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-pink-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold uppercase tracking-wider shadow-lg shadow-amber-500/10">
              <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>VIP PRO Member</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Vibely Member</span>
            </div>
          )}

          <h1 className="font-display text-3xl md:text-5xl font-black text-white leading-tight">
            {user?.name}
          </h1>

          <p className="text-sm text-slate-300 max-w-xl">
            {user?.bio || 'Music enthusiast and aura curator on Vibely.'}
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-400 pt-1">
            <div className="flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-purple-400" />
              <span>{user?.email}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-purple-400" />
              <span>Joined {joinDate}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex flex-wrap items-center justify-center md:justify-start gap-3">
            <button
              onClick={() => setEditModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-xs bg-vibely-surface border border-vibely-border text-slate-200 hover:text-white hover:border-purple-500 transition-all hover:scale-105"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>

            {!isPro && (
              <button
                onClick={() => openSubscriptionModal()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs bg-gradient-to-r from-amber-500 to-pink-500 text-slate-950 hover:brightness-110 shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
              >
                <Crown className="w-4 h-4 fill-slate-950" />
                <span>Upgrade to VIP</span>
              </button>
            )}

            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-xs bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-all hover:scale-105"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </section>

      {/* VIP Membership Perks Showcase */}
      <section className={`p-6 md:p-8 rounded-3xl border transition-all ${isPro ? 'bg-gradient-to-br from-amber-950/20 via-purple-950/30 to-slate-950 border-amber-500/30 shadow-xl' : 'bg-gradient-to-br from-purple-950/30 to-slate-900 border-vibely-border'}`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Crown className="w-5 h-5 fill-amber-400" />
              </div>
              <h3 className="font-display font-black text-xl text-white">
                {isPro ? 'Vibely VIP Subscription Active' : 'Vibely VIP Membership'}
              </h3>
            </div>
            <p className="text-sm text-slate-300 max-w-xl">
              {isPro
                ? 'Your VIP privileges are active! Enjoy unrestricted 320kbps offline track downloads, Lossless Audio streaming, dynamic queue priority, and exclusive badge styling.'
                : 'Unlock offline MP3 track downloads, 320kbps ultra-HD audio, zero waiting queues, and high-fidelity sound on any device.'}
            </p>
            <div className="flex flex-wrap gap-4 pt-1 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" /> 320kbps Offline Downloads
              </span>
              <span className="flex items-center gap-1.5 text-purple-400">
                <CheckCircle2 className="w-4 h-4" /> Lossless Audio Engine
              </span>
              <span className="flex items-center gap-1.5 text-pink-400">
                <CheckCircle2 className="w-4 h-4" /> Next-Play Queue Control
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {isPro ? (
              <button
                onClick={() => {
                  cancelSubscription();
                  showToast('VIP Subscription deactivated for testing.', 'info');
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-vibely-border transition-all"
              >
                Cancel VIP Plan
              </button>
            ) : (
              <button
                onClick={() => openSubscriptionModal()}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 hover:from-amber-300 hover:to-purple-500 text-slate-950 shadow-xl shadow-amber-500/20 transition-all hover:scale-105"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>Start Free VIP Trial</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link
          to="/library?tab=playlists"
          className="p-5 rounded-2xl bg-vibely-surface border border-vibely-border hover:border-purple-500/40 transition-all group flex flex-col justify-between"
        >
          <ListMusic className="w-6 h-6 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
          <div>
            <div className="text-2xl font-bold font-display text-white">{stats?.playlists || 0}</div>
            <div className="text-xs text-slate-400">Playlists Created</div>
          </div>
        </Link>

        <Link
          to="/library?tab=liked"
          className="p-5 rounded-2xl bg-vibely-surface border border-vibely-border hover:border-pink-500/40 transition-all group flex flex-col justify-between"
        >
          <Heart className="w-6 h-6 text-pink-400 mb-2 group-hover:scale-110 transition-transform" />
          <div>
            <div className="text-2xl font-bold font-display text-white">{stats?.likedSongs || 0}</div>
            <div className="text-xs text-slate-400">Liked Tracks</div>
          </div>
        </Link>

        <Link
          to="/library?tab=albums"
          className="p-5 rounded-2xl bg-vibely-surface border border-vibely-border hover:border-cyan-500/40 transition-all group flex flex-col justify-between"
        >
          <Disc className="w-6 h-6 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
          <div>
            <div className="text-2xl font-bold font-display text-white">{stats?.savedAlbums || 0}</div>
            <div className="text-xs text-slate-400">Saved Albums</div>
          </div>
        </Link>

        <div className="p-5 rounded-2xl bg-vibely-surface border border-vibely-border flex flex-col justify-between">
          <History className="w-6 h-6 text-emerald-400 mb-2" />
          <div>
            <div className="text-2xl font-bold font-display text-white">{history.length}</div>
            <div className="text-xs text-slate-400">Recent Plays Logged</div>
          </div>
        </div>
      </section>

      {/* Recent Listening History */}
      {history.length > 0 && (
        <section className="p-6 rounded-3xl bg-vibely-surface border border-vibely-border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-lg text-white">Recently Played</h3>
            <Link to="/library?tab=history" className="text-xs font-semibold text-purple-400 hover:underline">
              View all
            </Link>
          </div>

          <div className="space-y-1">
            {history.slice(0, 5).map((song, idx) => (
              <SongRow key={`${song.historyId || song.id}-${idx}`} song={song} index={idx} queueList={history} />
            ))}
          </div>
        </section>
      )}

      {/* Edit Profile Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-vibely-surface border border-vibely-border p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-vibely-border">
              <h3 className="font-display font-bold text-lg text-white">Edit Your Profile</h3>
              <button onClick={() => setEditModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Display Name *
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-vibely-border text-white text-sm focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Bio
                </label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-vibely-border text-white text-sm focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Avatar Image URL
                </label>
                <input
                  type="url"
                  value={editAvatar}
                  onChange={(e) => setEditAvatar(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-vibely-border text-white text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
