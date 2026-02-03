const admin = require('../config/firebase');
const User = require('../models/User');

/**
 * Middleware to verify Firebase ID token and attach user to request
 */
const authenticateUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }

        const idToken = authHeader.split('Bearer ')[1];

        // 1. Verify Token with Firebase
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { uid, email, firebase } = decodedToken;

        // 2. Find or Create User in MongoDB
        // We strictly find by email or firebase UID. 
        // Ideally, we store the firebase UID in the DB.

        // Try finding by email first (migration friendly)
        let user = await User.findOne({ email: email });

        // If not found, try finding by a customized googleId/firebaseId if you have one.
        // For now, let's assume email is the unique identifier link.

        if (!user) {
            // Option: Auto-create user or reject?
            // Let's auto-create to be safe for new signups logic flow
            console.log(`Creating new user for ${email} from Auth Middleware`);
            user = new User({
                email,
                firstName: firebase.identities?.['google.com']?.[0]?.displayName || 'New',
                lastName: 'User',
                authUid: uid // We should save the UID
            });
            await user.save();
        } else {
            // Ensure authUid is set for future stability
            if (!user.authUid) {
                user.authUid = uid;
                await user.save();
            }
        }

        // 3. Attach to request
        req.user = user;
        next();

    } catch (error) {
        console.error('Auth Middleware Error:', error);
        if (error.code === 'auth/id-token-expired') {
            return res.status(401).json({ error: 'Unauthorized: Token expired' });
        }
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

module.exports = authenticateUser;
