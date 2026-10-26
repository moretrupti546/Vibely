import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, UserPlus, UserCheck, Play, ArrowLeft, Loader2, Disc3 } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import { useToast } from '../context/ToastContext';
import { SongRow } from '../components/cards/SongRow';
import { AlbumCard } from '../components/cards/AlbumCard';
import { DEFAULT_ARTISTS, DEFAULT_SONGS, DEFAULT_ALBUMS } from '../data/catalog';

export const ArtistDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { playSong } = usePlayer();
  const { showToast } = useToast();

  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowed, setIsFollowed] = useState(false);

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/artists/${id}`);
        if (res.data?.success && res.data.data) {
          setArtist(res.data.data);
          setIsFollowed(res.data.data.isFollowed);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Backend artist fetch notice, using catalog:', err?.message);
      }

      const found = DEFAULT_ARTISTS.find((a) => a.id === id || a.name.toLowerCase().includes(id.toLowerCase())) || DEFAULT_ARTISTS[0];
      const artistSongs = DEFAULT_SONGS.filter((s) => s.artist?.id === found.id || s.artist?.name === found.name);
      const artistAlbums = DEFAULT_ALBUMS.filter((a) => a.artist?.id === found.id || a.artist?.name === found.name);

      setArtist({
        ...found,
        songs: artistSongs.length > 0 ? artistSongs : DEFAULT_SONGS.slice(0, 3),
        albums: artistAlbums.length > 0 ? artistAlbums : DEFAULT_ALBUMS.slice(0, 2)
      });
      setLoading(false);
    };

    fetchArtist();
  }, [id]);

  const handleToggleFollow = async () => {
    if (!isAuthenticated) {
      showToast('Please log in to follow artists.', 'info');
      return;
    }

    const nextFollow = !isFollowed;
    setIsFollowed(nextFollow);
    showToast(nextFollow ? `Following ${artist.name} 🌟` : `Unfollowed ${artist.name}`, 'success');

    try {
      await api.post(`/users/me/artists/${artist.id}`);
    } catch (err) {
      console.warn('Backend follow sync notice:', err?.message);
    }
  };

  const handlePlayTopTracks = () => {
    if (artist?.songs?.length > 0) {
      playSong(artist.songs[0], artist.songs);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex items-center justify-center text-purple-400">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="py-24 text-center text-slate-400">
        <p>Artist not found.</p>
        <Link to="/app" className="text-purple-400 hover:underline mt-2 inline-block">
          Return to Music
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-24">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      {/* Artist Hero Header */}
      <section className="relative overflow-hidden rounded-3xl p-8 md:p-12 border border-vibely-border bg-gradient-to-r from-purple-950/80 via-slate-900 to-slate-950 flex flex-col md:flex-row items-center gap-8 shadow-2xl">
        <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden shadow-2xl shrink-0 border-4 border-purple-500/30">
          <img
            src={artist.image || '/assets/playlists/default-playlist.svg'}
            alt={artist.name}
            className="w-full h-full object-cover select-none"
            onError={(e) => {
              e.currentTarget.src = '/assets/playlists/default-playlist.svg';
            }}
          />
        </div>

        <div className="flex-1 space-y-3 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-1.5 text-purple-400 text-xs font-bold uppercase tracking-wider">
            {artist.verified && <CheckCircle2 className="w-4 h-4" />}
            <span>Verified Artist</span>
          </div>

          <h1 className="font-display text-4xl md:text-6xl font-black text-white leading-tight">
            {artist.name}
          </h1>

          <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
            {artist.bio}
          </p>

          <p className="text-xs font-mono text-purple-300 font-semibold">
            {artist.monthlyListeners?.toLocaleString() || 0} monthly listeners
          </p>

          <div className="pt-3 flex flex-wrap items-center justify-center md:justify-start gap-4">
            {artist.songs?.length > 0 && (
              <button
                onClick={handlePlayTopTracks}
                className="flex items-center gap-2.5 px-7 py-3 rounded-full font-bold text-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-xl shadow-purple-600/30 hover:scale-105 transition-all"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Play Top Tracks</span>
              </button>
            )}

            <button
              onClick={handleToggleFollow}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm border transition-all hover:scale-105 ${
                isFollowed
                  ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                  : 'bg-vibely-surface border-vibely-border text-slate-200 hover:text-white'
              }`}
            >
              {isFollowed ? (
                <>
                  <UserCheck className="w-4 h-4 text-purple-400" />
                  <span>Following</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Follow</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Popular Tracks */}
      {artist.songs?.length > 0 && (
        <section className="p-4 md:p-6 rounded-3xl bg-vibely-surface border border-vibely-border space-y-3">
          <h2 className="font-display text-xl font-bold text-white px-2">Top Tracks</h2>
          <div className="space-y-1">
            {artist.songs.map((song, idx) => (
              <SongRow
                key={song.id}
                song={song}
                index={idx}
                queueList={artist.songs}
                showAlbum={true}
              />
            ))}
          </div>
        </section>
      )}

      {/* Discography / Albums */}
      {artist.albums?.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-display text-xl font-bold text-white">Discography</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {artist.albums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
