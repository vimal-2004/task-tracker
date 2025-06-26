const API_URL = 'http://localhost:3001/api';

async function request(path, options = {}) {
  const headers = options.headers || {};
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  const res = await fetch(API_URL + path, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'API error');
  return data;
}

export function register({ name, email, password }) {
  return request('/auth/register', {
    method: 'POST',
    body: { name, email, password },
  });
}

export function login({ email, password }) {
  return request('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

export function getTeams(userId) {
  return request(`/teams?userId=${userId}`);
}

export function createTeam({ name, userId }) {
  return request('/teams', {
    method: 'POST',
    body: { name, userId },
  });
}

export function joinTeam({ teamId, userId }) {
  return request('/teams/join', {
    method: 'POST',
    body: { teamId, userId },
  });
}

export function getTasks(teamId) {
  return request(`/tasks/team/${teamId}`);
}

export function createTask(task) {
  return request('/tasks', {
    method: 'POST',
    body: task,
  });
}

export function updateTask(id, updates) {
  return request(`/tasks/${id}`, {
    method: 'PUT',
    body: updates,
  });
}

export function deleteTask(id) {
  return request(`/tasks/${id}`, {
    method: 'DELETE',
  });
} 