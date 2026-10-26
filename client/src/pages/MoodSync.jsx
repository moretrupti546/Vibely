import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Sparkles,
  Play,
  Pause,
  FastForward,
  ListPlus,
  PlusSquare,
  Sliders,
  Volume2,
  Check,
  Disc3,
  Sun,
  Clock,
  ArrowRight
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { useToast } from '../context/ToastContext';
import { SongRow } from '../components/cards/SongRow';
import {
  MOOD_DEFINITIONS,
  getSongsByIds
} from '../data/moodCatalog';
import api from '../services/api';

export const MoodSync = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialMood = searchParams.get('mood') || 'happy';

  const [selectedMoodId, setSelectedMoodId] = useState(initialMood);
  const [selectedIntensity, setSelectedIntensity] = useState(2); // 1, 2, or 3
  const [savingPlaylist, setSavingPlaylist] = useState(false);

  const { currentSong, isPlaying, playSong, togglePlay, playNextInQueue, addToQueue } = usePlayer();
  const { showToast } = useToast();

  // Sync state with search params if navigated with query params
  useEffect(() => {
    const m = searchParams.get('mood');
    if (m && MOOD_DEFINITIONS.some((x) => x.id === m)) {
      setSelectedMoodId(m);
    }
  }, [searchParams]);

  // Current active mood object
  const currentMood = useMemo(() => {
    return MOOD_DEFINITIONS.find((m) => m.id === selectedMoodId) || MOOD_DEFINITIONS[0];
  }, [selectedMoodId]);

  // Current active intensity definition
  const currentIntensityDef = useMemo(() => {
    return currentMood.intensities.find((i) => i.level === selectedIntensity) || currentMood.intensities[1];
  }, [currentMood, selectedIntensity]);

  // Recommended tracks for current mood & intensity
  const moodTracks = useMemo(() => {
    return getSongsByIds(currentIntensityDef.songIds);
  }, [currentIntensityDef]);

  // Check if current mood mix is playing
  const isMoodMixPlaying = isPlaying && moodTracks.some((s) => s.id === currentSong?.id);

  const handlePlayMoodMix = () => {
    if (isMoodMixPlaying) {
      togglePlay();
    } else if (moodTracks.length > 0) {
      playSong(moodTracks[0], moodTracks);
      showToast(`Now playing: ${currentMood.name} (${currentIntensityDef.label}) Mix 🎶`, 'info');
    }
  };

  const handlePlayNextMoodMix = () => {
    if (moodTracks.length > 0) {
      [...moodTracks].reverse().forEach((s) => playNextInQueue(s));
      showToast(`Added ${moodTracks.length} tracks to play next ⏭️`, 'success');
    }
  };

  const handleAddAllToQueue = (tracks, name) => {
    tracks.forEach((s) => addToQueue(s));
    showToast(`Added ${tracks.length} tracks from ${name} to your queue 🎶`, 'success');
  };

  const handleSaveAsPlaylist = async (title, desc, tracks) => {
    setSavingPlaylist(true);
    const trackIds = tracks.map((t) => t.id);

    const newPlaylist = {
      id: `playlist-mood-${Date.now()}`,
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
      showToast(`Saved "${title}" to your playlists! 🎧`, 'success');
    } catch (e) {
      showToast('Playlist saved to library.', 'success');
    } finally {
      setSavingPlaylist(false);
    }
  };

  return (
    <div className="space-y-10 pb-24 relative select-none">
      {/* Dynamic Ambient Background Aura Glows */}
      <div
        className={`fixed top-24 right-10 w-96 h-96 rounded-full blur-[160px] pointer-events-none -z-10 transition-colors duration-1000 ${
          currentMood.id === 'happy'
            ? 'bg-amber-500/15'
            : currentMood.id === 'sad'
            ? 'bg-blue-600/15'
            : currentMood.id === 'stressed'
            ? 'bg-emerald-500/15'
            : currentMood.id === 'heartbroken'
            ? 'bg-rose-600/15'
            : currentMood.id === 'romantic'
            ? 'bg-pink-500/15'
            : 'bg-purple-600/15'
        }`}
      />

      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-3xl p-8 md:p-12 border border-vibely-border bg-gradient-to-r from-purple-950/90 via-slate-900/90 to-slate-950 shadow-2xl">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold uppercase tracking-wider shadow-lg shadow-purple-500/10">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Emotional Calibration Engine</span>
          </div>

          <h1 className="font-display text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
            Mood<span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">Sync</span>
          </h1>

          <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl">
            Music tailored precisely for how you feel. Select your emotion, calibrate your feeling intensity, and Vibely instantly aligns your sonic frequency.
          </p>
        </div>
      </section>

      {/* STEP 1: Choose Your Feeling */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-purple-400">Step 1</span>
            <h2 className="font-display text-2xl font-bold text-white">How are you feeling right now?</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3.5">
          {MOOD_DEFINITIONS.map((mood) => {
            const isSelected = selectedMoodId === mood.id;
            return (
              <button
                key={mood.id}
                onClick={() => {
                  setSelectedMoodId(mood.id);
                  setSearchParams({ mood: mood.id });
                }}
                className={`relative p-5 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between overflow-hidden group ${
                  isSelected
                    ? `bg-slate-900 ${mood.borderColor} ${mood.glowColor} shadow-xl scale-[1.03] ring-2 ring-purple-500/40`
                    : 'bg-vibely-surface/80 border-vibely-border hover:border-slate-600 hover:scale-[1.01]'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl filter drop-shadow">{mood.emoji}</span>
                  {isSelected && (
                    <div className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_8px_#a855f7] animate-pulse" />
                  )}
                </div>

                <div>
                  <h3 className="font-display font-bold text-base text-white group-hover:text-purple-300 transition-colors">
                    {mood.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{mood.tagline}</p>
                </div>

                {/* Active Gradient Underline */}
                {isSelected && (
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${mood.color}`} />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* STEP 2: Choose Mood Intensity (UNIQUE TWIST) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-pink-400">Step 2 (Unique Twist)</span>
            <h2 className="font-display text-2xl font-bold text-white">Choose Mood Intensity</h2>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${currentMood.badgeBg}`}>
            Level {selectedIntensity} of 3
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {currentMood.intensities.map((item) => {
            const isActive = selectedIntensity === item.level;
            return (
              <div
                key={item.level}
                onClick={() => setSelectedIntensity(item.level)}
                className={`cursor-pointer p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                  isActive
                    ? `bg-slate-900/90 ${currentMood.borderColor} shadow-xl ring-2 ring-purple-500/50 scale-[1.02]`
                    : 'bg-vibely-surface border-vibely-border hover:border-slate-600 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 text-xs font-black flex items-center justify-center border border-purple-500/30">
                      {item.level}
                    </span>
                    <h4 className="font-display font-bold text-base text-white">{item.label}</h4>
                  </div>
                  {isActive && <Check className="w-5 h-5 text-purple-400" />}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">{item.desc}</p>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <Volume2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>{item.songIds.length} Curated Tracks Available</span>
                </div>

                {isActive && (
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${currentMood.color}`} />
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* STEP 3: Recommended Matching Music */}
      <section className="space-y-4">
        {/* Action Bar Header */}
        <div className="p-6 rounded-3xl bg-vibely-surface border border-vibely-border flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${currentMood.color} flex items-center justify-center text-3xl shadow-xl shrink-0`}
            >
              {currentMood.emoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                  Calibrated Recommendations
                </span>
                <span>•</span>
                <span className="text-xs text-slate-400">{currentIntensityDef.label}</span>
              </div>
              <h3 className="font-display font-extrabold text-2xl text-white">
                {currentMood.name} Vibes & Soul Mix
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">{currentIntensityDef.desc}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              onClick={handlePlayMoodMix}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-sm bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-xl shadow-purple-600/30 transition-all hover:scale-105"
            >
              {isMoodMixPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isMoodMixPlaying ? 'Pause Mood' : 'Play Mood Mix'}</span>
            </button>

            <button
              onClick={handlePlayNextMoodMix}
              className="flex items-center gap-2 px-4 py-3 rounded-full font-semibold text-xs bg-vibely-surface hover:bg-slate-800 border border-vibely-border text-slate-200 transition-all hover:scale-105"
              title="Play these tracks right after the current song"
            >
              <FastForward className="w-4 h-4 text-purple-400" />
              <span className="hidden sm:inline">Play Next</span>
            </button>

            <button
              onClick={() => handleAddAllToQueue(moodTracks, `${currentMood.name} Mix`)}
              className="flex items-center gap-2 px-4 py-3 rounded-full font-semibold text-xs bg-vibely-surface hover:bg-slate-800 border border-vibely-border text-slate-200 transition-all hover:scale-105"
              title="Add all mood tracks to queue"
            >
              <ListPlus className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Queue All</span>
            </button>

            <button
              onClick={() =>
                handleSaveAsPlaylist(
                  `${currentMood.name}: ${currentIntensityDef.label}`,
                  `Curated on Vibely MoodSync for feeling ${currentMood.name.toLowerCase()} at intensity level ${selectedIntensity}.`,
                  moodTracks
                )
              }
              disabled={savingPlaylist}
              className="flex items-center gap-2 px-4 py-3 rounded-full font-semibold text-xs bg-vibely-surface hover:bg-slate-800 border border-vibely-border text-slate-200 transition-all hover:scale-105 disabled:opacity-50"
              title="Save as custom playlist to your library"
            >
              <PlusSquare className="w-4 h-4 text-pink-400" />
              <span className="hidden sm:inline">Save Playlist</span>
            </button>
          </div>
        </div>

        {/* Song Rows */}
        <div className="bg-vibely-surface rounded-3xl border border-vibely-border p-4 space-y-1 shadow-lg">
          {moodTracks.map((song, idx) => (
            <SongRow key={song.id} song={song} index={idx} queueList={moodTracks} />
          ))}
        </div>
      </section>

      {/* Direct Link Banner to Dedicated Signature Moments & Daily Soundtracks Page */}
      <section className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-amber-950/40 via-indigo-950/40 to-slate-900 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shrink-0 shadow-lg">
            <Sun className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider mb-1">
              <Clock className="w-3 h-3" />
              <span>Dedicated Feature</span>
            </div>
            <h3 className="font-display font-bold text-lg text-white">
              Signature Moments & Daily Soundtracks
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Explore 5 bespoke life moments (Morning Motivation, College Commute, Coding, Evening Walks, Late Night) & our 8-track Daily Soundtrack refreshed at midnight.
            </p>
          </div>
        </div>
        <Link
          to="/moments"
          className="shrink-0 flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white font-bold text-xs hover:scale-105 transition-all shadow-lg shadow-amber-500/20"
        >
          <span>Explore Moments & Daily</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
};

export default MoodSync;
