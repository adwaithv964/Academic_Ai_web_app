const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    name: String,
    code: String,
    credits: Number,
    instructor: String,
    grade: String, // Current letter grade or percentage
    term: String,
    color: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', CourseSchema);
