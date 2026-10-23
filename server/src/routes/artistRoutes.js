const express = require('express');
const router = express.Router();
const artistController = require('../controllers/artistController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.get('/', artistController.getAllArtists);
router.get('/:id', optionalAuth, artistController.getArtistById);

module.exports = router;
