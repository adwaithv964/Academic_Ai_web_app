const SystemSettings = require('../models/SystemSettings');

const maintenance = async (req, res, next) => {
    try {
        // Exclude Admin routes and Auth routes from maintenance check
        if (req.path.startsWith('/api/admin') ||
            req.path.startsWith('/api/auth') ||
            req.path.startsWith('/api/public') ||
            req.path === '/api/user') { // Allow user profile fetch to determine role
            return next();
        }

        const settings = await SystemSettings.getInstance();

        if (settings.maintenanceMode) {
            // Check if user is admin (req.user is populated by auth middleware if token was present)
            if (req.user && req.user.role === 'admin') {
                return next();
            }

            return res.status(503).json({
                error: 'Service Unavailable',
                message: 'System is currently under maintenance. Please try again later.'
            });
        }

        next();
    } catch (error) {
        console.error("Maintenance Middleware Error:", error);
        next(); // Fail open if DB error
    }
};

module.exports = maintenance;
