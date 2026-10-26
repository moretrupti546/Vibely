import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Play,
  Pause,
  Compass,
  ArrowRight,
  Disc3,
  Flame,
  Music,
  Heart,
  ListMusic,
  Sliders,
  Volume2,
  Shield,
  Zap,
  CheckCircle2,
  Menu,
  X,
  Radio,
  Headphones,
  Layers,
  ChevronRight,
  Activity
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import {
  DEFAULT_SONGS,
  DEFAULT_ARTISTS,
  DEFAULT_PLAYLISTS
} from '../data/catalog';
import { MusicVisualizer } from '../components/ui/MusicVisualizer';
import { PlaylistCard } from '../components/cards/PlaylistCard';
import { useScrollReveal } from '../hooks/useScrollReveal';

const MOODS = [
  {
    id: 'romance',
    title: 'Romantic Melodies',
    desc: 'Soul-stirring Bollywood ballads and acoustic love anthems.',
    genre: 'Bollywood',
    gradient: 'from-pink-600/30 to-purple-600/30',
    border: 'border-pink-500/30',
    iconColor: 'text-pink-400',
    cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'chill',
    title: 'Chill Vibes',
    desc: 'Rainy lo-fi loops, relaxing keys, and late-night calm.',
    genre: 'Lo-Fi',
    gradient: 'from-cyan-600/30 to-blue-600/30',
    border: 'border-cyan-500/30',
    iconColor: 'text-cyan-400',
    cover: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'sufi',
    title: 'Sufi & Soul',
    desc: 'Deep spiritual transcendence and classical devotion.',
    genre: 'Sufi',
    gradient: 'from-amber-600/30 to-orange-600/30',
    border: 'border-amber-500/30',
    iconColor: 'text-amber-400',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'party',
    title: 'Party Mode',
    desc: 'High-voltage desi dhol, wedding hits, and club bangers.',
    genre: 'Bollywood Dance',
    gradient: 'from-yellow-500/30 to-red-600/30',
    border: 'border-yellow-500/30',
    iconColor: 'text-yellow-400',
    cover: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'focus',
    title: 'Deep Focus',
    desc: 'Binaural synthscapes and 432Hz ambient frequencies.',
    genre: 'Ambient',
    gradient: 'from-emerald-600/30 to-teal-600/30',
    border: 'border-emerald-500/30',
    iconColor: 'text-emerald-400',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'late-night',
    title: 'Late Night',
    desc: 'Slowed & reverbed echoes for midnight drives and introspections.',
    genre: 'Synthwave',
    gradient: 'from-indigo-600/30 to-violet-600/30',
    border: 'border-indigo-500/30',
    iconColor: 'text-indigo-400',
    cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'workout',
    title: 'Workout Energy',
    desc: 'Pulsating bass and adrenaline surges to push your limits.',
    genre: 'Electronic',
    gradient: 'from-rose-600/30 to-orange-600/30',
    border: 'border-rose-500/30',
    iconColor: 'text-rose-400',
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'acoustic',
    title: 'Acoustic Sessions',
    desc: 'Raw unplugged guitars, intimate vocals, and pure melody.',
    genre: 'Indie Pop',
    gradient: 'from-purple-600/30 to-pink-600/30',
    border: 'border-purple-500/30',
    iconColor: 'text-purple-400',
    cover: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=600&q=80'
  }
];

const FEATURES = [
  {
    icon: Compass,
    title: 'Discover Authentic Music',
    desc: 'Access curated Bollywood chart-toppers, classic Sufi melodies, and international indie vibrations.',
    tag: 'Curated Daily'
  },
  {
    icon: ListMusic,
    title: 'Create Personal Playlists',
    desc: 'Build, edit, and organize custom mixes with custom artwork, descriptions, and track ordering.',
    tag: 'Full CRUD'
  },
  {
    icon: Heart,
    title: 'Save Favorite Tracks',
    desc: 'Instant one-click likes that seamlessly synchronize with your personal cloud library.',
    tag: 'Cloud Sync'
  },
  {
    icon: Zap,
    title: 'Seamless Playback Engine',
    desc: 'Persistent HTML5 audio with zero-delay local streaming, seek scrubbing, queue, and shuffle.',
    tag: 'Low Latency'
  },
  {
    icon: Sliders,
    title: 'Explore by Mood & Genre',
    desc: 'Filter songs effortlessly across romance, high-energy party, relaxing lo-fi, and meditation.',
    tag: 'Instant Filter'
  },
  {
    icon: Shield,
    title: 'Keep Your Library Organized',
    desc: 'Track recently played history, followed artists, saved albums, and personalized recommendations.',
    tag: 'Personalized'
  }
];

export const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayer();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [trendingSongs, setTrendingSongs] = useState(() => DEFAULT_SONGS.slice(0, 9));
  const [artists, setArtists] = useState(() => DEFAULT_ARTISTS.slice(0, 8));
  const [playlists, setPlaylists] = useState(() => DEFAULT_PLAYLISTS.slice(0, 6));
  const [loading, setLoading] = useState(false);
  const [policyModal, setPolicyModal] = useState(null); // 'privacy' | 'terms' | null

  // Scroll reveal observers for smooth viewport entry
  const [showcaseRef, showcaseVisible] = useScrollReveal({ threshold: 0.05 });
  const [visualizerRef, visualizerVisible] = useScrollReveal({ threshold: 0.05 });
  const [moodsRef, moodsVisible] = useScrollReveal({ threshold: 0.05 });
  const [featuresRef, featuresVisible] = useScrollReveal({ threshold: 0.05 });
  const [howItWorksRef, howItWorksVisible] = useScrollReveal({ threshold: 0.05 });
  const [ctaRef, ctaVisible] = useScrollReveal({ threshold: 0.05 });

  // Hero showcase songs
  const heroSong = DEFAULT_SONGS[0]; // Tum Hi Ho
  const secondaryHeroSong = DEFAULT_SONGS[1]; // Kesariya
  const tertiaryHeroSong = DEFAULT_SONGS[4]; // Agar Tum Saath Ho
  const isHeroPlaying = currentSong?.id === heroSong?.id && isPlaying;
  const isSecondaryPlaying = currentSong?.id === secondaryHeroSong?.id && isPlaying;
  const isTertiaryPlaying = currentSong?.id === tertiaryHeroSong?.id && isPlaying;

  useEffect(() => {
    let isMounted = true;
    const fetchShowcaseData = async () => {
      try {
        const [songsRes, artistsRes, playlistsRes] = await Promise.allSettled([
          api.get('/songs/trending'),
          api.get('/artists'),
          api.get('/playlists')
        ]);
        if (isMounted) {
          if (songsRes.status === 'fulfilled' && songsRes.value.data?.success && songsRes.value.data.data?.length > 0) {
            setTrendingSongs(songsRes.value.data.data.slice(0, 9));
          }
          if (artistsRes.status === 'fulfilled' && artistsRes.value.data?.success && artistsRes.value.data.data?.length > 0) {
            setArtists(artistsRes.value.data.data.slice(0, 8));
          }
          if (playlistsRes.status === 'fulfilled' && playlistsRes.value.data?.success && playlistsRes.value.data.data?.length > 0) {
            setPlaylists(playlistsRes.value.data.data.slice(0, 6));
          }
        }
      } catch (err) {
        console.warn('Could not load showcase data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchShowcaseData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleStartListening = () => {
    if (isAuthenticated) {
      navigate('/app');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="min-h-screen bg-vibely-dark text-slate-100 selection:bg-purple-600 selection:text-white font-body relative overflow-x-hidden">
      {/* Background Animated Neon Ambient Glows */}
      <div className="fixed top-0 left-1/4 w-[32rem] h-[32rem] bg-purple-600/20 rounded-full blur-[140px] pointer-events-none -z-10 animate-neon-purple" />
      <div className="fixed top-1/3 right-10 w-[30rem] h-[30rem] bg-pink-600/18 rounded-full blur-[160px] pointer-events-none -z-10 animate-neon-pink" />
      <div className="fixed bottom-10 left-10 w-[26rem] h-[26rem] bg-cyan-600/15 rounded-full blur-[140px] pointer-events-none -z-10 animate-neon-cyan" />

      {/* Sticky Navigation Bar */}
      <header className="sticky top-0 z-50 h-20 bg-vibely-dark/80 backdrop-blur-2xl border-b border-vibely-border">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo & Tagline */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-display text-2xl font-black tracking-tight text-white">
                Vibely<span className="text-purple-400">.</span>
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-purple-400/90 -mt-1">
                Feel Every Beat
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#hero" className="nav-link-animated hover:text-purple-300 transition-colors">
              Home
            </a>
            <Link to="/explore" className="nav-link-animated hover:text-purple-300 transition-colors">
              Explore
            </Link>
            <a href="#showcase" className="nav-link-animated hover:text-purple-300 transition-colors">
              Showcase
            </a>
            <a href="#moods" className="nav-link-animated hover:text-purple-300 transition-colors">
              Moods
            </a>
            <a href="#features" className="nav-link-animated hover:text-purple-300 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="nav-link-animated hover:text-purple-300 transition-colors">
              About
            </a>
          </nav>

          {/* Desktop CTA / Auth buttons */}
          <div className="hidden md:flex items-center gap-3.5">
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/app')}
                className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 hover:scale-[1.02] active:scale-95 transition-all"
              >
                <span>Go to Music App</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <button
                  onClick={handleStartListening}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <span>Start Listening</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-vibely-surface/98 backdrop-blur-2xl border-b border-vibely-border px-6 py-5 space-y-4 animate-in slide-in-from-top-4">
            <nav className="flex flex-col gap-3 font-medium text-slate-300">
              <a
                href="#hero"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-purple-300"
              >
                Home
              </a>
              <Link
                to="/explore"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-purple-300"
              >
                Explore Music
              </Link>
              <a
                href="#showcase"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-purple-300"
              >
                Showcase
              </a>
              <a
                href="#moods"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-purple-300"
              >
                Moods
              </a>
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-purple-300"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-purple-300"
              >
                About Vibely
              </a>
            </nav>
            <div className="pt-3 border-t border-vibely-border flex flex-col gap-2.5">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/app');
                  }}
                  className="w-full py-2.5 rounded-full bg-purple-600 text-white font-semibold text-center"
                >
                  Open Music Player
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2 text-center text-slate-300 font-medium"
                  >
                    Sign In
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleStartListening();
                    }}
                    className="w-full py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-center shadow-lg shadow-purple-600/30"
                  >
                    Start Listening
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative pt-12 md:pt-20 pb-20 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-visible">
        {/* Subtle Background Sound-Wave Graphic */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden flex items-center justify-center opacity-20">
          <svg className="w-[125%] h-72 text-purple-500 animate-wave-drift" viewBox="0 0 1200 220" fill="none" preserveAspectRatio="none">
            <path
              d="M0,110 C150,170 300,50 450,120 C600,190 750,30 900,110 C1050,190 1200,60 1350,110"
              stroke="url(#heroWaveGrad1)"
              strokeWidth="2.5"
              fill="none"
            />
            <path
              d="M0,130 C180,70 360,180 540,110 C720,40 900,170 1080,100 C1260,30 1380,150 1500,120"
              stroke="url(#heroWaveGrad2)"
              strokeWidth="1.75"
              strokeDasharray="5 5"
              fill="none"
            />
            <defs>
              <linearGradient id="heroWaveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#ec4899" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="heroWaveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ec4899" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.6" />
              </linearGradient>
            </defs>
          </svg>

          {/* Ambient Soundwave Equalizer Pulse in Background */}
          <div className="absolute inset-x-8 bottom-6 flex items-end justify-between h-20 opacity-20 pointer-events-none">
            {Array.from({ length: 24 }).map((_, i) => (
              <span
                key={i}
                className="w-1 bg-gradient-to-t from-purple-500/40 to-pink-500/40 rounded-t-full transition-all duration-300"
                style={{
                  height: isPlaying ? undefined : `${15 + Math.sin(i * 0.5) * 10}%`,
                  animation: isPlaying ? `eqBarPulse${['A','B','C','D','E','F','G','H'][i % 8]} ${0.8 + (i % 6) * 0.12}s ease-in-out infinite` : undefined
                }}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Hero Left: Headlines & CTAs with Staggered Entrance */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="animate-fade-in-up stagger-1 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
              <span>Feel Every Beat with 100% Studio Sound</span>
            </div>

            <h1 className="animate-fade-in-up stagger-2 font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-[1.1] tracking-tight">
              Your Music. <br className="hidden sm:inline" />
              Your Mood. <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-300 bg-clip-text text-transparent">
                Your Vibely.
              </span>
            </h1>

            <p className="animate-fade-in-up stagger-3 text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Discover new sounds, revisit your favorites, and find the perfect soundtrack for every moment.
              Featuring authentic Bollywood anthems, acoustic masterworks, and curated vibes.
            </p>

            {/* CTAs with Micro-Interaction Classes */}
            <div className="animate-fade-in-up stagger-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={handleStartListening}
                className="btn-premium w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-base shadow-xl shadow-purple-600/30 hover:shadow-purple-600/50 flex items-center justify-center gap-3"
              >
                <span>Start Listening</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <Link
                to="/explore"
                className="btn-premium w-full sm:w-auto px-7 py-4 rounded-2xl bg-vibely-surface/90 hover:bg-slate-800 border border-vibely-border hover:border-purple-500/40 text-slate-200 hover:text-white font-semibold text-base flex items-center justify-center gap-2.5 shadow-md"
              >
                <Compass className="w-5 h-5 text-purple-400" />
                <span>Explore Music</span>
              </Link>
            </div>

            {/* Stats row with Staggered Entrance */}
            <div className="animate-fade-in-up stagger-5 pt-6 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 border-t border-vibely-border/60">
              <div className="group">
                <span className="block font-display text-2xl font-bold text-white group-hover:text-purple-300 transition-colors">100%</span>
                <span className="text-xs text-slate-400">Authentic Audio</span>
              </div>
              <div className="group">
                <span className="block font-display text-2xl font-bold text-white group-hover:text-pink-300 transition-colors">0 ms</span>
                <span className="text-xs text-slate-400">Instant Streaming</span>
              </div>
              <div className="group">
                <span className="block font-display text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors">Free</span>
                <span className="text-xs text-slate-400">No Paywall</span>
              </div>
            </div>
          </div>

          {/* Hero Right: 3D Visual Cards, Floating Artwork & Equalizer */}
          <div className="lg:col-span-5 relative flex items-center justify-center animate-fade-in-scale stagger-3">
            {/* Soft backdrop neon glows */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/30 via-pink-500/25 to-indigo-600/20 rounded-3xl blur-3xl -z-10 animate-neon-purple" />
            <div className="absolute -inset-4 bg-pink-500/15 rounded-3xl blur-2xl -z-10 animate-neon-pink" />

            {/* Floating Satellite 1: Top-Right Trending Badge (Kesariya) */}
            <div
              onClick={() => {
                if (isSecondaryPlaying) {
                  togglePlay();
                } else {
                  playSong(secondaryHeroSong, trendingSongs);
                }
              }}
              className="animate-float-slow absolute -top-8 -right-2 sm:-right-6 z-20 hidden sm:flex items-center gap-3 p-3 rounded-2xl bg-vibely-surface/90 backdrop-blur-xl border border-purple-500/40 shadow-2xl shadow-purple-600/25 cursor-pointer hover:scale-105 transition-all group"
              title={isSecondaryPlaying ? 'Pause Kesariya' : 'Play Kesariya'}
            >
              <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 shadow-md">
                <img
                  src={secondaryHeroSong?.coverArt || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=300&q=80'}
                  alt={secondaryHeroSong?.title || 'Trending Track'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  {isSecondaryPlaying ? (
                    <Pause className="w-4 h-4 text-white fill-current" />
                  ) : (
                    <Play className="w-4 h-4 text-white fill-current ml-0.5" />
                  )}
                </div>
              </div>
              <div className="min-w-0 pr-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">Trending #1</span>
                </div>
                <h4 className="text-xs font-bold text-white truncate max-w-[120px]">
                  {secondaryHeroSong?.title || 'Kesariya'}
                </h4>
                <p className="text-[10px] text-slate-400 truncate max-w-[120px]">
                  {secondaryHeroSong?.artist?.name || 'Arijit Singh'}
                </p>
              </div>
              {isSecondaryPlaying && (
                <div className="flex items-end gap-0.5 h-4 shrink-0 pr-1">
                  <span className="w-0.5 bg-purple-400 rounded-full eq-bar-1 h-3" />
                  <span className="w-0.5 bg-pink-400 rounded-full eq-bar-2 h-4" />
                  <span className="w-0.5 bg-indigo-400 rounded-full eq-bar-3 h-2" />
                </div>
              )}
            </div>

            {/* Floating Satellite 2: Bottom-Left Hi-Res Studio Badge */}
            <div className="animate-float-reverse absolute -bottom-7 -left-2 sm:-left-6 z-20 flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-vibely-surface/90 backdrop-blur-xl border border-pink-500/40 shadow-2xl shadow-pink-600/20 hover:scale-105 transition-all">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500/20 to-purple-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400">
                <Headphones className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-xs font-bold text-white">Lossless Studio M4A</span>
                <span className="block text-[10px] text-purple-300 font-medium">24-Bit / 48 kHz Pure Master</span>
              </div>
              <div className="flex items-end gap-0.5 h-3.5 shrink-0 pl-1">
                <span className={`w-0.5 rounded-full transition-all ${isPlaying ? 'bg-pink-400 eq-bar-2 h-3.5' : 'bg-slate-600 h-1.5'}`} />
                <span className={`w-0.5 rounded-full transition-all ${isPlaying ? 'bg-purple-400 eq-bar-3 h-3' : 'bg-slate-600 h-1.5'}`} />
                <span className={`w-0.5 rounded-full transition-all ${isPlaying ? 'bg-cyan-400 eq-bar-1 h-2.5' : 'bg-slate-600 h-1.5'}`} />
              </div>
            </div>

            {/* Floating Satellite 3: Top-Left Ambient Pill */}
            <div className="animate-float-gentle absolute -top-4 -left-3 z-20 hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-vibely-surface/85 backdrop-blur-md border border-purple-500/30 text-[11px] font-semibold text-purple-300 shadow-xl">
              <Sparkles className="w-3 h-3 text-pink-400" />
              <span>Zero Paywalls</span>
            </div>

            {/* Floating Satellite 4: Mid-Right Floating Album Vinyl Artwork (Khuda Jaane) */}
            <div
              onClick={() => {
                if (isTertiaryPlaying) {
                  togglePlay();
                } else {
                  playSong(tertiaryHeroSong, trendingSongs);
                }
              }}
              className="animate-float-drift absolute -bottom-10 -right-2 sm:-right-8 z-20 hidden md:flex items-center gap-3 p-3 rounded-2xl bg-vibely-surface/90 backdrop-blur-xl border border-pink-500/40 shadow-2xl shadow-pink-600/20 cursor-pointer hover:scale-105 transition-all group"
              title={isTertiaryPlaying ? 'Pause Khuda Jaane' : 'Play Khuda Jaane'}
            >
              <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 shadow-md">
                <img
                  src={tertiaryHeroSong?.coverArt || 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=300&q=80'}
                  alt={tertiaryHeroSong?.title || 'Khuda Jaane'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                  {isTertiaryPlaying ? (
                    <Pause className="w-4 h-4 text-white fill-current" />
                  ) : (
                    <Play className="w-4 h-4 text-white fill-current ml-0.5" />
                  )}
                </div>
              </div>
              <div className="min-w-0 pr-1">
                <div className="flex items-center gap-1.5">
                  <Disc3 className={`w-3 h-3 text-pink-400 ${isTertiaryPlaying ? 'animate-spin-slow' : ''}`} />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-pink-300">Golden Duet</span>
                </div>
                <h4 className="text-xs font-bold text-white truncate max-w-[120px]">
                  {tertiaryHeroSong?.title || 'Khuda Jaane'}
                </h4>
                <p className="text-[10px] text-slate-400 truncate max-w-[120px]">
                  {tertiaryHeroSong?.artist?.name || 'KK & Shreya'}
                </p>
              </div>
              {isTertiaryPlaying && (
                <div className="flex items-end gap-0.5 h-4 shrink-0 pr-1">
                  <span className="w-0.5 bg-pink-400 rounded-full eq-bar-1 h-3" />
                  <span className="w-0.5 bg-purple-400 rounded-full eq-bar-2 h-4" />
                  <span className="w-0.5 bg-indigo-400 rounded-full eq-bar-3 h-2" />
                </div>
              )}
            </div>

            <div className="w-full max-w-md space-y-4">
              {/* Main Featured Hero Card (Tum Hi Ho) */}
              <div className="p-5 rounded-3xl bg-vibely-surface/90 backdrop-blur-xl border border-purple-500/30 shadow-2xl relative overflow-hidden group animate-neon-card-glow music-card-hover">
                <div className="flex items-center gap-4">
                  <div
                    onClick={() => {
                      if (isHeroPlaying) {
                        togglePlay();
                      } else {
                        playSong(heroSong, trendingSongs);
                      }
                    }}
                    className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 shadow-lg cursor-pointer"
                    title={isHeroPlaying ? 'Pause Tum Hi Ho' : 'Play Tum Hi Ho'}
                  >
                    <img
                      src={heroSong?.coverArt || "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=300&q=80"}
                      alt={heroSong?.title || "Tum Hi Ho"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-purple-900/30 flex items-center justify-center">
                      <Disc3 className={`w-7 h-7 text-white/90 ${isHeroPlaying ? 'animate-spin-slow' : ''}`} />
                    </div>
                    {/* Play/Pause hover icon overlay */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-md">
                        {isHeroPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                      </div>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`inline-block w-2 h-2 rounded-full ${isHeroPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                      <span className="text-[11px] uppercase tracking-wider font-bold text-purple-400">
                        {isHeroPlaying ? 'Now Playing' : 'Featured Song'}
                      </span>
                    </div>
                    <h3 className="font-semibold text-white text-base truncate">{heroSong?.title || 'Tum Hi Ho'}</h3>
                    <p className="text-xs text-slate-400 truncate">
                      {heroSong?.artist?.name || 'Arijit Singh'} • {heroSong?.album?.title || 'Aashiqui 2'}
                    </p>
                  </div>

                  {/* Equalizer Wave Bars (True state reflection) */}
                  <div className="flex items-end gap-1 h-6 shrink-0 pr-1">
                    <MusicVisualizer isPlaying={isHeroPlaying} barCount={6} size="sm" />
                  </div>
                </div>

                {/* Interactive Play Bar */}
                <div className="mt-4 pt-3 border-t border-vibely-border flex items-center justify-between text-xs text-slate-400">
                  <button
                    onClick={() => {
                      if (isHeroPlaying) {
                        togglePlay();
                      } else {
                        playSong(heroSong, trendingSongs);
                      }
                    }}
                    className="flex items-center gap-1.5 text-purple-300 hover:text-white font-medium transition-colors"
                  >
                    <Radio className={`w-3.5 h-3.5 ${isHeroPlaying ? 'animate-pulse text-pink-400' : 'text-slate-400'}`} />
                    <span>{isHeroPlaying ? 'Playing Studio Stream' : 'Click to Play Track'}</span>
                  </button>
                  <Link
                    to="/explore"
                    className="hover:text-white flex items-center gap-1 transition-colors font-semibold"
                  >
                    <span>Browse All</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Interactive Live Music Visualizer Ribbon */}
      <section
        ref={visualizerRef}
        className={`py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto transition-all duration-700 reveal-hidden ${
          visualizerVisible ? 'reveal-visible' : ''
        }`}
      >
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-vibely-surface/95 via-vibely-card/90 to-vibely-surface/95 border border-purple-500/30 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          {/* Ambient neon pulse */}
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-purple-600/15 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-pink-600/15 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-center lg:text-left max-w-sm shrink-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold">
                <Activity className="w-3.5 h-3.5 text-pink-400" />
                <span>Live Audio Frequency Engine</span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                Feel the Live Equalizer
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                {isPlaying
                  ? `Active playback: "${currentSong?.title || heroSong.title}" • Dynamic 24-band frequency spectrum`
                  : 'Engine on standby • Click play on any song to activate live animated equalizer'}
              </p>
            </div>

            {/* Central Equalizer Wave Visualizer */}
            <div className="flex-1 w-full max-w-lg px-2 flex flex-col items-center">
              <MusicVisualizer isPlaying={isPlaying} barCount={24} size="md" className="w-full" />
              <div className="w-full flex justify-between text-[10px] text-slate-500 font-mono mt-2 pt-1 border-t border-vibely-border/40">
                <span>20Hz Sub</span>
                <span>250Hz Warmth</span>
                <span>2kHz Mids</span>
                <span>8kHz Highs</span>
                <span>16kHz Air</span>
              </div>
            </div>

            {/* Quick Play/Pause Action Button */}
            <div className="shrink-0">
              <button
                onClick={() => {
                  if (isPlaying) {
                    togglePlay();
                  } else if (currentSong) {
                    togglePlay();
                  } else {
                    playSong(heroSong, trendingSongs);
                  }
                }}
                className={`btn-premium flex items-center gap-2.5 px-6 py-3 rounded-2xl font-bold text-sm shadow-xl transition-all ${
                  isPlaying
                    ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-pink-600/30'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-purple-600/30'
                }`}
                title={isPlaying ? 'Pause music' : 'Start music and visualizer'}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Pause Audio</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                    <span>Experience Sound</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Music Showcase Section */}
      <section
        id="showcase"
        ref={showcaseRef}
        className={`py-20 bg-vibely-surface/40 border-y border-vibely-border transition-all duration-700 reveal-hidden ${
          showcaseVisible ? 'reveal-visible' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400 mb-2">
                <Flame className="w-4 h-4 text-pink-500" />
                <span>Showcase</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
                Featured Bollywood & Trending Hits
              </h2>
              <p className="text-sm text-slate-400 mt-1 max-w-xl">
                Listen to real studio audio previews right here or dive into the full music player.
              </p>
            </div>
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors"
            >
              <span>View full catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Songs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendingSongs.map((song) => {
              const isThisSong = currentSong?.id === song.id;
              const isThisPlaying = isThisSong && isPlaying;

              return (
                <div
                  key={song.id}
                  className="p-4 rounded-2xl bg-vibely-surface/80 hover:bg-vibely-surface border border-vibely-border music-card-hover group flex items-center justify-between shadow-lg focus-within:border-purple-500/50"
                >
                  <div className="flex items-center gap-3.5 min-w-0 pr-3">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 shadow-md">
                      <img
                        src={song.coverArt}
                        alt={song.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <button
                        onClick={() => {
                          if (isThisSong) {
                            togglePlay();
                          } else {
                            playSong(song, trendingSongs);
                          }
                        }}
                        className={`absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center transition-opacity duration-300 ${
                          isThisPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100'
                        }`}
                        aria-label={`Play ${song.title}`}
                      >
                        <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg">
                          {isThisPlaying ? (
                            <Pause className="w-4 h-4 fill-current" />
                          ) : (
                            <Play className="w-4 h-4 fill-current ml-0.5" />
                          )}
                        </div>
                      </button>

                      {/* Playing Equalizer Indicator Badge (bottom-left) */}
                      {isThisPlaying && (
                        <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md flex items-end gap-0.5 h-3 pointer-events-none">
                          <span className="w-0.5 bg-purple-400 rounded-full eq-bar-1 h-2" />
                          <span className="w-0.5 bg-pink-400 rounded-full eq-bar-2 h-3" />
                          <span className="w-0.5 bg-indigo-400 rounded-full eq-bar-3 h-1.5" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-semibold text-white text-sm truncate group-hover:text-purple-300 transition-colors">
                        {song.title}
                      </h4>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {song.artist?.name || 'Vibely Artist'}
                      </p>
                      <span className="inline-block px-2 py-0.5 mt-1 rounded text-[10px] font-medium bg-slate-800 text-slate-300">
                        {song.genre}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (isThisSong) {
                        togglePlay();
                      } else {
                        playSong(song, trendingSongs);
                      }
                    }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 ${
                      isThisPlaying
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 scale-105'
                        : 'bg-vibely-card text-slate-300 hover:text-white hover:bg-purple-600 hover:scale-105'
                    }`}
                    title={isThisPlaying ? 'Pause' : 'Play audio'}
                  >
                    {isThisPlaying ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Curated Playlists Showcase Grid */}
          <div className="pt-8 border-t border-vibely-border space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <ListMusic className="w-5 h-5 text-pink-400" />
                  <span>Curated Vibe Playlists</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  Handcrafted collections engineered for your mood, commute, and late-night listening.
                </p>
              </div>
              <Link
                to="/explore"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
              >
                <span>Browse all</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {playlists.map((pl) => (
                <PlaylistCard key={pl.id} playlist={pl} />
              ))}
            </div>
          </div>

          {/* Popular Artists Strip */}
          <div className="pt-8 border-t border-vibely-border space-y-6">
            <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span>Popular Artists on Vibely</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {artists.map((art) => (
                <Link
                  key={art.id}
                  to={`/artist/${art.id}`}
                  className="p-4 rounded-2xl bg-vibely-surface/60 hover:bg-vibely-surface border border-vibely-border music-card-hover text-center transition-all group shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                >
                  <img
                    src={art.image}
                    alt={art.name}
                    className="w-20 h-20 mx-auto rounded-full object-cover shadow-lg group-hover:scale-105 transition-transform duration-300"
                  />
                  <h4 className="font-semibold text-sm text-white mt-3 truncate group-hover:text-purple-300">
                    {art.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {art.monthlyListeners ? `${(art.monthlyListeners / 1000000).toFixed(1)}M listeners` : 'Artist'}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mood-Based Discovery Section */}
      <section
        id="moods"
        ref={moodsRef}
        className={`py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 transition-all duration-700 reveal-hidden ${
          moodsVisible ? 'reveal-visible' : ''
        }`}
      >
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-pink-400">
            <Radio className="w-4 h-4" />
            <span>Curated Frequencies</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
            Find Your Soundtrack by Mood
          </h2>
          <p className="text-sm text-slate-400">
            Choose what you want to feel right now. Instant playlists curated for relaxation, celebration, and focus.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {MOODS.map((mood, idx) => (
            <div
              key={mood.id}
              onClick={() => navigate(`/explore?genre=${encodeURIComponent(mood.genre)}`)}
              className={`group relative p-6 rounded-3xl bg-gradient-to-br ${mood.gradient} bg-vibely-surface border ${mood.border} music-card-hover cursor-pointer overflow-hidden shadow-xl stagger-item`}
              style={{ transitionDelay: `${idx * 60}ms` }}
            >
              <div className="relative z-10 space-y-3">
                <span className={`inline-block font-display text-lg font-bold text-white group-hover:text-purple-200 transition-colors`}>
                  {mood.title}
                </span>
                <p className="text-xs text-slate-300/90 leading-relaxed font-normal">
                  {mood.desc}
                </p>
                <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-white group-hover:translate-x-1 transition-transform">
                  <span>Explore {mood.genre}</span>
                  <ChevronRight className="w-4 h-4 text-purple-300" />
                </div>
              </div>

              {/* Decorative Background Image overlay with blend */}
              <img
                src={mood.cover}
                alt={mood.title}
                className="absolute right-0 bottom-0 w-32 h-32 object-cover rounded-tl-full opacity-25 group-hover:opacity-40 group-hover:scale-110 transition-all duration-500 pointer-events-none"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section
        id="features"
        ref={featuresRef}
        className={`py-20 bg-vibely-surface/50 border-y border-vibely-border transition-all duration-700 reveal-hidden ${
          featuresVisible ? 'reveal-visible' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
              <Zap className="w-4 h-4" />
              <span>Full-Stack Capabilities</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
              Engineered for Modern Music Lovers
            </h2>
            <p className="text-sm text-slate-400">
              Everything you expect from a premium streaming platform built with production-ready standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="p-7 rounded-3xl bg-vibely-surface border border-vibely-border music-card-hover space-y-4 group shadow-lg stagger-item"
                  style={{ transitionDelay: `${idx * 80}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      <Icon className="w-6 h-6 text-purple-400" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-800 text-purple-300 border border-slate-700">
                      {feat.tag}
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                    {feat.title}
                  </h3>

                  <p className="text-sm text-slate-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How Vibely Works (3-Step Experience) */}
      <section
        id="how-it-works"
        ref={howItWorksRef}
        className={`py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 transition-all duration-700 reveal-hidden ${
          howItWorksVisible ? 'reveal-visible' : ''
        }`}
      >
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
            <Layers className="w-4 h-4" />
            <span>Simple & Intuitive</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
            How Vibely Works
          </h2>
          <p className="text-sm text-slate-400">
            From the first note to your custom library in three effortless steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div
            className="p-8 rounded-3xl bg-vibely-surface/80 border border-vibely-border relative space-y-4 shadow-xl music-card-hover stagger-item"
            style={{ transitionDelay: '0ms' }}
          >
            <span className="font-display text-5xl font-black text-purple-500/25 block">01</span>
            <h3 className="font-display text-xl font-bold text-white">
              Discover your next favorite song
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Explore authentic Bollywood hits, romantic vocals, Sufi classics, and global indie releases across genres.
            </p>
          </div>

          {/* Step 2 */}
          <div
            className="p-8 rounded-3xl bg-vibely-surface/80 border border-vibely-border relative space-y-4 shadow-xl music-card-hover stagger-item"
            style={{ transitionDelay: '100ms' }}
          >
            <span className="font-display text-5xl font-black text-pink-500/25 block">02</span>
            <h3 className="font-display text-xl font-bold text-white">
              Build playlists for every mood
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Organize your vibes into custom collections, like your favorite tracks, and follow iconic playback artists.
            </p>
          </div>

          {/* Step 3 */}
          <div
            className="p-8 rounded-3xl bg-vibely-surface/80 border border-vibely-border relative space-y-4 shadow-xl music-card-hover stagger-item"
            style={{ transitionDelay: '200ms' }}
          >
            <span className="font-display text-5xl font-black text-indigo-500/25 block">03</span>
            <h3 className="font-display text-xl font-bold text-white">
              Press play and enjoy your music
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Sit back and immerse yourself in persistent, high-fidelity audio playback that never interrupts as you browse.
            </p>
          </div>
        </div>
      </section>

      {/* Final Call to Action Section */}
      <section
        ref={ctaRef}
        className={`py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto transition-all duration-700 reveal-hidden ${
          ctaVisible ? 'reveal-visible' : ''
        }`}
      >
        <div className="p-10 md:p-16 rounded-[2.5rem] bg-gradient-to-r from-purple-900/60 via-indigo-900/40 to-slate-900/80 border border-purple-500/30 text-center relative overflow-hidden shadow-2xl space-y-6">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center mx-auto shadow-lg shadow-purple-600/30">
              <Sparkles className="w-6 h-6 text-white" />
            </div>

            <h2 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight">
              Your Next Favorite Song Is Waiting.
            </h2>

            <p className="text-base text-slate-300 leading-relaxed">
              Join Vibely today and tune in to the vibrations that speak to you.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleStartListening}
                className="btn-premium w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-base shadow-xl shadow-purple-600/30 hover:shadow-purple-600/50 transition-all"
              >
                Join Vibely
              </button>
              <Link
                to="/login"
                className="btn-premium w-full sm:w-auto px-7 py-4 rounded-2xl bg-vibely-surface border border-vibely-border hover:border-slate-500 text-slate-300 hover:text-white font-semibold text-base transition-all"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-vibely-border py-12 bg-vibely-surface/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-display text-lg font-bold text-white">Vibely</span>
              <span className="text-xs text-purple-400 font-medium block -mt-1">Feel Every Beat.</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <a href="#hero" className="hover:text-purple-300 transition-colors">
              Home
            </a>
            <Link to="/explore" className="hover:text-purple-300 transition-colors">
              Explore
            </Link>
            <a href="#features" className="hover:text-purple-300 transition-colors">
              Features
            </a>
            <button
              onClick={() => setPolicyModal('privacy')}
              className="hover:text-purple-300 transition-colors"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setPolicyModal('terms')}
              className="hover:text-purple-300 transition-colors"
            >
              Terms of Service
            </button>
          </div>

          <p className="text-xs text-slate-500">
            © 2026 Vibely Inc. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Privacy Policy / Terms Modal */}
      {policyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-vibely-surface border border-vibely-border shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-white">
                {policyModal === 'privacy' ? 'Vibely Privacy Policy' : 'Vibely Terms of Service'}
              </h3>
              <button
                onClick={() => setPolicyModal(null)}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-xs sm:text-sm text-slate-300 space-y-3 max-h-[60vh] overflow-y-auto pr-2 leading-relaxed">
              {policyModal === 'privacy' ? (
                <>
                  <p>
                    At Vibely, accessible from vibely.io, your privacy is one of our top priorities. This document details the types of information collected and how it is used.
                  </p>
                  <p>
                    <strong>Information We Collect:</strong> We collect your account email, display name, and listening preferences to personalize your music streams and playlist synchronizations.
                  </p>
                  <p>
                    <strong>Security:</strong> All credentials and passwords are encrypted using bcrypt hashing. Audio playback tokens and sessions are protected via industry-standard JWT.
                  </p>
                  <p>
                    <strong>No Third-Party Tracking:</strong> Vibely does not sell or distribute personal information to third-party ad networks.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Welcome to Vibely! By accessing our music streaming platform, you agree to comply with the following Terms of Service.
                  </p>
                  <p>
                    <strong>License:</strong> Vibely grants you a personal, non-commercial streaming license for audio listening and playlist curation.
                  </p>
                  <p>
                    <strong>User Conduct:</strong> You agree not to distribute, copy, scrape, or reverse engineer any streaming endpoints or protected content.
                  </p>
                  <p>
                    <strong>Fair Usage:</strong> Playback streams are provided for personal enjoyment. Continuous automated harvesting is strictly prohibited.
                  </p>
                </>
              )}
            </div>
            <div className="pt-2 text-right">
              <button
                onClick={() => setPolicyModal(null)}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs shadow-md"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
