import moment from 'moment';
import React, { useState } from 'react';
import { Calendar, Event, momentLocalizer, View } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Task } from '../types/task';

const localizer = momentLocalizer(moment);

interface TaskEvent extends Event {
  resource: Task;
}

interface TaskCalendarProps {
  tasks: Task[];
  onTaskSelect?: (task: Task) => void;
}

const TaskCalendar: React.FC<TaskCalendarProps> = ({ tasks, onTaskSelect }) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [view, setView] = useState<View>('month');
  const [date, setDate] = useState(new Date());

  const events: TaskEvent[] = tasks.map((task) => ({
    title: task.completed ? `✓ ${task.title}` : task.title,
    start: new Date(task.due_date),
    end: new Date(task.due_date),
    resource: task,
  }));

  const eventStyleGetter = (event: TaskEvent) => {
    const task = event.resource;
    let backgroundColor = '#3498db';

    if (task.completed) {
      backgroundColor = '#95a5a6';
    } else {
      switch (task.priority) {
        case 'high':
          backgroundColor = '#e74c3c';
          break;
        case 'medium':
          backgroundColor = '#f39c12';
          break;
        case 'low':
          backgroundColor = '#27ae60';
          break;
      }
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: task.completed ? 0.7 : 1,
        color: 'white',
        border: 'none',
        fontSize: '12px',
        textDecoration: task.completed ? 'line-through' : 'none'
      }
    };
  };

  const handleSelectEvent = (event: TaskEvent) => {
    setSelectedTask(event.resource);
    if (onTaskSelect) {
      onTaskSelect(event.resource);
    }
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
  };

  const formatDate = (dateString: string) => {
    return moment(dateString).format('YYYY年MM月DD日 HH:mm');
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
      default: return '不明';
    }
  };

  // カレンダーのナビゲーションハンドラー
  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
  };

  // カレンダーのビュー変更ハンドラー
  const handleViewChange = (newView: View) => {
    setView(newView);
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
      <h2 style={{ margin: '0 0 20px 0', color: '#2c3e50' }}>カレンダー</h2>

      <div style={{ marginBottom: '16px', display: 'flex', gap: '16px', fontSize: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: '#e74c3c', borderRadius: '2px' }}></div>
          <span>高優先度</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: '#f39c12', borderRadius: '2px' }}></div>
          <span>中優先度</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: '#27ae60', borderRadius: '2px' }}></div>
          <span>低優先度</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: '#95a5a6', borderRadius: '2px' }}></div>
          <span>完了済み</span>
        </div>
      </div>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, backgroundColor: 'white', borderRadius: '8px', padding: '16px' }}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={handleSelectEvent}
        onNavigate={handleNavigate}
        onView={handleViewChange}
        date={date}
        view={view}
        messages={{
          next: '次',
          previous: '前',
          today: '今日',
          month: '月',
          week: '週',
          day: '日',
          agenda: 'アジェンダ',
          date: '日付',
          time: '時間',
          event: 'イベント',
          noEventsInRange: 'この期間にはイベントがありません',
          showMore: (total: number) => `他 ${total} 件`
        }}
      />

      {selectedTask && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '8px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, color: '#2c3e50' }}>タスク詳細</h3>
              <button
                onClick={handleCloseModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: '#7f8c8d'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <strong style={{ color: '#2c3e50' }}>タイトル:</strong>
              <div style={{
                marginTop: '4px',
                textDecoration: selectedTask.completed ? 'line-through' : 'none',
                color: selectedTask.completed ? '#95a5a6' : '#2c3e50'
              }}>
                {selectedTask.title}
              </div>
            </div>

            {selectedTask.description && (
              <div style={{ marginBottom: '12px' }}>
                <strong style={{ color: '#2c3e50' }}>説明:</strong>
                <div style={{ marginTop: '4px', color: '#7f8c8d' }}>
                  {selectedTask.description}
                </div>
              </div>
            )}

            <div style={{ marginBottom: '12px' }}>
              <strong style={{ color: '#2c3e50' }}>期限:</strong>
              <div style={{ marginTop: '4px', color: '#7f8c8d' }}>
                {formatDate(selectedTask.due_date)}
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <strong style={{ color: '#2c3e50' }}>優先度:</strong>
              <span style={{
                marginLeft: '8px',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold',
                color: 'white',
                backgroundColor: selectedTask.priority === 'high' ? '#e74c3c' :
                                selectedTask.priority === 'medium' ? '#f39c12' : '#27ae60'
              }}>
                {getPriorityText(selectedTask.priority)}
              </span>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <strong style={{ color: '#2c3e50' }}>ステータス:</strong>
              <span style={{
                marginLeft: '8px',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold',
                color: 'white',
                backgroundColor: selectedTask.completed ? '#27ae60' : '#e74c3c'
              }}>
                {selectedTask.completed ? '完了' : '未完了'}
              </span>
            </div>

            <button
              onClick={handleCloseModal}
              style={{
                width: '100%',
                padding: '8px 16px',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCalendar;
