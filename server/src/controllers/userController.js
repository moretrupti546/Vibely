const prisma = require('../config/db');

/**
 * Get comprehensive user library (Playlists, Liked Songs, Saved Albums, Followed Artists)
 */
const getUserLibrary = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [playlists, likedSongs, savedAlbums, followedArtists] = await Promise.all([
      prisma.playlist.findMany({
        where: { userId },
        include: {
          user: { select: { id: true, name: true } },
          _count: { select: { tracks: true } }
        },
        orderBy: { updatedAt: 'desc' }
      }),

      prisma.likedSong.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: {
          song: {
            include: {
              artist: { select: { id: true, name: true } },
              album: { select: { id: true, title: true, coverArt: true } }
            }
          }
        }
      }),

      prisma.savedAlbum.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: {
          album: {
            include: {
              artist: { select: { id: true, name: true } },
              _count: { select: { songs: true } }
            }
          }
        }
      }),

      prisma.followedArtist.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: {
          artist: true
        }
      })
    ]);

    const formattedLikedSongs = likedSongs.map(l => ({
      ...l.song,
      likedAt: l.createdAt,
      isLiked: true
    }));

    const formattedSavedAlbums = savedAlbums.map(s => ({
      ...s.album,
      savedAt: s.createdAt,
      isSaved: true
    }));

    res.json({
      success: true,
      data: {
        playlists,
        likedSongs: formattedLikedSongs,
        savedAlbums: formattedSavedAlbums,
        followedArtists: followedArtists.map(f => f.artist)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update authenticated user's profile details
 */
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, bio, avatar } = req.body;

    if (name && (typeof name !== 'string' || name.trim().length < 2)) {
      return res.status(400).json({
        success: false,
        message: 'Name must be at least 2 characters long.'
      });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name: name.trim() }),
        ...(bio !== undefined && { bio: bio.trim() }),
        ...(avatar && { avatar: avatar.trim() })
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true,
        createdAt: true
      }
    });

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: updated
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's listening history
 */
const getListeningHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { limit = 20 } = req.query;

    const history = await prisma.listeningHistory.findMany({
      where: { userId },
      take: Math.min(parseInt(limit, 10) || 20, 50),
      orderBy: { playedAt: 'desc' },
      include: {
        song: {
          include: {
            artist: { select: { id: true, name: true } },
            album: { select: { id: true, title: true, coverArt: true } }
          }
        }
      }
    });

    // Check likes
    const liked = await prisma.likedSong.findMany({
      where: { userId },
      select: { songId: true }
    });
    const likedSet = new Set(liked.map(l => l.songId));

    const formatted = history.map(h => ({
      ...h.song,
      historyId: h.id,
      playedAt: h.playedAt,
      isLiked: likedSet.has(h.song.id)
    }));

    res.json({
      success: true,
      data: formatted
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle liking / unliking a song
 */
const toggleLikeSong = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { songId } = req.params;

    const song = await prisma.song.findUnique({
      where: { id: songId }
    });

    if (!song) {
      return res.status(404).json({
        success: false,
        message: 'Song not found.'
      });
    }

    const existing = await prisma.likedSong.findUnique({
      where: {
        userId_songId: {
          userId,
          songId
        }
      }
    });

    if (existing) {
      await prisma.likedSong.delete({
        where: { id: existing.id }
      });
      return res.json({
        success: true,
        isLiked: false,
        message: 'Removed from Liked Songs.'
      });
    } else {
      await prisma.likedSong.create({
        data: {
          userId,
          songId
        }
      });
      return res.json({
        success: true,
        isLiked: true,
        message: 'Added to Liked Songs.'
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle saving / unsaving an album
 */
const toggleSaveAlbum = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { albumId } = req.params;

    const album = await prisma.album.findUnique({
      where: { id: albumId }
    });

    if (!album) {
      return res.status(404).json({
        success: false,
        message: 'Album not found.'
      });
    }

    const existing = await prisma.savedAlbum.findUnique({
      where: {
        userId_albumId: {
          userId,
          albumId
        }
      }
    });

    if (existing) {
      await prisma.savedAlbum.delete({
        where: { id: existing.id }
      });
      return res.json({
        success: true,
        isSaved: false,
        message: 'Album removed from your library.'
      });
    } else {
      await prisma.savedAlbum.create({
        data: {
          userId,
          albumId
        }
      });
      return res.json({
        success: true,
        isSaved: true,
        message: 'Album saved to your library.'
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle following / unfollowing an artist
 */
const toggleFollowArtist = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { artistId } = req.params;

    const artist = await prisma.artist.findUnique({
      where: { id: artistId }
    });

    if (!artist) {
      return res.status(404).json({
        success: false,
        message: 'Artist not found.'
      });
    }

    const existing = await prisma.followedArtist.findUnique({
      where: {
        userId_artistId: {
          userId,
          artistId
        }
      }
    });

    if (existing) {
      await prisma.followedArtist.delete({
        where: { id: existing.id }
      });
      return res.json({
        success: true,
        isFollowed: false,
        message: `Unfollowed ${artist.name}.`
      });
    } else {
      await prisma.followedArtist.create({
        data: {
          userId,
          artistId
        }
      });
      return res.json({
        success: true,
        isFollowed: true,
        message: `Following ${artist.name}!`
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserLibrary,
  updateProfile,
  getListeningHistory,
  toggleLikeSong,
  toggleSaveAlbum,
  toggleFollowArtist
};
