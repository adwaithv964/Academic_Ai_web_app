const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    description: String,
    date: { type: Date, required: true },
    time: String,
    color: { type: String, default: 'bg-blue-100 text-blue-700 border-blue-200' }, // Default pastel blue
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', EventSchema);
