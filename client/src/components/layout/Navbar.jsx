import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Search, User, LogOut, Settings, Heart, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 bg-vibely-dark/80 backdrop-blur-xl border-b border-vibely-border flex items-center justify-between px-6 transition-all">
      {/* History Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-full bg-vibely-surface border border-vibely-border flex items-center justify-center text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
          title="Go back"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => navigate(1)}
          className="w-8 h-8 rounded-full bg-vibely-surface border border-vibely-border flex items-center justify-center text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
          title="Go forward"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Global Quick Search Shortcut on Explore page */}
      {location.pathname !== '/explore' && (
        <div
          onClick={() => navigate('/explore')}
          className="hidden sm:flex items-center gap-2.5 px-4 py-2 rounded-full bg-vibely-surface/80 border border-vibely-border text-slate-400 hover:text-slate-200 hover:border-purple-500/40 text-sm cursor-pointer w-72 transition-all shadow-inner"
        >
          <Search className="w-4 h-4 text-purple-400" />
          <span>What do you want to play?</span>
        </div>
      )}

      {/* User Actions / Auth Pill */}
      <div className="flex items-center gap-3">
        {isAuthenticated ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-vibely-surface border border-vibely-border hover:border-purple-500/40 transition-all group"
            >
              <img
                src={user?.avatar || '/assets/playlists/default-playlist.svg'}
                alt={user?.name || 'User'}
                className="w-7 h-7 rounded-full object-cover border border-purple-500/50"
                onError={(e) => {
                  e.currentTarget.src = '/assets/playlists/default-playlist.svg';
                }}
              />
              <span className="text-sm font-semibold text-slate-200 group-hover:text-white">
                {user?.name}
              </span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-vibely-surface/95 backdrop-blur-xl border border-vibely-border shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 border-b border-vibely-border/60">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Signed in as</p>
                  <p className="text-sm font-medium text-white truncate">{user?.email}</p>
                </div>

                <div className="py-1">
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                  >
                    <User className="w-4 h-4 text-purple-400" />
                    <span>Your Profile</span>
                  </Link>

                  <Link
                    to="/library?tab=liked"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                  >
                    <Heart className="w-4 h-4 text-pink-400" />
                    <span>Liked Songs</span>
                  </Link>
                </div>

                <div className="border-t border-vibely-border/60 pt-1">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <Link
              to="/register"
              className="text-sm font-semibold text-slate-300 hover:text-white px-4 py-2 rounded-full transition-colors"
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className="text-sm font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-5 py-2 rounded-full shadow-lg shadow-purple-600/25 transition-all hover:scale-105"
            >
              Log In
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
