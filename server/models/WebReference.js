const mongoose = require('mongoose');

const WebReferenceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    url: { type: String, required: true },
    title: String,
    subject: String,
    type: { type: String, enum: ['video', 'article', 'documentation', 'other'], default: 'article' },
    dateAdded: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WebReference', WebReferenceSchema);
