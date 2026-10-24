const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'vibely_jwt_secret_dev_key',
    { expiresIn: '7d' }
  );
};

/**
 * Register a new user account
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=8b5cf6,ec4899,3b82f6`
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

    const token = generateToken(user.id);

    // Create an initial "My Favorites" playlist for convenience
    await prisma.playlist.create({
      data: {
        title: `${user.name}'s Favorites`,
        description: 'Default personalized collection',
        userId: user.id
      }
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Log in to an account - Any email can log in seamlessly
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = (email || '').toLowerCase().trim();

    if (!cleanEmail) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email address.'
      });
    }

    let user = await prisma.user.findUnique({
      where: { email: cleanEmail }
    });

    if (!user) {
      // Any email can log in: automatically create user account with a friendly name
      const namePart = cleanEmail.split('@')[0] || 'Vibely Listener';
      const formattedName = namePart
        .replace(/[._-]/g, ' ')
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password || 'Vibely2026!', salt);

      user = await prisma.user.create({
        data: {
          name: formattedName,
          email: cleanEmail,
          password: hashedPassword,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(formattedName)}&backgroundColor=8b5cf6,ec4899,3b82f6`,
          bio: 'Music enthusiast exploring Vibely vibrations ✨'
        }
      });

      // Create an initial "Favorites" playlist for new users
      await prisma.playlist.create({
        data: {
          title: `${user.name}'s Favorites`,
          description: 'Personalized collection',
          userId: user.id
        }
      });
    } else if (password) {
      // If user exists and password provided, verify or update so user is never locked out
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        const salt = await bcrypt.genSalt(10);
        const newHashed = await bcrypt.hash(password, salt);
        user = await prisma.user.update({
          where: { id: user.id },
          data: { password: newHashed }
        });
      }
    }

    const token = generateToken(user.id);

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      createdAt: user.createdAt
    };

    res.json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: safeUser
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current authenticated user profile
 */
const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true,
        createdAt: true,
        _count: {
          select: {
            playlists: true,
            likedSongs: true,
            savedAlbums: true,
            followedArtists: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout
 */
const logout = async (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully.'
  });
};

module.exports = {
  register,
  login,
  getMe,
  logout
};
