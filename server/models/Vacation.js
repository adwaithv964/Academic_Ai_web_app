





const mongoose = require('mongoose');

const VacationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: String,
    startDate: Date,
    endDate: Date,
    days: Number,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vacation', VacationSchema);
