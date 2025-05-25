import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (credentials: { email: string; password: string }) => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
};

export const fetchTasks = async () => {
  const response = await apiClient.get('/tasks');
  return response.data;
};

export const createTask = async (task: { title: string; description?: string; due_date: string; priority?: string }) => {
  const response = await apiClient.post('/tasks', { task });
  return response.data;
};

export const updateTask = async (id: number, task: { title?: string; description?: string; due_date?: string; completed?: boolean; priority?: string }) => {
  const response = await apiClient.put(`/tasks/${id}`, { task });
  return response.data;
};

export const deleteTask = async (id: number) => {
  const response = await apiClient.delete(`/tasks/${id}`);
  return response.data;
};

export const signup = async (data: { name: string; email: string; password: string; password_confirmation: string }) => {
  const response = await apiClient.post('/users', data);
  return response.data;
};

export default apiClient;
