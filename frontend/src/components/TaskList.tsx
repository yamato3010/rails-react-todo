import React, { useState } from 'react';
import { Task, CreateTaskData } from '../types/task';
import { updateTask, createTask, deleteTask } from '../api/axios';

interface TaskListProps {
  tasks: Task[];
  onTaskUpdate: (updatedTask: Task) => void;
  onTaskCreate: (newTask: Task) => void;
  onTaskDelete: (taskId: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskUpdate, onTaskCreate, onTaskDelete }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newTask, setNewTask] = useState<CreateTaskData>({
    title: '',
    description: '',
    due_date: '',
    priority: 'medium'
  });

  const handleToggleComplete = async (task: Task) => {
    try {
      const updatedTask = await updateTask(task.id, { completed: !task.completed });
      onTaskUpdate(updatedTask);
    } catch (error) {
      console.error('タスクの更新に失敗しました:', error);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim() || !newTask.due_date) return;

    try {
      const createdTask = await createTask(newTask);
      onTaskCreate(createdTask);
      setNewTask({ title: '', description: '', due_date: '', priority: 'medium' });
      setIsCreating(false);
    } catch (error) {
      console.error('タスクの作成に失敗しました:', error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!window.confirm('このタスクを削除しますか？')) return;

    try {
      await deleteTask(taskId);
      onTaskDelete(taskId);
    } catch (error) {
      console.error('タスクの削除に失敗しました:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ff4757';
      case 'medium': return '#ffa502';
      case 'low': return '#2ed573';
      default: return '#747d8c';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    // 完了していないタスクを上に
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    // 期限が近いものを上に
    return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
  });

  return (
    <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: '#2c3e50' }}>タスク一覧</h2>
        <button
          onClick={() => setIsCreating(true)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          + 新しいタスク
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreateTask} style={{ 
          marginBottom: '20px', 
          padding: '16px', 
          backgroundColor: 'white', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ marginBottom: '12px' }}>
            <input
              type="text"
              placeholder="タスクのタイトル"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
              required
            />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <textarea
              placeholder="説明（任意）"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                minHeight: '60px',
                resize: 'vertical'
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
            <input
              type="datetime-local"
              value={newTask.due_date}
              onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
              required
            />
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as 'low' | 'medium' | 'high' })}
              style={{
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              <option value="low">低</option>
              <option value="medium">中</option>
              <option value="high">高</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="submit"
              style={{
                padding: '8px 16px',
                backgroundColor: '#27ae60',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              作成
            </button>
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setNewTask({ title: '', description: '', due_date: '', priority: 'medium' });
              }}
              style={{
                padding: '8px 16px',
                backgroundColor: '#95a5a6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              キャンセル
            </button>
          </div>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {sortedTasks.map((task) => (
          <div
            key={task.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              opacity: task.completed ? 0.7 : 1,
              transition: 'all 0.2s ease'
            }}
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggleComplete(task)}
              style={{
                marginRight: '12px',
                transform: 'scale(1.2)',
                cursor: 'pointer'
              }}
            />
            
            <div style={{ flex: 1 }}>
              <div style={{
                textDecoration: task.completed ? 'line-through' : 'none',
                fontWeight: 'bold',
                color: task.completed ? '#95a5a6' : '#2c3e50',
                marginBottom: '4px'
              }}>
                {task.title}
              </div>
              
              {task.description && (
                <div style={{
                  fontSize: '12px',
                  color: '#7f8c8d',
                  marginBottom: '4px'
                }}>
                  {task.description}
                </div>
              )}
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  fontSize: '12px',
                  color: '#7f8c8d'
                }}>
                  期限: {formatDate(task.due_date)}
                </span>
                
                <span style={{
                  fontSize: '10px',
                  padding: '2px 6px',
                  borderRadius: '12px',
                  backgroundColor: getPriorityColor(task.priority),
                  color: 'white',
                  fontWeight: 'bold'
                }}>
                  {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
                </span>
              </div>
            </div>
            
            <button
              onClick={() => handleDeleteTask(task.id)}
              style={{
                padding: '4px 8px',
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              削除
            </button>
          </div>
        ))}
        
        {tasks.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#7f8c8d',
            fontSize: '14px'
          }}>
            タスクがありません。新しいタスクを作成してください。
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
