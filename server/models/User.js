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
    createdAt: { type: Date, default: Date.now },

    // Gamification - Core Stats
    lastActiveDate: { type: Date }, // For streak calculation
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },

    // Gamification - Config
    points: { type: Number, default: 0 },
    totalPoints: { type: Number, default: 0 },

    inventory: [{ type: String }], // IDs of bought items

    achievements: {
        type: Map,
        of: {
            progress: { type: Number, default: 0 },
            tier: { type: String, enum: ['locked', 'bronze', 'silver', 'gold'], default: 'locked' },
            unlockedAt: Date
        },
        default: {}
    },

    quests: {
        daily: [{
            id: String,
            progress: { type: Number, default: 0 },
            completed: { type: Boolean, default: false },
            claimed: { type: Boolean, default: false }
        }],
        weekly: [{
            id: String,
            progress: { type: Number, default: 0 },
            completed: { type: Boolean, default: false },
            claimed: { type: Boolean, default: false }
        }],
        lastGenerated: Date
    },

    garden: {
        plants: [{
            type: { type: String }, // e.g., 'tree', 'flower'
            stage: { type: Number, default: 1 }, // 1-3 growth stages
            plantedAt: Date
        }],
        unlockedThemes: [{ type: String }] // 'default', 'night', etc.
    },

    academicSettings: {
        currentGPA: String,
        targetGPA: String,
        gpaScale: { type: String, default: '10.0' },
        creditHours: String,
        completedHours: String,
        gradeWeighting: String,
        semesterSystem: String,
        academicYear: String,
        courseCatalogIntegration: Boolean
    }
});

module.exports = mongoose.model('User', UserSchema);
