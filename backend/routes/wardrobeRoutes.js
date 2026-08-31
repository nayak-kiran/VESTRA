const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  addToWardrobe,
  getWardrobe,
  removeFromWardrobe,
} = require('../controllers/wardrobeController');

router.post('/', protect, addToWardrobe);
router.get('/', protect, getWardrobe);
router.delete('/:id', protect, removeFromWardrobe);

module.exports = router;