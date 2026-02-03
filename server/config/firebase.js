const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

let serviceAccount;
try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        // Handle common formatting issues with env vars
        const rawConfig = process.env.FIREBASE_SERVICE_ACCOUNT.trim();
        serviceAccount = JSON.parse(rawConfig);

        // Fix newline characters in private_key if they are escaped literal "\n"
        if (serviceAccount.private_key && serviceAccount.private_key.includes('\\n')) {
            serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
        }
    } else {
        console.warn("WARNING: FIREBASE_SERVICE_ACCOUNT environment variable is not set.");
    }
} catch (e) {
    console.error("CRITICAL: Failed to parse FIREBASE_SERVICE_ACCOUNT json:", e.message);
}

const firebaseConfig = {
    projectId: process.env.VITE_FIREBASE_PROJECT_ID || (serviceAccount && serviceAccount.project_id),
    credential: serviceAccount
        ? admin.credential.cert(serviceAccount)
        : admin.credential.applicationDefault()
};

// Initialize only once
if (!admin.apps.length) {
    admin.initializeApp(firebaseConfig);
    console.log("Firebase Admin Initialized");
}

module.exports = admin;
