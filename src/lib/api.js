const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const TOKEN_KEY = 'nb_admin_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function adminLogin(password) {
  const res = await fetch(`${API_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  if (!res.ok) throw new Error('Wrong password');
  const data = await res.json();
  setToken(data.token);
  return data.token;
}

async function authed(path) {
  const token = getToken();
  if (!token) throw new Error('Not logged in');
  const res = await fetch(`${API_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) {
    clearToken();
    throw new Error('Session expired — please login again');
  }
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export const fetchStats = () => authed('/api/admin/stats');
export const fetchVisitors = (page = 1, limit = 50) =>
  authed(`/api/admin/visitors?page=${page}&limit=${limit}`);

export async function fetchPublicCount() {
  const res = await fetch(`${API_URL}/api/public/count`);
  if (!res.ok) throw new Error('Failed to load count');
  return res.json();
}
