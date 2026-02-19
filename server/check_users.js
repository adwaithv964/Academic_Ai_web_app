





const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || process.env.SERVER_MONGO_URI);
        console.log('Connected to DB');

        const users = await User.find({});
        console.log(`Found ${users.length} users.`);

        users.forEach(user => {
            console.log(`User ID: ${user._id}`);
            console.log(`Name: ${user.firstName} ${user.lastName}`);
            console.log(`Email: ${user.email}`);
            console.log(`Points: ${user.points}`);
            console.log(`Inventory: ${user.inventory}`);
            console.log('---');
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkUsers();
