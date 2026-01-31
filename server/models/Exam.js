const mongoose = require('mongoose');

const ExamSchema = new mongoose.Schema({
    subject: String,
    date: Date,
    time: String,
    location: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Exam', ExamSchema);
