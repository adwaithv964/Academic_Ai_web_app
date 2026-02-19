





const mongoose = require('mongoose');

const PredictionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    courseName: String,
    currentGrade: Number,
    predictedGrade: Number,
    rangeLow: Number,
    rangeHigh: Number,
    studyDataSummary: Object, 
    aiAnalysis: Object, 
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Prediction', PredictionSchema);
