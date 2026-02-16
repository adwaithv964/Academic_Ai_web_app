const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const User = require('./models/User');
const StudySession = require('./models/StudySession');
const achievementsController = require('./controllers/achievementsController');
const connectDB = require('./db');

// Mock Request/Response
const mockReq = {
    user: { _id: null }
};

const mockRes = {
    json: (data) => console.log(JSON.stringify(data, null, 2)),
    status: (code) => {
        console.log(`Status: ${code}`);
        return { json: (data) => console.log(`Error ${code}:`, data) }
    }
};

async function verify() {
    await connectDB(); // Connect DB

    // Create a dummy user for testing
    // Cleanup first
    await User.deleteOne({ email: 'badge_tester@test.com' });

    // Create new user
    // Note: Mongoose models might have validation, so ensure fields are valid
    const user = new User({
        firstName: 'Badge',
        lastName: 'Tester',
        email: 'badge_tester@test.com',
        xp: 0,
        level: 1,
        password: 'password123', // Dummy
        achievements: {}
    });

    await user.save();
    console.log("Created Test User ID:", user._id);

    mockReq.user._id = user._id;

    // 1. Initial State
    console.log("\n--- 1. Initial State (Should be locked) ---");
    await achievementsController.getGamification(mockReq, mockRes);

    // 2. Simulate Marathoner (Bronze: >4 hours session)
    // My refactor checks: if (maxSingleSession >= 240) which is 4 hours in minutes.
    // Create a 5 hour session (300 mins)
    const session1 = new StudySession({
        userId: user._id,
        subject: 'Math',
        topic: 'Algebra',
        startTime: '10:00',
        duration: 5, // 5 hours
        date: new Date().toISOString(),
        type: 'study'
    });
    await session1.save();

    console.log("\n--- 2. After 5h Session (Expect Marathoner Bronze) ---");
    await achievementsController.getGamification(mockReq, mockRes);

    // 3. Simulate Focus Master (Bronze: ? sessions)
    // My code doesn't specify threshold for bronze, let's check config.
    // Config: bronze: { threshold: 10, reward: 0 }
    // Let's create 10 Focus sessions.
    const focusSessions = [];
    for (let i = 0; i < 10; i++) {
        focusSessions.push({
            userId: user._id,
            subject: 'Coding',
            topic: 'Node',
            startTime: '10:00',
            duration: 1,
            type: 'Focus', // Matches my check: s.type === 'Focus'
            date: new Date().toISOString()
        });
    }
    await StudySession.insertMany(focusSessions);

    console.log("\n--- 3. After 10 Focus Sessions (Expect Focus Master Bronze) ---");
    await achievementsController.getGamification(mockReq, mockRes);

    // Clean up
    console.log("\n--- Cleanup ---");
    await User.deleteOne({ email: 'badge_tester@test.com' });
    await StudySession.deleteMany({ userId: user._id });

    console.log("Done.");
    process.exit();
}

verify();
