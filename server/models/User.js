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

    // Identity
    authUid: { type: String, unique: true, sparse: true, index: true },

    // Gamification - Core Stats
    lastActiveDate: { type: Date }, // For streak calculation
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },

    // Gamification - Config
    points: { type: Number, default: 0, index: true },
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
    },

    preferences: {
        notifications: {
            deadlineReminders: { type: Boolean, default: true },
            gradeUpdates: { type: Boolean, default: true },
            peerHelpResponses: { type: Boolean, default: true },
            studySessionReminders: { type: Boolean, default: true },
            weeklyProgressReports: { type: Boolean, default: false },
            emailNotifications: { type: Boolean, default: true },
            pushNotifications: { type: Boolean, default: true },
            smsNotifications: { type: Boolean, default: false }
        },
        display: {
            language: { type: String, default: "en" },
            timezone: { type: String, default: "Asia/Kolkata" },
            dateFormat: { type: String, default: "MM/DD/YYYY" },
            timeFormat: { type: String, default: "12" },
            defaultView: { type: String, default: "overview" },
            showQuickStats: { type: Boolean, default: true },
            showUpcomingDeadlines: { type: Boolean, default: true },
            showRecentGrades: { type: Boolean, default: true },
            compactMode: { type: Boolean, default: false }
        },
        privacy: {
            profileVisibility: { type: String, default: "friends" },
            progressSharing: { type: Boolean, default: true },
            studyGroupVisibility: { type: Boolean, default: true },
            allowPeerMessages: { type: Boolean, default: true }
        }
    }
});

module.exports = mongoose.model('User', UserSchema);
