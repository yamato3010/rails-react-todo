import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTasks } from '../api/axios';
import { Task } from '../types/task';
import { isTokenExpired } from '../utils/auth';
import TaskCalendar from './Calendar';
import TaskList from './TaskList';

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await fetchTasks();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError('タスクの取得に失敗しました。');
      console.error('タスクの取得エラー:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem('token');
      navigate('/');
    }
  }, [navigate]);

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  };

  const handleTaskCreate = (newTask: Task) => {
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const handleTaskDelete = (taskId: number) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const handleLogout = () => {
    if (window.confirm('ログアウトしますか？')) {
      localStorage.removeItem('token');
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#7f8c8d'
      }}>
        読み込み中...
      </div>
    );
  }

  return (
    <div style={{
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
      backgroundColor: '#ecf0f1',
      minHeight: '100vh'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ margin: 0, color: '#2c3e50' }}>ダッシュボード</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: '#7f8c8d', fontSize: '14px' }}>
            総タスク数: {tasks.length} | 完了: {tasks.filter(t => t.completed).length} | 未完了: {tasks.filter(t => !t.completed).length}
          </span>
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#c0392b'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#e74c3c'}
          >
            ログアウト
          </button>
        </div>
      </div>

      {error && (
        <div style={{
          padding: '16px',
          backgroundColor: '#e74c3c',
          color: 'white',
          borderRadius: '8px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>{error}</span>
          <button
            onClick={loadTasks}
            style={{
              padding: '4px 8px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            再試行
          </button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <TaskCalendar tasks={tasks} />
        </div>
        <div>
          <TaskList
            tasks={tasks}
            onTaskUpdate={handleTaskUpdate}
            onTaskCreate={handleTaskCreate}
            onTaskDelete={handleTaskDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
