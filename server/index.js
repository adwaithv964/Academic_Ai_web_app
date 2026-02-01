const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
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
const Course = require('./models/Course');
const Scenario = require('./models/Scenario');
const EisenhowerTask = require('./models/EisenhowerTask');

const Document = require('./models/Document');
const Exam = require('./models/Exam');
const Vacation = require('./models/Vacation');
const Term = require('./models/Term');
const Event = require('./models/Event');
const WebReference = require('./models/WebReference');


dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

// Store image in memory buffer so we can pass it to AI
const upload = multer({ storage: multer.memoryStorage() });

// Gemini SDK configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

// --- FIX 1: SIMPLIFIED MODEL LIST ---
// Only use stable, production-ready models to reduce errors.
const MODEL_HIERARCHY = [
  'gemini-1.5-flash', // Priority: Fastest & Cheapest
  'gemini-1.5-pro',   // Fallback: Smarter
  'gemini-2.0-flash'  // Latest stable (optional)
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

      // CRITICAL FIX: If we hit a Rate Limit (429), stop trying other models. 
      // The quota is usually on the API Key, not the model, so switching won't help.
      if (isRateLimit) {
        console.error('[Gemini] Quota exceeded. Stopping retries to prevent spam.');
        break;
      }

      // If it's just a 404 (model not found) or 500 (server hiccup), wait briefly and try the next model
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.error('[Gemini] All models failed. Last error:', lastError?.message);
  throw lastError;
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
        "riskAssessment": "<Risk based on overdue tasks or lack of study time>"
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
      return res.status(500).json({ error: 'Gemini API Key missing' });
    }

    // Convert buffer to base64
    const mimeType = req.file.mimetype;
    const imageBase64 = req.file.buffer.toString('base64');

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
        - STRICTLY return valid JSON array. No markdown formatting.
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

    // Use generateContentSafe to handle model fallbacks (flash -> pro)
    let text = "";
    try {
      text = await generateContentSafe(parts);
      // Clean up markdown if present
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    } catch (genErr) {
      console.error("Gemini Generation Failed:", genErr);
      return res.status(500).json({ error: `AI Error: ${genErr.message || genErr}` });
    }

    let events = [];
    try {
      events = JSON.parse(text);
    } catch (parseErr) {
      console.error("Failed to parse AI response:", text);
      return res.status(500).json({ error: 'Failed to parse AI response', raw: text });
    }

    res.json({ success: true, events });

  } catch (err) {
    console.error("AI Scan Error:", err);
    res.status(500).json({ error: err.message });
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

// --- GAMIFICATION: STORE ---
app.get('/api/store/items', (req, res) => {
  res.json(STORE_ITEMS);
});

app.post('/api/store/buy', async (req, res) => {
  try {
    const { userId, itemId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const item = STORE_ITEMS.find(i => i.id === itemId);
    if (!item) return res.status(400).json({ error: 'Item not found' });

    // Check ownership
    if (user.inventory && user.inventory.includes(itemId)) {
      return res.status(400).json({ error: 'Item already owned' });
    }

    // Check balance
    if (user.points < item.price) {
      return res.status(400).json({ error: 'Not enough points' });
    }

    user.points -= item.price;
    user.inventory.push(itemId);

    // Handle specific item effects if needed (e.g., set theme immediately)
    // For now, client handles the visual switch

    await user.save();
    res.json({ success: true, points: user.points, inventory: user.inventory });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- GAMIFICATION: QUESTS ---
app.get('/api/quests', async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.json({ daily: DAILY_QUESTS_POOL }); // Fallback to generic if no user

  try {
    const user = await User.findById(userId);
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
    const { userId, questId } = req.body;
    const user = await User.findById(userId);
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

    // Mark as claimed and completed
    userQuest.claimed = true;
    userQuest.completed = true; // Assuming claim implies completion for this simple flow at the moment

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
app.post('/api/garden/grow', async (req, res) => {
  try {
    const { userId, minutes } = req.body;
    const user = await User.findById(userId);
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
    // For now, assuming single user or getting the first one
    let user = await User.findOne();
    if (!user) {
      console.log("No user found, creating default user...");
      user = new User({
        firstName: 'Student',
        lastName: 'Scholar',
        email: 'student@example.com',
        points: 0,
        totalPoints: 0,
        quests: { daily: [] }
      });
      await user.save();
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/user', async (req, res) => {
  try {
    const { email, ...updateData } = req.body;
    // Upsert user based on email or create new if not exists (handling singleton logic for now)
    const user = await User.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- TASKS ---
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- STUDY SESSIONS ---
app.get('/api/study-sessions', async (req, res) => {
  try {
    const sessions = await StudySession.find().sort({ date: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/study-sessions', async (req, res) => {
  try {
    const session = new StudySession(req.body);
    await session.save();
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/study-sessions/:id', async (req, res) => {
  try {
    const session = await StudySession.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/study-sessions/:id', async (req, res) => {
  try {
    await StudySession.findByIdAndDelete(req.params.id);
    res.json({ message: 'Session deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- COURSES ---
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/courses', async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/courses/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/courses/:id', async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- EXAMS ---
app.get('/api/exams', async (req, res) => {
  try {
    const exams = await Exam.find().sort({ date: 1 });
    res.json(exams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/exams', async (req, res) => {
  try {
    const exam = new Exam(req.body);
    await exam.save();
    res.json(exam);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/exams/:id', async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(exam);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/exams/:id', async (req, res) => {
  try {
    await Exam.findByIdAndDelete(req.params.id);
    res.json({ message: 'Exam deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- VACATIONS ---
app.get('/api/vacations', async (req, res) => {
  try {
    const vacations = await Vacation.find().sort({ startDate: 1 });
    res.json(vacations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/vacations', async (req, res) => {
  try {
    const vacation = new Vacation(req.body);
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
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/events', async (req, res) => {
  try {
    const event = new Event(req.body);
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
    const documents = await Document.find({}, '-data').sort({ uploadDate: -1 });
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
    const term = new Term(req.body);
    await term.save();
    res.json(term);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- SCENARIOS (Data Room) ---
app.get('/api/scenarios', async (req, res) => {
  try {
    const scenarios = await Scenario.find().sort({ createdAt: -1 });
    res.json(scenarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/scenarios', async (req, res) => {
  try {
    const scenario = new Scenario(req.body);
    await scenario.save();
    res.json(scenario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- EISENHOWER TASKS ---
app.get('/api/eisenhower-tasks', async (req, res) => {
  try {
    const tasks = await EisenhowerTask.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/eisenhower-tasks', async (req, res) => {
  try {
    const task = new EisenhowerTask(req.body);
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/eisenhower-tasks/:id', async (req, res) => {
  try {
    const task = await EisenhowerTask.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/eisenhower-tasks/:id', async (req, res) => {
  try {
    await EisenhowerTask.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- DOCUMENTS ---
app.get('/api/documents', async (req, res) => {
  try {
    const documents = await Document.find().sort({ uploadDate: -1 });
    res.json(documents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- PREDICTION ---
app.get('/api/predictions', async (req, res) => {
  try {
    const predictions = await Prediction.find().sort({ timestamp: -1 });
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

    // 3. Merge Results
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
        aiAnalysis: aiAnalysis.insights
      });
      await newPrediction.save();
      console.log('Prediction saved to DB:', newPrediction._id);
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
      general: 'Analyze this academic document or image. Provide detailed insights about the content, structure, and educational elements present.',
      grades: 'Analyze this grade report or transcript. Extract key performance indicators, trends, and insights about academic progress.',
      homework: 'Analyze this homework/assignment image. Identify subject, difficulty, completion quality, and provide constructive feedback.',
      notes: 'Analyze these study notes. Assess organization, completeness, clarity, and suggest improvements for learning.',
    };

    const textPrompt = `${prompts[analysisType] || prompts.general}\nFocus: ${analysisType}`;

    // 2. Call generateContent with BOTH text and image
    const analysis = await generateContentSafe([textPrompt, imagePart]);

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
    const refs = await WebReference.find().sort({ dateAdded: -1 });
    res.json(refs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/web-references', async (req, res) => {
  try {
    const ref = new WebReference(req.body);
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
  app.listen(PORT, () => {
    console.log(`API server listening on http://localhost:${PORT}`);
  });
}

module.exports = app;