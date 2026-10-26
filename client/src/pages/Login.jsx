import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, Loader2, User, X, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Google OAuth Modal State
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const [googleUsername, setGoogleUsername] = useState('');
  const [googleEmail, setGoogleEmail] = useState('moretrupti546@gmail.com');
  const [googleLoading, setGoogleLoading] = useState(false);

  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(email, password, username);
    setLoading(false);

    if (res?.success) {
      navigate('/app');
    } else {
      setError(res?.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleGoogleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setGoogleLoading(true);

    const chosenUsername = (googleUsername || username || googleEmail.split('@')[0] || 'Vibely Listener').trim();
    const res = await loginWithGoogle(googleEmail, chosenUsername);
    setGoogleLoading(false);

    if (res?.success) {
      setGoogleModalOpen(false);
      navigate('/app');
    } else {
      setError(res?.message || 'Google sign-in failed. Please try again.');
    }
  };

  const handleQuickDemoLogin = async () => {
    setError('');
    setLoading(true);
    const res = await login('trupti@vibely.io', 'Vibely2026!', 'Trupti More');
    setLoading(false);
    if (res?.success) {
      navigate('/app');
    } else {
      setError(res?.message || 'Login failed. Please try again.');
    }
  };

  const handleFillDemo = () => {
    setUsername('Trupti More');
    setEmail('trupti@vibely.io');
    setPassword('Vibely2026!');
    setError('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-3xl bg-vibely-surface/90 backdrop-blur-xl border border-vibely-border shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-500 to-indigo-500 flex items-center justify-center mx-auto shadow-lg shadow-purple-600/30">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold text-white">
            Welcome Back to Vibely
          </h1>
          <p className="text-xs text-slate-400">
            Sign in with your Google account or credentials to enter your music world
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center font-medium">
            {error}
          </div>
        )}

        {/* Continue with Google Action Button */}
        <button
          type="button"
          onClick={() => {
            setGoogleUsername(username || 'Trupti More');
            setGoogleModalOpen(true);
          }}
          className="w-full py-3 px-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-vibely-border hover:border-purple-500/50 text-white text-sm font-semibold flex items-center justify-center gap-3 transition-all hover:scale-[1.02] shadow-xl group"
        >
          {/* Authentic Full-Color Google G Logo */}
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-vibely-border/80 w-full" />
          <span className="bg-vibely-surface px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
            or sign in with username
          </span>
          <div className="border-t border-vibely-border/80 w-full" />
        </div>

        {/* Main Login Form with Username */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Username / Display Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setGoogleUsername(e.target.value);
                }}
                placeholder="e.g. Trupti More or @trupti"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-vibely-border text-white text-sm focus:outline-none focus:border-purple-500 placeholder:text-slate-500"
              />
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-vibely-border text-white text-sm focus:outline-none focus:border-purple-500 placeholder:text-slate-500"
                required
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-vibely-border text-white text-sm focus:outline-none focus:border-purple-500 placeholder:text-slate-500"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.02]"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Sign In to Vibely</span>}
          </button>
        </form>

        {/* Quick Demo Options */}
        <div className="pt-2 border-t border-vibely-border/60 space-y-2">
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-pink-900/30 hover:bg-purple-900/60 border border-purple-500/40 text-purple-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all hover:border-purple-400 shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>1-Click Instant Demo Login (Trupti More)</span>
          </button>

          <button
            type="button"
            onClick={handleFillDemo}
            className="w-full py-2 px-4 rounded-xl bg-slate-900/60 hover:bg-slate-800/60 border border-slate-700/50 text-slate-400 hover:text-slate-200 text-[11px] font-medium flex items-center justify-center gap-1.5 transition-all"
          >
            <span>Autofill Demo Credentials</span>
          </button>
        </div>

        <p className="text-center text-xs text-slate-400">
          Want a new profile?{' '}
          <Link to="/register" className="text-purple-400 hover:underline font-semibold">
            Create an account
          </Link>
        </p>
      </div>

      {/* Google Authentication Dialog Modal */}
      {googleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-vibely-border p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-vibely-border/60">
              <div className="flex items-center gap-2.5">
                <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span className="font-display font-bold text-base text-white">Sign In with Google</span>
              </div>
              <button
                type="button"
                onClick={() => setGoogleModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Enter your desired <strong className="text-purple-300">Username</strong> and select your Google account to connect seamlessly to Vibely.
            </p>

            <form onSubmit={handleGoogleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Your Username / Display Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={googleUsername}
                    onChange={(e) => setGoogleUsername(e.target.value)}
                    placeholder="Enter your username (e.g. Trupti More)"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-vibely-border text-white text-sm focus:outline-none focus:border-purple-500"
                    required
                  />
                  <User className="w-4 h-4 text-purple-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Google Account Email *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={googleEmail}
                    onChange={(e) => setGoogleEmail(e.target.value)}
                    placeholder="your.email@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-vibely-border text-white text-sm focus:outline-none focus:border-purple-500"
                    required
                  />
                  <Mail className="w-4 h-4 text-purple-400 absolute left-3.5 top-3" />
                </div>
              </div>

              {/* Quick Preset Google Accounts */}
              <div className="p-3 rounded-2xl bg-slate-950/70 border border-vibely-border/80 space-y-2">
                <span className="block text-[11px] font-semibold text-slate-400">
                  Quick Select Google Account:
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setGoogleEmail('moretrupti546@gmail.com');
                    if (!googleUsername) setGoogleUsername('Trupti More');
                  }}
                  className="w-full p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 flex items-center justify-between text-left transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-purple-600/30 text-purple-300 text-xs font-bold flex items-center justify-center border border-purple-500/40">
                      T
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-white group-hover:text-purple-300">
                        Trupti More
                      </span>
                      <span className="block text-[10px] text-slate-400">moretrupti546@gmail.com</span>
                    </div>
                  </div>
                  {googleEmail === 'moretrupti546@gmail.com' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setGoogleModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={googleLoading}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50 hover:scale-105"
                >
                  {googleLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Authorize & Sign In</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
