import axios from 'axios';

let apiBase = import.meta.env.VITE_API_BASE_URL || '/api';

// Ensure apiBase ends with /api if it's a full URL
if (apiBase.startsWith('http') && !apiBase.endsWith('/api')) {
  apiBase = apiBase.replace(/\/$/, '') + '/api';
}

const client = axios.create({
  baseURL: apiBase,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ... (rest of imports/exports) ...

export default {
  user,
  tasks,
  sessions,
  courses,
  exams,
  scenarios,
  documents,
  webReferences,
  predictions,
  eisenhowerTasks,
  gamification,
  predictGrades,
  health
};
