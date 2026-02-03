const mongoose = require('mongoose');

const EisenhowerTaskSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    quad: { type: Number, required: true, enum: [1, 2, 3, 4] },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EisenhowerTask', EisenhowerTaskSchema);
