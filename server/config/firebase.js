





const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

let serviceAccount;


console.log("--- FIREBASE CONFIG DEBUG ---");
console.log("VITE_FIREBASE_PROJECT_ID:", process.env.VITE_FIREBASE_PROJECT_ID ? "Set" : "Missing");
console.log("FIREBASE_SERVICE_ACCOUNT:", process.env.FIREBASE_SERVICE_ACCOUNT ? "Set (Length: " + process.env.FIREBASE_SERVICE_ACCOUNT.length + ")" : "Missing");

try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        
        const rawConfig = process.env.FIREBASE_SERVICE_ACCOUNT.trim();
        serviceAccount = JSON.parse(rawConfig);

        
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
    
    
    projectId: process.env.VITE_FIREBASE_PROJECT_ID || (serviceAccount && serviceAccount.project_id) || 'academic-result-predictor-auth',
    credential: serviceAccount
        ? admin.credential.cert(serviceAccount)
        : admin.credential.applicationDefault()
};


if (!admin.apps.length) {
    admin.initializeApp(firebaseConfig);
    console.log("Firebase Admin Initialized");
}

module.exports = admin;
