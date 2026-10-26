// ====================================================================
// VIBELY — MOODSYNC & PERSONAL SOUNDTRACKS ENGINE
// Intelligent mood mapping, intensity scoring, and daily moments
// ====================================================================

import { DEFAULT_SONGS } from './catalog';

export const MOOD_DEFINITIONS = [
  {
    id: 'happy',
    name: 'Happy',
    emoji: '✨',
    color: 'from-amber-400 via-orange-500 to-pink-500',
    borderColor: 'border-amber-500/40',
    glowColor: 'shadow-amber-500/20',
    badgeBg: 'bg-amber-500/20 text-amber-300',
    tagline: 'High spirits, sunshine, and celebration',
    intensities: [
      {
        level: 1,
        label: 'Warm Contentment',
        desc: 'Gentle feel-good acoustic melodies and easygoing smiles',
        songIds: ['song-apna-bana-le', 'song-anuv-baarishein', 'song-ilahi']
      },
      {
        level: 2,
        label: 'Feel-Good Joy',
        desc: 'Catchy, uplifting singalong rhythms to brighten your day',
        songIds: ['song-kesariya', 'song-levitating', 'song-ghungroo', 'song-ed-perfect']
      },
      {
        level: 3,
        label: 'Euphoric Celebration',
        desc: 'Unstoppable high-voltage dance bangers & stadium pop',
        songIds: ['song-tauba-tauba', 'song-chaiyya-chaiyya', 'song-london-thumakda', 'song-taylor-cruel-summer']
      }
    ]
  },
  {
    id: 'sad',
    name: 'Sad',
    emoji: '🌧️',
    color: 'from-blue-600 via-indigo-600 to-purple-800',
    borderColor: 'border-blue-500/40',
    glowColor: 'shadow-blue-500/20',
    badgeBg: 'bg-blue-500/20 text-blue-300',
    tagline: 'Melancholic echoes, soft rain, and catharsis',
    intensities: [
      {
        level: 1,
        label: 'A Little Melancholic',
        desc: 'Soft acoustic strings and peaceful nostalgia',
        songIds: ['song-anuv-baarishein', 'song-yeh-aaina', 'song-midnight-rain']
      },
      {
        level: 2,
        label: 'Deep in My Feelings',
        desc: 'Heart-wrenching vocal masterpieces and soulful resonance',
        songIds: ['song-channa-mereya', 'song-agar-tum-saath-ho', 'song-tum-hi-ho']
      },
      {
        level: 3,
        label: 'Really Need Cheering Up!',
        desc: 'Soothing songs that gently transition into uplifting hope',
        songIds: ['song-kun-faya-kun', 'song-shankar-breathless', 'song-ilahi', 'song-kesariya']
      }
    ]
  },
  {
    id: 'stressed',
    name: 'Stressed',
    emoji: '🌿',
    color: 'from-emerald-500 via-teal-600 to-cyan-700',
    borderColor: 'border-emerald-500/40',
    glowColor: 'shadow-emerald-500/20',
    badgeBg: 'bg-emerald-500/20 text-emerald-300',
    tagline: 'Decompress, breathe deeply, and find inner peace',
    intensities: [
      {
        level: 1,
        label: 'Mild Unwind',
        desc: 'Calm acoustic guitar and slow melodic soundscapes',
        songIds: ['song-pee-loon', 'song-dil-diyan-gallan', 'song-anuv-baarishein']
      },
      {
        level: 2,
        label: 'Sensory Detox (432Hz)',
        desc: 'Immersion in lo-fi beats, rain whispers, and ambient healing',
        songIds: ['song-midnight-rain', 'song-cyber-city-drive', 'song-kun-faya-kun']
      },
      {
        level: 3,
        label: 'Power Through the Pressure',
        desc: 'Focused driving synthwave rhythm to clear mental clutter',
        songIds: ['song-blinding-lights', 'song-cyber-city-drive', 'song-coldplay-viva']
      }
    ]
  },
  {
    id: 'heartbroken',
    name: 'Heartbroken',
    emoji: '💔',
    color: 'from-rose-600 via-pink-700 to-purple-900',
    borderColor: 'border-rose-500/40',
    glowColor: 'shadow-rose-500/20',
    badgeBg: 'bg-rose-500/20 text-rose-300',
    tagline: 'Let the tears fall, embrace the memories, and heal',
    intensities: [
      {
        level: 1,
        label: 'Soft Bittersweet Reminiscence',
        desc: 'Looking back on moments with quiet tenderness',
        songIds: ['song-galliyan', 'song-main-rahoon', 'song-zara-sa']
      },
      {
        level: 2,
        label: 'Let It Hurt & Cry It Out',
        desc: 'Pure emotional surrender with poignant vocal power',
        songIds: ['song-channa-mereya', 'song-tum-hi-ho', 'song-agar-tum-saath-ho']
      },
      {
        level: 3,
        label: 'Healing & Moving Forward',
        desc: 'Reclaiming your strength and moving into a brighter chapter',
        songIds: ['song-shankar-breathless', 'song-ilahi', 'song-coldplay-viva', 'song-levitating']
      }
    ]
  },
  {
    id: 'romantic',
    name: 'Romantic',
    emoji: '💖',
    color: 'from-pink-500 via-rose-500 to-red-600',
    borderColor: 'border-pink-500/40',
    glowColor: 'shadow-pink-500/20',
    badgeBg: 'bg-pink-500/20 text-pink-300',
    tagline: 'Love confessions, sweet butterflies, and eternal devotion',
    intensities: [
      {
        level: 1,
        label: 'Sweet Butterflies & Crush',
        desc: 'Lighthearted romantic melodies for daydreaming',
        songIds: ['song-kesariya', 'song-raataan-lambiyan', 'song-dil-diyan-gallan']
      },
      {
        level: 2,
        label: 'Candlelight Intimacy',
        desc: 'Deeply expressive duets and slow dance serenades',
        songIds: ['song-khuda-jaane', 'song-deewani-mastani', 'song-sonu-main-agar', 'song-ed-perfect']
      },
      {
        level: 3,
        label: 'Eternal Love Anthems',
        desc: 'Timeless passionate ballads of devotion and soulmate connection',
        songIds: ['song-tum-hi-ho', 'song-apna-bana-le', 'song-raataan-lambiyan', 'song-zara-sa']
      }
    ]
  },
  {
    id: 'energetic',
    name: 'Energetic',
    emoji: '⚡',
    color: 'from-amber-500 via-red-500 to-purple-600',
    borderColor: 'border-amber-500/40',
    glowColor: 'shadow-amber-500/20',
    badgeBg: 'bg-amber-500/20 text-amber-300',
    tagline: 'High octane, fast pulse, and unstoppable momentum',
    intensities: [
      {
        level: 1,
        label: 'Upbeat Cardio & Rhythm',
        desc: 'Steady energetic tempo to keep your feet moving',
        songIds: ['song-ghungroo', 'song-ilahi', 'song-levitating']
      },
      {
        level: 2,
        label: 'Electric Dancefloor Rush',
        desc: 'Synth pulses and bass drops designed for peak movement',
        songIds: ['song-tauba-tauba', 'song-blinding-lights', 'song-sunidhi-kamli']
      },
      {
        level: 3,
        label: 'Maximum Adrenaline Blast',
        desc: 'Dhol rhythms and thunderous party anthems with zero brakes',
        songIds: ['song-chaiyya-chaiyya', 'song-london-thumakda', 'song-tauba-tauba', 'song-taylor-cruel-summer']
      }
    ]
  }
];

export const MOMENT_DEFINITIONS = [
  {
    id: 'morning-motivation',
    title: 'Morning Motivation',
    subtitle: 'Rise, Shine & Conquer',
    description: 'Crisp acoustic melodies and sunlit vocal anthems engineered to jumpstart your optimism and kickstart your day.',
    icon: 'Sun',
    accentColor: 'from-amber-400 to-orange-500',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    timeHint: 'Best at 06:00 - 10:00 AM',
    trackIds: ['song-ilahi', 'song-kesariya', 'song-levitating', 'song-coldplay-viva', 'song-apna-bana-le']
  },
  {
    id: 'college-commute',
    title: 'College Commute',
    subtitle: 'Transit Beats & Headphone World',
    description: 'Catchy rhythmic jams and crowd favorites for the metro, bus, highway drives, or campus walks.',
    icon: 'Bus',
    accentColor: 'from-indigo-500 to-purple-600',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    timeHint: 'Best at 08:00 AM & 04:00 PM',
    trackIds: ['song-tauba-tauba', 'song-ghungroo', 'song-blinding-lights', 'song-taylor-cruel-summer', 'song-chaiyya-chaiyya']
  },
  {
    id: 'coding-sessions',
    title: 'Coding Sessions',
    subtitle: 'Deep Focus & Terminal Flow',
    description: 'Immersive synthwaves, chill lo-fi chords, and atmospheric rhythms designed to lock you in the flow state with zero distraction.',
    icon: 'Code',
    accentColor: 'from-cyan-500 to-blue-600',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    timeHint: 'Best for 2+ hour focus blocks',
    trackIds: ['song-cyber-city-drive', 'song-midnight-rain', 'song-blinding-lights', 'song-kun-faya-kun', 'song-anuv-baarishein']
  },
  {
    id: 'evening-walks',
    title: 'Evening Walks',
    subtitle: 'Golden Hour & Twilight Breeze',
    description: 'Mellow guitars, poetic Urdu and Hindi verses, and breezy melodies to help you decompress as the sun sets.',
    icon: 'Sunset',
    accentColor: 'from-rose-500 to-pink-600',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    timeHint: 'Best at 05:30 - 08:00 PM',
    trackIds: ['song-pee-loon', 'song-dil-diyan-gallan', 'song-anuv-baarishein', 'song-ed-perfect', 'song-main-rahoon']
  },
  {
    id: 'late-night-thoughts',
    title: 'Late-Night Thoughts',
    subtitle: '2 AM Solace & Starlit Echoes',
    description: 'Introspective vocals, gentle piano, and deep ambient frequencies for when the world is quiet and your thoughts run deep.',
    icon: 'Moon',
    accentColor: 'from-purple-600 to-indigo-900',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    timeHint: 'Best at 11:00 PM - 03:00 AM',
    trackIds: ['song-agar-tum-saath-ho', 'song-channa-mereya', 'song-tum-hi-ho', 'song-midnight-rain', 'song-kun-faya-kun']
  }
];

/**
 * Returns matching songs from the catalog based on song IDs
 */
export function getSongsByIds(ids = []) {
  const songMap = new Map(DEFAULT_SONGS.map((s) => [s.id, s]));
  return ids.map((id) => songMap.get(id)).filter(Boolean);
}

/**
 * Generates Daily Soundtrack based deterministically on current calendar date.
 * Every day at midnight, a new fresh curated mix of 7 tracks is generated!
 */
export function getDailySoundtrack(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

  // Simple deterministic pseudo-random hash from date string
  let seed = 0;
  for (let i = 0; i < dateStr.length; i++) {
    seed = (seed * 31 + dateStr.charCodeAt(i)) & 0xffffffff;
  }

  const daysOfWeek = ['Sunday Serenade', 'Monday Momentum', 'Tuesday Transit', 'Midweek Oasis', 'Thursday Twilight', 'Friday Euphoria', 'Saturday High'];
  const dayTheme = daysOfWeek[date.getDay()];

  // Deterministically shuffle catalog and pick 7 tracks
  const tracks = [...DEFAULT_SONGS];
  for (let i = tracks.length - 1; i > 0; i--) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    const j = seed % (i + 1);
    [tracks[i], tracks[j]] = [tracks[j], tracks[i]];
  }

  const selectedTracks = tracks.slice(0, 7);

  // Calculate milliseconds until midnight
  const tomorrow = new Date(year, date.getMonth(), day + 1);
  const msUntilMidnight = tomorrow - date;

  return {
    dateStr,
    dayTheme,
    title: `Today's Soundscape — ${dayTheme}`,
    description: `Handcrafted audio aura for ${date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}. Refreshes every night at 00:00.`,
    tracks: selectedTracks,
    totalDuration: selectedTracks.reduce((acc, t) => acc + (t.duration || 0), 0),
    msUntilMidnight
  };
}
