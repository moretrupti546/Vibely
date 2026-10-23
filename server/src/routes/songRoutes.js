const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');
const { optionalAuth, requireAuth } = require('../middleware/authMiddleware');

router.get('/', optionalAuth, songController.getAllSongs);
router.get('/trending', optionalAuth, songController.getTrendingSongs);
router.get('/search', optionalAuth, songController.searchAll);
router.get('/:id', optionalAuth, songController.getSongById);
router.post('/:id/play', optionalAuth, songController.recordPlay);

module.exports = router;
