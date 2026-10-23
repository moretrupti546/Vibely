import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const PlayerContext = createContext(null);

export const PlayerProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const audioRef = useRef(new Audio());
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem('vibely_volume');
    return saved !== null ? parseFloat(saved) : 0.75;
  });
  const [isMuted, setIsMuted] = useState(false);
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(-1);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off', 'all', 'one'
  const [likedSongIds, setLikedSongIds] = useState(new Set());
  const [isAudioLoading, setIsAudioLoading] = useState(false);

  // Sync initial liked songs if user is logged in
  useEffect(() => {
    if (isAuthenticated) {
      api.get('/users/me/library')
        .then((res) => {
          if (res.data.success && res.data.data.likedSongs) {
            const ids = new Set(res.data.data.likedSongs.map((s) => s.id));
            setLikedSongIds(ids);
          }
        })
        .catch(() => {});
    } else {
      setLikedSongIds(new Set());
    }
  }, [isAuthenticated]);

  // Set up Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = isMuted ? 0 : volume;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setIsAudioLoading(false);
    };

    const handleWaiting = () => {
      setIsAudioLoading(true);
    };

    const handlePlaying = () => {
      setIsAudioLoading(false);
      setIsPlaying(true);
    };

    const handleEnded = () => {
      handleTrackEnd();
    };

    const handleError = (e) => {
      console.warn('Audio playback error:', e);
      setIsAudioLoading(false);
      setIsPlaying(false);
      showToast('Track audio stream is temporarily unavailable.', 'error');
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [volume, isMuted, repeatMode, queue, queueIndex, isShuffle]);

  const handleTrackEnd = () => {
    if (repeatMode === 'one') {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    } else {
      playNext();
    }
  };

  const playSong = async (song, newQueue = null) => {
    if (!song) return;

    if (newQueue && Array.isArray(newQueue)) {
      setQueue(newQueue);
      const idx = newQueue.findIndex((s) => s.id === song.id);
      setQueueIndex(idx !== -1 ? idx : 0);
    } else if (!queue.some((s) => s.id === song.id)) {
      setQueue((prev) => [...prev, song]);
      setQueueIndex(queue.length);
    } else {
      const idx = queue.findIndex((s) => s.id === song.id);
      setQueueIndex(idx);
    }

    setCurrentSong(song);
    setIsAudioLoading(true);

    try {
      audioRef.current.src = song.audioUrl;
      audioRef.current.currentTime = 0;
      await audioRef.current.play();
      setIsPlaying(true);

      // Track play count
      api.post(`/songs/${song.id}/play`).catch(() => {});
    } catch (err) {
      console.error('Failed to play track:', err);
      setIsAudioLoading(false);
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (!currentSong) {
      if (queue.length > 0) {
        playSong(queue[0]);
      }
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error('Audio play error:', err));
    }
  };

  const seek = (seconds) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
      setCurrentTime(seconds);
    }
  };

  const setVolumeLevel = (val) => {
    const clamped = Math.max(0, Math.min(1, val));
    setVolume(clamped);
    setIsMuted(false);
    audioRef.current.volume = clamped;
    localStorage.setItem('vibely_volume', clamped.toString());
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      audioRef.current.volume = volume;
    } else {
      setIsMuted(true);
      audioRef.current.volume = 0;
    }
  };

  const playNext = () => {
    if (queue.length === 0) return;

    if (isShuffle) {
      const randomIdx = Math.floor(Math.random() * queue.length);
      setQueueIndex(randomIdx);
      playSong(queue[randomIdx]);
      return;
    }

    if (queueIndex < queue.length - 1) {
      const nextIdx = queueIndex + 1;
      setQueueIndex(nextIdx);
      playSong(queue[nextIdx]);
    } else if (repeatMode === 'all') {
      setQueueIndex(0);
      playSong(queue[0]);
    } else {
      setIsPlaying(false);
    }
  };

  const playPrev = () => {
    if (audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }

    if (queueIndex > 0) {
      const prevIdx = queueIndex - 1;
      setQueueIndex(prevIdx);
      playSong(queue[prevIdx]);
    } else {
      audioRef.current.currentTime = 0;
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
    if (!isAuthenticated) {
      showToast('Please log in to like songs and save them to your library.', 'info');
      return;
    }

    const songId = song.id;
    const currentlyLiked = likedSongIds.has(songId);

    // Optimistic UI update
    setLikedSongIds((prev) => {
      const next = new Set(prev);
      if (currentlyLiked) next.delete(songId);
      else next.add(songId);
      return next;
    });

    try {
      const res = await api.post(`/users/me/likes/${songId}`);
      if (res.data.success) {
        showToast(
          res.data.isLiked ? `Added "${song.title}" to Liked Songs 💜` : `Removed "${song.title}" from Liked Songs`,
          'success'
        );
      }
    } catch (err) {
      // Revert optimistic update
      setLikedSongIds((prev) => {
        const next = new Set(prev);
        if (currentlyLiked) next.add(songId);
        else next.delete(songId);
        return next;
      });
      showToast('Failed to update liked songs.', 'error');
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
        toggleLike
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
