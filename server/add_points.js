





const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const addPoints = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || process.env.SERVER_MONGO_URI);
        console.log('Connected to DB');

        
        const users = await User.find({});
        console.log(`Found ${users.length} users.`);

        for (const user of users) {
            console.log(`User: ${user.firstName} ${user.lastName} | Points: ${user.points}`);
            user.points += 5000; 
            await user.save();
            console.log(`Updated points to ${user.points}`);
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

addPoints();
