const mongoose = require('mongoose');

const VacationSchema = new mongoose.Schema({
    name: String,
    startDate: Date,
    endDate: Date,
    days: Number,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vacation', VacationSchema);
