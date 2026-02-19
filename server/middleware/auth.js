





const admin = require('../config/firebase');
const User = require('../models/User');
const SystemSettings = require('../models/SystemSettings');

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
        

        
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { uid, email, firebase } = decodedToken;

        
        let user = await User.findOne({ email: email });

        if (!user) {
            
            const settings = await SystemSettings.getInstance();
            if (!settings.allowRegistration) {
                return res.status(403).json({ error: 'Registration is currently disabled.' });
            }

            
            
            console.log(`Creating new user for ${email} from Auth Middleware`);
            user = new User({
                email,
                firstName: firebase.identities?.['google.com']?.[0]?.displayName || 'New',
                lastName: 'User',
                authUid: uid 
            });
            await user.save();
        } else {
            
            if (!user.authUid) {
                user.authUid = uid;
                await user.save();
            }
        }

        
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
