const mongoose = require('mongoose');

const PredictionSchema = new mongoose.Schema({
    courseName: String,
    currentGrade: Number,
    predictedGrade: Number,
    rangeLow: Number,
    rangeHigh: Number,
    studyDataSummary: Object, // Store snapshot of study input
    aiAnalysis: Object, // { insights, riskAssessment, actionPlan }
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Prediction', PredictionSchema);
