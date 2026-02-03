const mongoose = require('mongoose');

const ScenarioSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: String,
    description: String,
    projectedGPA: Number,
    courses: [{
        name: String,
        credits: Number,
        grade: String, // Projected grade
        isNewCourse: Boolean
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Scenario', ScenarioSchema);
