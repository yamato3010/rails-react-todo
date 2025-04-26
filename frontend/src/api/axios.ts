import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async (credentials: { email: string; password: string }) => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
};

export const fetchTasks = async () => {
  const token = localStorage.getItem('token');
  const response = await apiClient.get('/tasks', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};