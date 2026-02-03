const mongoose = require('mongoose');

const TermSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: String, // e.g., "Fall 2023"
    startDate: Date,
    endDate: Date,
    defaultDuration: Number, // e.g., 60 minutes
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Term', TermSchema);
