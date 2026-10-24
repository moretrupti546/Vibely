import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Pause, Bookmark, Shuffle, Disc3, Loader2, ArrowLeft } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import { useToast } from '../context/ToastContext';
import { SongRow } from '../components/cards/SongRow';
import { AddToPlaylistModal } from '../components/modals/AddToPlaylistModal';
import { DEFAULT_ALBUMS, DEFAULT_SONGS } from '../data/catalog';

const formatSeconds = (secs) => {
  if (!secs) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

export const AlbumDetails = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayer();
  const { showToast } = useToast();

  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [selectedSongForPlaylist, setSelectedSongForPlaylist] = useState(null);

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/albums/${id}`);
        if (res.data?.success && res.data.data) {
          setAlbum(res.data.data);
          setIsSaved(res.data.data.isSaved);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Backend album fetch notice, using catalog:', err?.message);
      }

      const found = DEFAULT_ALBUMS.find((a) => a.id === id || a.title.toLowerCase().includes(id.toLowerCase())) || DEFAULT_ALBUMS[0];
      const albumSongs = DEFAULT_SONGS.filter((s) => s.album?.id === found.id || s.genre === found.genre);
      setAlbum({
        ...found,
        songs: albumSongs.length > 0 ? albumSongs : DEFAULT_SONGS.slice(0, 4)
      });
      setLoading(false);
    };

    fetchAlbum();
  }, [id]);

  const handleToggleSaveAlbum = async () => {
    if (!isAuthenticated) {
      showToast('Please log in to save albums to your library.', 'info');
      return;
    }

    try {
      const res = await api.post(`/users/me/albums/${album.id}`);
      if (res.data.success) {
        setIsSaved(res.data.isSaved);
        showToast(
          res.data.isSaved ? `Saved "${album.title}" to your library 💿` : `Removed "${album.title}" from library`,
          'success'
        );
      }
    } catch (err) {
      showToast('Failed to update album in library.', 'error');
    }
  };

  const handlePlayAll = () => {
    if (album?.songs?.length > 0) {
      playSong(album.songs[0], album.songs);
    }
  };

  const handleShuffle = () => {
    if (album?.songs?.length > 0) {
      const shuffled = [...album.songs].sort(() => Math.random() - 0.5);
      playSong(shuffled[0], shuffled);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex items-center justify-center text-purple-400">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!album) {
    return (
      <div className="py-24 text-center text-slate-400">
        <p>Album not found.</p>
        <Link to="/" className="text-purple-400 hover:underline mt-2 inline-block">
          Return Home
        </Link>
      </div>
    );
  }

  const isCurrentAlbumPlaying = album.songs?.some((s) => s.id === currentSong?.id);
  const totalDuration = album.songs?.reduce((acc, s) => acc + (s.duration || 0), 0) || 0;

  return (
    <div className="space-y-8 pb-24">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </Link>

      {/* Album Header */}
      <section className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 p-6 md:p-8 rounded-3xl bg-vibely-surface border border-vibely-border">
        <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden shadow-2xl shrink-0 bg-slate-900 border border-white/10">
          <img src={album.coverArt} alt={album.title} className="w-full h-full object-cover" />
        </div>

        <div className="flex-1 space-y-3 text-center md:text-left">
          <div className="inline-block px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider">
            Album • {album.genre}
          </div>

          <h1 className="font-display text-3xl md:text-5xl font-black text-white leading-tight">
            {album.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-sm text-slate-300">
            <Link to={`/artist/${album.artist?.id}`} className="font-semibold text-white hover:underline">
              {album.artist?.name}
            </Link>
            <span>•</span>
            <span>{album.releaseYear}</span>
            <span>•</span>
            <span>{album.songs?.length || 0} songs</span>
            <span>•</span>
            <span className="text-slate-400 font-mono">{formatSeconds(totalDuration)}</span>
          </div>

          {/* Action Row */}
          <div className="pt-3 flex items-center justify-center md:justify-start gap-4">
            <button
              onClick={handlePlayAll}
              className="flex items-center gap-2.5 px-7 py-3 rounded-full font-bold text-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-xl shadow-purple-600/30 hover:scale-105 transition-all"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Play Album</span>
            </button>

            <button
              onClick={handleShuffle}
              className="p-3 rounded-full bg-vibely-surface border border-vibely-border text-slate-300 hover:text-white transition-all hover:scale-105"
              title="Shuffle Album"
            >
              <Shuffle className="w-5 h-5" />
            </button>

            <button
              onClick={handleToggleSaveAlbum}
              className={`p-3 rounded-full border border-vibely-border transition-all hover:scale-105 ${
                isSaved
                  ? 'bg-purple-500/20 border-purple-500/40 text-purple-400'
                  : 'bg-vibely-surface text-slate-300 hover:text-white'
              }`}
              title={isSaved ? 'Saved in Library' : 'Save Album'}
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-purple-400' : ''}`} />
            </button>
          </div>
        </div>
      </section>

      {/* Tracklist Table */}
      <section className="p-4 md:p-6 rounded-3xl bg-vibely-surface border border-vibely-border space-y-2">
        <div className="flex items-center justify-between pb-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-vibely-border">
          <div className="flex items-center gap-4">
            <span className="w-6 text-center">#</span>
            <span>Title</span>
          </div>
          <span className="w-10 text-right">Time</span>
        </div>

        <div className="space-y-1">
          {album.songs?.map((song, idx) => (
            <SongRow
              key={song.id}
              song={song}
              index={idx}
              queueList={album.songs}
              showAlbum={false}
              onAddToPlaylist={(s) => setSelectedSongForPlaylist(s)}
            />
          ))}
        </div>
      </section>

      {/* Add To Playlist Modal */}
      {selectedSongForPlaylist && (
        <AddToPlaylistModal
          isOpen={!!selectedSongForPlaylist}
          onClose={() => setSelectedSongForPlaylist(null)}
          song={selectedSongForPlaylist}
        />
      )}
    </div>
  );
};
