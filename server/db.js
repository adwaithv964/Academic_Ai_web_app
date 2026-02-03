const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '..', 'server_debug.log');
const log = (msg) => fs.appendFileSync(logFile, `[DB] ${new Date().toISOString()} ${msg}\n`);

const connectDB = async () => {
    try {
        log('Attempting to connect to MongoDB...');
        const mongoURI = process.env.SERVER_MONGO_URI || process.env.MONGO_URI;

        if (!mongoURI) {
            log('ERROR: No MONGO_URI found in env');
            throw new Error('No MONGO_URI in env');
        }

        const conn = await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000,
        });

        log(`MongoDB Connected: ${conn.connection.host}`);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        log(`Error: ${error.message}`);
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
