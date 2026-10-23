import React, { useState, useEffect } from 'react';
import { Search, X, Loader2, Music2, Disc, User, ListMusic } from 'lucide-react';
import api from '../services/api';
import { SongCard } from '../components/cards/SongCard';
import { ArtistCard } from '../components/cards/ArtistCard';
import { AlbumCard } from '../components/cards/AlbumCard';
import { PlaylistCard } from '../components/cards/PlaylistCard';

const GENRES = [
  { name: 'Synthwave', gradient: 'from-purple-600 to-indigo-800' },
  { name: 'Lo-Fi', gradient: 'from-blue-600 to-cyan-800' },
  { name: 'Ambient', gradient: 'from-emerald-600 to-teal-800' },
  { name: 'Indie Pop', gradient: 'from-pink-600 to-rose-800' },
  { name: 'Electronic', gradient: 'from-amber-600 to-orange-800' },
  { name: 'Chillhop', gradient: 'from-violet-600 to-fuchsia-800' }
];

export const Explore = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [results, setResults] = useState({ songs: [], artists: [], albums: [], playlists: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults({ songs: [], artists: [], albums: [], playlists: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const typeParam = filterType !== 'all' ? `&type=${filterType}` : '';
        const res = await api.get(`/songs/search?q=${encodeURIComponent(searchTerm.trim())}${typeParam}`);
        if (res.data.success) {
          setResults(res.data.data);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, filterType]);

  const hasResults =
    results.songs.length > 0 ||
    results.artists.length > 0 ||
    results.albums.length > 0 ||
    results.playlists.length > 0;

  return (
    <div className="space-y-8 pb-20">
      {/* Search Header */}
      <div className="max-w-2xl space-y-4">
        <h1 className="font-display text-3xl font-extrabold text-white">Search & Explore</h1>

        <div className="relative">
          <Search className="w-5 h-5 text-purple-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search songs, artists, albums, or playlists..."
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-vibely-surface border border-vibely-border text-white placeholder:text-slate-400 focus:outline-none focus:border-purple-500 shadow-xl text-base transition-all"
            autoFocus
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-3.5 p-1 rounded-full text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Chips */}
        {searchTerm && (
          <div className="flex items-center gap-2 overflow-x-auto pt-1">
            {[
              { id: 'all', label: 'All Results' },
              { id: 'songs', label: 'Songs' },
              { id: 'artists', label: 'Artists' },
              { id: 'albums', label: 'Albums' },
              { id: 'playlists', label: 'Playlists' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  filterType === f.id
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'bg-vibely-surface text-slate-300 hover:text-white border border-vibely-border'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="py-16 flex items-center justify-center gap-3 text-purple-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-sm font-medium">Scanning the frequency...</span>
        </div>
      )}

      {/* Results View */}
      {!loading && searchTerm && (
        <div className="space-y-8">
          {!hasResults ? (
            <div className="p-12 text-center rounded-3xl bg-vibely-surface border border-vibely-border max-w-lg mx-auto space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-white">No matches found</h3>
              <p className="text-xs text-slate-400">
                We couldn't find anything matching "{searchTerm}". Try checking your spelling or search for another artist, song, or genre.
              </p>
            </div>
          ) : (
            <>
              {/* Songs */}
              {results.songs.length > 0 && (
                <section className="space-y-3">
                  <div className="flex items-center gap-2 text-white font-display font-bold text-xl">
                    <Music2 className="w-5 h-5 text-purple-400" />
                    <h3>Songs</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {results.songs.map((song) => (
                      <SongCard key={song.id} song={song} queueList={results.songs} />
                    ))}
                  </div>
                </section>
              )}

              {/* Artists */}
              {results.artists.length > 0 && (
                <section className="space-y-3">
                  <div className="flex items-center gap-2 text-white font-display font-bold text-xl">
                    <User className="w-5 h-5 text-cyan-400" />
                    <h3>Artists</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {results.artists.map((artist) => (
                      <ArtistCard key={artist.id} artist={artist} />
                    ))}
                  </div>
                </section>
              )}

              {/* Albums */}
              {results.albums.length > 0 && (
                <section className="space-y-3">
                  <div className="flex items-center gap-2 text-white font-display font-bold text-xl">
                    <Disc className="w-5 h-5 text-pink-400" />
                    <h3>Albums</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {results.albums.map((album) => (
                      <AlbumCard key={album.id} album={album} />
                    ))}
                  </div>
                </section>
              )}

              {/* Playlists */}
              {results.playlists.length > 0 && (
                <section className="space-y-3">
                  <div className="flex items-center gap-2 text-white font-display font-bold text-xl">
                    <ListMusic className="w-5 h-5 text-indigo-400" />
                    <h3>Playlists</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {results.playlists.map((playlist) => (
                      <PlaylistCard key={playlist.id} playlist={playlist} />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      )}

      {/* Default Browse by Genre (when search is empty) */}
      {!searchTerm && (
        <section className="space-y-4">
          <h2 className="font-display text-xl font-bold text-white">Browse All Genres</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {GENRES.map((genre) => (
              <div
                key={genre.name}
                onClick={() => setSearchTerm(genre.name)}
                className={`relative h-32 rounded-2xl p-5 bg-gradient-to-br ${genre.gradient} overflow-hidden shadow-lg hover:scale-105 transition-all cursor-pointer flex flex-col justify-between`}
              >
                <h3 className="font-display font-extrabold text-xl text-white tracking-wide">
                  {genre.name}
                </h3>
                <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">
                  Explore Vibes →
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
