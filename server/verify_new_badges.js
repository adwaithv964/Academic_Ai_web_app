const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const User = require('./models/User');
const StudySession = require('./models/StudySession');
const Task = require('./models/Task');
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
    await User.deleteOne({ email: 'new_badge_tester@test.com' });

    // Create new user
    // Mongoose might require password, so adding dummy password
    const user = new User({
        firstName: 'NewBadge',
        lastName: 'Tester',
        email: 'new_badge_tester@test.com',
        xp: 0,
        level: 1,
        password: 'password123',
        achievements: {}
    });

    await user.save();
    console.log("Created Test User ID:", user._id);

    mockReq.user._id = user._id;

    // 1. Initial State
    console.log("\n--- 1. Initial State ---");
    await achievementsController.getGamification(mockReq, mockRes);

    // 2. Simulate Early Riser (Bronze: 1 session < 8 AM)
    const earlySession = new StudySession({
        userId: user._id,
        startTime: '07:00', // 7 AM
        duration: 1,
        date: new Date().toISOString()
    });
    await earlySession.save();

    console.log("\n--- 2. After Early Session (Expect Early Riser Bronze) ---");
    await achievementsController.getGamification(mockReq, mockRes);

    // 3. Simulate Night Owl (Bronze: 1 session > 10 PM)
    const nightSession = new StudySession({
        userId: user._id,
        startTime: '23:00', // 11 PM
        duration: 1,
        date: new Date().toISOString()
    });
    await nightSession.save();

    console.log("\n--- 3. After Night Session (Expect Night Owl Bronze) ---");
    await achievementsController.getGamification(mockReq, mockRes);

    // 4. Simulate Task Master (Bronze: 10 tasks)
    const tasks = [];
    for (let i = 0; i < 10; i++) {
        tasks.push({
            userId: user._id,
            title: `Task ${i}`,
            completed: true
        });
    }
    await Task.insertMany(tasks);

    console.log("\n--- 4. After 10 Tasks (Expect Task Master Bronze) ---");
    await achievementsController.getGamification(mockReq, mockRes);

    // Clean up
    console.log("\n--- Cleanup ---");
    await User.deleteOne({ email: 'new_badge_tester@test.com' });
    await StudySession.deleteMany({ userId: user._id });
    await Task.deleteMany({ userId: user._id });

    console.log("Done.");
    process.exit();
}

verify();
