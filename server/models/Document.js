const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    subject: String,
    type: { type: String, enum: ['note', 'paper', 'syllabus', 'assignment', 'other'], default: 'other' },
    size: String,
    data: Buffer, // Storing file directly in Mongo for simplicity as requested
    contentType: String,
    uploadDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Document', DocumentSchema);
