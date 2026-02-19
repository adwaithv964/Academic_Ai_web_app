





const mongoose = require('mongoose');

const TermSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: String, 
    startDate: Date,
    endDate: Date,
    defaultDuration: Number, 
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Term', TermSchema);
