import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Play, Pause, Flame, Disc, Radio, Compass, Music2, ArrowRight } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import { SongCard } from '../components/cards/SongCard';
import { AlbumCard } from '../components/cards/AlbumCard';
import { PlaylistCard } from '../components/cards/PlaylistCard';
import { ArtistCard } from '../components/cards/ArtistCard';
import { CardSkeleton, HeroSkeleton } from '../components/ui/SkeletonLoader';
import {
  DEFAULT_SONGS,
  DEFAULT_ALBUMS,
  DEFAULT_PLAYLISTS,
  DEFAULT_ARTISTS
} from '../data/catalog';
import { MOOD_DEFINITIONS } from '../data/moodCatalog';
import { useFollowedArtists } from '../hooks/useFollowedArtists';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const MOODS = ['All', 'Bollywood', 'Sufi', 'Romance', 'Synthwave', 'Lo-Fi', 'Ambient', 'Indie Pop', 'Electronic'];

export const Home = () => {
  const { user } = useAuth();
  const { playSong } = usePlayer();
  const {
    followedIds,
    recommendedSongs,
    followedArtistObjects
  } = useFollowedArtists();

  const [trendingSongs, setTrendingSongs] = useState(DEFAULT_SONGS);
  const [albums, setAlbums] = useState(DEFAULT_ALBUMS);
  const [playlists, setPlaylists] = useState(DEFAULT_PLAYLISTS);
  const [artists, setArtists] = useState(DEFAULT_ARTISTS);
  const [loading, setLoading] = useState(false);
  const [selectedMood, setSelectedMood] = useState('All');

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [songsRes, albumsRes, playlistsRes, artistsRes] = await Promise.allSettled([
          api.get('/songs/trending'),
          api.get('/albums'),
          api.get('/playlists'),
          api.get('/artists')
        ]);

        if (songsRes.status === 'fulfilled' && songsRes.value.data?.success && songsRes.value.data.data?.length > 0) {
          setTrendingSongs(songsRes.value.data.data);
        }
        if (albumsRes.status === 'fulfilled' && albumsRes.value.data?.success && albumsRes.value.data.data?.length > 0) {
          setAlbums(albumsRes.value.data.data);
        }
        if (playlistsRes.status === 'fulfilled' && playlistsRes.value.data?.success && playlistsRes.value.data.data?.length > 0) {
          setPlaylists(playlistsRes.value.data.data);
        }
        if (artistsRes.status === 'fulfilled' && artistsRes.value.data?.success && artistsRes.value.data.data?.length > 0) {
          setArtists(artistsRes.value.data.data);
        }
      } catch (err) {
        console.warn('Backend catalog notice, utilizing default catalog:', err?.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const filteredSongs = selectedMood === 'All'
    ? trendingSongs
    : trendingSongs.filter((s) => {
        const g = (s.genre || '').toLowerCase();
        const m = selectedMood.toLowerCase();
        if (m === 'romance') return g.includes('romance') || g.includes('bollywood');
        if (m === 'sufi') return g.includes('sufi');
        return g.includes(m);
      });

  const heroSong = trendingSongs[0];
  const { currentSong, isPlaying, togglePlay } = usePlayer();
  const isHeroPlaying = currentSong?.id === heroSong?.id && isPlaying;

  const handleHeroPlay = () => {
    if (isHeroPlaying) {
      togglePlay();
    } else {
      playSong(heroSong, trendingSongs);
    }
  };

  return (
    <div className="space-y-10 pb-20 relative">
      {/* Ambient Neon Floating Background Glows */}
      <div className="fixed top-20 right-10 w-96 h-96 bg-purple-600/15 rounded-full blur-[140px] pointer-events-none -z-10 animate-neon-purple" />
      <div className="fixed bottom-20 left-10 w-96 h-96 bg-pink-600/12 rounded-full blur-[140px] pointer-events-none -z-10 animate-neon-pink" />

      {/* Hero Featured Release */}
      {loading ? (
        <HeroSkeleton />
      ) : heroSong ? (
        <section className="relative w-full rounded-3xl overflow-hidden p-8 md:p-12 border border-vibely-border bg-gradient-to-r from-purple-950/80 via-slate-900 to-slate-950 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl animate-neon-card-glow">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-600/20 via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-xl space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
              <span>{isHeroPlaying ? 'Now Playing Worldwide' : 'Featured Release'}</span>
            </div>

            <h1 className="font-display text-3xl md:text-5xl font-black text-white leading-tight">
              {getGreeting()}, {user ? user.name.split(' ')[0] : 'Listener'}
            </h1>

            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Step into the neon frequency. Listen to <span className="text-white font-semibold">{heroSong.title}</span> by <span className="text-purple-300">{heroSong.artist?.name}</span> and feel every beat.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4">
              <button
                onClick={handleHeroPlay}
                className="flex items-center gap-2.5 px-7 py-3.5 rounded-full font-bold text-sm bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-xl shadow-purple-600/40 hover:scale-105 active:scale-95 transition-all btn-premium"
              >
                {isHeroPlaying ? (
                  <>
                    <Pause className="w-5 h-5 fill-current" />
                    <span>Pause Stream</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                    <span>Play Now</span>
                  </>
                )}
              </button>

              <Link
                to={`/song/${heroSong.id}`}
                className="px-6 py-3.5 rounded-full font-semibold text-sm bg-white/10 hover:bg-white/15 text-white border border-white/10 transition-all hover:scale-105"
              >
                View Track
              </Link>

              {isHeroPlaying && (
                <div className="flex items-end gap-1 h-6 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-purple-500/30">
                  <span className="w-1 bg-purple-400 rounded-full eq-bar-1 h-4" />
                  <span className="w-1 bg-pink-400 rounded-full eq-bar-2 h-5" />
                  <span className="w-1 bg-cyan-400 rounded-full eq-bar-3 h-3" />
                  <span className="w-1 bg-indigo-400 rounded-full eq-bar-4 h-5" />
                </div>
              )}
            </div>
          </div>

          <div
            onClick={handleHeroPlay}
            className="relative z-10 w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden shadow-2xl border border-white/10 shrink-0 group cursor-pointer"
            title={isHeroPlaying ? 'Pause' : 'Play'}
          >
            <img
              src={heroSong.coverArt || '/assets/covers/default-cover.svg'}
              alt={heroSong.title}
              className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ${
                isHeroPlaying ? 'scale-105' : ''
              }`}
              onError={(e) => {
                e.currentTarget.src = '/assets/covers/default-cover.svg';
              }}
            />
            {isHeroPlaying && (
              <div className="absolute inset-0 bg-purple-950/30 backdrop-blur-[1px] flex items-center justify-center">
                <Disc className="w-16 h-16 text-white/90 animate-spin-slow drop-shadow-lg" />
              </div>
            )}
          </div>
        </section>
      ) : null}

      {/* MoodSync Feature Spotlight */}
      <section className="relative overflow-hidden rounded-3xl p-6 md:p-8 border border-purple-500/30 bg-gradient-to-r from-purple-950/70 via-slate-900 to-indigo-950/80 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-bold uppercase tracking-wider border border-pink-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Feel Every Emotion</span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-black text-white">
              Mood<span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">Sync</span> — Music for your feelings
            </h2>
            <p className="text-xs md:text-sm text-slate-300 max-w-xl">
              Select how you feel right now. Calibrate your emotional intensity or dive into bespoke soundtracks for coding, college commutes, and late-night thoughts.
            </p>
          </div>

          <Link
            to="/moodsync"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-600/30 transition-all hover:scale-105 shrink-0"
          >
            <span>Open MoodSync Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Quick Feeling Selectors */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {MOOD_DEFINITIONS.map((m) => (
            <Link
              key={m.id}
              to={`/moodsync?tab=feelings&mood=${m.id}`}
              className="p-3.5 rounded-2xl bg-slate-900/80 border border-vibely-border hover:border-purple-500/50 hover:bg-slate-800/80 transition-all group flex items-center gap-3 hover:scale-105 shadow-md"
            >
              <span className="text-2xl filter drop-shadow">{m.emoji}</span>
              <div>
                <span className="block font-display font-bold text-xs text-white group-hover:text-purple-300 transition-colors">
                  {m.name}
                </span>
                <span className="text-[10px] text-slate-400">3 Intensities</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Mood Selector Pills */}
      <section>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {MOODS.map((mood) => (
            <button
              key={mood}
              onClick={() => setSelectedMood(mood)}
              className={`px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-all whitespace-nowrap ${
                selectedMood === mood
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25 scale-105'
                  : 'bg-vibely-surface text-slate-300 hover:text-white hover:bg-slate-800/80 border border-vibely-border'
              }`}
            >
              {mood}
            </button>
          ))}
        </div>
      </section>

      {/* Trending Songs Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Flame className="w-6 h-6 text-orange-400" />
            <h2 className="font-display text-xl md:text-2xl font-bold text-white">Trending Vibes</h2>
          </div>
          <Link to="/explore" className="text-xs font-semibold text-purple-400 hover:text-purple-300">
            See all
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : filteredSongs.length === 0 ? (
          <div className="p-8 text-center text-slate-400 bg-vibely-surface rounded-2xl border border-vibely-border">
            No tracks found in the "{selectedMood}" category.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredSongs.slice(0, 20).map((song) => (
              <SongCard key={song.id} song={song} queueList={filteredSongs} />
            ))}
          </div>
        )}
      </section>

      {/* Recommended For You (Based on Followed Artists) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h2 className="font-display text-xl md:text-2xl font-bold text-white">
                Recommended For You
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              {followedArtistObjects.length > 0 ? (
                <>
                  Personalized based on artists you follow:{' '}
                  <span className="text-purple-300 font-semibold">
                    {followedArtistObjects.slice(0, 3).map((a) => a.name).join(', ')}
                    {followedArtistObjects.length > 3 ? ` +${followedArtistObjects.length - 3} more` : ''}
                  </span>
                </>
              ) : (
                'Follow artists below to calibrate your personalized sound stream'
              )}
            </p>
          </div>

          {recommendedSongs.length > 0 && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => playSong(recommendedSongs[0], recommendedSongs)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/25 transition-all hover:scale-105"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Play Mix</span>
              </button>
            </div>
          )}
        </div>

        {recommendedSongs.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {recommendedSongs.slice(0, 10).map((song) => (
              <SongCard key={`rec-${song.id}`} song={song} queueList={recommendedSongs} />
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-vibely-surface border border-vibely-border text-center space-y-2">
            <p className="text-xs text-slate-300">
              No recommendations yet! Follow artists in the section below to get personalized music.
            </p>
          </div>
        )}
      </section>

      {/* Popular Albums */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Disc className="w-6 h-6 text-purple-400" />
            <h2 className="font-display text-xl md:text-2xl font-bold text-white">Popular Albums</h2>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {albums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        )}
      </section>

      {/* Curated Editorial Playlists */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Radio className="w-6 h-6 text-pink-400" />
            <h2 className="font-display text-xl md:text-2xl font-bold text-white">Curated Playlists</h2>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {playlists.map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        )}
      </section>

      {/* Artists Section with Interactive Follow & Follower Count */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <div className="flex items-center gap-2.5">
              <Music2 className="w-6 h-6 text-cyan-400" />
              <h2 className="font-display text-xl md:text-2xl font-bold text-white">
                Artists You Can Follow
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Follow your favorite voices — Vibely will automatically calibrate your recommendations above.
            </p>
          </div>

          <span className="text-xs text-purple-400 font-semibold px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 w-fit">
            {followedIds.length} Artist{followedIds.length === 1 ? '' : 's'} Followed
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {artists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
