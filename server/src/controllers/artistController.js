const prisma = require('../config/db');

/**
 * Get all artists
 */
const getAllArtists = async (req, res, next) => {
  try {
    const artists = await prisma.artist.findMany({
      orderBy: { monthlyListeners: 'desc' },
      include: {
        _count: { select: { songs: true, albums: true, followers: true } }
      }
    });

    res.json({
      success: true,
      data: artists
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get artist details by ID with top songs and albums
 */
const getArtistById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const artist = await prisma.artist.findUnique({
      where: { id },
      include: {
        albums: {
          include: {
            _count: { select: { songs: true } }
          }
        },
        songs: {
          take: 10,
          orderBy: { plays: 'desc' },
          include: {
            album: { select: { id: true, title: true, coverArt: true } }
          }
        },
        _count: { select: { followers: true, songs: true, albums: true } }
      }
    });

    if (!artist) {
      return res.status(404).json({
        success: false,
        message: 'Artist not found.'
      });
    }

    let isFollowed = false;
    if (req.user) {
      const follow = await prisma.followedArtist.findUnique({
        where: {
          userId_artistId: {
            userId: req.user.id,
            artistId: artist.id
          }
        }
      });
      isFollowed = !!follow;
    }

    res.json({
      success: true,
      data: {
        ...artist,
        isFollowed
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllArtists,
  getArtistById
};
