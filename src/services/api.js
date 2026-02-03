import axios from 'axios';

const apiBase = import.meta.env.VITE_API_BASE_URL || '/api';

const client = axios.create({
  baseURL: apiBase,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
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
  getLeaderboard: () => client.get('/leaderboard').then(r => r.data),
  getStoreItems: () => client.get('/store/items').then(r => r.data),
  buyItem: (userId, itemId) => client.post('/store/buy', { userId, itemId }).then(r => r.data),
  getQuests: (userId) => client.get(`/quests?userId=${userId}`).then(r => r.data),
  claimQuest: (userId, questId) => client.post('/quests/claim', { userId, questId }).then(r => r.data),
  growGarden: (userId, minutes) => client.post('/garden/grow', { userId, minutes }).then(r => r.data)
};

export default {
  user,
  tasks,
  sessions,
  courses,
  exams,
  scenarios,
  documents,
  documents,
  webReferences,
  predictions,
  predictions,
  eisenhowerTasks,
  gamification,
  predictGrades,
  health
};
