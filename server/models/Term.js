const mongoose = require('mongoose');

const TermSchema = new mongoose.Schema({
    name: String, // e.g., "Fall 2023"
    startDate: Date,
    endDate: Date,
    defaultDuration: Number, // e.g., 60 minutes
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Term', TermSchema);
