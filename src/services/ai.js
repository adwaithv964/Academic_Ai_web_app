import axios from 'axios';

const apiBase = import.meta.env.VITE_API_BASE_URL || '/api';

const client = axios.create({
  baseURL: apiBase,
  timeout: 30000,
});

export async function chat(message, subject = 'general') {
  const { data } = await client.post('/ai/chat', { message, subject });
  return data; // { text }
}

export async function analyzeImage(file, analysisType = 'general') {
  const form = new FormData();
  form.append('image', file);
  form.append('analysisType', analysisType);
  const { data } = await client.post('/ai/analyze-image', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data; // { analysis, analysisType }
}
