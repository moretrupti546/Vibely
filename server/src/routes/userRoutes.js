const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth } = require('../middleware/authMiddleware');

router.get('/me/library', requireAuth, userController.getUserLibrary);
router.patch('/me', requireAuth, userController.updateProfile);
router.get('/me/history', requireAuth, userController.getListeningHistory);
router.post('/me/likes/:songId', requireAuth, userController.toggleLikeSong);
router.post('/me/albums/:albumId', requireAuth, userController.toggleSaveAlbum);
router.post('/me/artists/:artistId', requireAuth, userController.toggleFollowArtist);

module.exports = router;
