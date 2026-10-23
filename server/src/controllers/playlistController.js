const prisma = require('../config/db');

/**
 * Get all public playlists
 */
const getAllPlaylists = async (req, res, next) => {
  try {
    const playlists = await prisma.playlist.findMany({
      where: { isPublic: true },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
        _count: { select: { tracks: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: playlists
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get playlist details by ID with tracks and ownership status
 */
const getPlaylistById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const playlist = await prisma.playlist.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
        tracks: {
          orderBy: { order: 'asc' },
          include: {
            song: {
              include: {
                artist: { select: { id: true, name: true } },
                album: { select: { id: true, title: true, coverArt: true } }
              }
            }
          }
        }
      }
    });

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: 'Playlist not found.'
      });
    }

    const isOwner = req.user ? req.user.id === playlist.userId : false;

    // Check liked songs status if user is logged in
    let userLikedSongIds = new Set();
    if (req.user) {
      const userLikes = await prisma.likedSong.findMany({
        where: { userId: req.user.id },
        select: { songId: true }
      });
      userLikedSongIds = new Set(userLikes.map(l => l.songId));
    }

    const tracks = playlist.tracks.map(pt => ({
      ...pt.song,
      playlistTrackId: pt.id,
      addedAt: pt.addedAt,
      isLiked: userLikedSongIds.has(pt.song.id)
    }));

    const totalDuration = tracks.reduce((acc, t) => acc + (t.duration || 0), 0);

    res.json({
      success: true,
      data: {
        id: playlist.id,
        title: playlist.title,
        description: playlist.description,
        coverArt: playlist.coverArt,
        isPublic: playlist.isPublic,
        createdAt: playlist.createdAt,
        updatedAt: playlist.updatedAt,
        user: playlist.user,
        isOwner,
        totalDuration,
        trackCount: tracks.length,
        tracks
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new user playlist
 */
const createPlaylist = async (req, res, next) => {
  try {
    const { title, description, coverArt, isPublic = true } = req.body;

    const playlist = await prisma.playlist.create({
      data: {
        title,
        description: description || 'Personal curated playlist',
        coverArt: coverArt || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
        isPublic: Boolean(isPublic),
        userId: req.user.id
      },
      include: {
        user: { select: { id: true, name: true } },
        _count: { select: { tracks: true } }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Playlist created successfully.',
      data: playlist
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing playlist (title, description, coverArt)
 */
const updatePlaylist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, coverArt, isPublic } = req.body;

    const existing = await prisma.playlist.findUnique({
      where: { id }
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Playlist not found.'
      });
    }

    if (existing.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. You can only edit playlists you created.'
      });
    }

    const updated = await prisma.playlist.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(coverArt !== undefined && { coverArt }),
        ...(isPublic !== undefined && { isPublic: Boolean(isPublic) })
      }
    });

    res.json({
      success: true,
      message: 'Playlist updated successfully.',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a playlist with ownership verification
 */
const deletePlaylist = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.playlist.findUnique({
      where: { id }
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Playlist not found.'
      });
    }

    if (existing.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. You can only delete your own playlists.'
      });
    }

    await prisma.playlist.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Playlist deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add a song to a playlist
 */
const addTrackToPlaylist = async (req, res, next) => {
  try {
    const { id: playlistId } = req.params;
    const { songId } = req.body;

    if (!songId) {
      return res.status(400).json({
        success: false,
        message: 'Song ID is required.'
      });
    }

    const playlist = await prisma.playlist.findUnique({
      where: { id: playlistId }
    });

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: 'Playlist not found.'
      });
    }

    if (playlist.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. You can only add tracks to your own playlists.'
      });
    }

    // Check if song exists
    const song = await prisma.song.findUnique({
      where: { id: songId }
    });

    if (!song) {
      return res.status(404).json({
        success: false,
        message: 'Song not found.'
      });
    }

    // Check for duplicate in this playlist
    const existingTrack = await prisma.playlistTrack.findUnique({
      where: {
        playlistId_songId: {
          playlistId,
          songId
        }
      }
    });

    if (existingTrack) {
      return res.status(409).json({
        success: false,
        message: 'This song is already in the playlist.'
      });
    }

    // Get current max order
    const lastTrack = await prisma.playlistTrack.findFirst({
      where: { playlistId },
      orderBy: { order: 'desc' }
    });
    const nextOrder = lastTrack ? lastTrack.order + 1 : 0;

    const track = await prisma.playlistTrack.create({
      data: {
        playlistId,
        songId,
        order: nextOrder
      },
      include: {
        song: {
          include: {
            artist: { select: { id: true, name: true } },
            album: { select: { id: true, title: true, coverArt: true } }
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Song added to playlist.',
      data: track
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove a song from a playlist
 */
const removeTrackFromPlaylist = async (req, res, next) => {
  try {
    const { id: playlistId, trackId: songId } = req.params;

    const playlist = await prisma.playlist.findUnique({
      where: { id: playlistId }
    });

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: 'Playlist not found.'
      });
    }

    if (playlist.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. You can only modify your own playlists.'
      });
    }

    await prisma.playlistTrack.delete({
      where: {
        playlistId_songId: {
          playlistId,
          songId
        }
      }
    });

    res.json({
      success: true,
      message: 'Track removed from playlist.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPlaylists,
  getPlaylistById,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addTrackToPlaylist,
  removeTrackFromPlaylist
};
