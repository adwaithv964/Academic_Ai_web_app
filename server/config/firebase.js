const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

let serviceAccount;

// DEBUG: Log environment status (Masked)
console.log("--- FIREBASE CONFIG DEBUG ---");
console.log("VITE_FIREBASE_PROJECT_ID:", process.env.VITE_FIREBASE_PROJECT_ID ? "Set" : "Missing");
console.log("FIREBASE_SERVICE_ACCOUNT:", process.env.FIREBASE_SERVICE_ACCOUNT ? "Set (Length: " + process.env.FIREBASE_SERVICE_ACCOUNT.length + ")" : "Missing");

try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        // Handle common formatting issues with env vars
        const rawConfig = process.env.FIREBASE_SERVICE_ACCOUNT.trim();
        serviceAccount = JSON.parse(rawConfig);

        // Fix newline characters in private_key if they are escaped literal "\n"
        if (serviceAccount.private_key && serviceAccount.private_key.includes('\\n')) {
            serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
        }
        console.log("Service Account parsed successfully. Project ID from JSON:", serviceAccount.project_id);
    } else {
        console.log("Using Default Credentials (no SERVICE_ACCOUNT env var provided)");
    }
} catch (e) {
    console.error("CRITICAL: Failed to parse FIREBASE_SERVICE_ACCOUNT json:", e.message);
}

const firebaseConfig = {
    // FALLBACK: Use the known project ID if env var is missing.
    // This fixes "Unable to detect a Project Id" if verifyIdToken is used without a service account.
    projectId: process.env.VITE_FIREBASE_PROJECT_ID || (serviceAccount && serviceAccount.project_id) || 'academic-result-predictor-auth',
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
