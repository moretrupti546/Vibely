import { useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { DEFAULT_SONGS, DEFAULT_ARTISTS } from '../data/catalog';

const STORAGE_KEY = 'vibely_followed_artists';

const getInitialFollowed = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}
  // Default to Arijit Singh followed for instant rich recommendations on first visit
  return ['artist-arijit-singh'];
};

export const useFollowedArtists = () => {
  const [followedIds, setFollowedIds] = useState(getInitialFollowed);
  const { showToast } = useToast();
  const { isAuthenticated } = useAuth();

  // Keep in sync with custom event across all open components
  useEffect(() => {
    const handleSync = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          setFollowedIds(JSON.parse(saved));
        }
      } catch (e) {}
    };

    window.addEventListener('vibely_artist_follow_changed', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('vibely_artist_follow_changed', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const isFollowing = useCallback(
    (artistId) => {
      return followedIds.includes(artistId);
    },
    [followedIds]
  );

  const toggleFollow = useCallback(
    async (artist) => {
      if (!artist || !artist.id) return;

      const currentlyFollowed = followedIds.includes(artist.id);
      let updated;

      if (currentlyFollowed) {
        updated = followedIds.filter((id) => id !== artist.id);
        showToast(`Unfollowed ${artist.name}`, 'info');
      } else {
        updated = [...followedIds, artist.id];
        showToast(`Following ${artist.name} 🌟 New recommendations unlocked!`, 'success');
      }

      setFollowedIds(updated);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new Event('vibely_artist_follow_changed'));
      } catch (e) {}

      // Optional backend sync
      if (isAuthenticated) {
        try {
          await api.post(`/users/me/artists/${artist.id}`);
        } catch (e) {
          // Backend optional
        }
      }
    },
    [followedIds, showToast, isAuthenticated]
  );

  // Calculate dynamic recommendations based on followed artists
  const recommendedSongs = useMemo(() => {
    if (!followedIds || followedIds.length === 0) {
      // If no artists followed, return popular default tracks
      return DEFAULT_SONGS.slice(0, 10);
    }

    const followedArtistSet = new Set(followedIds);

    // 1. Tracks directly by followed artists (highest priority)
    const directTracks = DEFAULT_SONGS.filter(
      (s) => s.artist && followedArtistSet.has(s.artist.id)
    );

    // 2. Discover genres of followed artists
    const followedGenres = new Set(
      directTracks.map((s) => (s.genre || '').toLowerCase()).filter(Boolean)
    );

    // 3. Similar tracks from the same genres by other artists
    const relatedTracks = DEFAULT_SONGS.filter(
      (s) =>
        s.artist &&
        !followedArtistSet.has(s.artist.id) &&
        followedGenres.has((s.genre || '').toLowerCase())
    );

    // Merge direct tracks first, followed by related tracks, avoiding duplicates
    const combined = [...directTracks, ...relatedTracks];
    const uniqueMap = new Map();
    combined.forEach((s) => {
      if (!uniqueMap.has(s.id)) {
        uniqueMap.set(s.id, s);
      }
    });

    return Array.from(uniqueMap.values());
  }, [followedIds]);

  // Retrieve full artist objects of followed artists
  const followedArtistObjects = useMemo(() => {
    const map = new Map(DEFAULT_ARTISTS.map((a) => [a.id, a]));
    return followedIds.map((id) => map.get(id)).filter(Boolean);
  }, [followedIds]);

  return {
    followedIds,
    isFollowing,
    toggleFollow,
    recommendedSongs,
    followedArtistObjects
  };
};
