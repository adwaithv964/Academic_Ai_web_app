const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    studentId: String,
    institution: String,
    major: String,
    graduationYear: String,
    phone: String,
    dateOfBirth: String,
    address: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
