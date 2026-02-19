





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

    
    authUid: { type: String, unique: true, sparse: true, index: true },

    
    lastActiveDate: { type: Date }, 
    streak: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },

    
    points: { type: Number, default: 0, index: true },
    totalPoints: { type: Number, default: 0 },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },

    inventory: [{ type: String }], 

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
        level: { type: Number, default: 1 }, 
        plants: [{
            type: { type: String }, 
            stage: { type: Number, default: 1 }, 
            plantedAt: Date
        }],
        unlockedThemes: [{ type: String }] 
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
            compactMode: { type: Boolean, default: false },
            activeTheme: { type: String, default: 'default' }
        },
        privacy: {
            profileVisibility: { type: String, default: "friends" },
            progressSharing: { type: Boolean, default: true },
            studyGroupVisibility: { type: Boolean, default: true },
            allowPeerMessages: { type: Boolean, default: true }
        }
    }
});


UserSchema.methods.updateQuestProgress = async function (type, amount = 1) {
    
    const { DAILY_QUESTS_POOL } = require('../config/gamification');

    if (!this.quests || !this.quests.daily) return;

    let modified = false;
    this.quests.daily.forEach(quest => {
        const poolItem = DAILY_QUESTS_POOL.find(p => p.id === quest.id);
        if (poolItem && poolItem.type === type) {
            
            if (!quest.completed) {
                quest.progress += amount;
                if (quest.progress >= poolItem.target) {
                    quest.progress = poolItem.target;
                    quest.completed = true;
                    
                }
                modified = true;
            }
        }
    });

    if (modified) {
        await this.save();
    }
};

module.exports = mongoose.model('User', UserSchema);
