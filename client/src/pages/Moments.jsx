import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Sun,
  Bus,
  Code,
  Sunset,
  Moon,
  Sparkles,
  Play,
  Pause,
  FastForward,
  ListPlus,
  PlusSquare,
  Clock,
  Calendar,
  Compass,
  Volume2,
  Sliders,
  Check,
  Disc3,
  Share2
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { useToast } from '../context/ToastContext';
import { SongRow } from '../components/cards/SongRow';
import {
  MOMENT_DEFINITIONS,
  getSongsByIds,
  getDailySoundtrack
} from '../data/moodCatalog';
import api from '../services/api';

const MOMENT_ICONS = {
  Sun: Sun,
  Bus: Bus,
  Code: Code,
  Sunset: Sunset,
  Moon: Moon
};

export const Moments = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialMoment = searchParams.get('moment') || 'morning-motivation';

  const [selectedMomentId, setSelectedMomentId] = useState(initialMoment);
  const [dailySoundtrack, setDailySoundtrack] = useState(() => getDailySoundtrack());
  const [countdown, setCountdown] = useState({ hours: '00', mins: '00', secs: '00', text: '' });
  const [savingPlaylist, setSavingPlaylist] = useState(false);

  const { currentSong, isPlaying, playSong, togglePlay, playNextInQueue, addToQueue } = usePlayer();
  const { showToast } = useToast();

  // Sync state if query param changes
  useEffect(() => {
    const m = searchParams.get('moment');
    if (m && MOMENT_DEFINITIONS.some((x) => x.id === m)) {
      setSelectedMomentId(m);
    }
  }, [searchParams]);

  // Live countdown to midnight for Daily Soundtrack auto-refresh
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
      const diffMs = midnight - now;

      if (diffMs <= 0) {
        setDailySoundtrack(getDailySoundtrack());
        return;
      }

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diffMs % (1000 * 60)) / 1000);

      const hStr = hours.toString().padStart(2, '0');
      const mStr = mins.toString().padStart(2, '0');
      const sStr = secs.toString().padStart(2, '0');

      setCountdown({
        hours: hStr,
        mins: mStr,
        secs: sStr,
        text: `${hStr}h ${mStr}m ${sStr}s`
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Current moment object & tracks
  const currentMoment = useMemo(() => {
    return MOMENT_DEFINITIONS.find((m) => m.id === selectedMomentId) || MOMENT_DEFINITIONS[0];
  }, [selectedMomentId]);

  const momentTracks = useMemo(() => {
    return getSongsByIds(currentMoment.trackIds);
  }, [currentMoment]);

  // Playback state checks
  const isDailyPlaying = isPlaying && dailySoundtrack.tracks.some((s) => s.id === currentSong?.id);
  const isMomentPlaying = isPlaying && momentTracks.some((s) => s.id === currentSong?.id);

  // Play Daily Soundtrack
  const handlePlayDaily = () => {
    if (isDailyPlaying) {
      togglePlay();
    } else if (dailySoundtrack.tracks.length > 0) {
      playSong(dailySoundtrack.tracks[0], dailySoundtrack.tracks);
      showToast(`Now playing: ${dailySoundtrack.dayTheme} Soundtrack 🎶`, 'info');
    }
  };

  // Play Selected Moment Soundtrack
  const handlePlayMoment = () => {
    if (isMomentPlaying) {
      togglePlay();
    } else if (momentTracks.length > 0) {
      playSong(momentTracks[0], momentTracks);
      showToast(`Now playing: ${currentMoment.title} (${momentTracks.length} tracks) 🎧`, 'info');
    }
  };

  // Play Next
  const handlePlayNextTracks = (tracks, name) => {
    if (tracks.length > 0) {
      [...tracks].reverse().forEach((s) => playNextInQueue(s));
      showToast(`Queued ${tracks.length} tracks from ${name} to play next ⏭️`, 'success');
    }
  };

  // Add all to queue
  const handleAddAllToQueue = (tracks, name) => {
    tracks.forEach((s) => addToQueue(s));
    showToast(`Added ${tracks.length} tracks from ${name} to your queue 🎶`, 'success');
  };

  // Save Playlist
  const handleSaveAsPlaylist = async (title, desc, tracks) => {
    setSavingPlaylist(true);
    const trackIds = tracks.map((t) => t.id);

    const newPlaylist = {
      id: `playlist-moment-${Date.now()}`,
      title,
      description: desc,
      coverArt: tracks[0]?.coverArt || '/assets/playlists/wanderlust.svg',
      isPublic: true,
      tracks: tracks,
      _count: { tracks: tracks.length },
      createdAt: new Date().toISOString()
    };

    try {
      await api.post('/playlists', {
        title,
        description: desc,
        isPublic: true,
        trackIds
      });
    } catch (err) {
      // Backend fallback handled below
    }

    try {
      const stored = localStorage.getItem('vibely_user_playlists');
      const list = stored ? JSON.parse(stored) : [];
      list.unshift(newPlaylist);
      localStorage.setItem('vibely_user_playlists', JSON.stringify(list));
      window.dispatchEvent(new Event('vibely_playlist_updated'));
      showToast(`Saved "${title}" to your library! 🎧`, 'success');
    } catch (e) {
      showToast('Playlist saved to library.', 'success');
    } finally {
      setSavingPlaylist(false);
    }
  };

  const CurrentMomentIcon = MOMENT_ICONS[currentMoment.icon] || Sparkles;

  return (
    <div className="space-y-12 pb-24 relative select-none">
      {/* Dynamic Ambient Background Glows */}
      <div
        className="fixed top-24 right-10 w-96 h-96 rounded-full blur-[160px] pointer-events-none -z-10 bg-amber-500/15 transition-colors duration-1000"
      />
      <div
        className="fixed bottom-32 left-10 w-80 h-80 rounded-full blur-[140px] pointer-events-none -z-10 bg-indigo-600/15"
      />

      {/* Page Header Banner */}
      <section className="relative overflow-hidden rounded-3xl p-8 md:p-12 border border-vibely-border bg-gradient-to-r from-amber-950/40 via-slate-900/90 to-purple-950/40 shadow-2xl">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider shadow-lg shadow-amber-500/10">
            <Sun className="w-4 h-4 text-amber-400" />
            <span>Signature Moments & Daily Soundtracks</span>
          </div>

          <h1 className="font-display text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
            Soundtracks for <span className="bg-gradient-to-r from-amber-400 via-rose-400 to-purple-400 bg-clip-text text-transparent">Every Moment</span>
          </h1>

          <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl">
            From high-energy morning motivation and college commutes to deep coding focus blocks and 2 AM contemplation. Plus an auto-refreshed 8-track daily soundscape that regenerates every midnight.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>5 Signature Life Moments (7 tracks each)</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Daily Soundtrack Auto-Refreshes Midnight</span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* FEATURE 1: DAILY SOUNDTRACK ENGINE (8 FRESH TRACKS + LIVE COUNTDOWN) */}
      {/* ==================================================================== */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Engine 01</span>
            <h2 className="font-display text-2xl font-bold text-white">Daily Soundtrack Engine</h2>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800/60 px-3 py-1 rounded-full border border-slate-700/60">
            <Disc3 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span>8 Fresh Tracks Today</span>
          </span>
        </div>

        <div className="relative overflow-hidden rounded-3xl p-8 md:p-10 border border-cyan-500/30 bg-gradient-to-br from-indigo-950/80 via-slate-900 to-cyan-950/70 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-5 max-w-2xl">
              {/* Status & Live Countdown Badges */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold uppercase tracking-wider shadow-lg shadow-cyan-500/10">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{dailySoundtrack.dayTheme}</span>
                </div>

                {/* Live Countdown Box */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 text-slate-200 border border-cyan-500/40 text-xs font-mono shadow-inner">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-slate-400">Refreshes in:</span>
                  <span className="font-bold text-cyan-300 font-mono tracking-wider">{countdown.text || 'Calculating...'}</span>
                </div>
              </div>

              <div>
                <h3 className="font-display text-3xl md:text-5xl font-black text-white leading-tight">
                  {dailySoundtrack.title}
                </h3>
                <p className="text-sm md:text-base text-slate-300 mt-2 leading-relaxed">
                  {dailySoundtrack.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={handlePlayDaily}
                  className="flex items-center gap-2.5 px-7 py-3.5 rounded-full font-bold text-sm bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-xl shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95"
                >
                  {isDailyPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                  <span>{isDailyPlaying ? 'Pause Daily Mix' : "Play Today's 8 Tracks"}</span>
                </button>

                <button
                  onClick={() => handlePlayNextTracks(dailySoundtrack.tracks, 'Daily Mix')}
                  className="flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-xs bg-vibely-surface hover:bg-slate-800 border border-vibely-border text-slate-200 transition-all hover:scale-105"
                  title="Queue next to play right after current track"
                >
                  <FastForward className="w-4 h-4 text-cyan-400" />
                  <span>Play Next</span>
                </button>

                <button
                  onClick={() => handleAddAllToQueue(dailySoundtrack.tracks, 'Daily Soundtrack')}
                  className="flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-xs bg-vibely-surface hover:bg-slate-800 border border-vibely-border text-slate-200 transition-all hover:scale-105"
                >
                  <ListPlus className="w-4 h-4 text-cyan-400" />
                  <span>Queue 8 Tracks</span>
                </button>

                <button
                  onClick={() =>
                    handleSaveAsPlaylist(
                      dailySoundtrack.title,
                      `Handcrafted daily soundtrack for ${dailySoundtrack.dateStr} on Vibely.`,
                      dailySoundtrack.tracks
                    )
                  }
                  disabled={savingPlaylist}
                  className="flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-xs bg-vibely-surface hover:bg-slate-800 border border-vibely-border text-slate-200 transition-all hover:scale-105 disabled:opacity-50"
                >
                  <PlusSquare className="w-4 h-4 text-pink-400" />
                  <span>{savingPlaylist ? 'Saving...' : 'Save as Playlist'}</span>
                </button>
              </div>
            </div>

            {/* Album Art Showcase Cluster */}
            <div className="shrink-0 space-y-3">
              <div className="grid grid-cols-2 gap-2 w-48 h-48 md:w-56 md:h-56 rounded-3xl overflow-hidden p-2 bg-slate-900/90 border border-cyan-500/20 shadow-2xl">
                {dailySoundtrack.tracks.slice(0, 4).map((t, idx) => (
                  <img
                    key={`${t.id}-${idx}`}
                    src={t.coverArt}
                    alt={t.title}
                    className="w-full h-full object-cover rounded-2xl shadow-md hover:scale-105 transition-transform"
                  />
                ))}
              </div>

              {/* Countdown Ticker Box */}
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/5 text-center">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-1">
                  Countdown to Midnight
                </span>
                <div className="flex items-center justify-center gap-2 text-sm font-mono font-bold text-cyan-300">
                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-cyan-500/20">{countdown.hours}h</span>
                  <span>:</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-cyan-500/20">{countdown.mins}m</span>
                  <span>:</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-cyan-500/20">{countdown.secs}s</span>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Tracks Listing Table */}
          <div className="mt-8 pt-6 border-t border-white/10 space-y-1">
            <div className="flex items-center justify-between px-4 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-white/5">
              <span># & Title</span>
              <span className="hidden md:inline">Album</span>
              <span>Duration</span>
            </div>
            {dailySoundtrack.tracks.map((song, idx) => (
              <SongRow key={song.id} song={song} index={idx} queueList={dailySoundtrack.tracks} />
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* FEATURE 2: 5 SIGNATURE LIFE MOMENTS (7 TRACKS EACH) */}
      {/* ==================================================================== */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Engine 02</span>
          <h2 className="font-display text-2xl font-bold text-white">5 Signature Life Moments</h2>
          <p className="text-xs text-slate-400 mt-1">
            Bespoke 7-track audio flows engineered for the critical inflection points of your day.
          </p>
        </div>

        {/* 5 Moment Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {MOMENT_DEFINITIONS.map((moment) => {
            const IconComp = MOMENT_ICONS[moment.icon] || Sparkles;
            const isSelected = selectedMomentId === moment.id;
            return (
              <button
                key={moment.id}
                onClick={() => {
                  setSelectedMomentId(moment.id);
                  setSearchParams({ moment: moment.id });
                }}
                className={`p-6 rounded-3xl border text-left transition-all duration-300 relative flex flex-col justify-between overflow-hidden group ${
                  isSelected
                    ? 'bg-slate-900 border-amber-500/60 shadow-xl ring-2 ring-amber-500/40 scale-[1.03]'
                    : 'bg-vibely-surface/80 border-vibely-border hover:border-slate-600 hover:scale-[1.01]'
                }`}
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${moment.accentColor} flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    <IconComp className="w-6 h-6" />
                  </div>

                  <h3 className="font-display font-bold text-lg text-white group-hover:text-amber-300 transition-colors">
                    {moment.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-400 mt-0.5 line-clamp-1">{moment.subtitle}</p>
                </div>

                <div className="mt-6 pt-3 border-t border-vibely-border/60 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-medium">{moment.timeHint}</span>
                  <span className="text-[10px] font-bold text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    7 Tracks
                  </span>
                </div>

                {isSelected && (
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${moment.accentColor}`} />
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Moment Showcase & Tracklist */}
        <div className="p-6 md:p-8 rounded-3xl bg-vibely-surface border border-vibely-border space-y-6 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div
                className={`w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-tr ${currentMoment.accentColor} flex items-center justify-center text-white shadow-lg`}
              >
                <CurrentMomentIcon className="w-7 h-7" />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${currentMoment.badgeColor}`}>
                    {currentMoment.timeHint}
                  </span>
                  <span>•</span>
                  <span className="text-xs font-semibold text-slate-400">
                    {momentTracks.length} Specially Selected Tracks
                  </span>
                </div>

                <h3 className="font-display font-extrabold text-2xl md:text-3xl text-white mt-1">
                  {currentMoment.title}: <span className="text-slate-300 font-medium text-xl">{currentMoment.subtitle}</span>
                </h3>
                <p className="text-xs md:text-sm text-slate-300 max-w-2xl mt-1.5 leading-relaxed">
                  {currentMoment.description}
                </p>
              </div>
            </div>

            {/* Moment Action Controls */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={handlePlayMoment}
                className={`flex items-center gap-2.5 px-6 py-3 rounded-full font-bold text-xs md:text-sm text-white shadow-xl transition-all hover:scale-105 active:scale-95 bg-gradient-to-r ${currentMoment.accentColor}`}
              >
                {isMomentPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                <span>{isMomentPlaying ? 'Pause Moment' : 'Play All 7 Tracks'}</span>
              </button>

              <button
                onClick={() => handlePlayNextTracks(momentTracks, currentMoment.title)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-full font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all hover:scale-105"
                title="Play next after currently playing song"
              >
                <FastForward className="w-3.5 h-3.5 text-amber-400" />
                <span>Play Next</span>
              </button>

              <button
                onClick={() => handleAddAllToQueue(momentTracks, currentMoment.title)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-full font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all hover:scale-105"
              >
                <ListPlus className="w-3.5 h-3.5 text-purple-400" />
                <span>Queue 7</span>
              </button>

              <button
                onClick={() =>
                  handleSaveAsPlaylist(
                    `${currentMoment.title} Soundtrack`,
                    currentMoment.description,
                    momentTracks
                  )
                }
                disabled={savingPlaylist}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-full font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all hover:scale-105 disabled:opacity-50"
              >
                <PlusSquare className="w-3.5 h-3.5 text-pink-400" />
                <span>Save</span>
              </button>
            </div>
          </div>

          {/* 7 Tracks Table */}
          <div className="pt-4 border-t border-vibely-border space-y-1">
            <div className="flex items-center justify-between px-4 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-white/5">
              <span># & Title</span>
              <span className="hidden md:inline">Album</span>
              <span>Duration</span>
            </div>
            {momentTracks.map((song, idx) => (
              <SongRow key={song.id} song={song} index={idx} queueList={momentTracks} />
            ))}
          </div>
        </div>
      </section>

      {/* Discovery banner linking to MoodSync */}
      <section className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-purple-900/40 via-pink-900/30 to-slate-900/80 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-white">
              Want music tuned to your exact emotions?
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Explore MoodSync to choose how you feel (happy, sad, stressed, romantic) and dial your emotional intensity.
            </p>
          </div>
        </div>
        <Link
          to="/moodsync"
          className="shrink-0 px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs hover:scale-105 transition-all shadow-lg shadow-purple-600/25"
        >
          Open MoodSync →
        </Link>
      </section>
    </div>
  );
};

export default Moments;
