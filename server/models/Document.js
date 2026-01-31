const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
    name: String,
    type: String, // pdf, image, etc.
    size: Number,
    path: String, // URL or file path (if using local/s3)
    uploadDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Document', DocumentSchema);
