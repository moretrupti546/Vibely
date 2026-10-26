import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Library as LibraryIcon, Heart, Disc, ListMusic, History, Plus, Loader2, Sparkles, User, Play } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import { PlaylistCard } from '../components/cards/PlaylistCard';
import { AlbumCard } from '../components/cards/AlbumCard';
import { ArtistCard } from '../components/cards/ArtistCard';
import { SongRow } from '../components/cards/SongRow';
import { CreatePlaylistModal } from '../components/modals/CreatePlaylistModal';
import { AddToPlaylistModal } from '../components/modals/AddToPlaylistModal';
import { useFollowedArtists } from '../hooks/useFollowedArtists';
import {
  DEFAULT_PLAYLISTS,
  DEFAULT_SONGS,
  DEFAULT_ALBUMS,
  DEFAULT_ARTISTS
} from '../data/catalog';

export const Library = () => {
  const { isAuthenticated } = useAuth();
  const { playSong } = usePlayer();
  const { followedIds, recommendedSongs, followedArtistObjects } = useFollowedArtists();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'playlists';

  const [libraryData, setLibraryData] = useState(() => {
    let likedSongs = DEFAULT_SONGS.slice(0, 4);
    let playlists = [];
    try {
      const savedLikes = localStorage.getItem('vibely_liked_songs_full');
      if (savedLikes) likedSongs = JSON.parse(savedLikes);
      const savedPl = localStorage.getItem('vibely_user_playlists');
      if (savedPl && Array.isArray(JSON.parse(savedPl))) playlists = JSON.parse(savedPl);
    } catch (e) {}
    return {
      playlists,
      likedSongs,
      savedAlbums: DEFAULT_ALBUMS.slice(0, 3),
      followedArtists: DEFAULT_ARTISTS.slice(0, 4)
    };
  });
  const [history, setHistory] = useState(
    DEFAULT_SONGS.slice(0, 3).map((s) => ({ song: s, playedAt: new Date().toISOString() }))
  );
  const [loading, setLoading] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedSongForPlaylist, setSelectedSongForPlaylist] = useState(null);

  const fetchLibrary = async () => {
    let localPlaylists = [];
    try {
      const savedLikes = localStorage.getItem('vibely_liked_songs_full');
      const savedPl = localStorage.getItem('vibely_user_playlists');
      if (savedPl && Array.isArray(JSON.parse(savedPl))) {
        localPlaylists = JSON.parse(savedPl);
      }
      setLibraryData((prev) => ({
        ...prev,
        likedSongs: savedLikes ? JSON.parse(savedLikes) : prev.likedSongs,
        playlists: localPlaylists
      }));
    } catch (e) {}

    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    try {
      const [libRes, histRes] = await Promise.allSettled([
        api.get('/users/me/library'),
        api.get('/users/me/history?limit=30')
      ]);

      if (libRes.status === 'fulfilled' && libRes.value.data?.success && libRes.value.data.data) {
        const serverData = libRes.value.data.data;
        const serverPlaylists = Array.isArray(serverData.playlists) ? serverData.playlists : [];
        const mergedPlaylists = [...localPlaylists];
        serverPlaylists.forEach((sp) => {
          if (!mergedPlaylists.some((p) => p.id === sp.id)) {
            mergedPlaylists.push(sp);
          }
        });

        setLibraryData((prev) => ({
          ...prev,
          ...serverData,
          playlists: mergedPlaylists,
          likedSongs: serverData.likedSongs?.length ? serverData.likedSongs : prev.likedSongs
        }));
      }
      if (histRes.status === 'fulfilled' && histRes.value.data?.success && histRes.value.data.data) {
        setHistory(histRes.value.data.data);
      }
    } catch (err) {
      console.warn('Backend library notice, using local library:', err?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibrary();

    const handleUpdate = () => {
      fetchLibrary();
    };

    window.addEventListener('vibely_playlist_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('vibely_playlist_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [isAuthenticated]);

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
  };

  if (!isAuthenticated) {
    return (
      <div className="py-24 text-center max-w-md mx-auto space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-purple-600/20 border border-purple-500/30 text-purple-400 flex items-center justify-center mx-auto shadow-2xl">
          <LibraryIcon className="w-8 h-8" />
        </div>
        <h2 className="font-display font-black text-2xl text-white">Your Personal Sanctuary</h2>
        <p className="text-sm text-slate-300">
          Sign in to access your customized playlists, liked songs, saved albums, and listening history.
        </p>
        <div className="pt-2">
          <Link
            to="/login"
            className="inline-block px-7 py-3 rounded-full font-bold text-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-xl shadow-purple-600/30 transition-all hover:scale-105"
          >
            Log In to Vibely
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-white">Your Library</h1>
          <p className="text-xs text-slate-400 mt-1">Manage your curated music collection</p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/25 hover:scale-105 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Playlist</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-vibely-border pb-3">
        {[
          { id: 'playlists', label: 'Playlists', icon: ListMusic, count: libraryData.playlists.length },
          { id: 'liked', label: 'Liked Songs', icon: Heart, count: libraryData.likedSongs.length },
          { id: 'albums', label: 'Saved Albums', icon: Disc, count: libraryData.savedAlbums.length },
          { id: 'artists', label: 'Followed Artists', icon: User, count: followedArtistObjects.length },
          { id: 'history', label: 'History', icon: History, count: history.length }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="py-20 flex justify-center text-purple-400">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <div>
          {/* Playlists Tab */}
          {activeTab === 'playlists' && (
            <div className="space-y-4">
              {libraryData.playlists.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-vibely-surface border border-vibely-border max-w-md mx-auto space-y-3">
                  <ListMusic className="w-10 h-10 text-slate-500 mx-auto" />
                  <h3 className="font-bold text-white text-base">No playlists yet</h3>
                  <p className="text-xs text-slate-400">
                    Create your first playlist and start building your custom soundscapes.
                  </p>
                  <button
                    onClick={() => setCreateModalOpen(true)}
                    className="px-5 py-2 rounded-full bg-purple-600 text-white font-bold text-xs shadow-md"
                  >
                    Create Playlist
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {libraryData.playlists.map((playlist) => (
                    <PlaylistCard key={playlist.id} playlist={playlist} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Liked Songs Tab */}
          {activeTab === 'liked' && (
            <div className="space-y-4">
              {libraryData.likedSongs.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-vibely-surface border border-vibely-border max-w-md mx-auto space-y-3">
                  <Heart className="w-10 h-10 text-slate-500 mx-auto" />
                  <h3 className="font-bold text-white text-base">No liked songs yet</h3>
                  <p className="text-xs text-slate-400">
                    Tap the heart icon on any song to save it directly to this private collection.
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-3xl bg-vibely-surface border border-vibely-border space-y-1">
                  {libraryData.likedSongs.map((song, idx) => (
                    <SongRow
                      key={song.id}
                      song={song}
                      index={idx}
                      queueList={libraryData.likedSongs}
                      showAlbum={true}
                      onAddToPlaylist={(s) => setSelectedSongForPlaylist(s)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Saved Albums Tab */}
          {activeTab === 'albums' && (
            <div className="space-y-4">
              {libraryData.savedAlbums.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-vibely-surface border border-vibely-border max-w-md mx-auto space-y-3">
                  <Disc className="w-10 h-10 text-slate-500 mx-auto" />
                  <h3 className="font-bold text-white text-base">No saved albums</h3>
                  <p className="text-xs text-slate-400">
                    Explore popular albums and bookmark them to listen to full discographies anytime.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {libraryData.savedAlbums.map((album) => (
                    <AlbumCard key={album.id} album={album} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Followed Artists Tab */}
          {activeTab === 'artists' && (
            <div className="space-y-8">
              {followedArtistObjects.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-vibely-surface border border-vibely-border max-w-md mx-auto space-y-3">
                  <User className="w-10 h-10 text-slate-500 mx-auto" />
                  <h3 className="font-bold text-white text-base">No artists followed yet</h3>
                  <p className="text-xs text-slate-400">
                    Follow artists on the Home or Explore pages to calibrate your recommendations.
                  </p>
                  <Link
                    to="/app"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white transition-all shadow-md"
                  >
                    <span>Browse Artists</span>
                  </Link>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {followedArtistObjects.map((artist) => (
                      <ArtistCard key={artist.id} artist={artist} />
                    ))}
                  </div>

                  {/* Personalized Recommendations Section for Followed Artists */}
                  {recommendedSongs.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-vibely-border space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-purple-400" />
                            <h3 className="font-display font-bold text-lg text-white">
                              Recommended Tracks for Your Artists
                            </h3>
                          </div>
                          <p className="text-xs text-slate-400">
                            Algorithmic picks matching the genres and discographies of artists you follow.
                          </p>
                        </div>

                        <button
                          onClick={() => playSong(recommendedSongs[0], recommendedSongs)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs bg-purple-600 hover:bg-purple-500 text-white shadow-md transition-all hover:scale-105"
                        >
                          <Play className="w-3.5 h-3.5 fill-white" />
                          <span>Play Mix</span>
                        </button>
                      </div>

                      <div className="p-4 rounded-3xl bg-vibely-surface border border-vibely-border space-y-1">
                        {recommendedSongs.slice(0, 8).map((song, idx) => (
                          <SongRow
                            key={`lib-rec-${song.id}-${idx}`}
                            song={song}
                            index={idx}
                            queueList={recommendedSongs}
                            showAlbum={true}
                            onAddToPlaylist={(s) => setSelectedSongForPlaylist(s)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Listening History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              {history.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-vibely-surface border border-vibely-border max-w-md mx-auto space-y-3">
                  <History className="w-10 h-10 text-slate-500 mx-auto" />
                  <h3 className="font-bold text-white text-base">No listening history yet</h3>
                  <p className="text-xs text-slate-400">
                    Songs you listen to will automatically appear here so you never lose a great vibe.
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-3xl bg-vibely-surface border border-vibely-border space-y-1">
                  {history.map((song, idx) => (
                    <SongRow
                      key={`${song.historyId || song.id}-${idx}`}
                      song={song}
                      index={idx}
                      queueList={history}
                      showAlbum={true}
                      onAddToPlaylist={(s) => setSelectedSongForPlaylist(s)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <CreatePlaylistModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreated={() => fetchLibrary()}
      />

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
