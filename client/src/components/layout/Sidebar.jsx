import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Compass, Library, PlusSquare, Heart, Music, Disc3, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export const Sidebar = ({ onOpenCreatePlaylist }) => {
  const { isAuthenticated, user } = useAuth();
  const [userPlaylists, setUserPlaylists] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      api.get('/users/me/library')
        .then((res) => {
          if (res.data.success && res.data.data.playlists) {
            setUserPlaylists(res.data.data.playlists);
          }
        })
        .catch(() => {});
    } else {
      setUserPlaylists([]);
    }
  }, [isAuthenticated]);

  return (
    <aside className="w-64 bg-vibely-surface/90 border-r border-vibely-border flex flex-col h-full select-none z-20 shrink-0">
      {/* Brand Logo */}
      <div className="p-6 pb-4">
        <NavLink to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:scale-105 transition-transform duration-300">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-display text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-purple-300 bg-clip-text text-transparent">
              Vibely<span className="text-purple-400">.</span>
            </span>
            <span className="block text-[10px] uppercase font-bold tracking-widest text-purple-400/80 -mt-1">
              Feel Every Beat
            </span>
          </div>
        </NavLink>
      </div>

      {/* Main Navigation */}
      <div className="px-3 py-2 space-y-1">
        <NavLink
          to="/app"
          className={({ isActive }) =>
            `flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
              isActive
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-lg shadow-purple-500/10'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`
          }
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/explore"
          className={({ isActive }) =>
            `flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
              isActive
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-lg shadow-purple-500/10'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`
          }
        >
          <Compass className="w-5 h-5" />
          <span>Explore</span>
        </NavLink>

        <NavLink
          to="/library"
          className={({ isActive }) =>
            `flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
              isActive
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-lg shadow-purple-500/10'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`
          }
        >
          <Library className="w-5 h-5" />
          <span>Your Library</span>
        </NavLink>

        <NavLink
          to="/"
          className="flex items-center gap-3.5 px-4 py-2.5 rounded-xl font-medium text-xs text-slate-400 hover:text-purple-300 hover:bg-slate-800/40 transition-all duration-200"
        >
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>Landing Page</span>
        </NavLink>
      </div>

      <div className="my-2 border-t border-vibely-border/60 mx-4" />

      {/* Quick Actions */}
      <div className="px-3 space-y-1">
        <button
          onClick={() => {
            if (!isAuthenticated) {
              navigate('/login');
            } else {
              onOpenCreatePlaylist();
            }
          }}
          className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/40 text-sm font-medium transition-all group"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-500/30 to-pink-500/30 border border-purple-500/40 flex items-center justify-center group-hover:scale-110 transition-transform">
            <PlusSquare className="w-4 h-4 text-purple-300" />
          </div>
          <span>Create Playlist</span>
        </button>

        <NavLink
          to="/library?tab=liked"
          className={({ isActive }) =>
            `flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive
                ? 'text-pink-300 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`
          }
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-700 to-pink-600 flex items-center justify-center shadow-md shadow-pink-500/20">
            <Heart className="w-3.5 h-3.5 text-white fill-white" />
          </div>
          <span>Liked Songs</span>
        </NavLink>
      </div>

      {/* Scrollable Playlist Section */}
      <div className="mt-4 flex-1 overflow-y-auto px-4 pb-24">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-3">
          Your Playlists
        </div>
        {userPlaylists.length > 0 ? (
          <div className="space-y-0.5">
            {userPlaylists.map((pl) => (
              <NavLink
                key={pl.id}
                to={`/playlist/${pl.id}`}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-lg text-sm truncate transition-colors ${
                    isActive
                      ? 'text-purple-300 font-medium bg-purple-500/10'
                      : 'text-slate-400 hover:text-slate-200'
                  }`
                }
              >
                {pl.title}
              </NavLink>
            ))}
          </div>
        ) : (
          <div className="px-3 py-4 text-xs text-slate-400">
            {isAuthenticated
              ? 'No playlists yet. Create one above!'
              : 'Sign in to access your personal playlists.'}
          </div>
        )}
      </div>
    </aside>
  );
};
