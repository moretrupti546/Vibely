const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

/**
 * Middleware to protect routes that require authentication
 */
const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.'
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authorization token.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'vibely_jwt_secret_dev_key');
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        bio: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Account not found. Please log in again.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Session expired. Please log in again.'
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid token. Authorization failed.'
    });
  }
};

/**
 * Optional authentication: attaches user if token is present, continues anyway if not
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'vibely_jwt_secret_dev_key');
        const user = await prisma.user.findUnique({
          where: { id: decoded.userId },
          select: { id: true, email: true, name: true, avatar: true }
        });
        if (user) {
          req.user = user;
        }
      }
    }
    next();
  } catch (err) {
    // Continue unauthenticated if token verification fails
    next();
  }
};

module.exports = {
  requireAuth,
  optionalAuth
};
