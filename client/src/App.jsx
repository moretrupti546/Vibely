import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate, Link } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { PlayerProvider } from './context/PlayerContext';

import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { MobileNav } from './components/layout/MobileNav';
import { BottomPlayer } from './components/player/BottomPlayer';
import { CreatePlaylistModal } from './components/modals/CreatePlaylistModal';

import { LandingPage } from './pages/LandingPage';
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
import { ArrowLeft, Sparkles } from 'lucide-react';

export function AppContent() {
  const [createPlaylistOpen, setCreatePlaylistOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isLandingPage = location.pathname === '/';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  // Standalone Public Landing Page
  if (isLandingPage) {
    return (
      <div className="min-h-screen bg-vibely-dark text-slate-100 relative">
        <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes>
        <BottomPlayer />
      </div>
    );
  }

  // Standalone Auth Pages (Login / Register) with clean background and back link
  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-vibely-dark text-slate-100 flex flex-col justify-between relative selection:bg-purple-600 selection:text-white">
        <div className="p-6 flex items-center justify-between max-w-7xl mx-auto w-full">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Vibely Home</span>
          </Link>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-white text-base">Vibely</span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-4">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>

        <div className="p-6 text-center text-xs text-slate-500">
          © 2026 Vibely Inc. Feel Every Beat.
        </div>
        <BottomPlayer />
      </div>
    );
  }

  // Full-Featured Music Streaming Application Shell
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
            <Route path="/app" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/library" element={<Library />} />
            <Route path="/song/:id" element={<SongDetails />} />
            <Route path="/album/:id" element={<AlbumDetails />} />
            <Route path="/playlist/:id" element={<PlaylistDetails />} />
            <Route path="/artist/:id" element={<ArtistDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/app" replace />} />
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
        onCreated={(newPl) => {
          if (newPl?.id) {
            navigate(`/playlist/${newPl.id}`);
          }
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
