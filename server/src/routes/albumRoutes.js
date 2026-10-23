const express = require('express');
const router = express.Router();
const albumController = require('../controllers/albumController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.get('/', albumController.getAllAlbums);
router.get('/:id', optionalAuth, albumController.getAlbumById);

module.exports = router;
