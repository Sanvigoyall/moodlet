const express = require('express');
const router = express.Router();
const { getEntries, createEntry, deleteEntry } = require('../controllers/entryController');
const { protect } = require('../middleware/auth');

// All routes are protected — user must be logged in
router.get('/', protect, getEntries);
router.post('/', protect, createEntry);
router.delete('/:id', protect, deleteEntry);

module.exports = router;
