const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

let serviceAccount;
try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    }
} catch (e) {
    console.warn("Failed to parse FIREBASE_SERVICE_ACCOUNT json:", e.message);
}

const firebaseConfig = {
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
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
