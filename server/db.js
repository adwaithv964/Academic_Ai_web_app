
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dns = require('dns');

// Force Node.js to use Google/Cloudflare DNS instead of Windows system resolver.
// Windows DNS often fails to resolve MongoDB Atlas SRV records (_mongodb._tcp.*).
dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);

const logFile = path.join(__dirname, '..', 'server_debug.log');
const log = (msg) => fs.appendFileSync(logFile, `[DB] ${new Date().toISOString()} ${msg}\n`);

const connectDB = async (retries = 3) => {
    const mongoURI = process.env.SERVER_MONGO_URI || process.env.MONGO_URI;

    if (!mongoURI) {
        log('ERROR: No MONGO_URI found in env');
        console.error('\n❌ MONGO_URI is missing from your .env file.\n   Add MONGO_URI=<your atlas connection string> to the root .env\n');
        process.exit(1);
    }

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            log(`Attempt ${attempt}/${retries}: Connecting to MongoDB...`);
            console.log(`🔄 MongoDB connection attempt ${attempt}/${retries}...`);

            const conn = await mongoose.connect(mongoURI, {
                serverSelectionTimeoutMS: 10000,
                family: 4, // Force IPv4 — avoids IPv6 DNS resolution issues on Windows
            });

            log(`MongoDB Connected: ${conn.connection.host}`);
            console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
            return;
        } catch (error) {
            log(`Attempt ${attempt} failed: ${error.message}`);
            const isNetworkErr = error.message.includes('ECONNREFUSED') ||
                error.message.includes('querySrv') ||
                error.message.includes('ETIMEDOUT') ||
                error.message.includes('ENOTFOUND');

            if (isNetworkErr) {
                console.error(`\n❌ Cannot reach MongoDB Atlas (attempt ${attempt}/${retries}): ${error.message}`);
                console.error('   Possible causes:');
                console.error('   1. Your Atlas cluster is PAUSED → resume it at atlas.mongodb.com');
                console.error('   2. Your IP is not whitelisted → Atlas > Network Access > Add 0.0.0.0/0');
                console.error('   3. Firewall blocking outbound port 27017 or DNS SRV lookups\n');
            } else {
                console.error(`❌ MongoDB error: ${error.message}`);
            }

            if (attempt < retries) {
                const delay = attempt * 3000;
                console.log(`   Retrying in ${delay / 1000}s...`);
                await new Promise(r => setTimeout(r, delay));
            } else {
                console.error('   All connection attempts failed. Exiting.\n');
                process.exit(1);
            }
        }
    }
};

module.exports = connectDB;
