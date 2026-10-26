// ====================================================================
// VIBELY — STUDENT ZONE DATA CATALOG
// FocusFlow Sessions, Exam Mode Subjects, Virtual Study Rooms & Streaks
// ====================================================================

import { DEFAULT_SONGS } from './catalog';

export const FOCUS_DURATIONS = [
  {
    minutes: 25,
    label: '25 Min',
    name: 'Pomodoro Sprint',
    breakMinutes: 5,
    tagline: '25m laser focus + 5m brain recharge',
    badge: 'Popular',
    color: 'from-purple-500 to-indigo-600',
    borderColor: 'border-purple-500/40',
    icon: 'Timer'
  },
  {
    minutes: 45,
    label: '45 Min',
    name: 'Deep Work Block',
    breakMinutes: 10,
    tagline: 'Ideal for complex problem solving & essay drafting',
    badge: 'High Focus',
    color: 'from-cyan-500 to-blue-600',
    borderColor: 'border-cyan-500/40',
    icon: 'Brain'
  },
  {
    minutes: 60,
    label: '60 Min',
    name: 'Ultra Study Marathon',
    breakMinutes: 15,
    tagline: 'Uninterrupted deep flow for intensive revisions',
    badge: 'Pro Flow',
    color: 'from-amber-500 to-rose-600',
    borderColor: 'border-amber-500/40',
    icon: 'Flame'
  }
];

export const STUDY_SOUNDSCAPES = [
  {
    id: 'lofi-beats',
    name: 'Lo-Fi Beats',
    subtitle: 'Warm analog vinyl & chillhop tape loops',
    emoji: '☕',
    color: 'from-amber-500/20 to-purple-600/20',
    border: 'border-amber-500/30',
    songIds: [
      'song-midnight-rain',
      'song-gehraiyaan',
      'song-anuv-baarishein',
      'song-cyber-city-drive'
    ]
  },
  {
    id: 'rain-ambient',
    name: 'Rain & Ambient Calm',
    subtitle: 'Gentle raindrops & soft acoustic frequencies',
    emoji: '🌧️',
    color: 'from-blue-600/20 to-indigo-600/20',
    border: 'border-blue-500/30',
    songIds: [
      'song-anuv-baarishein',
      'song-yeh-aaina',
      'song-main-rahoon',
      'song-hasi-ban-gaye'
    ]
  },
  {
    id: 'piano-classical',
    name: 'Piano & Acoustic Soul',
    subtitle: 'Emotional melodic keys & serene harmony',
    emoji: '🎹',
    color: 'from-pink-500/20 to-rose-600/20',
    border: 'border-pink-500/30',
    songIds: [
      'song-ed-perfect',
      'song-sonu-main-agar',
      'song-kal-ho-naa-ho',
      'song-alizeh',
      'song-khuda-jaane'
    ]
  },
  {
    id: 'synth-cyber',
    name: '432Hz Synth & Instrumental',
    subtitle: 'Steady electronic flow with zero vocal distraction',
    emoji: '⚡',
    color: 'from-cyan-500/20 to-purple-600/20',
    border: 'border-cyan-500/30',
    songIds: [
      'song-cyber-city-drive',
      'song-stars-align',
      'song-blinding-lights',
      'song-coldplay-viva'
    ]
  }
];

export const EXAM_SUBJECTS = [
  {
    id: 'programming-cs',
    name: 'Programming & CS',
    icon: 'Laptop',
    emoji: '💻',
    accentColor: 'from-cyan-500 to-blue-600',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    tagline: 'Algorithmic Flow & Clean Code',
    description: 'Brisk 432Hz synthwaves, atmospheric electronic beats, and distraction-free rhythms to lock you into debugging and system architecture.',
    songIds: [
      'song-cyber-city-drive',
      'song-stars-align',
      'song-gehraiyaan',
      'song-midnight-rain',
      'song-blinding-lights'
    ]
  },
  {
    id: 'mathematics-physics',
    name: 'Mathematics & Physics',
    icon: 'Compass',
    emoji: '📐',
    accentColor: 'from-purple-500 to-indigo-600',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    tagline: 'Differential Equations & Logic Resonance',
    description: 'Minimal acoustic melodies, tranquil piano keys, and ambient grounding frequencies that heighten spatial visualization and problem solving.',
    songIds: [
      'song-kun-faya-kun',
      'song-ed-perfect',
      'song-main-rahoon',
      'song-yeh-aaina',
      'song-alizeh'
    ]
  },
  {
    id: 'theory-law',
    name: 'Theory & Memorization',
    icon: 'BookOpen',
    emoji: '📖',
    accentColor: 'from-amber-400 to-orange-500',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    tagline: 'Active Recall & Retention Groove',
    description: 'Steady, low-BPM acoustic guitar and vocal harmonies that keep your mind absorbed in dense textbook reading without cognitive burnout.',
    songIds: [
      'song-anuv-baarishein',
      'song-gehraiyaan',
      'song-hasi-ban-gaye',
      'song-dil-diyan-gallan',
      'song-o-saathi'
    ]
  },
  {
    id: 'pre-exam-destress',
    name: 'Pre-Exam Calm & De-Stress',
    icon: 'Sparkles',
    emoji: '🧘',
    accentColor: 'from-emerald-400 to-teal-500',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    tagline: 'Panic-Free Grounding & Confidence',
    description: 'Warm soothing acoustics and peaceful resonance designed to lower your cortisol and steady your breathing 30 minutes before the exam begins.',
    songIds: [
      'song-apna-bana-le',
      'song-kun-faya-kun',
      'song-ilahi',
      'song-pee-loon',
      'song-kesariya'
    ]
  },
  {
    id: 'late-night-revision',
    name: 'Late-Night Revision',
    icon: 'Moon',
    emoji: '🌙',
    accentColor: 'from-rose-500 to-purple-600',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    tagline: 'Midnight Oil & Red-Eye Focus',
    description: 'Low-stimulus nocturnal soundscapes for 2 AM syllabus cramming — keeping your eyes open and thoughts razor-sharp without caffeine jitters.',
    songIds: [
      'song-agar-tum-saath-ho',
      'song-kal-ho-naa-ho',
      'song-khairiyat',
      'song-channa-mereya',
      'song-midnight-rain'
    ]
  }
];

export const VIRTUAL_STUDY_ROOMS = [
  {
    id: 'room-library-4th-floor',
    title: 'University Library — 4th Floor',
    subtitle: 'Silent Code, Maths & Problem Solving',
    activeCount: 94,
    currentSoundscape: 'Lo-Fi Synth & Ambient Focus',
    targetMinutes: 45,
    minutesLeft: 31,
    emoji: '🏛️',
    gradient: 'from-indigo-600/30 via-slate-900 to-purple-900/40',
    border: 'border-indigo-500/30',
    trackIds: ['song-cyber-city-drive', 'song-stars-align', 'song-gehraiyaan'],
    members: [
      { name: 'Arjun M.', field: 'CS & AI', status: 'In the Zone ⚡', avatar: '👨‍💻' },
      { name: 'Sarah K.', field: 'Applied Maths', status: 'Proving Theorems 📐', avatar: '👩‍🔬' },
      { name: 'Dev R.', field: 'ECE', status: 'Verilog Synthesis 💻', avatar: '🧑‍💻' },
      { name: 'Liam P.', field: 'Physics', status: 'Quantum Notes 🌌', avatar: '👨‍🎓' },
      { name: 'Meera S.', field: 'Data Science', status: 'Model Training 📊', avatar: '👩‍💻' }
    ]
  },
  {
    id: 'room-midnight-cafe',
    title: 'Midnight Tokyo Coffeehouse',
    subtitle: 'Cozy Rain, Coffee Steam & Deep Writing',
    activeCount: 148,
    currentSoundscape: 'Lo-Fi Rain & Warm Piano',
    targetMinutes: 25,
    minutesLeft: 14,
    emoji: '☕',
    gradient: 'from-amber-600/25 via-slate-900 to-slate-950',
    border: 'border-amber-500/30',
    trackIds: ['song-midnight-rain', 'song-anuv-baarishein', 'song-ed-perfect'],
    members: [
      { name: 'Kenji T.', field: 'Literature', status: 'Essay Final Draft ✍️', avatar: '📖' },
      { name: 'Anya V.', field: 'Law', status: 'Case Law Revision ⚖️', avatar: '👩‍⚖️' },
      { name: 'Rohan B.', field: 'Biomedicine', status: 'Flashcard Sprint 🧬', avatar: '👨‍⚕️' },
      { name: 'Elena M.', field: 'Product Design', status: 'Figma Flow 🎨', avatar: '👩‍🎨' },
      { name: 'Zack L.', field: 'Macro Economics', status: 'Reading Graphs 📈', avatar: '🧑‍💼' }
    ]
  },
  {
    id: 'room-finals-sprint',
    title: 'Finals Countdown Sprint House',
    subtitle: 'High-Stakes Revision & Group Momentum',
    activeCount: 76,
    currentSoundscape: 'Instrumental Calm & Peak Focus',
    targetMinutes: 60,
    minutesLeft: 48,
    emoji: '🚀',
    gradient: 'from-rose-600/25 via-slate-900 to-indigo-950/40',
    border: 'border-rose-500/30',
    trackIds: ['song-kun-faya-kun', 'song-yeh-aaina', 'song-main-rahoon'],
    members: [
      { name: 'Vikram C.', field: 'Statistics', status: 'Hypothesis Testing 🎲', avatar: '👨‍🏫' },
      { name: 'Chloe N.', field: 'Organic Chem', status: 'Reaction Mechanisms 🧪', avatar: '👩‍🔬' },
      { name: 'Aditya P.', field: 'MBA Finance', status: 'DCF Valuation 💼', avatar: '🧑‍💻' },
      { name: 'Maya D.', field: 'Cognitive Science', status: 'Reviewing Papers 🧠', avatar: '👩‍🎓' }
    ]
  }
];

export function getSongsByIds(ids = []) {
  const map = new Map(DEFAULT_SONGS.map((s) => [s.id, s]));
  return ids.map((id) => map.get(id)).filter(Boolean);
}

export function getStudentStats() {
  try {
    const raw = localStorage.getItem('vibely_student_stats');
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        streakDays: parsed.streakDays || 1,
        totalMinutes: parsed.totalMinutes || 0,
        sessionsCompleted: parsed.sessionsCompleted || 0,
        todaySessions: parsed.todaySessions || 0,
        lastActiveDate: parsed.lastActiveDate || new Date().toISOString().slice(0, 10)
      };
    }
  } catch (e) {}

  return {
    streakDays: 3,
    totalMinutes: 145,
    sessionsCompleted: 5,
    todaySessions: 2,
    lastActiveDate: new Date().toISOString().slice(0, 10)
  };
}

export function recordCompletedSession(minutes) {
  const current = getStudentStats();
  const today = new Date().toISOString().slice(0, 10);
  const isSameDay = current.lastActiveDate === today;

  const updated = {
    streakDays: isSameDay ? current.streakDays : current.streakDays + 1,
    totalMinutes: (current.totalMinutes || 0) + minutes,
    sessionsCompleted: (current.sessionsCompleted || 0) + 1,
    todaySessions: isSameDay ? (current.todaySessions || 0) + 1 : 1,
    lastActiveDate: today
  };

  try {
    localStorage.setItem('vibely_student_stats', JSON.stringify(updated));
    window.dispatchEvent(new Event('vibely_student_stats_updated'));
  } catch (e) {}

  return updated;
}
