const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
        type: String,
        enum: ['achievement', 'streak', 'course_completion', 'level_up', 'quest_complete'],
        required: true
    },
    title: { type: String, required: true },
    description: String,
    metadata: { type: Map, of: String }, // Flexible data (e.g., badgeId, courseName)
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);
