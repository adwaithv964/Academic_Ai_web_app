const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') }); // Attempt root .env first
if (!process.env.MONGO_URI && !process.env.SERVER_MONGO_URI) {
    // Fallback to server/.env if root fails or specific var missing
    dotenv.config({ path: path.join(__dirname, '../server/.env') });
}

const User = require('../server/models/User'); // Adjust path to models

const makeAdmin = async () => {
    const email = process.argv[2];

    if (!email) {
        console.error('Please provide an email address.');
        console.log('Usage: node scripts/makeAdmin.js <email>');
        process.exit(1);
    }

    try {
        const mongoURI = process.env.SERVER_MONGO_URI || process.env.MONGO_URI;
        if (!mongoURI) {
            throw new Error("Mongo URI not found in .env");
        }

        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB...');

        const user = await User.findOne({ email });

        if (!user) {
            console.error(`User with email ${email} not found.`);
            process.exit(1);
        }

        if (user.role === 'admin') {
            console.log(`User ${email} is already an admin.`);
        } else {
            user.role = 'admin';
            await user.save();
            console.log(`Successfully promoted ${email} to ADMIN.`);
        }

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

makeAdmin();
