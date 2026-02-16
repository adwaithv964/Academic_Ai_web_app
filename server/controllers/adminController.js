const User = require('../models/User');
const Task = require('../models/Task');
const StudySession = require('../models/StudySession');
const Course = require('../models/Course');
const Exam = require('../models/Exam');
const Vacation = require('../models/Vacation');
const ActivityLog = require('../models/ActivityLog');
const Document = require('../models/Document');
const WebReference = require('../models/WebReference');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();

        // Active users in last 24h (using lastActiveDate if available, else approximate from updated users)
        // Since lastActiveDate was just added, we might not have it for everyone.
        const oneDayAgo = new Date(new Date() - 24 * 60 * 60 * 1000);
        const activeUsers = await User.countDocuments({
            $or: [
                { lastActiveDate: { $gte: oneDayAgo } },
                { updatedAt: { $gte: oneDayAgo } } // Fallback
            ]
        });

        const totalSessions = await StudySession.countDocuments();
        const totalTasks = await Task.countDocuments();

        // Calculate total study time across all users
        const sessions = await StudySession.find({}, 'duration');
        const totalStudyHours = sessions.reduce((acc, curr) => acc + (curr.duration || 0), 0);

        res.json({
            totalUsers,
            activeUsers,
            totalSessions,
            totalTasks,
            totalStudyHours: Math.round(totalStudyHours * 10) / 10
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const pageSize = 20;
        const page = Number(req.query.pageNumber) || 1;

        const keyword = req.query.keyword ? {
            $or: [
                { firstName: { $regex: req.query.keyword, $options: 'i' } },
                { lastName: { $regex: req.query.keyword, $options: 'i' } },
                { email: { $regex: req.query.keyword, $options: 'i' } },
            ]
        } : {};

        const count = await User.countDocuments({ ...keyword });
        const users = await User.find({ ...keyword })
            .select('-password -__v') // Exclude sensitive/unnecessary
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .sort({ createdAt: -1 });

        res.json({ users, page, pages: Math.ceil(count / pageSize) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    Get user details by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Parallel fetch for speed
        const [tasks, sessions, courses, exams, documents, webRefs] = await Promise.all([
            Task.find({ userId: user._id }).sort({ createdAt: -1 }).limit(50),
            StudySession.find({ userId: user._id }).sort({ date: -1 }).limit(50),
            Course.find({ userId: user._id }),
            Exam.find({ userId: user._id }),
            Document.find({ userId: user._id }).select('name subject type size uploadDate'),
            WebReference.find({ userId: user._id })
        ]);

        res.json({
            user,
            stats: {
                tasksCount: await Task.countDocuments({ userId: user._id }),
                sessionsCount: await StudySession.countDocuments({ userId: user._id }),
                coursesCount: courses.length,
                examsCount: exams.length,
                documentsCount: documents.length,
                webRefsCount: webRefs.length
            },
            recentData: {
                tasks,
                sessions,
                courses,
                exams,
                documents,
                webRefs
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Clean up related data (Cascading delete manually)
        await Promise.all([
            Task.deleteMany({ userId: user._id }),
            StudySession.deleteMany({ userId: user._id }),
            Course.deleteMany({ userId: user._id }),
            Exam.deleteMany({ userId: user._id }),
            Vacation.deleteMany({ userId: user._id }),
            ActivityLog.deleteMany({ userId: user._id }),
            Document.deleteMany({ userId: user._id }),
            WebReference.deleteMany({ userId: user._id }),
            User.deleteOne({ _id: user._id })
        ]);

        res.json({ message: 'User removed' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const SystemSettings = require('../models/SystemSettings');
const GlobalCourse = require('../models/GlobalCourse');

// @desc    Get system settings
// @route   GET /api/admin/settings
// @access  Private/Admin
const getSystemSettings = async (req, res) => {
    try {
        const settings = await SystemSettings.getInstance();
        res.json(settings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    Update system settings
// @route   PUT /api/admin/settings
// @access  Private/Admin
const updateSystemSettings = async (req, res) => {
    try {
        const settings = await SystemSettings.getInstance();

        if (req.body.maintenanceMode !== undefined) settings.maintenanceMode = req.body.maintenanceMode;
        if (req.body.allowRegistration !== undefined) settings.allowRegistration = req.body.allowRegistration;
        if (req.body.systemEmail !== undefined) settings.systemEmail = req.body.systemEmail;

        const updatedSettings = await settings.save();

        // Log the event
        await createSystemLog(
            'WARNING',
            'System Settings Updated',
            req.user?._id,
            req.ip,
            { changedInfo: "Maintenance/Registration/Email updated" }
        );

        res.json(updatedSettings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    Get all global courses
// @route   GET /api/admin/content/courses
// @access  Private/Admin
const getGlobalCourses = async (req, res) => {
    try {
        const keyword = req.query.keyword ? {
            $or: [
                { name: { $regex: req.query.keyword, $options: 'i' } },
                { code: { $regex: req.query.keyword, $options: 'i' } },
            ]
        } : {};

        const courses = await GlobalCourse.find({ ...keyword }).sort({ code: 1 });
        res.json(courses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    Add a global course
// @route   POST /api/admin/content/courses
// @access  Private/Admin
const addGlobalCourse = async (req, res) => {
    try {
        const { code, name, credits, description, department } = req.body;

        const existing = await GlobalCourse.findOne({ code: code.toUpperCase() });
        if (existing) {
            return res.status(400).json({ error: 'Course with this code already exists' });
        }

        const course = new GlobalCourse({
            code,
            name,
            credits,
            description,
            department
        });

        const createdCourse = await course.save();

        await createSystemLog('SUCCESS', `Global Course Added: ${code}`, req.user?._id, req.ip);

        res.status(201).json(createdCourse);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    Update a global course
// @route   PUT /api/admin/content/courses/:id
// @access  Private/Admin
const updateGlobalCourse = async (req, res) => {
    try {
        const { name, credits, description, department } = req.body;

        const course = await GlobalCourse.findById(req.params.id);
        if (!course) return res.status(404).json({ error: 'Course not found' });

        course.name = name || course.name;
        course.credits = credits || course.credits;
        course.description = description || course.description;
        course.department = department || course.department;

        const updatedCourse = await course.save();
        res.json(updatedCourse);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    Delete a global course
// @route   DELETE /api/admin/content/courses/:id
// @access  Private/Admin
const deleteGlobalCourse = async (req, res) => {
    try {
        const course = await GlobalCourse.findById(req.params.id);
        if (!course) return res.status(404).json({ error: 'Course not found' });

        await GlobalCourse.deleteOne({ _id: req.params.id });

        await createSystemLog('WARNING', `Global Course Deleted: ${course.code}`, req.user?._id, req.ip);

        res.json({ message: 'Course removed' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const SystemLog = require('../models/SystemLog');

// Helper to create logs
const createSystemLog = async (level, message, userId = null, ip = null, details = {}) => {
    try {
        await SystemLog.create({
            level,
            message,
            userId,
            ip,
            details
        });
    } catch (err) {
        console.error("Failed to write system log:", err);
    }
};

// @desc    Get system logs
// @route   GET /api/admin/logs
// @access  Private/Admin
const getSystemLogs = async (req, res) => {
    try {
        // Simple pagination or limit
        const limit = parseInt(req.query.limit) || 50;
        const logs = await SystemLog.find()
            .sort({ timestamp: -1 })
            .limit(limit)
            .populate('userId', 'firstName lastName email'); // Populate user info if available

        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ... existing code ...

module.exports = {
    getDashboardStats,
    getAllUsers,
    getUserDetails,
    deleteUser,
    getSystemSettings,
    updateSystemSettings,
    getGlobalCourses,
    addGlobalCourse,
    updateGlobalCourse,
    deleteGlobalCourse,
    getSystemLogs,
    createSystemLog // Exporting helper for use in other files if needed, or just internal use
};
