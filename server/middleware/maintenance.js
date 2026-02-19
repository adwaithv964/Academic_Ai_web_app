





const SystemSettings = require('../models/SystemSettings');

const maintenance = async (req, res, next) => {
    try {
        
        if (req.path.startsWith('/api/admin') ||
            req.path.startsWith('/api/auth') ||
            req.path.startsWith('/api/public') ||
            req.path === '/api/user') { 
            return next();
        }

        const settings = await SystemSettings.getInstance();

        if (settings.maintenanceMode) {
            
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
        next(); 
    }
};

module.exports = maintenance;
