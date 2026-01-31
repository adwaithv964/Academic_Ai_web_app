const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: String,
    subject: String,
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    dueDate: String,
    type: String, // assignment, exam, etc.
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', TaskSchema);
