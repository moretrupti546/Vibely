const prisma = require('../config/db');

/**
 * Get all songs with optional genre filtering & search
 */
const getAllSongs = async (req, res, next) => {
  try {
    const { genre, search, limit = 50, page = 1 } = req.query;
    const take = Math.min(parseInt(limit, 10) || 50, 100);
    const skip = ((parseInt(page, 10) || 1) - 1) * take;

    const where = {};
    if (genre && genre !== 'All') {
      where.genre = { equals: genre };
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { artist: { name: { contains: search } } },
        { genre: { contains: search } }
      ];
    }

    const [songs, total] = await Promise.all([
      prisma.song.findMany({
        where,
        take,
        skip,
        include: {
          artist: { select: { id: true, name: true, image: true, verified: true } },
          album: { select: { id: true, title: true, coverArt: true } }
        },
        orderBy: { plays: 'desc' }
      }),
      prisma.song.count({ where })
    ]);

    // Check liked status if user is logged in
    let likedSongIds = new Set();
    if (req.user) {
      const userLikes = await prisma.likedSong.findMany({
        where: { userId: req.user.id },
        select: { songId: true }
      });
      likedSongIds = new Set(userLikes.map(l => l.songId));
    }

    const formatted = songs.map(song => ({
      ...song,
      isLiked: likedSongIds.has(song.id)
    }));

    res.json({
      success: true,
      data: formatted,
      meta: {
        total,
        page: parseInt(page, 10),
        limit: take,
        totalPages: Math.ceil(total / take)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single song details by ID
 */
const getSongById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const song = await prisma.song.findUnique({
      where: { id },
      include: {
        artist: {
          select: {
            id: true,
            name: true,
            bio: true,
            image: true,
            verified: true,
            monthlyListeners: true
          }
        },
        album: {
          select: {
            id: true,
            title: true,
            coverArt: true,
            releaseYear: true,
            genre: true
          }
        }
      }
    });

    if (!song) {
      return res.status(404).json({
        success: false,
        message: 'Song not found.'
      });
    }

    // Get related songs by same artist or genre
    const relatedSongs = await prisma.song.findMany({
      where: {
        OR: [
          { artistId: song.artistId },
          { genre: song.genre }
        ],
        NOT: { id: song.id }
      },
      take: 5,
      include: {
        artist: { select: { id: true, name: true } },
        album: { select: { id: true, title: true, coverArt: true } }
      }
    });

    let isLiked = false;
    if (req.user) {
      const like = await prisma.likedSong.findUnique({
        where: {
          userId_songId: {
            userId: req.user.id,
            songId: song.id
          }
        }
      });
      isLiked = !!like;
    }

    res.json({
      success: true,
      data: {
        ...song,
        isLiked,
        relatedSongs
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Search songs, albums, artists, and playlists
 */
const searchAll = async (req, res, next) => {
  try {
    const { q, type } = req.query;
    if (!q || q.trim() === '') {
      return res.json({
        success: true,
        data: { songs: [], artists: [], albums: [], playlists: [] }
      });
    }

    const query = q.trim();

    const [songs, artists, albums, playlists] = await Promise.all([
      (!type || type === 'songs') ? prisma.song.findMany({
        where: {
          OR: [
            { title: { contains: query } },
            { genre: { contains: query } },
            { artist: { name: { contains: query } } }
          ]
        },
        take: 10,
        include: {
          artist: { select: { id: true, name: true } },
          album: { select: { id: true, title: true, coverArt: true } }
        }
      }) : [],

      (!type || type === 'artists') ? prisma.artist.findMany({
        where: {
          OR: [
            { name: { contains: query } },
            { bio: { contains: query } }
          ]
        },
        take: 6
      }) : [],

      (!type || type === 'albums') ? prisma.album.findMany({
        where: {
          OR: [
            { title: { contains: query } },
            { genre: { contains: query } },
            { artist: { name: { contains: query } } }
          ]
        },
        take: 6,
        include: {
          artist: { select: { id: true, name: true } }
        }
      }) : [],

      (!type || type === 'playlists') ? prisma.playlist.findMany({
        where: {
          OR: [
            { title: { contains: query } },
            { description: { contains: query } }
          ],
          isPublic: true
        },
        take: 6,
        include: {
          user: { select: { id: true, name: true } },
          _count: { select: { tracks: true } }
        }
      }) : []
    ]);

    res.json({
      success: true,
      data: { songs, artists, albums, playlists }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get trending songs
 */
const getTrendingSongs = async (req, res, next) => {
  try {
    const songs = await prisma.song.findMany({
      take: 10,
      orderBy: { plays: 'desc' },
      include: {
        artist: { select: { id: true, name: true, verified: true } },
        album: { select: { id: true, title: true, coverArt: true } }
      }
    });

    let likedSongIds = new Set();
    if (req.user) {
      const userLikes = await prisma.likedSong.findMany({
        where: { userId: req.user.id },
        select: { songId: true }
      });
      likedSongIds = new Set(userLikes.map(l => l.songId));
    }

    const formatted = songs.map(song => ({
      ...song,
      isLiked: likedSongIds.has(song.id)
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
 * Record a song play and log to listening history
 */
const recordPlay = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updated = await prisma.song.update({
      where: { id },
      data: { plays: { increment: 1 } }
    });

    if (req.user) {
      await prisma.listeningHistory.create({
        data: {
          userId: req.user.id,
          songId: id
        }
      });
    }

    res.json({
      success: true,
      plays: updated.plays
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSongs,
  getSongById,
  searchAll,
  getTrendingSongs,
  recordPlay
};
