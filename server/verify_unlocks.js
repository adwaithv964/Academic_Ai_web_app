const mongoose = require('mongoose');
const User = require('./models/User');
const Task = require('./models/Task');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const boostStats = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || process.env.SERVER_MONGO_URI);
        console.log('Connected to DB');

        const users = await User.find({});
        if (users.length === 0) {
            console.log('No users found.');
            process.exit(0);
        }

        const user = users[0]; // Just target the first user
        console.log(`Boosting stats for: ${user.firstName}`);

        // 1. Boost Level (Unlocks Golden Avatar, Grandmaster)
        user.level = 15; // Unlocks Golden Avatar (req 10)

        // 2. Boost Garden (Unlocks Nature Theme)
        if (!user.garden) user.garden = {};
        user.garden.level = 5; // Unlocks Nature Theme (req 3)

        // 3. Boost Streak (Unlocks Freeze)
        user.streak = 10; // Unlocks Streak Freeze (req 7)

        await user.save();
        console.log('User stats updated.');

        // 4. Boost Tasks (Unlocks Cyberpunk Theme)
        // We need to ensure there are 25 completed tasks.
        const currentTasks = await Task.countDocuments({ userId: user._id, status: 'completed' });
        const needed = 25 - currentTasks;

        if (needed > 0) {
            console.log(`Creating ${needed} completed dummy tasks...`);
            const dummyTasks = Array(needed).fill().map((_, i) => ({
                userId: user._id,
                title: `Verification Task ${i}`,
                status: 'completed',
                type: 'general',
                deadline: new Date()
            }));
            await Task.insertMany(dummyTasks);
        }

        console.log('Verification Setup Complete!');
        console.log('You should now be able to redeem: Nature Theme, Golden Avatar, Cyberpunk Theme.');
        console.log('Dark Mode requires study hours (check API logic for complexity), skipping for now.');

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

boostStats();
