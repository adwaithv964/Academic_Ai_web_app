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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

// Store image in memory buffer so we can pass it to AI
const upload = multer({ storage: multer.memoryStorage() });

// Gemini SDK configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

// Prioritized list of models for fallback
const MODEL_HIERARCHY = [
  'gemini-2.5-pro-exp',        // 2.5 Pro (Complex Reasoning)
  'gemini-2.5-flash-exp',      // 2.5 Flash (Speed/Intelligence)
  'gemini-2.5-flash-lite-exp', // 2.5 Flash-Lite (High Throughput)
  'gemini-2.0-flash-exp',      // 2.0 Flash (Multimodal)
  'gemini-2.0-flash-lite-preview-02-05', // 2.0 Flash-Lite (Multimodal)
  'gemini-2.0-flash-lite-preview',        // 2.0 Flash-Lite (Generic)
  'gemini-exp-1206'            // Fallback: Reliable high-reasoning experimental model
];

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Helper: Safe generation with recursive fallback
async function generateContentSafe(input) {
  if (!GEMINI_API_KEY) throw new Error('Missing GEMINI_API_KEY');

  let lastError = null;

  for (const modelName of MODEL_HIERARCHY) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(input);
      const response = await result.response;
      return response.text();
    } catch (error) {
      const isRateLimit = error.message.includes('429') || (error.response && error.response.status === 429);
      const isNotFound = error.message.includes('404') || (error.response && error.response.status === 404);

      console.warn(`[Gemini] Model ${modelName} failed (RateLimit: ${isRateLimit}, NotFound: ${isNotFound}). Trying next...`);
      lastError = error;

      // Continue to next model on failure
      continue;
    }
  }

  console.error('[Gemini] All models failed. Last error:', lastError?.message);
  throw lastError;
}

// Helper: Text-only generation (wrapper)
async function geminiGenerate(text) {
  return generateContentSafe(text);
}

// --- LOGIC FUNCTIONS ---

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function letterFromGrade(g) {
  if (g >= 90) return 'A';
  if (g >= 80) return 'B';
  if (g >= 70) return 'C';
  if (g >= 60) return 'D';
  return 'F';
}

function buildPrediction(payload) {
  const currentGrade = Number(payload?.currentGrade ?? 75);
  const difficulty = String(payload?.difficulty ?? 'medium');
  const remainingAssignments = Number(payload?.remainingAssignments ?? 3);
  const examWeight = Number(payload?.examWeight ?? 40);
  const homeworkWeight = Number(payload?.homeworkWeight ?? 40);
  const participationWeight = Number(payload?.participationWeight ?? 20);
  const historicalPerformance = String(payload?.historicalPerformance ?? 'average');
  const studyHours = Number(payload?.studyHours ?? 10);
  const attendanceRate = Number(payload?.attendanceRate ?? 95);

  const difficultyPenalty = difficulty === 'hard' ? -5 : difficulty === 'medium' ? -2 : 0;
  const historyAdj = historicalPerformance === 'below-average' ? -3 : historicalPerformance === 'above-average' ? 3 : 0;
  const studyAdj = (studyHours - 10) * 0.6;
  const attendanceAdj = (attendanceRate - 90) * 0.2;
  const workloadVolatility = clamp(10 - remainingAssignments * 1.5, 2, 10);

  let predicted = currentGrade + difficultyPenalty + historyAdj + studyAdj + attendanceAdj;
  predicted = clamp(predicted, 0, 100);

  const confidence = clamp((workloadVolatility + (100 - Math.abs(predicted - currentGrade)) / 10) / 20, 0.3, 0.9);
  const letterGrade = letterFromGrade(predicted);

  const distA = clamp((predicted - 88) / 20, 0, 0.5);
  const distB = clamp((predicted - 78) / 20, 0, 0.5);
  const distC = clamp((predicted - 68) / 20, 0, 0.5);
  const distD = clamp((predicted - 58) / 20, 0, 0.5);
  let raw = [distA, distB, distC, distD, 0.2];
  const sum = raw.reduce((a, b) => a + b, 0) || 1;
  raw = raw.map((v) => v / sum);
  const probabilityDistribution = [
    { grade: 'A (90-100)', probability: raw[0] },
    { grade: 'B (80-89)', probability: raw[1] },
    { grade: 'C (70-79)', probability: raw[2] },
    { grade: 'D (60-69)', probability: raw[3] },
    { grade: 'F (0-59)', probability: raw[4] },
  ];

  const recommendations = [
    {
      title: 'Focus on High-Weight Assessments',
      description: `Prioritize exam preparation (${examWeight}% weight). A 10% improvement here has strong impact.`,
      impact: 'High',
      effort: 'High',
      timeline: '2-3 weeks',
      priority: 'high',
    },
    {
      title: 'Improve Homework Consistency',
      description: `Maintain regular homework performance (${homeworkWeight}% weight).`,
      impact: 'Medium',
      effort: 'Medium',
      timeline: 'Ongoing',
      priority: 'medium',
    },
    {
      title: 'Increase Class Participation',
      description: `Engage in discussions and ask questions (${participationWeight}% weight).`,
      impact: 'Low',
      effort: 'Low',
      timeline: 'Immediate',
      priority: 'low',
    },
  ];

  const riskFactors = [
    {
      category: 'Assignment Load',
      level: remainingAssignments > 4 ? 'high' : remainingAssignments > 2 ? 'medium' : 'low',
      description: `${remainingAssignments} assignments remaining may impact quality.`,
      mitigation: 'Start early and plan weekly milestones.',
    },
    {
      category: 'Course Difficulty',
      level: difficulty === 'hard' ? 'high' : difficulty === 'medium' ? 'medium' : 'low',
      description: `Course difficulty rated as ${difficulty}.`,
      mitigation: 'Seek support, use study groups, and tutorials.',
    },
    {
      category: 'Historical Performance',
      level: historicalPerformance === 'below-average' ? 'high' : historicalPerformance === 'average' ? 'medium' : 'low',
      description: `Past performance indicates ${historicalPerformance}.`,
      mitigation: 'Address gaps with targeted practice and feedback.',
    },
  ];

  const targetGrades = [
    {
      letter: 'A',
      grade: 90,
      requiredAverage: clamp(90 + (100 - examWeight - homeworkWeight - participationWeight) * 0.1, 60, 100),
      difficulty: predicted >= 85 ? 'Easy' : predicted >= 75 ? 'Moderate' : 'Challenging',
      description: 'Excellent performance',
    },
    {
      letter: 'B',
      grade: 80,
      requiredAverage: clamp(80 + (100 - examWeight - homeworkWeight - participationWeight) * 0.08, 55, 95),
      difficulty: predicted >= 75 ? 'Easy' : predicted >= 65 ? 'Moderate' : 'Challenging',
      description: 'Good performance',
    },
    {
      letter: 'C',
      grade: 70,
      requiredAverage: clamp(70 + (100 - examWeight - homeworkWeight - participationWeight) * 0.06, 50, 90),
      difficulty: predicted >= 65 ? 'Easy' : 'Moderate',
      description: 'Satisfactory performance',
    },
  ];

  const scenarios = {
    optimistic: {
      finalGrade: clamp(predicted + 8, 0, 100),
      probability: 0.25,
      requirements: ['Score 90%+ on remaining exams', 'Perfect homework completion', 'Active class engagement'],
    },
    realistic: {
      finalGrade: clamp(predicted, 0, 100),
      probability: 0.5,
      requirements: ['Maintain current study pace', 'Complete all assignments', 'Regular attendance'],
    },
    conservative: {
      finalGrade: clamp(predicted - 5, 0, 100),
      probability: 0.25,
      requirements: ['Meet minimum requirements', 'Submit 80% of assignments', 'Basic attendance'],
    },
  };

  return {
    predictedGrade: Math.round(predicted * 100) / 100,
    confidence,
    letterGrade,
    probabilityDistribution,
    recommendations,
    riskFactors,
    targetGrades,
    scenarios,
  };
}

// --- API ENDPOINTS ---

app.post('/api/predict', (req, res) => {
  try {
    const result = buildPrediction(req.body || {});
    res.json(result);
  } catch (e) {
    res.status(400).json({ error: 'Invalid input' });
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
    console.error('Gemini chat error:', err?.response?.data || err?.message || err);
    const status = err?.response?.status || 500;
    return res.status(status).json({ error: 'AI chat failed. Check server logs.' });
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
    // Note: We bypass the 'geminiGenerate' helper here to support arrays (multimodal)
    // UPDATED: Use generateContentSafe for fallback support
    const analysis = await generateContentSafe([textPrompt, imagePart]);

    return res.json({ analysis, analysisType });
  } catch (err) {
    console.error('Gemini image analysis error:', err?.response?.data || err?.message || err);
    const status = err?.response?.status || 500;
    return res.status(status).json({ error: 'AI image analysis failed. Check server logs.' });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`API server listening on http://localhost:${PORT}`);
  });
}

module.exports = app;