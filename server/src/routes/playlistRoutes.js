const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlistController');
const { optionalAuth, requireAuth } = require('../middleware/authMiddleware');
const { playlistValidation } = require('../middleware/validationMiddleware');

router.get('/', playlistController.getAllPlaylists);
router.get('/:id', optionalAuth, playlistController.getPlaylistById);
router.post('/', requireAuth, playlistValidation, playlistController.createPlaylist);
router.patch('/:id', requireAuth, playlistController.updatePlaylist);
router.delete('/:id', requireAuth, playlistController.deletePlaylist);
router.post('/:id/tracks', requireAuth, playlistController.addTrackToPlaylist);
router.delete('/:id/tracks/:trackId', requireAuth, playlistController.removeTrackFromPlaylist);

module.exports = router;
