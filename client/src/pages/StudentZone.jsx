import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  GraduationCap,
  Timer,
  Brain,
  Flame,
  Laptop,
  Compass,
  BookOpen,
  Sparkles,
  Moon,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  FastForward,
  ListPlus,
  PlusSquare,
  Users,
  CheckCircle2,
  Coffee,
  Headphones,
  Award,
  Zap,
  ArrowRight,
  ShieldCheck,
  Disc3,
  Calendar
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { useToast } from '../context/ToastContext';
import { SongRow } from '../components/cards/SongRow';
import {
  FOCUS_DURATIONS,
  STUDY_SOUNDSCAPES,
  EXAM_SUBJECTS,
  VIRTUAL_STUDY_ROOMS,
  getSongsByIds,
  getStudentStats,
  recordCompletedSession
} from '../data/studentCatalog';
import api from '../services/api';

const SUBJECT_ICONS = {
  Laptop: Laptop,
  Compass: Compass,
  BookOpen: BookOpen,
  Sparkles: Sparkles,
  Moon: Moon
};

export const StudentZone = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'focus'; // 'focus' | 'exam' | 'rooms' | 'streaks'

  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedDuration, setSelectedDuration] = useState(25);
  const [selectedSoundscapeId, setSelectedSoundscapeId] = useState('lofi-beats');
  const [selectedSubjectId, setSelectedSubjectId] = useState('programming-cs');
  const [joinedRoomId, setJoinedRoomId] = useState(null);
  const [distractionFree, setDistractionFree] = useState(false);
  const [savingPlaylist, setSavingPlaylist] = useState(false);

  // Timer state
  const [timerSecondsLeft, setTimerSecondsLeft] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerInitialSeconds, setTimerInitialSeconds] = useState(25 * 60);

  // Student stats state
  const [studentStats, setStudentStats] = useState(getStudentStats);
  const [recentReaction, setRecentReaction] = useState(null);

  const { currentSong, isPlaying, playSong, togglePlay, playNextInQueue, addToQueue } = usePlayer();
  const { showToast } = useToast();

  // Sync tab with query params
  useEffect(() => {
    const t = searchParams.get('tab');
    if (['focus', 'exam', 'rooms', 'streaks'].includes(t)) {
      setActiveTab(t);
    }
  }, [searchParams]);

  // Update timer initial seconds when duration changes
  const handleSelectDuration = (minutes) => {
    setSelectedDuration(minutes);
    const secs = minutes * 60;
    setTimerInitialSeconds(secs);
    setTimerSecondsLeft(secs);
    setIsTimerRunning(false);
  };

  // Live Timer Effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsTimerRunning(false);
            // Session completed! Record session and increase streak
            const updated = recordCompletedSession(selectedDuration);
            setStudentStats(updated);
            showToast(`🎉 FocusFlow session complete! +${selectedDuration} min added to your streak!`, 'success');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSecondsLeft, selectedDuration, showToast]);

  // Reset timer
  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimerSecondsLeft(timerInitialSeconds);
  };

  // Toggle timer + audio flow
  const handleToggleTimer = () => {
    const nextRunning = !isTimerRunning;
    setIsTimerRunning(nextRunning);

    if (nextRunning) {
      // If no music is playing, start the soundscape automatically
      const activeSoundscape = STUDY_SOUNDSCAPES.find((s) => s.id === selectedSoundscapeId);
      if (activeSoundscape) {
        const tracks = getSongsByIds(activeSoundscape.songIds);
        if (tracks.length > 0 && (!isPlaying || !tracks.some((t) => t.id === currentSong?.id))) {
          playSong(tracks[0], tracks);
          if (!distractionFree) {
            showToast(`Focus session started: playing ${activeSoundscape.name} 🎧`, 'info');
          }
        }
      }
    }
  };

  // Listen to external stats updates
  useEffect(() => {
    const handleStatsUpdate = () => {
      setStudentStats(getStudentStats());
    };
    window.addEventListener('vibely_student_stats_updated', handleStatsUpdate);
    return () => window.removeEventListener('vibely_student_stats_updated', handleStatsUpdate);
  }, []);

  // Format timer seconds into MM:SS
  const formatTimer = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const timerProgress = useMemo(() => {
    if (timerInitialSeconds === 0) return 100;
    return Math.round(((timerInitialSeconds - timerSecondsLeft) / timerInitialSeconds) * 100);
  }, [timerSecondsLeft, timerInitialSeconds]);

  // Active Soundscape & tracks
  const currentSoundscape = useMemo(() => {
    return STUDY_SOUNDSCAPES.find((s) => s.id === selectedSoundscapeId) || STUDY_SOUNDSCAPES[0];
  }, [selectedSoundscapeId]);

  const soundscapeTracks = useMemo(() => {
    return getSongsByIds(currentSoundscape.songIds);
  }, [currentSoundscape]);

  // Active Subject & tracks
  const currentSubject = useMemo(() => {
    return EXAM_SUBJECTS.find((s) => s.id === selectedSubjectId) || EXAM_SUBJECTS[0];
  }, [selectedSubjectId]);

  const subjectTracks = useMemo(() => {
    return getSongsByIds(currentSubject.songIds);
  }, [currentSubject]);

  // Play Subject Playlist
  const isSubjectPlaying = isPlaying && subjectTracks.some((s) => s.id === currentSong?.id);

  const handlePlaySubject = () => {
    if (isSubjectPlaying) {
      togglePlay();
    } else if (subjectTracks.length > 0) {
      playSong(subjectTracks[0], subjectTracks);
      showToast(`Now playing: ${currentSubject.name} Exam Flow 📚`, 'info');
    }
  };

  // Join or Leave Virtual Study Room
  const handleToggleRoom = (room) => {
    if (joinedRoomId === room.id) {
      setJoinedRoomId(null);
      showToast(`Left ${room.title}. Great work! ☕`, 'info');
    } else {
      setJoinedRoomId(room.id);
      const tracks = getSongsByIds(room.trackIds);
      if (tracks.length > 0) {
        playSong(tracks[0], tracks);
      }
      showToast(`Joined ${room.title} with ${room.activeCount} other students! 👥`, 'success');
    }
  };

  // Reactions in Room
  const handleReaction = (emoji) => {
    setRecentReaction(emoji);
    showToast(`Shared reaction: ${emoji}`, 'info');
    setTimeout(() => setRecentReaction(null), 2500);
  };

  // Save Subject Playlist
  const handleSavePlaylist = async (title, desc, tracks) => {
    setSavingPlaylist(true);
    const newPlaylist = {
      id: `playlist-student-${Date.now()}`,
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
        trackIds: tracks.map((t) => t.id)
      });
    } catch (e) {}

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

  const SubjectIcon = SUBJECT_ICONS[currentSubject.icon] || Sparkles;

  return (
    <div
      className={`space-y-12 pb-24 relative select-none transition-all duration-700 ${
        distractionFree ? 'max-w-4xl mx-auto' : ''
      }`}
    >
      {/* Dynamic Ambient Background Glows */}
      <div className="fixed top-24 right-10 w-96 h-96 rounded-full blur-[160px] pointer-events-none -z-10 bg-indigo-600/15" />
      <div className="fixed bottom-32 left-10 w-80 h-80 rounded-full blur-[140px] pointer-events-none -z-10 bg-purple-600/15" />

      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-3xl p-8 md:p-12 border border-vibely-border bg-gradient-to-r from-indigo-950/90 via-slate-900/90 to-purple-950/80 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-2xl space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold uppercase tracking-wider shadow-lg shadow-indigo-500/10">
                <GraduationCap className="w-4 h-4 text-indigo-400" />
                <span>Vibely Student Zone</span>
              </div>

              {/* Distraction Free Toggle Pill */}
              <button
                onClick={() => {
                  const next = !distractionFree;
                  setDistractionFree(next);
                  showToast(
                    next ? 'Zen Mode activated — lowering distractions 🧘' : 'Standard view restored 🎧',
                    'info'
                  );
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                  distractionFree
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-emerald-500/20'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-700'
                }`}
                title="Automatically lower distractions by hiding unnecessary alerts"
              >
                {distractionFree ? <VolumeX className="w-3.5 h-3.5 text-emerald-400" /> : <Volume2 className="w-3.5 h-3.5 text-slate-400" />}
                <span>{distractionFree ? 'Zen Mode: ON' : 'Zen Distraction-Free'}</span>
              </button>
            </div>

            <h1 className="font-display text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
              Study. <span className="bg-gradient-to-r from-indigo-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">Vibe</span>. Repeat.
            </h1>

            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              Curated soundscapes and focus tools engineered specifically for college students and high-focus study sprints.
            </p>

            {/* Feature Tabs */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => {
                  setActiveTab('focus');
                  setSearchParams({ tab: 'focus' });
                }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs md:text-sm font-bold transition-all shadow-lg ${
                  activeTab === 'focus'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-indigo-600/25 scale-105'
                    : 'bg-vibely-surface border border-vibely-border text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Timer className="w-4 h-4 text-cyan-400" />
                <span>FocusFlow Timer</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('exam');
                  setSearchParams({ tab: 'exam' });
                }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs md:text-sm font-bold transition-all shadow-lg ${
                  activeTab === 'exam'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-pink-600/25 scale-105'
                    : 'bg-vibely-surface border border-vibely-border text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Exam Mode</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('rooms');
                  setSearchParams({ tab: 'rooms' });
                }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs md:text-sm font-bold transition-all shadow-lg ${
                  activeTab === 'rooms'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-cyan-600/25 scale-105'
                    : 'bg-vibely-surface border border-vibely-border text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Study with Me</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('streaks');
                  setSearchParams({ tab: 'streaks' });
                }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs md:text-sm font-bold transition-all shadow-lg ${
                  activeTab === 'streaks'
                    ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-amber-500/25 scale-105'
                    : 'bg-vibely-surface border border-vibely-border text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Flame className="w-4 h-4 text-orange-400" />
                <span>Focus Streaks ({studentStats.streakDays}d)</span>
              </button>
            </div>
          </div>

          {/* Quick Streak Widget */}
          <div className="shrink-0 p-5 rounded-3xl bg-slate-900/90 border border-white/10 shadow-2xl flex flex-col items-center gap-3 w-full sm:w-56 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/25">
              <Flame className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <span className="font-display font-extrabold text-2xl text-white">
                {studentStats.streakDays}-Day Streak
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {studentStats.totalMinutes} total focus minutes
              </p>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-400 to-rose-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (studentStats.todaySessions / 3) * 100)}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 font-medium">
              Daily Goal: {studentStats.todaySessions}/3 sessions
            </span>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* FEATURE 1: STUDY MODE — FOCUSFLOW TIMER */}
      {/* ==================================================================== */}
      {activeTab === 'focus' && (
        <div className="space-y-10 animate-in fade-in duration-300">
          {/* STEP 1: Duration Selector */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Step 1</span>
                <h2 className="font-display text-2xl font-bold text-white">Choose Session Duration</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {FOCUS_DURATIONS.map((dur) => {
                const isSelected = selectedDuration === dur.minutes;
                return (
                  <button
                    key={dur.minutes}
                    onClick={() => handleSelectDuration(dur.minutes)}
                    className={`p-6 rounded-3xl border text-left transition-all duration-300 relative flex flex-col justify-between overflow-hidden group ${
                      isSelected
                        ? `bg-slate-900 ${dur.borderColor} shadow-xl ring-2 ring-indigo-500/40 scale-[1.02]`
                        : 'bg-vibely-surface/80 border-vibely-border hover:border-slate-600 hover:scale-[1.01]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-display font-black text-3xl text-white">{dur.label}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {dur.badge}
                        </span>
                      </div>
                      <h4 className="font-display font-bold text-base text-white group-hover:text-cyan-300 transition-colors">
                        {dur.name}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">{dur.tagline}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-vibely-border/60 text-[11px] text-slate-400 font-medium">
                      ☕ +{dur.breakMinutes}m Rest Interval
                    </div>

                    {isSelected && (
                      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${dur.color}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* STEP 2: Choose Study Soundscape */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-purple-400">Step 2</span>
                <h2 className="font-display text-2xl font-bold text-white">Choose Study Audio Scenery</h2>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {STUDY_SOUNDSCAPES.map((sc) => {
                const isSelected = selectedSoundscapeId === sc.id;
                return (
                  <button
                    key={sc.id}
                    onClick={() => setSelectedSoundscapeId(sc.id)}
                    className={`p-5 rounded-2xl border text-left transition-all duration-300 relative flex flex-col justify-between overflow-hidden group ${
                      isSelected
                        ? 'bg-slate-900 border-purple-500/60 shadow-xl ring-2 ring-purple-500/40 scale-[1.03]'
                        : 'bg-vibely-surface/80 border-vibely-border hover:border-slate-600 hover:scale-[1.01]'
                    }`}
                  >
                    <div>
                      <span className="text-3xl filter drop-shadow block mb-2">{sc.emoji}</span>
                      <h4 className="font-display font-bold text-sm text-white group-hover:text-purple-300 transition-colors">
                        {sc.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{sc.subtitle}</p>
                    </div>

                    <div className="mt-3 text-[10px] text-slate-400 font-medium">
                      {sc.songIds.length} Looped Tracks
                    </div>

                    {isSelected && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-cyan-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* STEP 3: Active FocusFlow Timer Dashboard */}
          <section className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-950 border border-indigo-500/30 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
              {/* Circular Clock Display */}
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center shrink-0">
                {/* SVG Progress Circle */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="44%"
                    className="stroke-slate-800"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="44%"
                    className="stroke-indigo-500 transition-all duration-1000 ease-linear"
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 125}
                    strokeDashoffset={
                      2 * Math.PI * 125 * (1 - timerSecondsLeft / timerInitialSeconds)
                    }
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>

                {/* Inside Timer Center */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                    {isTimerRunning ? 'Flow In Progress' : 'Ready to Focus'}
                  </span>
                  <div className="font-display font-black text-5xl sm:text-6xl text-white tracking-tight my-1 font-mono">
                    {formatTimer(timerSecondsLeft)}
                  </div>
                  <span className="text-xs text-slate-400">
                    {selectedDuration} min • {currentSoundscape.name}
                  </span>
                </div>
              </div>

              {/* Timer Controls & Active Audio Info */}
              <div className="space-y-6 max-w-xl text-center lg:text-left">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-2 border border-cyan-500/30">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>FocusFlow Active Engine</span>
                  </div>
                  <h3 className="font-display text-3xl font-black text-white">
                    {isTimerRunning ? 'Locked into Deep Focus' : 'Start Your Focus Session'}
                  </h3>
                  <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                    {distractionFree
                      ? '🧘 Zen Mode active: Non-essential toasts and alerts are silenced so you can stay fully immersed.'
                      : 'Audio streams automatically synchronize with your study countdown. Complete the timer to add focus minutes to your streak.'}
                  </p>
                </div>

                {/* Big Action Controls */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                  <button
                    onClick={handleToggleTimer}
                    className={`flex items-center gap-3 px-8 py-4 rounded-full font-bold text-base text-white shadow-xl transition-all hover:scale-105 active:scale-95 ${
                      isTimerRunning
                        ? 'bg-gradient-to-r from-amber-500 to-rose-600 shadow-rose-600/30'
                        : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 shadow-indigo-600/30'
                    }`}
                  >
                    {isTimerRunning ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
                    <span>{isTimerRunning ? 'Pause Session' : 'Start Focus Session'}</span>
                  </button>

                  <button
                    onClick={handleResetTimer}
                    className="flex items-center gap-2 px-5 py-4 rounded-full font-semibold text-xs bg-vibely-surface hover:bg-slate-800 text-slate-200 border border-vibely-border transition-all hover:scale-105"
                    title="Reset timer to beginning"
                  >
                    <RotateCcw className="w-4 h-4 text-slate-400" />
                    <span>Reset</span>
                  </button>
                </div>

                {/* Soundscape Track List */}
                <div className="pt-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Playing Scenery: {currentSoundscape.name} ({soundscapeTracks.length} tracks)
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {soundscapeTracks.map((t) => (
                      <span
                        key={t.id}
                        onClick={() => playSong(t, soundscapeTracks)}
                        className={`cursor-pointer px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                          currentSong?.id === t.id
                            ? 'bg-purple-600/30 text-purple-300 border-purple-500/50'
                            : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-700'
                        }`}
                      >
                        <Headphones className="w-3 h-3 text-cyan-400" />
                        <span>{t.title}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ==================================================================== */}
      {/* FEATURE 2: EXAM MODE — LAST-MINUTE VIBES & SUBJECT PLAYLISTS */}
      {/* ==================================================================== */}
      {activeTab === 'exam' && (
        <div className="space-y-10 animate-in fade-in duration-300">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-pink-400">Targeted Exam Playlists</span>
            <h2 className="font-display text-2xl font-bold text-white">Exam Mode: Choose Your Subject</h2>
            <p className="text-xs text-slate-400 mt-1">
              Select your subject to trigger bespoke algorithmic frequencies engineered for optimal cognitive retention.
            </p>
          </div>

          {/* Subject Pills Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {EXAM_SUBJECTS.map((subj) => {
              const isSelected = selectedSubjectId === subj.id;
              const IconComp = SUBJECT_ICONS[subj.icon] || Sparkles;
              return (
                <button
                  key={subj.id}
                  onClick={() => setSelectedSubjectId(subj.id)}
                  className={`p-6 rounded-3xl border text-left transition-all duration-300 relative flex flex-col justify-between overflow-hidden group ${
                    isSelected
                      ? 'bg-slate-900 border-pink-500/60 shadow-xl ring-2 ring-pink-500/40 scale-[1.03]'
                      : 'bg-vibely-surface/80 border-vibely-border hover:border-slate-600 hover:scale-[1.01]'
                  }`}
                >
                  <div>
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${subj.accentColor} flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}
                    >
                      <IconComp className="w-6 h-6" />
                    </div>

                    <h3 className="font-display font-bold text-base text-white group-hover:text-pink-300 transition-colors">
                      {subj.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">{subj.tagline}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-vibely-border/60 text-[10px] text-slate-400 font-medium">
                    {subj.songIds.length} Verified Tracks
                  </div>

                  {isSelected && (
                    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${subj.accentColor}`} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Subject Showcase & Tracklist */}
          <div className="p-6 md:p-8 rounded-3xl bg-vibely-surface border border-vibely-border space-y-6 shadow-xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div
                  className={`w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-tr ${currentSubject.accentColor} flex items-center justify-center text-white shadow-lg`}
                >
                  <SubjectIcon className="w-7 h-7" />
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${currentSubject.badgeColor}`}>
                      {currentSubject.name}
                    </span>
                    <span>•</span>
                    <span className="text-xs font-semibold text-slate-400">
                      {subjectTracks.length} Curated Revision Tracks
                    </span>
                  </div>

                  <h3 className="font-display font-extrabold text-2xl md:text-3xl text-white mt-1">
                    {currentSubject.name}: <span className="text-slate-300 font-medium text-xl">{currentSubject.tagline}</span>
                  </h3>
                  <p className="text-xs md:text-sm text-slate-300 max-w-2xl mt-1.5 leading-relaxed">
                    {currentSubject.description}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  onClick={handlePlaySubject}
                  className={`flex items-center gap-2.5 px-6 py-3 rounded-full font-bold text-xs md:text-sm text-white shadow-xl transition-all hover:scale-105 active:scale-95 bg-gradient-to-r ${currentSubject.accentColor}`}
                >
                  {isSubjectPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                  <span>{isSubjectPlaying ? 'Pause Stream' : 'Play Subject Flow'}</span>
                </button>

                <button
                  onClick={() => {
                    [...subjectTracks].reverse().forEach((s) => playNextInQueue(s));
                    showToast(`Queued ${subjectTracks.length} tracks to play next ⏭️`, 'success');
                  }}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-full font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all hover:scale-105"
                >
                  <FastForward className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Play Next</span>
                </button>

                <button
                  onClick={() => {
                    subjectTracks.forEach((s) => addToQueue(s));
                    showToast(`Added ${subjectTracks.length} tracks to queue 🎶`, 'success');
                  }}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-full font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all hover:scale-105"
                >
                  <ListPlus className="w-3.5 h-3.5 text-purple-400" />
                  <span>Queue All</span>
                </button>

                <button
                  onClick={() =>
                    handleSavePlaylist(
                      `${currentSubject.name} Exam Flow`,
                      currentSubject.description,
                      subjectTracks
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

            {/* Song Listing Table */}
            <div className="pt-4 border-t border-vibely-border space-y-1">
              <div className="flex items-center justify-between px-4 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-white/5">
                <span># & Title</span>
                <span className="hidden md:inline">Album</span>
                <span>Duration</span>
              </div>
              {subjectTracks.map((song, idx) => (
                <SongRow key={song.id} song={song} index={idx} queueList={subjectTracks} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* FEATURE 3: “STUDY WITH ME” VIRTUAL FOCUS ROOMS */}
      {/* ==================================================================== */}
      {activeTab === 'rooms' && (
        <div className="space-y-10 animate-in fade-in duration-300">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider border border-cyan-500/30 mb-1">
              <Users className="w-3.5 h-3.5" />
              <span>Virtual Campus Coworking</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-white">“Study with Me” Virtual Focus Rooms</h2>
            <p className="text-xs text-slate-400 mt-1">
              Study side-by-side with fellow students worldwide. Synchronized ambient timer, shared soundtrack, and zero pressure (cameras remain off).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VIRTUAL_STUDY_ROOMS.map((room) => {
              const isJoined = joinedRoomId === room.id;
              return (
                <div
                  key={room.id}
                  className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
                    isJoined
                      ? 'bg-slate-900 border-cyan-500 shadow-2xl ring-2 ring-cyan-500/50 scale-[1.02]'
                      : `bg-gradient-to-br ${room.gradient} ${room.border} hover:border-slate-500`
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl filter drop-shadow">{room.emoji}</span>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 text-cyan-300 border border-cyan-500/30 text-xs font-bold">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        <span>{room.activeCount} studying now</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-display font-extrabold text-xl text-white">
                        {room.title}
                      </h3>
                      <p className="text-xs text-slate-300 mt-1">{room.subtitle}</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Sprint Countdown:</span>
                        <span className="font-mono font-bold text-cyan-300">{room.minutesLeft}m remaining</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Shared Sound:</span>
                        <span className="text-slate-200 font-medium truncate max-w-[150px]">{room.currentSoundscape}</span>
                      </div>
                    </div>

                    {/* Studying Members List */}
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                        Active Study Peers
                      </span>
                      <div className="space-y-1.5">
                        {room.members.map((m, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-white/5 text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <span>{m.avatar}</span>
                              <span className="font-semibold text-white">{m.name}</span>
                              <span className="text-[10px] text-slate-400">({m.field})</span>
                            </div>
                            <span className="text-[10px] text-indigo-300 font-medium">{m.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Room Action Control */}
                  <div className="mt-6 pt-4 border-t border-white/10 space-y-3">
                    <button
                      onClick={() => handleToggleRoom(room)}
                      className={`w-full py-3 rounded-full font-bold text-xs transition-all shadow-lg flex items-center justify-center gap-2 ${
                        isJoined
                          ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                          : 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-cyan-500/25'
                      }`}
                    >
                      {isJoined ? (
                        <>
                          <VolumeX className="w-4 h-4" />
                          <span>Leave Focus Room</span>
                        </>
                      ) : (
                        <>
                          <Headphones className="w-4 h-4" />
                          <span>Join Virtual Study Room</span>
                        </>
                      )}
                    </button>

                    {/* Quick Reactions Bar (when joined) */}
                    {isJoined && (
                      <div className="flex items-center justify-center gap-2 pt-1">
                        {['🔥', '☕', '🎧', '💻', '💯'].map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => handleReaction(emoji)}
                            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-600 flex items-center justify-center text-sm transition-transform hover:scale-125"
                            title={`Send ${emoji} to room`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* FEATURE 4: FOCUS STREAKS & ACHIEVEMENTS */}
      {/* ==================================================================== */}
      {activeTab === 'streaks' && (
        <div className="space-y-10 animate-in fade-in duration-300">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Study Gamification</span>
            <h2 className="font-display text-2xl font-bold text-white">Focus Streaks & Academic Records</h2>
            <p className="text-xs text-slate-400 mt-1">
              Consistency creates mastery. Complete daily Pomodoro sessions to maintain your streak flame.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-6 rounded-3xl bg-vibely-surface border border-vibely-border flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Streak</span>
                <Flame className="w-6 h-6 text-orange-400 animate-pulse" />
              </div>
              <div className="font-display font-black text-4xl text-white">
                {studentStats.streakDays} <span className="text-lg font-normal text-slate-400">Days</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">Active focus logged today</p>
            </div>

            <div className="p-6 rounded-3xl bg-vibely-surface border border-vibely-border flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Time</span>
                <Timer className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="font-display font-black text-4xl text-white">
                {studentStats.totalMinutes} <span className="text-lg font-normal text-slate-400">Minutes</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">Deep work sessions tracked</p>
            </div>

            <div className="p-6 rounded-3xl bg-vibely-surface border border-vibely-border flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed Sprints</span>
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="font-display font-black text-4xl text-white">
                {studentStats.sessionsCompleted} <span className="text-lg font-normal text-slate-400">Sprints</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">Finished without quitting</p>
            </div>

            <div className="p-6 rounded-3xl bg-vibely-surface border border-vibely-border flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Daily Goal</span>
                <Award className="w-6 h-6 text-purple-400" />
              </div>
              <div className="font-display font-black text-4xl text-white">
                {studentStats.todaySessions} <span className="text-lg font-normal text-slate-400">/ 3 Done</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                {studentStats.todaySessions >= 3 ? '🎉 Daily goal completed!' : `${3 - studentStats.todaySessions} more to hit daily goal`}
              </p>
            </div>
          </div>

          {/* Achievement Badges Showcase */}
          <div className="p-6 md:p-8 rounded-3xl bg-vibely-surface border border-vibely-border space-y-6">
            <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Academic Milestone Badges</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 flex items-center gap-3">
                <span className="text-3xl">🎓</span>
                <div>
                  <h4 className="font-bold text-sm text-white">Freshman Focus</h4>
                  <p className="text-[11px] text-slate-400">Completed 1st study block</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 flex items-center gap-3">
                <span className="text-3xl">🔥</span>
                <div>
                  <h4 className="font-bold text-sm text-white">Streak Master</h4>
                  <p className="text-[11px] text-slate-400">Maintained 3+ day streak</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 flex items-center gap-3">
                <span className="text-3xl">🧠</span>
                <div>
                  <h4 className="font-bold text-sm text-white">Exam Conqueror</h4>
                  <p className="text-[11px] text-slate-400">Listened to all 5 subjects</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 flex items-center gap-3">
                <span className="text-3xl">🚀</span>
                <div>
                  <h4 className="font-bold text-sm text-white">Deep Work Wizard</h4>
                  <p className="text-[11px] text-slate-400">Exceeded 120+ focus mins</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentZone;
