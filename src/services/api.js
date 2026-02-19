import axios from 'axios';

import { auth } from './firebase';

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

// Add a request interceptor to attach the Token
client.interceptors.request.use(async (config) => {
  try {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error("Error attaching auth token:", error);
  }
  return config;
});

// --- Existing Methods ---
export async function predictGrades(payload) {
  const { data } = await client.post('/predict', payload);
  return data;
}

export async function health() {
  const { data } = await client.get('/health');
  return data;
}

// --- New Feature APIs ---

export const user = {
  get: () => client.get('/user').then(r => r.data),
  update: (data) => client.post('/user', data).then(r => r.data),
  updateTheme: (theme) => client.put('/user/theme', { theme }).then(r => r.data),
};

export const tasks = {
  list: () => client.get('/tasks').then(r => r.data),
  create: (data) => client.post('/tasks', data).then(r => r.data),
  update: (id, data) => client.put(`/tasks/${id}`, data).then(r => r.data),
  delete: (id) => client.delete(`/tasks/${id}`).then(r => r.data),
};

export const sessions = {
  list: () => client.get('/study-sessions').then(r => r.data),
  create: (data) => client.post('/study-sessions', data).then(r => r.data),
  update: (id, data) => client.put(`/study-sessions/${id}`, data).then(r => r.data),
  delete: (id) => client.delete(`/study-sessions/${id}`).then(r => r.data),
};

export const courses = {
  list: () => client.get('/courses').then(r => r.data),
  create: (data) => client.post('/courses', data).then(r => r.data),
  update: (id, data) => client.put(`/courses/${id}`, data).then(r => r.data),
  delete: (id) => client.delete(`/courses/${id}`).then(r => r.data),
};

export const exams = {
  list: () => client.get('/exams').then(r => r.data),
  create: (data) => client.post('/exams', data).then(r => r.data),
  update: (id, data) => client.put(`/exams/${id}`, data).then(r => r.data),
  delete: (id) => client.delete(`/exams/${id}`).then(r => r.data),
};

export const scenarios = {
  list: () => client.get('/scenarios').then(r => r.data),
  create: (data) => client.post('/scenarios', data).then(r => r.data),
};

export const documents = {
  list: () => client.get('/documents').then(r => r.data),
  upload: (formData) => client.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(r => r.data),
  update: (id, data) => client.put(`/documents/${id}`, data).then(r => r.data),
  delete: (id) => client.delete(`/documents/${id}`).then(r => r.data),
  getDownloadUrl: (id) => `${apiBase}/documents/${id}/download`,
  download: (id) => client.get(`/documents/${id}/download`, { responseType: 'blob' }).then(r => r.data),
};

export const terms = {
  get: () => client.get('/terms').then(r => r.data),
  save: (data) => client.post('/terms', data).then(r => r.data),
};

export const webReferences = {
  list: () => client.get('/web-references').then(r => r.data),
  create: (data) => client.post('/web-references', data).then(r => r.data),
  update: (id, data) => client.put(`/web-references/${id}`, data).then(r => r.data),
  delete: (id) => client.delete(`/web-references/${id}`).then(r => r.data),
};

export const predictions = {
  list: () => client.get('/predictions').then(r => r.data),
};

export const eisenhowerTasks = {
  list: () => client.get('/eisenhower-tasks').then(r => r.data),
  create: (data) => client.post('/eisenhower-tasks', data).then(r => r.data),
  update: (id, data) => client.put(`/eisenhower-tasks/${id}`, data).then(r => r.data),
  delete: (id) => client.delete(`/eisenhower-tasks/${id}`).then(r => r.data),
};

export const gamification = {
  getStats: () => client.get('/achievements/stats').then(r => r.data),
  getGamification: () => client.get('/achievements').then(r => r.data),
  getLeaderboard: () => client.get('/leaderboard').then(r => r.data),
  getStoreItems: () => client.get('/store/items').then(r => r.data),
  buyItem: (itemId) => client.post('/store/buy', { itemId }).then(r => r.data),
  getQuests: () => client.get(`/quests`).then(r => r.data),
  claimQuest: (questId) => client.post('/quests/claim', { questId }).then(r => r.data),
  growGarden: (minutes) => client.post('/garden/grow', { minutes }).then(r => r.data),
  getGarden: () => client.get('/garden').then(r => r.data)
};

export const history = {
  list: () => client.get('/history').then(r => r.data),
};

export const events = {
  list: () => client.get('/events').then(r => r.data),
  create: (data) => client.post('/events', data).then(r => r.data),
  update: (id, data) => client.put(`/events/${id}`, data).then(r => r.data),
  delete: (id) => client.delete(`/events/${id}`).then(r => r.data),
};

export const vacations = {
  list: () => client.get('/vacations').then(r => r.data),
  create: (data) => client.post('/vacations', data).then(r => r.data),
  update: (id, data) => client.put(`/vacations/${id}`, data).then(r => r.data),
  delete: (id) => client.delete(`/vacations/${id}`).then(r => r.data),
};

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
  history,
  events,
  vacations,
  terms,
  predictGrades,
  health
};
