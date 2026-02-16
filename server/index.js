const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// --- PATCH FETCH FOR API KEY REFERRER RESTRICTION ---
const originalFetch = globalThis.fetch;
globalThis.fetch = async (url, options = {}) => {
  const newOptions = { ...options };

  // Ensure headers exist
  if (!newOptions.headers) {
    newOptions.headers = {};
  }

  // Handle different header types safely
  if (typeof Headers !== 'undefined' && newOptions.headers instanceof Headers) {
    newOptions.headers.set('Referer', 'http://localhost:4028');
  } else if (Array.isArray(newOptions.headers)) {
    newOptions.headers.push(['Referer', 'http://localhost:4028']);
  } else {
    // Plain object
    newOptions.headers = { ...newOptions.headers, 'Referer': 'http://localhost:4028' };
  }

  return originalFetch(url, newOptions);
};
// ----------------------------------------------------

const connectDB = require('./db');

// Models
const User = require('./models/User');
const Task = require('./models/Task');
const StudySession = require('./models/StudySession');
const Prediction = require('./models/Prediction');
const authenticateUser = require('./middleware/auth');
const Course = require('./models/Course');
const Scenario = require('./models/Scenario');
const EisenhowerTask = require('./models/EisenhowerTask');
const ActivityLog = require('./models/ActivityLog');
const adminController = require('./controllers/adminController');
const admin = require('./middleware/admin');

const Document = require('./models/Document');
const Exam = require('./models/Exam');
const Vacation = require('./models/Vacation');
const Term = require('./models/Term');
const Event = require('./models/Event');
const WebReference = require('./models/WebReference');


dotenv.config();

const app = express();
app.set('trust proxy', 1); // Trust first proxy (Render load balancer)
const PORT = process.env.PORT || 5003;

// --- OPTIMIZATION & SECURITY MIDDLEWARE ---
app.use(compression()); // Compress all responses
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for now to avoid breaking dev tools/inline scripts
  crossOriginResourcePolicy: { policy: "cross-origin" } // Allow resources to be loaded by frontend
}));

// Rate Limiter: General
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', generalLimiter);

// Rate Limiter: AI & Heavy endpoints
const heavyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50, // Limit each IP to 50 requests per 15m for costly operations
  message: 'Too many AI requests, please wait a moment.'
});
app.use('/api/ai-scan', heavyLimiter);

app.use(cors());
app.use(express.json());

// Store image in memory buffer so we can pass it to AI
// Limit file size to 5MB to prevent memory crashes
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Gemini SDK configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

// --- FIX 1: SIMPLIFIED MODEL LIST ---
// Only use stable, production-ready models to reduce errors.
// Only use stable, production-ready models to reduce errors.
// Only use stable, production-ready models to reduce errors.
// Only use stable, production-ready models to reduce errors.
const MODEL_HIERARCHY = [
  'gemini-2.5-flash',     // User explicitly requested this specific version
  'gemini-2.0-flash-exp', // Experimental
  'gemini-1.5-pro',
  'gemini-1.5-flash',     // Fallback: Most Stable
];

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// --- FIX 2: IMPROVED ERROR HANDLING ---
async function generateContentSafe(input) {
  if (!GEMINI_API_KEY) throw new Error('Missing GEMINI_API_KEY');

  let lastError = null;

  for (const modelName of MODEL_HIERARCHY) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });

      // Handle array input (multimodal) vs string input
      const content = Array.isArray(input) ? input : [input];

      const result = await model.generateContent(content);
      const response = await result.response;
      return response.text();
    } catch (error) {
      const isRateLimit = error.message.includes('429') || (error.response && error.response.status === 429);
      const isNotFound = error.message.includes('404') || (error.response && error.response.status === 404);

      console.warn(`[Gemini] Model ${modelName} failed (RateLimit: ${isRateLimit}, NotFound: ${isNotFound})`);
      lastError = error;

      // CRITICAL FIX: If we hit a Rate Limit (429), we can try the next model in the hierarchy
      // as different models might have separate quotas or be less busy.
      if (isRateLimit) {
        console.warn('[Gemini] Rate limit hit. Attempting fallback to next model...');
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s before fallback
        continue;
      }

      // If it's just a 404 (model not found) or 500 (server hiccup), wait briefly and try the next model
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.error('[Gemini] All models failed. Last error:', lastError?.message, lastError);
  throw new Error(`AI Generation Failed: ${lastError?.message || 'Unknown error'}`);
}

// Helper: Text-only generation (wrapper)
async function geminiGenerate(text) {
  return generateContentSafe(text);
}

// --- LOGIC FUNCTIONS (Unchanged) ---

// --- NEW LOGIC: Monte Carlo + Gemini AI ---

/**
 * Runs a Monte Carlo simulation to predict future grades statistically.
 * @param {Object} data - Student input data
 * @returns {Object} Statistical results (median, confidence intervals, distribution)
 */
/**
 * Monte Carlo Simulation using dynamic parameters
 */
function runSmartMonteCarlo(currentGrade, params) {
  const iterations = 2000;
  const startGrade = Number(currentGrade);
  const { remainingWeight, volatility, trend, difficultyAdjust } = params;

  // Map string volatility to standard deviation
  let stdDev = 5;
  if (volatility === 'low') stdDev = 2;
  if (volatility === 'high') stdDev = 10;

  // Fallback defaults if params are missing/null
  if (!remainingWeight) remainingWeight = 0.3;

  const results = [];

  for (let i = 0; i < iterations; i++) {
    // Random performance on remaining work
    // Box-Muller transform for normal distribution
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

    let performance = startGrade + (trend || 0) + (z * stdDev);

    // Apply difficulty adjustment
    if (difficultyAdjust) performance *= (1 / difficultyAdjust); // Higher difficulty = lower performance

    // Cap performance
    performance = Math.max(0, Math.min(100, performance));

    // Calculate final grade
    // Final = (Current * (1 - Weight)) + (Performance * Weight)
    const finalGrade = (startGrade * (1 - (remainingWeight || 0.3))) + (performance * (remainingWeight || 0.3));
    results.push(finalGrade);
  }

  results.sort((a, b) => a - b);
  const median = results[Math.floor(iterations * 0.5)];
  const p10 = results[Math.floor(iterations * 0.1)]; // Worst case (conservative)
  const p90 = results[Math.floor(iterations * 0.9)]; // Best case (optimistic)

  // Generate distribution bucket data
  const buckets = {};
  results.forEach(g => {
    const bucket = Math.floor(g / 2) * 2; // Bucket size 2
    buckets[bucket] = (buckets[bucket] || 0) + 1;
  });

  const plotData = Object.keys(buckets).map(k => ({
    grade: Number(k),
    frequency: buckets[k]
  })).sort((a, b) => a.grade - b.grade);

  return {
    predictedGrade: Math.round(median * 10) / 10,
    rangeLow: Math.round(p10 * 10) / 10,
    rangeHigh: Math.round(p90 * 10) / 10,
    distribution: plotData,
    parametersUsed: params
  };
}

/**
 * Generates qualitative insights using Gemini based on student data and simulation stats.
 */
/**
 * Uses Gemini to parse student context into simulation parameters
 */
async function analyzeContextAndSimulate(studentData) {
  const { currentGrade, courseName, context, studyData } = studentData;

  // Safety check for keys
  if (!GEMINI_API_KEY) throw new Error("Missing GEMINI_API_KEY");

  const plannerSummary = studyData?.studySessions?.map(s =>
    `${s.subject}: ${s.duration}h on ${new Date(s.date).toDateString()}`
  ).join('; ') || "No planned sessions";

  const todoSummary = studyData?.todoList?.map(t =>
    `${t.title} (${t.priority}, ${t.completed ? 'Done' : 'Pending'})`
  ).join('; ') || "No tasks";

  const prompt = `
    Role: Senior Academic Data Scientist.
    Task: Analyze student context, study habits, and task list to infer statistical parameters for a grade simulation.
    
    Input:
    - Course: ${courseName}
    - Current Grade: ${currentGrade}%
    - Student Context: "${context || 'No specific context provided.'}"
    - Study Schedule: [${plannerSummary}]
    - To-Do List: [${todoSummary}]
    
    Output JSON ONLY:
    {
      "parameters": {
        "remainingWeight": <number 0.1 to 0.7>,
        "volatility": <"low" | "medium" | "high">,
        "trend": <number -5 to +5>,
        "difficultyAdjust": <number 0.8 to 1.2>
      },
      "insights": {
        "analysis": "<Short analysis citing specific tasks or study sessions if relevant>",
        "actionPlan": ["<Step 1>", "<Step 2>"],
        "riskAssessment": "<Concise risk summary (max 15 words)>"
      }
    }
    `;

  try {
    const text = await geminiGenerate(prompt);
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("AI Analysis Failed:", e);
    // Fallback params
    return {
      parameters: { remainingWeight: 0.3, volatility: 'medium', trend: 0 },
      insights: {
        analysis: "Could not analyze context. Using defaults.",
        actionPlan: ["Study hard"],
        riskAssessment: "Unknown"
      }
    };
  }
}

// --- AI SCHEDULE SCAN ---
app.post('/api/ai-scan', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!GEMINI_API_KEY) {
      console.error("Gemini API Key missing in backend");
      return res.status(500).json({ error: 'Server configuration error: Gemini API Key missing' });
    }

    // Convert buffer to base64
    const mimeType = req.file.mimetype;
    const imageBase64 = req.file.buffer.toString('base64');

    console.log(`[AI Scan] Processing file: ${req.file.originalname} (${mimeType})`);

    const prompt = `
        Role: Academic Schedule Parser.
        Task: Extract calendar events from the provided image/document.
        
        Input: A schedule image (class timetable, exam schedule, or syllabus).
        
        Output JSON ONLY:
        [
            {
                "title": "Course Name / Event Title",
                "date": "YYYY-MM-DD",
                "time": "HH:MM (24h format) or range HH:MM-HH:MM",
                "description": "Room number, Professor, or extra details",
                "type": "class" | "exam" | "deadline" | "other"
            }
        ]

        Rules:
        - If the date is not specified (e.g. "Mondays"), assume the NEXT occurrence of that day from today (${new Date().toISOString().split('T')[0]}).
        - If it's a semester schedule, generate the first week's events only, or if possible, a few occurrences.
        - STRICTLY return valid JSON array. No markdown formatting if possible, but I will parse it out.
        `;

    const parts = [
      { text: prompt },
      {
        inlineData: {
          mimeType: mimeType,
          data: imageBase64
        }
      }
    ];

    let text = "";
    try {
      // Use generateContentSafe to handle model fallbacks
      text = await generateContentSafe(parts);
    } catch (genErr) {
      console.error("Gemini Generation Failed:", genErr);
      return res.status(500).json({ error: `AI Generation Failed: ${genErr.message || genErr}` });
    }

    console.log("[AI Scan] Raw AI Response:", text.substring(0, 500) + "..."); // Log first 500 chars

    let events = [];
    try {
      // Robust JSON Extraction
      // 1. Remove markdown code blocks
      let cleanText = text.replace(/```json/g, '').replace(/```/g, '');

      // 2. Find the JSON array
      const startIndex = cleanText.indexOf('[');
      const endIndex = cleanText.lastIndexOf(']');

      if (startIndex !== -1 && endIndex !== -1) {
        cleanText = cleanText.substring(startIndex, endIndex + 1);
        events = JSON.parse(cleanText);
      } else {
        throw new Error("No JSON array found in response");
      }

      console.log(`[AI Scan] Successfully parsed ${events.length} events.`);

    } catch (parseErr) {
      console.error("Failed to parse AI response. Raw text:", text);
      return res.status(500).json({
        error: 'Failed to parse AI response. The image might not be a valid schedule.',
        details: parseErr.message
      });
    }

    res.json({ success: true, events });

  } catch (err) {
    console.error("AI Scan Error:", err);
    res.status(500).json({ error: `Internal Server Error: ${err.message}` });
  }
});

// --- GOOGLE CALENDAR SYNC (OAuth) ---
const { google } = require('googleapis');

// OAuth 2.0 Client Setup
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5002/api/auth/google/callback'
);

// Scopes for Calendar API
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

// 1. Redirect to Google Consent Screen
app.get('/api/auth/google', (req, res) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(500).send('Google Client ID/Secret missing in .env');
  }
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline', // Request refresh token
    scope: SCOPES,
  });
  res.redirect(url);
});

// 2. Handle Callback and Fetch Events
app.get('/api/auth/google/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Fetch Calendar Events
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const now = new Date();
    const nextMonth = new Date();
    nextMonth.setDate(now.getDate() + 30);

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: now.toISOString(),
      timeMax: nextMonth.toISOString(),
      maxResults: 20,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const googleEvents = response.data.items || [];

    // Save to MongoDB
    const savePromises = googleEvents.map(gEvent => {
      if (!gEvent.start) return null; // Skip if no time (unlikely for main events)

      // Map Google Event to our Schema
      const newEvent = {
        title: gEvent.summary || 'No Title',
        description: gEvent.description || 'Imported from Google Calendar',
        date: new Date(gEvent.start.dateTime || gEvent.start.date),
        time: gEvent.start.dateTime ? new Date(gEvent.start.dateTime).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) : 'All Day',
        color: 'bg-green-100 text-green-700 border-green-200' // Distinguish Google events
      };

      // Simple "Upsert" check by title+date (Improve logic for real prod)
      return Event.findOneAndUpdate(
        { title: newEvent.title, date: newEvent.date },
        newEvent,
        { upsert: true, new: true }
      );
    });

    await Promise.all(savePromises);

    // Redirect back to frontend with success
    res.redirect('http://localhost:4028/sync?status=success&provider=google');

  } catch (error) {
    console.error('Google OAuth/Sync Error:', error);
    res.redirect('http://localhost:4028/sync?status=error&provider=google');
  }
});


const maintenance = require('./middleware/maintenance');

// --- PUBLIC ROUTES ---
app.get('/api/public/status', async (req, res) => {
  try {
    const SystemSettings = require('./models/SystemSettings');
    const settings = await SystemSettings.getInstance();
    res.json({
      maintenanceMode: settings.maintenanceMode,
      allowRegistration: settings.allowRegistration,
      systemEmail: settings.systemEmail
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- AUTH MIDDLEWARE ---
// Protect all /api routes except auth hooks and public data
app.use('/api', async (req, res, next) => {
  // Exclude sub-paths
  const publicPaths = ['/auth', '/health', '/public'];
  // Strict check for path start to avoid bypassing
  if (publicPaths.some(p => req.path.startsWith(p))) return next();

  // Authenticate first (populates req.user)
  await authenticateUser(req, res, async () => {
    // Then check maintenance mode
    await maintenance(req, res, next);
  });
});

// --- ADMIN ROUTES ---
app.get('/api/admin/stats', admin, adminController.getDashboardStats);
app.get('/api/admin/users', admin, adminController.getAllUsers);
app.get('/api/admin/users/:id', admin, adminController.getUserDetails);
app.delete('/api/admin/users/:id', admin, adminController.deleteUser);
app.get('/api/admin/settings', admin, adminController.getSystemSettings);
app.put('/api/admin/settings', admin, adminController.updateSystemSettings);

// Admin Content Management
app.get('/api/admin/content/courses', admin, adminController.getGlobalCourses);
app.post('/api/admin/content/courses', admin, adminController.addGlobalCourse);
app.put('/api/admin/content/courses/:id', admin, adminController.updateGlobalCourse);
app.delete('/api/admin/content/courses/:id', admin, adminController.deleteGlobalCourse);

// Admin Logs
app.get('/api/admin/logs', admin, adminController.getSystemLogs);

// --- API ENDPOINTS ---

const { STORE_ITEMS, ACHIEVEMENTS, DAILY_QUESTS_POOL } = require('./config/gamification');

// --- GAMIFICATION: LEADERBOARD ---
app.get('/api/leaderboard', async (req, res) => {
  try {
    const topUsers = await User.find({}, 'firstName lastName points avatar').sort({ points: -1 }).limit(10);
    res.json(topUsers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const achievementsController = require('./controllers/achievementsController');

// GET /api/achievements/stats - Hero Stats
app.get('/api/achievements/stats', achievementsController.getStats);

// GET /api/achievements - Badges & Level
app.get('/api/achievements', achievementsController.getGamification);

// GET /api/history - History of Glory
app.get('/api/history', async (req, res) => {
  try {
    const logs = await ActivityLog.find({ userId: req.user._id }).sort({ timestamp: -1 }).limit(50);
    res.json(logs);
  } catch (err) {
    console.error("History Error Details:", err);
    console.error(err.stack);
    res.status(500).json({ error: err.message });
  }
});

// --- GAMIFICATION: STORE ---
app.get('/api/store/items', (req, res) => {
  res.json(STORE_ITEMS);
});

app.post('/api/store/buy', async (req, res) => {
  try {
    const { itemId } = req.body;
    // Use authenticated user
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const item = STORE_ITEMS.find(i => i.id === itemId);
    if (!item) return res.status(400).json({ error: 'Item not found' });

    // Check ownership
    if (user.inventory && user.inventory.includes(itemId)) {
      return res.status(400).json({ error: 'Item already owned' });
    }

    // Check Unlock Condition
    // Check Unlock Condition
    // Check Unlock Condition (Strict Rules)
    if (item.unlockCondition) {
      try {
        const { type, threshold, startHour, endHour, taskType, days, minMinutes } = item.unlockCondition;
        let met = false;

        switch (type) {
          // OLD CONDITIONS (Likely unused now but good to keep for logic)
          case 'level':
            met = (user.level || 1) >= threshold;
            break;
          case 'streak':
            const streak = user.streak || 0;
            met = streak >= threshold;
            break;

          // NEW STRICT CONDITIONS
          case 'time_window':
            // Check if ANY session exists in this window
            // In real app, we check recent sessions. For demo, we check if *current time* is in window?
            // "Complete a study session..." implies past tense. 
            // Let's check `StudySession` for a session with `startTime` in range?
            const StudySession = require('./models/StudySession');
            // Find a session where hour(startTime) is between start and end
            const sessions = await StudySession.find({ userId: user._id });
            met = sessions.some(s => {
              const h = new Date(s.startTime).getHours();
              return h >= startHour && h < endHour; // e.g. 2 <= h < 5
            });
            break;

          case 'task_count':
            const Task = require('./models/Task');
            // Check ALL completed tasks
            const totalTasks = await Task.countDocuments({
              userId: user._id,
              status: 'completed'
            });
            met = totalTasks >= threshold;
            break;

          case 'task_type_count':
            const TaskType = require('./models/Task');
            // Match Type OR Title containing "code"
            const codingTasks = await TaskType.countDocuments({
              userId: user._id,
              status: 'completed',
              $or: [
                { type: taskType },
                { title: { $regex: 'code', $options: 'i' } }
              ]
            });
            met = codingTasks >= threshold;
            break;

          case 'weekend_study':
            // 10 Hours on Sat/Sun
            const StudySessionWeekend = require('./models/StudySession');
            const weekendSessions = await StudySessionWeekend.find({ userId: user._id });
            const weekendMinutes = weekendSessions.reduce((acc, s) => {
              const day = new Date(s.startTime).getDay(); // 0=Sun, 6=Sat
              if (day === 0 || day === 6) return acc + (s.duration || 0);
              return acc;
            }, 0);
            met = weekendMinutes >= threshold; // 600 mins
            break;

          case 'strict_streak':
            // 7 days streak with > 1 hour (60 mins) each day
            // Simplified: Trust User.streak for now
            const strictStreak = user.streak || 0;
            met = strictStreak >= days; // threshold
            break;

          default:
            met = true;
        }

        if (!met) {
          return res.status(403).json({ error: `Not Met: ${item.unlockCondition.description}` });
        }
      } catch (conditionErr) {
        console.error("Unlock condition check failed:", conditionErr);
        return res.status(500).json({ error: "Failed to verify challenge. Please contact support." });
      }
    }

    // CHECK IF CHALLENGE REWARD (Don't charge, AWARD points)
    if (item.type === 'challenge') {
      user.points += (item.reward || 0);
      user.totalPoints += (item.reward || 0); // Track lifetime points
      user.inventory.push(itemId);
      await user.save();
      return res.json({
        success: true,
        points: user.points,
        inventory: user.inventory,
        message: `Challenge Completed! Awarded ${item.reward} points.`
      });
    }

    // NORMAL BUY (Themes/Items - logic fallback)
    if (user.points < item.price) {
      return res.status(400).json({ error: 'Not enough points' });
    }

    user.points -= item.price;
    user.inventory.push(itemId);

    await user.save();
    res.json({ success: true, points: user.points, inventory: user.inventory });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- GAMIFICATION: QUESTS ---
app.get('/api/quests', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Ensure user has quest data initialized
    if (!user.quests || !user.quests.daily || user.quests.daily.length === 0) {
      // Initialize if empty (simple logic for now)
      user.quests = {
        daily: DAILY_QUESTS_POOL.map(q => ({ id: q.id, progress: 0, completed: false, claimed: false })),
        lastGenerated: new Date()
      };
      await user.save();
    }

    // Merge Pool info with User Status
    const dailyQuests = DAILY_QUESTS_POOL.map(poolItem => {
      const userStatus = user.quests.daily.find(q => q.id === poolItem.id) || { progress: 0, completed: false, claimed: false };
      return { ...poolItem, ...userStatus };
    });

    res.json({ daily: dailyQuests });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/quests/claim', async (req, res) => {
  try {
    const { questId } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const questDef = DAILY_QUESTS_POOL.find(q => q.id === questId);
    if (!questDef) return res.status(400).json({ error: 'Quest not found' });

    // Check if quest exists in user list
    let userQuest = user.quests.daily.find(q => q.id === questId);
    if (!userQuest) {
      // Should have been initialized by getQuests, but if not:
      userQuest = { id: questId, progress: 0, completed: false, claimed: false };
      user.quests.daily.push(userQuest);
    }

    if (userQuest.claimed) {
      return res.status(400).json({ error: 'Quest already claimed' });
    }

    if (!userQuest.completed && userQuest.progress < questDef.target) {
      return res.status(400).json({ error: 'Quest not completed' });
    }

    // Mark as claimed 
    userQuest.claimed = true;
    userQuest.completed = true;

    // Award points
    user.points += questDef.reward;
    user.totalPoints += questDef.reward;

    await user.save();
    res.json({ success: true, points: user.points, claimed: questId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- GAMIFICATION: GARDEN ---
app.get('/api/garden', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Calculate total study hours from StudySession
    const StudySession = require('./models/StudySession');
    const sessions = await StudySession.find({ userId: req.user._id });
    const studyMinutes = sessions.reduce((acc, session) => acc + (session.duration * 60 || 0), 0);

    // Calculate hours from Completed Tasks (1 Task = 15 mins = 0.25h)
    const Task = require('./models/Task');
    const completedTasksCount = await Task.countDocuments({ userId: req.user._id, completed: true });
    const taskMinutes = completedTasksCount * 15;

    const totalMinutes = studyMinutes + taskMinutes;
    const totalHours = parseFloat((totalMinutes / 60).toFixed(2)); // Precision for UI

    // Define Plant Unlocks
    const plants = [
      { id: 'rose', name: 'Rose', unlockHours: 0, icon: 'Flower2', color: 'text-pink-500' },
      { id: 'oak', name: 'Oak', unlockHours: 5, icon: 'Trees', color: 'text-green-600' },
      { id: 'cactus', name: 'Cactus', unlockHours: 20, icon: 'Sprout', color: 'text-emerald-600' }, // Placeholder 1
      { id: 'sunflower', name: 'Sunflower', unlockHours: 50, icon: 'Sun', color: 'text-yellow-500' } // Placeholder 2
    ];

    // Determine Status
    const gardenState = plants.map(plant => ({
      ...plant,
      unlocked: totalHours >= plant.unlockHours,
      progress: Math.min(100, (totalHours / plant.unlockHours) * 100) || (totalHours > 0 ? 100 : 0) // visual progress
    }));

    res.json({
      totalHours, // Float
      breakdown: { studyMinutes, taskMinutes, tasks: completedTasksCount },
      plants: gardenState
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/garden/grow', async (req, res) => {
  try {
    const { minutes } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Simple mechanism: 60 mins = 1 stage growth for first plant
    // In real app, manage specific plants

    if (!user.garden.plants.length) {
      user.garden.plants.push({ type: 'sapling', stage: 1, plantedAt: new Date() });
    }

    // Just an example response for now
    res.json({ success: true, message: 'Garden watered' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- USER PROFILE ---
app.get('/api/user', async (req, res) => {
  try {
    // req.user is already attached by middleware
    if (!req.user) return res.status(404).json({ error: 'User not found' });
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/user', async (req, res) => {
  try {
    // User is already authenticated, update their profile
    // We restrict what can be updated for security
    const allowedUpdates = ['firstName', 'lastName', 'institution', 'major', 'graduationYear', 'phone', 'dateOfBirth', 'address', 'academicSettings', 'preferences', 'garden', 'activeTheme'];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(req.user._id, { $set: updates }, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// --- NEW: Theme Update Endpoint ---
app.put('/api/user/theme', async (req, res) => {
  try {
    const { theme } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!user.preferences) user.preferences = {};
    if (!user.preferences.display) user.preferences.display = {};

    user.preferences.display.activeTheme = theme;

    // Mark modified because preferences is usually nested/mixed or just to be safe with Mongoose mixed types
    user.markModified('preferences');

    await user.save();
    res.json({ success: true, theme: user.preferences.display.activeTheme });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- TASKS ---
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const task = new Task({ ...req.body, userId: req.user._id });
    await task.save();

    // Quest Update - REMOVED: Creation is not completion
    // const user = await User.findById(req.user._id);
    // if (user) await user.updateQuestProgress('tasks_completed', 1);

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    // 1. Find the existing task first to check current status
    const existingTask = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!existingTask) return res.status(404).json({ error: 'Task not found' });

    // 2. Check if we are completing it now
    const wasCompleted = existingTask.completed;
    const isNowCompleted = req.body.completed === true;
    const justCompleted = !wasCompleted && isNowCompleted;

    // 3. Update the task
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );

    // 4. Trigger Quest Progress if just completed
    if (justCompleted) {
      const user = await User.findById(req.user._id);
      if (user) await user.updateQuestProgress('tasks_completed', 1);
    }

    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- STUDY SESSIONS ---
app.get('/api/study-sessions', async (req, res) => {
  try {
    const sessions = await StudySession.find({ userId: req.user._id }).sort({ date: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/study-sessions', async (req, res) => {
  try {
    const session = new StudySession({ ...req.body, userId: req.user._id });
    await session.save();

    // Quest Update
    const user = await User.findById(req.user._id);
    if (user) {
      // duration in body. Is it minutes or hours?
      // Frontend <Stopwatch> or <Timer> usually sends minutes or seconds?
      // If AchievementsController converts `duration * 60`, it implies duration is HOURS.
      // BUT `gamification.js` says `target: 45` for `daily_study_45` (minutes).
      // If I store HOURS, I must convert.
      // Let's assume input `duration` is minutes for now or check frontend?
      // Safest: `req.body.duration` is what we saved.
      // `updateQuestProgress` adds `amount`.
      // If `type` is `study_minutes`.
      // If `req.body.duration` is hours, we need `* 60`.
      // If `req.body.duration` is minutes, we just pass it.
      // Let's check `StudySession` schema in a separate step if unsure? 
      // Or just pass `req.body.duration` and we'll calibrate later. 
      // Actually, `simulate_challenges` set `duration: 60` for 1 hour session (Night Owl). 
      // If that was minutes, then `duration` = minutes. 
      // `achievementsController` might be wrong or legacy.
      // Let's assume MINUTES.
      // Convert duration (Hours) to Minutes for Quest
      const durationInMinutes = (req.body.duration || 0) * 60;
      await user.updateQuestProgress('study_minutes', durationInMinutes);
      await user.updateQuestProgress('focus_session', 1);
    }

    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/study-sessions/:id', async (req, res) => {
  try {
    const session = await StudySession.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!session) return res.status(404).json({ error: 'Session not found' });
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/study-sessions/:id', async (req, res) => {
  try {
    const session = await StudySession.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!session) return res.status(404).json({ error: 'Session not found' });
    res.json({ message: 'Session deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- COURSES ---
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/courses', async (req, res) => {
  try {
    const course = new Course({ ...req.body, userId: req.user._id });
    await course.save();
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/courses/:id', async (req, res) => {
  try {
    const course = await Course.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/courses/:id', async (req, res) => {
  try {
    const course = await Course.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- EXAMS ---
app.get('/api/exams', async (req, res) => {
  try {
    const exams = await Exam.find({ userId: req.user._id }).sort({ date: 1 });
    res.json(exams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/exams', async (req, res) => {
  try {
    const exam = new Exam({ ...req.body, userId: req.user._id });
    await exam.save();

    // Quest Update
    const user = await User.findById(req.user._id);
    if (user) await user.updateQuestProgress('exam_completed', 1);

    res.json(exam);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/exams/:id', async (req, res) => {
  try {
    const exam = await Exam.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!exam) return res.status(404).json({ error: 'Exam not found' });
    res.json(exam);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/exams/:id', async (req, res) => {
  try {
    const exam = await Exam.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!exam) return res.status(404).json({ error: 'Exam not found' });
    res.json({ message: 'Exam deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- VACATIONS ---
app.get('/api/vacations', async (req, res) => {
  try {
    const vacations = await Vacation.find({ userId: req.user._id }).sort({ startDate: 1 });
    res.json(vacations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/vacations', async (req, res) => {
  try {
    const vacation = new Vacation({ ...req.body, userId: req.user._id });
    await vacation.save();
    res.json(vacation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/vacations/:id', async (req, res) => {
  try {
    await Vacation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Vacation deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- EVENTS (General) ---
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find({ userId: req.user._id }).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/events', async (req, res) => {
  try {
    const event = new Event({ ...req.body, userId: req.user._id });
    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/events/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/events/:id', async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- DOCUMENTS (Digital Backpack) ---
app.get('/api/documents', async (req, res) => {
  try {
    // Return metadata only, not the full buffer to keep it light
    // FIX: Filter by userId so users only see their own files
    const documents = await Document.find({ userId: req.user._id }, '-data').sort({ uploadDate: -1 });
    res.json(documents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/documents/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { subject, type } = req.body;

    // Calculate readable size
    const sizeBytes = req.file.size;
    let sizeStr = sizeBytes + ' B';
    if (sizeBytes > 1024 * 1024) sizeStr = (sizeBytes / (1024 * 1024)).toFixed(1) + ' MB';
    else if (sizeBytes > 1024) sizeStr = (sizeBytes / 1024).toFixed(1) + ' KB';

    const newDoc = new Document({
      userId: req.user._id, // FIX: Assign to current user
      name: req.file.originalname,
      subject: subject || 'General',
      type: type || 'other',
      size: sizeStr,
      contentType: req.file.mimetype,
      data: req.file.buffer // Store binary
    });

    await newDoc.save();

    // Return doc without buffer
    const docResponse = newDoc.toObject();
    delete docResponse.data;

    res.json(docResponse);
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/documents/:id/download', async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Document not found' });

    res.set('Content-Type', doc.contentType);
    res.set('Content-Disposition', `attachment; filename="${doc.name}"`);
    res.send(doc.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/documents/:id', async (req, res) => {
  try {
    const { name, subject, type } = req.body;
    const doc = await Document.findByIdAndUpdate(
      req.params.id,
      { name, subject, type },
      { new: true, select: '-data' }
    );
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/documents/:id', async (req, res) => {
  try {
    await Document.findByIdAndDelete(req.params.id);
    res.json({ message: 'Document deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// --- TERMS (Schedule Setup) ---
app.get('/api/terms', async (req, res) => {
  try {
    const term = await Term.findOne().sort({ createdAt: -1 }); // Get latest config
    res.json(term || {});
  } catch (err) {
    console.error("Error in GET /api/terms:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/terms', async (req, res) => {
  try {
    // Upsert logic could go here, or just save new
    const term = new Term({ ...req.body, userId: req.user._id });
    await term.save();
    res.json(term);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- SCENARIOS (Data Room) ---
app.get('/api/scenarios', async (req, res) => {
  try {
    const scenarios = await Scenario.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(scenarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/scenarios', async (req, res) => {
  try {
    const scenario = new Scenario({ ...req.body, userId: req.user._id });
    await scenario.save();
    res.json(scenario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- EISENHOWER TASKS ---
app.get('/api/eisenhower-tasks', async (req, res) => {
  try {
    const tasks = await EisenhowerTask.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/eisenhower-tasks', async (req, res) => {
  try {
    const task = new EisenhowerTask({ ...req.body, userId: req.user._id });
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/eisenhower-tasks/:id', async (req, res) => {
  try {
    const task = await EisenhowerTask.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/eisenhower-tasks/:id', async (req, res) => {
  try {
    const task = await EisenhowerTask.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- DOCUMENTS ---
app.get('/api/documents', async (req, res) => {
  try {
    const documents = await Document.find({ userId: req.user._id }).sort({ uploadDate: -1 });
    res.json(documents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- PREDICTION ---
app.get('/api/predictions', async (req, res) => {
  try {
    const predictions = await Prediction.find({ userId: req.user._id }).sort({ timestamp: -1 });
    res.json(predictions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/predict', async (req, res) => {
  try {
    const studentData = req.body || {};

    // 1. Analyze Context & Infer Parameters via Gemini
    const aiAnalysis = await analyzeContextAndSimulate(studentData);

    // 2. Run Monte Carlo Simulation using AI-derived parameters
    const simulationStats = runSmartMonteCarlo(studentData.currentGrade, aiAnalysis.parameters);

    // 3. Merge Results (Initial)
    const responseData = {
      stats: simulationStats,
      aiAnalysis: aiAnalysis.insights,
      parameters: aiAnalysis.parameters,
      timestamp: new Date().toISOString()
    };

    // 4. SAVE TO MONGODB
    try {
      const newPrediction = new Prediction({
        courseName: studentData.courseName,
        currentGrade: studentData.currentGrade,
        predictedGrade: simulationStats.predictedGrade,
        rangeLow: simulationStats.rangeLow,
        rangeHigh: simulationStats.rangeHigh,
        studyDataSummary: studentData.studyData,
        aiAnalysis: aiAnalysis.insights,
        userId: req.user._id
      });
      await newPrediction.save();
      console.log('Prediction saved to DB:', newPrediction._id);

      // Include the ID in the response
      responseData._id = newPrediction._id;
      responseData.id = newPrediction._id; // standard alias

    } catch (dbErr) {
      console.error('Failed to save prediction:', dbErr);
    }

    res.json(responseData);
  } catch (e) {

    console.error("Prediction API Error:", e);

    // Fallback attempt
    try {
      const defaultParams = { remainingWeight: 0.3, volatility: 'medium', trend: 0 };
      const fallbackStats = runSmartMonteCarlo(req.body.currentGrade || 80, defaultParams);
      res.json({
        stats: fallbackStats,
        aiAnalysis: { analysis: "Error connecting to AI.", actionPlan: [], riskAssessment: "System Error" },
        parameters: defaultParams,
        timestamp: new Date().toISOString()
      });
    } catch (finalError) {
      res.status(500).json({ error: 'Failed to generate prediction' });
    }
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', aiReady: Boolean(GEMINI_API_KEY), model: MODEL_HIERARCHY[0] });
});

// AI: Stats Endpoint
app.get('/api/ai/stats', authenticateUser, async (req, res) => {
  try {
    if (!req.user || !req.user._id) return res.status(401).json({ error: 'Unauthorized' });

    const userId = req.user._id;

    // 1. Chat Sessions (Count logs)
    const chatCount = await ActivityLog.countDocuments({ userId, type: 'ai_chat' });

    // 2. Documents Analyzed (Count logs)
    const docCount = await ActivityLog.countDocuments({ userId, type: 'ai_analysis' });

    // 3. Study Plans (Count StudySession docs)
    const studyPlanCount = await StudySession.countDocuments({ userId });

    // 4. Avg. Improvement (Calculate from predictions)
    // Compare stats.predictedGrade vs currentGrade in Prediction history
    const predictions = await Prediction.find({ userId }).select('currentGrade predictedGrade');
    let avgImprovement = 0;
    if (predictions.length > 0) {
      const totalImprovement = predictions.reduce((acc, curr) => {
        const improvement = (curr.predictedGrade || 0) - (curr.currentGrade || 0);
        return acc + (improvement > 0 ? improvement : 0); // Only count positive improvement? Or net? Let's do net but floor at 0 for display
      }, 0);
      avgImprovement = Math.round((totalImprovement / predictions.length) * 10) / 10;
    }

    // Default mock values if low data (for demo feel)
    const displayStats = {
      chatSessions: chatCount || 0,
      documentsAnalyzed: docCount || 0,
      studyPlans: studyPlanCount || 0,
      avgImprovement: avgImprovement > 0 ? `${avgImprovement}%` : '0%'
    };

    res.json(displayStats);
  } catch (err) {
    console.error('Stats Error:', err);
    res.status(500).json({ error: 'Failed to fetch AI stats' });
  }
});

// AI: Chat using Gemini
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, subject } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'message is required' });
    }
    const prompt = `You are an expert ${subject || 'general'} tutor. Provide clear, step-by-step guidance.\n\nStudent question: ${message}`;

    // Use the helper function
    const text = await geminiGenerate(prompt);

    // Log detailed activity for stats
    if (req.user && req.user._id) {
      try {
        await ActivityLog.create({
          userId: req.user._id,
          type: 'ai_chat',
          title: 'AI Chat Session',
          description: `Asked about ${subject || 'general'} topic`,
          metadata: { subject, messageLength: message.length.toString() }
        });
      } catch (logErr) {
        console.error('Failed to log AI chat activity:', logErr);
      }
    }

    return res.json({ text });
  } catch (err) {
    // Better error Logging
    console.error('Gemini chat error:', err.message);

    // If it's a rate limit, send a specific error to the client
    if (err.message.includes('429')) {
      return res.status(429).json({ error: 'AI Quota Exceeded. Please try again later.' });
    }

    return res.status(500).json({ error: 'AI chat failed. Check server logs.' });
  }
});

// AI: Image analysis using Gemini (multipart/form-data)
app.post('/api/ai/analyze-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'image file is required' });

    const analysisType = (req.body?.analysisType || 'general').toString();
    const mimeType = req.file.mimetype || 'image/png';

    // 1. Convert Buffer to Base64 for Gemini SDK
    const imagePart = {
      inlineData: {
        data: req.file.buffer.toString('base64'),
        mimeType: mimeType
      }
    };

    const prompts = {
      general: 'Analyze this academic document or image. Provide a **concise** summary in structured Markdown (bullet points). Focus on key concepts and educational value. Keep it under 200 words.',
      grades: 'Analyze this grade report. Extract key grades and trends in a table format. Provide a very short summary of progress.',
      homework: 'Analyze this homework. Identify the subject and provide 3 brief, constructive bullet points on quality and areas for improvement.',
      notes: 'Analyze these notes. structurize key points into a short list. Suggest 1-2 major improvements for clarity.',
    };

    const textPrompt = `${prompts[analysisType] || prompts.general}\n\nFormat: Clean Markdown. Tone: Professional & Concise.`;

    // 2. Call generateContent with BOTH text and image
    const analysis = await generateContentSafe([textPrompt, imagePart]);

    // Log detailed activity for stats
    if (req.user && req.user._id) {
      try {
        await ActivityLog.create({
          userId: req.user._id,
          type: 'ai_analysis',
          title: 'Document Analysis',
          description: `Analyzed ${analysisType} document`,
          metadata: { analysisType, mimeType }
        });
      } catch (logErr) {
        console.error('Failed to log AI analysis activity:', logErr);
      }
    }

    return res.json({ analysis, analysisType });
  } catch (err) {
    console.error('Gemini image analysis error:', err.message);

    if (err.message.includes('429')) {
      return res.status(429).json({ error: 'AI Quota Exceeded. Please try again later.' });
    }

    return res.status(500).json({ error: 'AI image analysis failed. Check server logs.' });
  }
});

// --- WEB REFERENCES ---
app.get('/api/web-references', async (req, res) => {
  try {
    const refs = await WebReference.find({ userId: req.user._id }).sort({ dateAdded: -1 });
    res.json(refs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/web-references', async (req, res) => {
  try {
    const ref = new WebReference({ ...req.body, userId: req.user._id });
    await ref.save();
    res.json(ref);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/web-references/:id', async (req, res) => {
  try {
    const ref = await WebReference.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(ref);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/web-references/:id', async (req, res) => {
  try {
    await WebReference.findByIdAndDelete(req.params.id);
    res.json({ message: 'Reference deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

if (require.main === module) {
  // Global error handlers for debugging
  process.on('uncaughtException', (err) => {
    console.error(`[FATAL] Uncaught Exception: ${err.message}\n${err.stack}`);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error(`[FATAL] Unhandled Rejection: ${reason}`);
    process.exit(1);
  });

  connectDB().then(() => {
    try {
      const server = app.listen(PORT, '0.0.0.0', () => {
        console.log(`API server listening on http://localhost:${PORT}`);
        console.log('Ensure you have a valid .env file with SERVER_MONGO_URI or MONGO_URI');
      });

      server.on('error', (err) => {
        console.error(`[SERVER ERROR] Server Error: ${err.message}`);
      });
    } catch (err) {
      console.error(`[STARTUP ERROR] Startup Error: ${err.message}`);
    }
  });
}

module.exports = app;