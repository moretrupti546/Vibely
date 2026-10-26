import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Crown,
  Sparkles,
  Check,
  Download,
  Zap,
  Disc3,
  ShieldCheck,
  ArrowRight,
  Music2,
  AlertTriangle,
  RotateCcw,
  Lock,
  LogIn
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePlayer } from '../../context/PlayerContext';
import { useToast } from '../../context/ToastContext';

export const SubscriptionModal = ({ isOpen, onClose, onSubscribed, song = null }) => {
  const { isPro, subscribeToPro, cancelSubscription, user, isAuthenticated } = useAuth();
  const { downloadTrack } = usePlayer();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [selectedPlan, setSelectedPlan] = useState('lifetime'); // 'monthly' | 'lifetime'
  const [activating, setActivating] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  if (!isOpen) return null;

  const handleActivate = () => {
    // Strictly require login before allowing user to get VIP Pro
    if (!isAuthenticated) {
      onClose();
      showToast('Please log in or sign up to activate VIP Pro! 🔐', 'info');
      navigate('/login?redirect=pro');
      return;
    }

    setActivating(true);
    setTimeout(() => {
      const success = subscribeToPro(selectedPlan === 'lifetime' ? 'VIP Lifetime Pass' : 'VIP Monthly Pro');
      setActivating(false);
      if (success) {
        onSubscribed && onSubscribed();
        if (song) {
          setTimeout(() => {
            downloadTrack(song);
          }, 400);
        }
        onClose();
      }
    }, 600);
  };

  const handleCancelPlan = () => {
    setCancelling(true);
    setTimeout(() => {
      cancelSubscription();
      setCancelling(false);
      setConfirmCancel(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-slate-900 via-vibely-surface to-slate-950 border border-purple-500/40 p-6 md:p-8 shadow-2xl shadow-purple-600/30 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Ambient Neon Background Glows */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-amber-500/15 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-purple-600/20 rounded-full blur-[90px] pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => {
            setConfirmCancel(false);
            onClose();
          }}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* VIEW 1: ACTIVE VIP MEMBER VIEW (MANAGE & CANCEL) */}
        {isPro ? (
          <div className="space-y-6 pt-2">
            <div className="text-center space-y-2.5">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-pink-500/20 border border-amber-500/50 text-amber-300 text-xs font-bold uppercase tracking-wider shadow-lg shadow-amber-500/10">
                <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Vibely VIP Active</span>
              </div>

              <h2 className="font-display text-2xl md:text-3xl font-black text-white">
                Your VIP Pro Plan is Active
              </h2>

              <p className="text-xs md:text-sm text-slate-300 max-w-sm mx-auto">
                You currently enjoy unrestricted 320kbps offline downloads, Lossless audio, and priority track sequencing.
              </p>
            </div>

            {/* Active Perks List */}
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-900/60 border border-emerald-500/30">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold text-white">Offline MP3 Downloads</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-900/60 border border-emerald-500/30">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold text-white">Lossless Studio Sound</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-900/60 border border-emerald-500/30">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold text-white">Priority Play Next</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-900/60 border border-emerald-500/30">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold text-white">VIP Crown Profile Badge</span>
              </div>
            </div>

            {/* Plan Info Card */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Current Plan</span>
                <div className="text-sm font-bold text-white mt-0.5">{user?.plan || 'Vibely VIP Pass'}</div>
                <div className="text-[11px] text-emerald-400 mt-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Active & Verified</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Crown className="w-5 h-5 fill-amber-400" />
              </div>
            </div>

            {/* Cancellation Confirmation or Action */}
            {confirmCancel ? (
              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 space-y-3 animate-in fade-in duration-200">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-white">Cancel VIP Pro Plan?</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      You will revert to the standard Free plan and lose 320kbps offline MP3 downloads and studio acoustic streaming.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 pt-1">
                  <button
                    onClick={handleCancelPlan}
                    disabled={cancelling}
                    className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg transition-all hover:scale-105 disabled:opacity-50"
                  >
                    {cancelling ? 'Cancelling...' : 'Yes, Cancel VIP Plan'}
                  </button>
                  <button
                    onClick={() => setConfirmCancel(false)}
                    className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
                  >
                    Keep VIP Plan
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={() => setConfirmCancel(true)}
                  className="w-full py-3 px-4 rounded-2xl text-xs font-semibold text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-all flex items-center justify-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Cancel VIP Subscription</span>
                </button>

                <p className="text-[11px] text-center text-slate-400">
                  Cancel anytime in 1 click. Zero cancellation fees.
                </p>
              </div>
            )}
          </div>
        ) : (
          /* VIEW 2: UPGRADE TO VIP / START TRIAL VIEW */
          <div className="space-y-6 pt-2">
            {/* Modal Header */}
            <div className="text-center space-y-2.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-purple-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider shadow-lg shadow-amber-500/10">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>Vibely VIP Experience</span>
              </div>

              <h2 className="font-display text-2xl md:text-3xl font-black text-white">
                Unlock Offline Downloads & Studio Audio
              </h2>

              <p className="text-xs md:text-sm text-slate-300 max-w-sm mx-auto">
                {song ? (
                  <span>
                    Download <strong className="text-white">"{song.title}"</strong> and take entire studio collections anywhere, zero data required.
                  </span>
                ) : (
                  'Elevate your frequency with studio-grade downloads and high-fidelity soundscapes.'
                )}
              </p>
            </div>

            {/* VIP Benefits List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-900/60 border border-purple-500/20">
                <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300 shrink-0">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white">Offline Downloads</div>
                  <div className="text-slate-400 text-[11px]">Save 320kbps MP3s directly to your device</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-900/60 border border-amber-500/20">
                <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white">Lossless Audio</div>
                  <div className="text-slate-400 text-[11px]">24-Bit studio acoustics & spatial sound</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-900/60 border border-pink-500/20">
                <div className="p-1.5 rounded-lg bg-pink-500/20 text-pink-300 shrink-0">
                  <Music2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white">Priority Queueing</div>
                  <div className="text-slate-400 text-[11px]">Play Next & unlimited track sequencing</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-900/60 border border-cyan-500/20">
                <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 shrink-0">
                  <Crown className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white">VIP Crown Badge</div>
                  <div className="text-slate-400 text-[11px]">Golden verified status on your profile</div>
                </div>
              </div>
            </div>

            {/* Plan Selectors */}
            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => setSelectedPlan('lifetime')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  selectedPlan === 'lifetime'
                    ? 'bg-gradient-to-tr from-purple-900/40 via-amber-950/30 to-purple-950/40 border-amber-500/60 shadow-lg shadow-amber-500/10 scale-[1.02]'
                    : 'bg-slate-900/50 border-vibely-border hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">BEST VALUE</span>
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                      selectedPlan === 'lifetime'
                        ? 'border-amber-400 bg-amber-400 text-black'
                        : 'border-slate-600'
                    }`}
                  >
                    {selectedPlan === 'lifetime' && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
                <div className="font-bold text-sm text-white mt-1">Lifetime Pass</div>
                <div className="text-xs text-amber-300 font-extrabold mt-0.5">
                  $19.99 <span className="text-[10px] font-normal text-slate-400">one-time</span>
                </div>
              </div>

              <div
                onClick={() => setSelectedPlan('monthly')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  selectedPlan === 'monthly'
                    ? 'bg-gradient-to-tr from-purple-900/40 via-purple-950/30 to-indigo-950/40 border-purple-500/60 shadow-lg shadow-purple-500/10 scale-[1.02]'
                    : 'bg-slate-900/50 border-vibely-border hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">MONTHLY</span>
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                      selectedPlan === 'monthly'
                        ? 'border-purple-400 bg-purple-400 text-white'
                        : 'border-slate-600'
                    }`}
                  >
                    {selectedPlan === 'monthly' && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
                <div className="font-bold text-sm text-white mt-1">Vibely Pro</div>
                <div className="text-xs text-purple-300 font-extrabold mt-0.5">
                  $4.99 <span className="text-[10px] font-normal text-slate-400">/ month</span>
                </div>
              </div>
            </div>

            {/* Authentication Notice if not logged in */}
            {!isAuthenticated && (
              <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/40 flex items-center justify-between gap-3 text-xs animate-in fade-in">
                <div className="flex items-center gap-2.5 text-slate-300">
                  <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Log in is required to activate and link your VIP Pro pass.</span>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    navigate('/login?redirect=pro');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs whitespace-nowrap shadow-md transition-all hover:scale-105"
                >
                  Log In
                </button>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="space-y-2.5">
              <button
                onClick={handleActivate}
                disabled={activating}
                className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm bg-gradient-to-r from-amber-500 via-purple-600 to-pink-600 hover:from-amber-400 hover:to-pink-500 text-white shadow-xl shadow-purple-600/30 hover:shadow-purple-600/50 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group"
              >
                {activating ? (
                  <Sparkles className="w-5 h-5 animate-spin" />
                ) : !isAuthenticated ? (
                  <>
                    <LogIn className="w-4 h-4 text-amber-200" />
                    <span>Log In to Get VIP Pro (Free Trial)</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                ) : (
                  <>
                    <Crown className="w-4 h-4 text-amber-200 fill-amber-200" />
                    <span>Start 30-Day Free VIP Trial (Instant Access)</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-slate-400">
                {isAuthenticated
                  ? 'Cancel anytime in 1 click. Zero hidden fees. Includes instant offline downloads.'
                  : 'Account required. Sign in or sign up in seconds to unlock VIP downloads.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default SubscriptionModal;
