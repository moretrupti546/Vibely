const https = require('https');
const http = require('http');
const path = require('path');
const fs = require('fs');
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
      take: 20,
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

/**
 * Helper to pipe remote audio stream with guaranteed audio/mpeg Content-Type
 */
const pipeAudioResponse = (sourceRes, req, clientRes) => {
  const status = sourceRes.statusCode === 206 ? 206 : 200;
  clientRes.status(status);

  clientRes.setHeader('Content-Type', 'audio/mpeg');
  clientRes.setHeader('Accept-Ranges', 'bytes');
  clientRes.setHeader('Access-Control-Allow-Origin', '*');
  clientRes.setHeader('Cache-Control', 'public, max-age=86400');

  if (sourceRes.headers['content-range']) {
    clientRes.setHeader('Content-Range', sourceRes.headers['content-range']);
  }
  if (sourceRes.headers['content-length']) {
    clientRes.setHeader('Content-Length', sourceRes.headers['content-length']);
  }

  sourceRes.pipe(clientRes);
};

/**
 * Stream song audio by ID with guaranteed audio/mpeg headers
 */
const streamSong = async (req, res, next) => {
  try {
    const { id } = req.params;
    const song = await prisma.song.findUnique({
      where: { id }
    });

    if (!song || !song.audioUrl) {
      return res.status(404).json({ success: false, message: 'Track not found.' });
    }

    const audioUrl = song.audioUrl;

    // Handle local audio files
    if (audioUrl.startsWith('/audio/') || audioUrl.startsWith('audio/')) {
      const cleanPath = audioUrl.replace(/^\/?audio\//, '');
      const filePath = path.join(__dirname, '../../../client/public/audio', cleanPath);
      if (fs.existsSync(filePath)) {
        const stat = fs.statSync(filePath);
        const fileSize = stat.size;
        const range = req.headers.range;

        res.setHeader('Accept-Ranges', 'bytes');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cache-Control', 'public, max-age=86400');

        if (range) {
          const parts = range.replace(/bytes=/, '').split('-');
          const start = parseInt(parts[0], 10);
          const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
          const chunksize = (end - start) + 1;
          const file = fs.createReadStream(filePath, { start, end });
          res.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Content-Length': chunksize,
            'Content-Type': 'audio/mp4'
          });
          return file.pipe(res);
        } else {
          res.writeHead(200, {
            'Content-Length': fileSize,
            'Content-Type': 'audio/mp4'
          });
          return fs.createReadStream(filePath).pipe(res);
        }
      }
    }

    // External URL handling
    const clientRange = req.headers.range;
    let parsedUrl;
    try {
      parsedUrl = new URL(audioUrl);
    } catch {
      return res.status(404).json({ success: false, message: 'Invalid track audio URL.' });
    }

    const client = parsedUrl.protocol === 'https:' ? https : http;

    const requestHeaders = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    };
    if (clientRange) {
      requestHeaders['Range'] = clientRange;
    }

    const proxyReq = client.get(audioUrl, { headers: requestHeaders }, (proxyRes) => {
      if (proxyRes.statusCode >= 300 && proxyRes.statusCode < 400 && proxyRes.headers.location) {
        const redirectUrl = new URL(proxyRes.headers.location, audioUrl);
        const redirectClient = redirectUrl.protocol === 'https:' ? https : http;
        redirectClient.get(redirectUrl.toString(), { headers: requestHeaders }, (redRes) => {
          pipeAudioResponse(redRes, req, res);
        }).on('error', (err) => {
          console.error('Audio stream redirect error:', err.message);
          res.redirect(audioUrl);
        });
        return;
      }

      pipeAudioResponse(proxyRes, req, res);
    });

    proxyReq.on('error', (err) => {
      console.error('Audio stream proxy error:', err.message);
      res.redirect(audioUrl);
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
  recordPlay,
  streamSong
};
