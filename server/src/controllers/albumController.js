const prisma = require('../config/db');

/**
 * Get all albums
 */
const getAllAlbums = async (req, res, next) => {
  try {
    const { genre } = req.query;
    const where = {};
    if (genre && genre !== 'All') {
      where.genre = { equals: genre };
    }

    const albums = await prisma.album.findMany({
      where,
      orderBy: { releaseYear: 'desc' },
      include: {
        artist: { select: { id: true, name: true, image: true } },
        _count: { select: { songs: true } }
      }
    });

    res.json({
      success: true,
      data: albums
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single album details by ID with track list
 */
const getAlbumById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const album = await prisma.album.findUnique({
      where: { id },
      include: {
        artist: {
          select: {
            id: true,
            name: true,
            image: true,
            verified: true,
            bio: true
          }
        },
        songs: {
          include: {
            artist: { select: { id: true, name: true } }
          },
          orderBy: { createdAt: 'asc' }
        },
        _count: { select: { songs: true, savedBy: true } }
      }
    });

    if (!album) {
      return res.status(404).json({
        success: false,
        message: 'Album not found.'
      });
    }

    let isSaved = false;
    let userLikedSongIds = new Set();

    if (req.user) {
      const saved = await prisma.savedAlbum.findUnique({
        where: {
          userId_albumId: {
            userId: req.user.id,
            albumId: album.id
          }
        }
      });
      isSaved = !!saved;

      const userLikes = await prisma.likedSong.findMany({
        where: { userId: req.user.id },
        select: { songId: true }
      });
      userLikedSongIds = new Set(userLikes.map(l => l.songId));
    }

    // Attach isLiked to each song in album
    const songsWithLikeStatus = album.songs.map(song => ({
      ...song,
      isLiked: userLikedSongIds.has(song.id)
    }));

    res.json({
      success: true,
      data: {
        ...album,
        isSaved,
        songs: songsWithLikeStatus
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAlbums,
  getAlbumById
};
