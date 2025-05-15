import React, { useEffect, useState } from 'react';
import { fetchTasks } from '../api/axios';
import TaskCalendar from './Calendar';
import { useNavigate } from 'react-router-dom';
import { isTokenExpired } from '../utils/auth';

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await fetchTasks();
        setTasks(data);
      } catch (err) {
        setError('タスクの取得に失敗しました。');
      }
    };
    loadTasks();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem('token'); // 期限切れの場合はトークンを削除
      navigate('/'); // ログイン画面にリダイレクト
    }
  }, [navigate]);

  return (
    <div>
      <TaskCalendar tasks={tasks} />
      <h1>タスク一覧</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {tasks.map((task: any) => (
          <li key={task.id}>
            <strong>{task.title}</strong> - {task.due_date}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;