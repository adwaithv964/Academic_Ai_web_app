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
};

export const scenarios = {
  list: () => client.get('/scenarios').then(r => r.data),
  create: (data) => client.post('/scenarios', data).then(r => r.data),
};

export const documents = {
  list: () => client.get('/documents').then(r => r.data),
};

export const predictions = {
  list: () => client.get('/predictions').then(r => r.data),
};

export default {
  user,
  tasks,
  sessions,
  courses,
  scenarios,
  documents,
  predictions,
  predictGrades,
  health
};
