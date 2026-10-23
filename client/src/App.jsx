import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { PlayerProvider } from './context/PlayerContext';

import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { MobileNav } from './components/layout/MobileNav';
import { BottomPlayer } from './components/player/BottomPlayer';
import { CreatePlaylistModal } from './components/modals/CreatePlaylistModal';

import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { Library } from './pages/Library';
import { SongDetails } from './pages/SongDetails';
import { AlbumDetails } from './pages/AlbumDetails';
import { PlaylistDetails } from './pages/PlaylistDetails';
import { ArtistDetails } from './pages/ArtistDetails';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

export function AppContent() {
  const [createPlaylistOpen, setCreatePlaylistOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-vibely-dark text-slate-100">
      {/* Desktop Sidebar */}
      <div className="hidden md:block h-full">
        <Sidebar onOpenCreatePlaylist={() => setCreatePlaylistOpen(true)} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
        <Navbar />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 pb-36">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/library" element={<Library />} />
            <Route path="/song/:id" element={<SongDetails />} />
            <Route path="/album/:id" element={<AlbumDetails />} />
            <Route path="/playlist/:id" element={<PlaylistDetails />} />
            <Route path="/artist/:id" element={<ArtistDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Persistent Bottom Audio Player */}
        <BottomPlayer />

        {/* Mobile Bottom Navigation */}
        <MobileNav />
      </div>

      {/* Global Create Playlist Modal */}
      <CreatePlaylistModal
        isOpen={createPlaylistOpen}
        onClose={() => setCreatePlaylistOpen(false)}
        onCreated={(playlist) => {
          // Trigger reload / navigation if needed
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <PlayerProvider>
            <AppContent />
          </PlayerProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
