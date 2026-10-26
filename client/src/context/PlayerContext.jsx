import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { DEFAULT_SONGS } from '../data/catalog';

const PlayerContext = createContext(null);

export const PlayerProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const audioRef = useRef(null);
  if (!audioRef.current && typeof Audio !== 'undefined') {
    audioRef.current = new Audio();
  }

  const [currentSong, setCurrentSong] = useState(() => {
    try {
      const saved = localStorage.getItem('vibely_last_played_song');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_SONGS[0];
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(() => {
    try {
      const saved = localStorage.getItem('vibely_last_played_song');
      if (saved) return JSON.parse(saved).duration || 260;
    } catch (e) {}
    return DEFAULT_SONGS[0]?.duration || 260;
  });
  const [audioMode, setAudioMode] = useState(() => {
    return localStorage.getItem('vibely_audio_mode') || 'full';
  });
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem('vibely_volume');
    return saved !== null ? parseFloat(saved) : 0.75;
  });
  const [isMuted, setIsMuted] = useState(false);
  const [queue, setQueue] = useState(() => {
    try {
      const saved = localStorage.getItem('vibely_last_queue');
      if (saved && Array.isArray(JSON.parse(saved))) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_SONGS;
  });
  const [queueIndex, setQueueIndex] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off', 'all', 'one'
  const [likedSongIds, setLikedSongIds] = useState(() => {
    try {
      const saved = localStorage.getItem('vibely_liked_song_ids');
      if (saved) {
        return new Set(JSON.parse(saved));
      }
    } catch (e) {}
    return new Set(DEFAULT_SONGS.slice(0, 4).map((s) => s.id));
  });
  const [isAudioLoading, setIsAudioLoading] = useState(false);

  // Synchronous refs to avoid listener churn and stale closures
  const queueRef = useRef(queue);
  const queueIndexRef = useRef(queueIndex);
  const repeatModeRef = useRef(repeatMode);
  const isShuffleRef = useRef(isShuffle);
  const currentSongRef = useRef(currentSong);
  const audioModeRef = useRef(audioMode);

  useEffect(() => { queueRef.current = queue; }, [queue]);
  useEffect(() => { queueIndexRef.current = queueIndex; }, [queueIndex]);
  useEffect(() => { repeatModeRef.current = repeatMode; }, [repeatMode]);
  useEffect(() => { isShuffleRef.current = isShuffle; }, [isShuffle]);
  useEffect(() => { currentSongRef.current = currentSong; }, [currentSong]);
  useEffect(() => {
    audioModeRef.current = audioMode;
    localStorage.setItem('vibely_audio_mode', audioMode);
  }, [audioMode]);

  // Synchronize volume and mute to the audio element without re-binding event listeners
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Sync initial liked songs if user is logged in
  useEffect(() => {
    if (isAuthenticated) {
      api.get('/users/me/library')
        .then((res) => {
          if (res.data?.success && res.data.data?.likedSongs) {
            const serverLikedIds = res.data.data.likedSongs.map((s) => s.id);
            if (serverLikedIds.length > 0) {
              setLikedSongIds((prev) => {
                const combined = new Set([...prev, ...serverLikedIds]);
                try {
                  localStorage.setItem('vibely_liked_song_ids', JSON.stringify([...combined]));
                } catch (e) {}
                return combined;
              });
            }
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated]);

  // Forward declaration of playNext for ended handler
  const playNext = () => {
    const q = queueRef.current;
    const qIdx = queueIndexRef.current;
    const shuffle = isShuffleRef.current;
    const repeat = repeatModeRef.current;

    if (q.length === 0) return;

    if (shuffle) {
      const randomIdx = Math.floor(Math.random() * q.length);
      setQueueIndex(randomIdx);
      playSong(q[randomIdx]);
      return;
    }

    if (qIdx < q.length - 1) {
      const nextIdx = qIdx + 1;
      setQueueIndex(nextIdx);
      playSong(q[nextIdx]);
    } else if (repeat === 'all') {
      setQueueIndex(0);
      playSong(q[0]);
    } else {
      setIsPlaying(false);
    }
  };

  // Set up Audio event listeners ONCE on mount
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = isMuted ? 0 : volume;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || currentSongRef.current?.duration || 260);
      setIsAudioLoading(false);
    };

    const handleWaiting = () => {
      setIsAudioLoading(true);
    };

    const handlePlaying = () => {
      setIsAudioLoading(false);
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      if (repeatModeRef.current === 'one') {
        audio.currentTime = 0;
        audio.play().catch(() => {});
        return;
      }
      playNext();
    };

    const handleError = (e) => {
      if (!audio.src || audio.error?.code === 1) {
        return; // Aborted purposefully (e.g. user skipped track)
      }
      console.warn('Audio playback error:', e, audio.error);

      // Auto-fallback to previewUrl (m4a stream) if full mp3 failed
      if (audio.src && audio.src.endsWith('.mp3') && currentSongRef.current?.previewUrl) {
        console.warn('Auto-recovering track with AAC/M4A stream:', currentSongRef.current.previewUrl);
        audio.src = currentSongRef.current.previewUrl;
        audio.play().catch(() => {});
        return;
      }

      setIsAudioLoading(false);
      setIsPlaying(false);

      const code = audio.error?.code;
      let msg = 'Track audio stream is temporarily unavailable.';
      if (code === 2) msg = 'Network error while loading track audio.';
      if (code === 3) msg = 'Error decoding track audio stream.';
      if (code === 4) msg = 'Audio format not supported or file not found.';
      showToast(msg, 'error');
    };

    const handleCanPlay = () => {
      setIsAudioLoading(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  const playSong = async (song, newQueue = null) => {
    if (!song) return;

    if (newQueue && Array.isArray(newQueue)) {
      setQueue(newQueue);
      const idx = newQueue.findIndex((s) => s.id === song.id);
      setQueueIndex(idx !== -1 ? idx : 0);
      try {
        localStorage.setItem('vibely_last_queue', JSON.stringify(newQueue));
      } catch (e) {}
    } else if (!queueRef.current.some((s) => s.id === song.id)) {
      setQueue((prev) => [...prev, song]);
      setQueueIndex(queueRef.current.length);
    } else {
      const idx = queueRef.current.findIndex((s) => s.id === song.id);
      setQueueIndex(idx);
    }

    setCurrentSong(song);
    try {
      localStorage.setItem('vibely_last_played_song', JSON.stringify(song));
    } catch (e) {}
    const initialDur = song.duration || 260;
    setDuration(initialDur);
    setIsAudioLoading(true);

    try {
      const audio = audioRef.current;
      if (!audio) return;

      const targetSrc = getAudioSource(song, audioModeRef.current);
      const isDifferentSong = !currentSongRef.current || currentSongRef.current.id !== song.id;

      if (!audio.src || isDifferentSong || !audio.src.endsWith(targetSrc)) {
        audio.src = targetSrc;
        audio.currentTime = 0;
      }

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        await playPromise;
      }
      setIsPlaying(true);
      setIsAudioLoading(false);

      // Track play count
      api.post(`/songs/${song.id}/play`).catch(() => {});
    } catch (err) {
      setIsAudioLoading(false);
      setIsPlaying(!audioRef.current?.paused);

      if (err.name === 'AbortError') {
        return; // Fast skip, expected
      }

      console.warn('Audio play notice:', err.name, err.message);

      if (err.name === 'NotAllowedError') {
        showToast('Playback paused by browser autoplay policy. Click play to start listening.', 'info');
      } else if (err.name === 'NotSupportedError') {
        showToast(`Unable to play "${song.title}": Audio format or stream not supported.`, 'error');
      } else {
        showToast(`Could not play "${song.title}". Please try again.`, 'error');
      }
    }
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!currentSongRef.current) {
      const q = queueRef.current;
      if (q.length > 0) {
        playSong(q[0]);
      }
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      setIsAudioLoading(true);
      audio.play()
        .then(() => {
          setIsPlaying(true);
          setIsAudioLoading(false);
        })
        .catch((err) => {
          setIsAudioLoading(false);
          setIsPlaying(false);
          if (err.name === 'NotAllowedError') {
            showToast('Click play to resume audio playback.', 'info');
          } else if (err.name !== 'AbortError') {
            console.error('Audio play error:', err);
            showToast('Unable to resume playback.', 'error');
          }
        });
    }
  };

  const getAudioSource = (song, mode) => {
    if (!song) return '';
    if (mode === 'preview') {
      return song.previewUrl || (song.audioUrl ? song.audioUrl.replace(/\.mp3$/, '.m4a') : `/api/songs/${song.id}/stream`);
    }
    return song.audioUrl ? song.audioUrl.replace(/\.m4a$/, '.mp3') : `/api/songs/${song.id}/stream`;
  };

  const seek = (seconds) => {
    const audio = audioRef.current;
    if (!audio) return;

    const maxDur = audio.duration || currentSongRef.current?.duration || 300;
    const clamped = Math.max(0, Math.min(maxDur, seconds));
    audio.currentTime = clamped;
    setCurrentTime(clamped);
  };

  const toggleAudioMode = () => {
    const nextMode = audioMode === 'full' ? 'preview' : 'full';
    setAudioMode(nextMode);
    audioModeRef.current = nextMode;
    localStorage.setItem('vibely_audio_mode', nextMode);

    if (currentSongRef.current) {
      const song = currentSongRef.current;
      const targetSrc = getAudioSource(song, nextMode);
      const audio = audioRef.current;

      if (audio) {
        const wasPlaying = !audio.paused;
        const currentPos = audio.currentTime;
        audio.src = targetSrc;
        audio.currentTime = nextMode === 'preview' && currentPos > 28 ? 0 : currentPos;
        if (wasPlaying) {
          audio.play().catch(() => {});
        }
      }
    }

    if (nextMode === 'full') {
      showToast('Switched to Full Song Mode (Complete Studio Tracks) 🎵', 'info');
    } else {
      showToast('Switched to 30s Quick Preview Mode ⚡', 'info');
    }
  };

  const setVolumeLevel = (val) => {
    const clamped = Math.max(0, Math.min(1, val));
    setVolume(clamped);
    setIsMuted(false);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
    localStorage.setItem('vibely_volume', clamped.toString());
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (audioRef.current) {
        audioRef.current.volume = volume;
      }
    } else {
      setIsMuted(true);
      if (audioRef.current) {
        audioRef.current.volume = 0;
      }
    }
  };

  const playPrev = () => {
    const audio = audioRef.current;
    const q = queueRef.current;
    const qIdx = queueIndexRef.current;

    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      setCurrentTime(0);
      return;
    }

    if (qIdx > 0) {
      const prevIdx = qIdx - 1;
      setQueueIndex(prevIdx);
      playSong(q[prevIdx]);
    } else if (audio) {
      audio.currentTime = 0;
      setCurrentTime(0);
    }
  };

  const toggleShuffle = () => {
    setIsShuffle((prev) => !prev);
    showToast(!isShuffle ? 'Shuffle turned ON' : 'Shuffle turned OFF', 'info');
  };

  const toggleRepeat = () => {
    const modes = ['off', 'all', 'one'];
    const nextIdx = (modes.indexOf(repeatMode) + 1) % modes.length;
    const nextMode = modes[nextIdx];
    setRepeatMode(nextMode);
    const labels = { off: 'Repeat OFF', all: 'Repeat ALL tracks', one: 'Repeat CURRENT track' };
    showToast(labels[nextMode], 'info');
  };

  const addToQueue = (song) => {
    setQueue((prev) => [...prev, song]);
    showToast(`Added "${song.title}" to queue 🎵`, 'success');
  };

  const removeFromQueue = (songId) => {
    setQueue((prev) => prev.filter((s) => s.id !== songId));
  };

  const clearQueue = () => {
    if (currentSong) {
      setQueue([currentSong]);
      setQueueIndex(0);
    } else {
      setQueue([]);
      setQueueIndex(-1);
    }
  };

  const isSongLiked = (songId) => {
    return likedSongIds.has(songId);
  };

  const toggleLike = async (song) => {
    if (!song) return;

    if (!isAuthenticated) {
      showToast('Please log in to like songs and save them to your library.', 'info');
      return;
    }

    const songId = song.id;
    const currentlyLiked = likedSongIds.has(songId);
    const willBeLiked = !currentlyLiked;

    // Instant optimistic UI update & localStorage persistence
    setLikedSongIds((prev) => {
      const next = new Set(prev);
      if (willBeLiked) next.add(songId);
      else next.delete(songId);
      try {
        localStorage.setItem('vibely_liked_song_ids', JSON.stringify([...next]));
      } catch (e) {}
      return next;
    });

    // Update full songs list for Library tab
    try {
      const savedFullRaw = localStorage.getItem('vibely_liked_songs_full');
      let savedFull = savedFullRaw ? JSON.parse(savedFullRaw) : DEFAULT_SONGS.slice(0, 4);
      if (willBeLiked) {
        if (!savedFull.some((s) => s.id === songId)) {
          savedFull = [song, ...savedFull];
        }
      } else {
        savedFull = savedFull.filter((s) => s.id !== songId);
      }
      localStorage.setItem('vibely_liked_songs_full', JSON.stringify(savedFull));
    } catch (e) {}

    // Instant celebratory toast
    showToast(
      willBeLiked ? `Added "${song.title}" to Liked Songs 💜` : `Removed "${song.title}" from Liked Songs`,
      'success'
    );

    // Sync in background with backend if connected (never fails user action)
    try {
      await api.post(`/users/me/likes/${songId}`);
    } catch (err) {
      console.warn('Backend like sync notice (offline or static preview mode):', err?.message);
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        isAudioLoading,
        currentTime,
        duration,
        volume,
        isMuted,
        queue,
        queueIndex,
        isShuffle,
        repeatMode,
        playSong,
        togglePlay,
        seek,
        setVolumeLevel,
        toggleMute,
        playNext,
        playPrev,
        toggleShuffle,
        toggleRepeat,
        addToQueue,
        removeFromQueue,
        clearQueue,
        isSongLiked,
        toggleLike,
        audioMode,
        toggleAudioMode,
        setAudioMode
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
