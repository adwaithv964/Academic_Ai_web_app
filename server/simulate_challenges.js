const mongoose = require('mongoose');
const User = require('./models/User');
const Task = require('./models/Task');
const StudySession = require('./models/StudySession');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const simulateChallenges = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || process.env.SERVER_MONGO_URI);
        console.log('Connected to DB');

        const users = await User.find({});
        if (users.length === 0) { console.log('No users found.'); process.exit(0); }
        const user = users[0];
        console.log(`Simulating for: ${user.firstName}`);

        // 1. CLEAR INVENTORY (Remove old themes if any, to test fresh)
        // user.inventory = []; 

        // 2. SIMULATE NIGHT OWL (Session between 2 AM and 5 AM)
        console.log('Creating Night Owl Session...');
        const nightSession = new StudySession({
            userId: user._id,
            startTime: new Date().setHours(3, 0, 0, 0), // Today at 3 AM
            endTime: new Date().setHours(4, 0, 0, 0),
            duration: 60,
            subject: 'Late Night Coding'
        });
        await nightSession.save();

        // 3. SIMULATE CODE MASTER (50 Coding Tasks)
        // Check existing count
        const currentCoding = await Task.countDocuments({
            userId: user._id,
            status: 'completed',
            $or: [{ type: 'coding' }, { title: { $regex: 'code', $options: 'i' } }]
        });
        const neededCoding = 50 - currentCoding;
        if (neededCoding > 0) {
            console.log(`Creating ${neededCoding} coding tasks...`);
            const codingTasks = Array(neededCoding).fill().map((_, i) => ({
                userId: user._id,
                title: `Coding Challenge Task ${i}`,
                status: 'completed',
                type: 'coding', // Ensure 'coding' is treated as type if your schema supports it, or it falls back
                deadline: new Date()
            }));
            await Task.insertMany(codingTasks);
        }

        // 4. SIMULATE WEEKEND WARRIOR (10 Hours on Weekend)
        // Create a massive session on last Sunday
        console.log('Creating Weekend Session...');
        const lastSunday = new Date();
        lastSunday.setDate(lastSunday.getDate() - (lastSunday.getDay() + 7) % 7); // Go back to Sunday
        const weekendSession = new StudySession({
            userId: user._id,
            startTime: lastSunday.setHours(10, 0, 0, 0),
            endTime: lastSunday.setHours(20, 0, 0, 0),
            duration: 600, // 10 hours
            subject: 'Weekend Marathon'
        });
        await weekendSession.save();

        // 5. STREAK
        user.streak = 7;
        await user.save();

        // 6. SIMULATE DAILY QUESTS (New Features)
        // We'll call the method directly to verify logic
        console.log('Simulating Daily Quests...');

        // "Ace the Test"
        if (user.updateQuestProgress) {
            await user.updateQuestProgress('exam_completed', 1);
            console.log('- Exam Quest Updated');

            // "Deep Work" (120 mins)
            await user.updateQuestProgress('study_minutes', 120);
            console.log('- Study Quest Updated (120m)');

            // "Task Force" (5 tasks)
            await user.updateQuestProgress('tasks_completed', 5);
            console.log('- Task Quest Updated (5 tasks)');

            // "Laser Focus"
            await user.updateQuestProgress('focus_session', 1);
            console.log('- Focus Quest Updated');
        } else {
            console.error("ERROR: updateQuestProgress method not found on User model!");
        }

        console.log('Simulation Complete! You should be able to claim ALL rewards now.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

simulateChallenges();
