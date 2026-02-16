const mongoose = require('mongoose');

const globalCourseSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    credits: {
        type: Number,
        required: true,
        min: 0,
        max: 20
    },
    description: {
        type: String,
        default: ''
    },
    department: {
        type: String,
        default: 'General' // e.g., CS, Math, Physics
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('GlobalCourse', globalCourseSchema);
