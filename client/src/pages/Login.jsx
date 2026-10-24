import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
    }
  };

  const handleQuickDemoLogin = async () => {
    setError('');
    setLoading(true);
    const res = await login('trupti@vibely.io', 'Vibely2026!');
    setLoading(false);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
    }
  };

  const handleFillDemo = () => {
    setEmail('trupti@vibely.io');
    setPassword('Vibely2026!');
    setError('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-3xl bg-vibely-surface/90 backdrop-blur-xl border border-vibely-border shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-500 to-indigo-500 flex items-center justify-center mx-auto shadow-lg shadow-purple-600/30">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold text-white">
            Welcome Back to Vibely
          </h1>
          <p className="text-xs text-slate-400">
            Enter your credentials to tune in to your saved vibrations
          </p>
          <div className="inline-block mt-1 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-medium">
            ✨ Any email address can sign in instantly
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="any.email@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-vibely-border text-white text-sm focus:outline-none focus:border-purple-500"
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
                placeholder="•••••••• (any password)"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-vibely-border text-white text-sm focus:outline-none focus:border-purple-500"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.02]"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Sign In with Any Email</span>}
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
    </div>
  );
};
