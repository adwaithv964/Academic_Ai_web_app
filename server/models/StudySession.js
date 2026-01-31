const mongoose = require('mongoose');

const StudySessionSchema = new mongoose.Schema({
    subject: String,
    topic: String,
    date: String, // ISO String
    startTime: String,
    duration: Number, // in hours
    priority: String,
    type: String, // study, review, etc.
    location: String,
    notes: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StudySession', StudySessionSchema);
