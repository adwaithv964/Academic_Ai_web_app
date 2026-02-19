const mongoose = require('mongoose');

const StudySessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    subject: String,
    topic: String,
    date: { type: String, index: true }, // ISO String
    startTime: String,
    duration: Number, // in HOURS (actual)
    plannedDuration: Number, // in minutes (goal)
    priority: String,
    type: String, // study, review, etc.
    location: String,
    notes: String,
    isCompleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StudySession', StudySessionSchema);
