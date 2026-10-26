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
import { SubscriptionModal } from './components/modals/SubscriptionModal';
import { usePlayer } from './context/PlayerContext';

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

/**
 * Layout wrapper for Authentication pages (Login / Register)
 */
function AuthLayout({ children }) {
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
        {children}
      </div>

      <div className="p-6 text-center text-xs text-slate-500">
        © 2026 Vibely Inc. Feel Every Beat.
      </div>
      <BottomPlayer />
    </div>
  );
}

/**
 * Layout wrapper for the full-featured music streaming application
 */
function AppShell({ children, onOpenCreatePlaylist }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-vibely-dark text-slate-100">
      {/* Desktop Sidebar */}
      <div className="hidden md:block h-full">
        <Sidebar onOpenCreatePlaylist={onOpenCreatePlaylist} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
        <Navbar />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 pb-36">
          {children}
        </main>

        {/* Persistent Bottom Audio Player */}
        <BottomPlayer />

        {/* Mobile Bottom Navigation */}
        <MobileNav />
      </div>
    </div>
  );
}

export function AppContent() {
  const [createPlaylistOpen, setCreatePlaylistOpen] = useState(false);
  const { isSubscriptionModalOpen, closeSubscriptionModal, pendingSongForDownload } = usePlayer();
  const navigate = useNavigate();

  return (
    <>
      <Routes>
        {/* Standalone Public Landing Page */}
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-vibely-dark text-slate-100 relative">
              <LandingPage />
              <BottomPlayer />
            </div>
          }
        />

        {/* Auth Pages */}
        <Route
          path="/login"
          element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          }
        />
        <Route
          path="/register"
          element={
            <AuthLayout>
              <Register />
            </AuthLayout>
          }
        />

        {/* Main Music App Routes wrapped in AppShell */}
        <Route
          path="/app"
          element={
            <AppShell onOpenCreatePlaylist={() => setCreatePlaylistOpen(true)}>
              <Home />
            </AppShell>
          }
        />
        <Route
          path="/explore"
          element={
            <AppShell onOpenCreatePlaylist={() => setCreatePlaylistOpen(true)}>
              <Explore />
            </AppShell>
          }
        />
        <Route
          path="/library"
          element={
            <AppShell onOpenCreatePlaylist={() => setCreatePlaylistOpen(true)}>
              <Library />
            </AppShell>
          }
        />
        <Route
          path="/song/:id"
          element={
            <AppShell onOpenCreatePlaylist={() => setCreatePlaylistOpen(true)}>
              <SongDetails />
            </AppShell>
          }
        />
        <Route
          path="/album/:id"
          element={
            <AppShell onOpenCreatePlaylist={() => setCreatePlaylistOpen(true)}>
              <AlbumDetails />
            </AppShell>
          }
        />
        <Route
          path="/playlist/:id"
          element={
            <AppShell onOpenCreatePlaylist={() => setCreatePlaylistOpen(true)}>
              <PlaylistDetails />
            </AppShell>
          }
        />
        <Route
          path="/artist/:id"
          element={
            <AppShell onOpenCreatePlaylist={() => setCreatePlaylistOpen(true)}>
              <ArtistDetails />
            </AppShell>
          }
        />
        <Route
          path="/profile"
          element={
            <AppShell onOpenCreatePlaylist={() => setCreatePlaylistOpen(true)}>
              <Profile />
            </AppShell>
          }
        />

        {/* Fallback & Redirects */}
        <Route path="*" element={<Navigate to="/app" replace />} />
      </Routes>

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

      {/* Global VIP Subscription Modal */}
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={closeSubscriptionModal}
        song={pendingSongForDownload}
      />
    </>
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
