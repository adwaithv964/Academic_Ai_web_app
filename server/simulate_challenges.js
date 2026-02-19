





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

        
        

        
        console.log('Creating Night Owl Session...');
        const nightSession = new StudySession({
            userId: user._id,
            startTime: new Date().setHours(3, 0, 0, 0), 
            endTime: new Date().setHours(4, 0, 0, 0),
            duration: 60,
            subject: 'Late Night Coding'
        });
        await nightSession.save();

        
        
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
                type: 'coding', 
                deadline: new Date()
            }));
            await Task.insertMany(codingTasks);
        }

        
        
        console.log('Creating Weekend Session...');
        const lastSunday = new Date();
        lastSunday.setDate(lastSunday.getDate() - (lastSunday.getDay() + 7) % 7); 
        const weekendSession = new StudySession({
            userId: user._id,
            startTime: lastSunday.setHours(10, 0, 0, 0),
            endTime: lastSunday.setHours(20, 0, 0, 0),
            duration: 600, 
            subject: 'Weekend Marathon'
        });
        await weekendSession.save();

        
        user.streak = 7;
        await user.save();

        
        
        console.log('Simulating Daily Quests...');

        
        if (user.updateQuestProgress) {
            await user.updateQuestProgress('exam_completed', 1);
            console.log('- Exam Quest Updated');

            
            await user.updateQuestProgress('study_minutes', 120);
            console.log('- Study Quest Updated (120m)');

            
            await user.updateQuestProgress('tasks_completed', 5);
            console.log('- Task Quest Updated (5 tasks)');

            
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
