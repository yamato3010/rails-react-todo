import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const TaskCalendar: React.FC<{ tasks: any[] }> = ({ tasks }) => {
  const events = tasks.map((task) => ({
    title: task.title,
    start: new Date(task.due_date),
    end: new Date(task.due_date),
  }));

  return (
    <div>
      <h1>カレンダー</h1>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </div>
  );
};

export default TaskCalendar;