const Entry = require('../models/Entry');

/**
 * @desc    Get all entries for logged-in user
 * @route   GET /api/entries
 * @access  Private
 */
const getEntries = async (req, res) => {
    try {
        const entries = await Entry.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, entries });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch entries.' });
    }
};

/**
 * @desc    Create a new journal entry
 * @route   POST /api/entries
 * @access  Private
 */
const createEntry = async (req, res) => {
    try {
        const { mood, moodLabel, color, border, textColor, text } = req.body;

        if (!mood || !text) {
            return res.status(400).json({ success: false, message: 'Mood and text are required.' });
        }

        const entry = await Entry.create({
            user: req.user._id,
            mood,
            moodLabel,
            color,
            border,
            textColor,
            text,
        });

        res.status(201).json({ success: true, entry });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to save entry.' });
    }
};

/**
 * @desc    Delete a journal entry
 * @route   DELETE /api/entries/:id
 * @access  Private
 */
const deleteEntry = async (req, res) => {
    try {
        const entry = await Entry.findById(req.params.id);

        if (!entry) {
            return res.status(404).json({ success: false, message: 'Entry not found.' });
        }

        // Make sure entry belongs to logged-in user
        if (entry.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this entry.' });
        }

        await entry.deleteOne();
        res.status(200).json({ success: true, message: 'Entry deleted.' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to delete entry.' });
    }
};

module.exports = { getEntries, createEntry, deleteEntry };
