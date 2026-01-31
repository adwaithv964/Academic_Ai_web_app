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
const Document = require('./models/Document');


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

// --- API ENDPOINTS ---

// --- USER PROFILE ---
app.get('/api/user', async (req, res) => {
  try {
    // For now, assuming single user or getting the first one
    const user = await User.findOne();
    res.json(user || {});
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

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`API server listening on http://localhost:${PORT}`);
  });
}

module.exports = app;