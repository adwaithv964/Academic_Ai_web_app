import axios from 'axios';

const apiBase = import.meta.env.VITE_API_BASE_URL || '/api';

const client = axios.create({
  baseURL: apiBase,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function predictGrades(payload) {
  const { data } = await client.post('/predict', payload);
  return data;
}

export async function health() {
  const { data } = await client.get('/health');
  return data;
}
