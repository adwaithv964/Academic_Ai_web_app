const mongoose = require('mongoose');

const EisenhowerTaskSchema = new mongoose.Schema({
    text: { type: String, required: true },
    quad: { type: Number, required: true, enum: [1, 2, 3, 4] },
    userId: { type: String, required: false }, // Optional for future multi-user support
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EisenhowerTask', EisenhowerTaskSchema);
