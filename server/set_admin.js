/**
 * set_admin.js
 * ─────────────────────────────────────────────────────────────────
 * Promotes a user to the 'admin' role by their email address.
 *
 * Usage (run from the /server directory):
 *   node set_admin.js <email>
 *
 * Example:
 *   node set_admin.js cybershield929@gmail.com
 * ─────────────────────────────────────────────────────────────────
 */

const mongoose = require('mongoose');
const dns = require('dns');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Use reliable DNS servers (same fix as db.js for Windows Atlas SRV issues)
dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);

const User = require('./models/User');

const targetEmail = process.argv[2];

if (!targetEmail) {
    console.error('\n❌  No email provided.');
    console.error('   Usage: node set_admin.js <email>');
    console.error('   Example: node set_admin.js cybershield929@gmail.com\n');
    process.exit(1);
}

const run = async () => {
    const mongoURI = process.env.SERVER_MONGO_URI || process.env.MONGO_URI;

    if (!mongoURI) {
        console.error('\n❌  MONGO_URI is missing from your .env file.\n');
        process.exit(1);
    }

    try {
        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 10000,
            family: 4,
        });
        console.log('✅  Connected to MongoDB.');

        const user = await User.findOne({ email: targetEmail });

        if (!user) {
            console.error(`\n❌  No user found with email: ${targetEmail}`);
            console.error('    Make sure the user has signed up in the app at least once.\n');
            process.exit(1);
        }

        if (user.role === 'admin') {
            console.log(`\nℹ️   "${targetEmail}" is already an admin. No changes made.\n`);
            process.exit(0);
        }

        user.role = 'admin';
        await user.save();

        console.log(`\n🎉  Success! "${targetEmail}" has been promoted to admin.`);
        console.log(`    User ID  : ${user._id}`);
        console.log(`    Name     : ${user.firstName} ${user.lastName}`);
        console.log(`    New Role : ${user.role}\n`);
        process.exit(0);

    } catch (err) {
        console.error('\n❌  Error:', err.message, '\n');
        process.exit(1);
    }
};

run();
