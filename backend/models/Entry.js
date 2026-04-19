const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        mood: {
            type: String,
            required: [true, 'Mood is required'],
        },
        moodLabel: { type: String },
        color: { type: String },
        border: { type: String },
        textColor: { type: String },
        text: {
            type: String,
            required: [true, 'Entry text is required'],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Entry', entrySchema);
