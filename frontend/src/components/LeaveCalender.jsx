import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

const localizer = momentLocalizer(moment);

import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import addDays from 'date-fns/addDays';
import isWeekend from 'date-fns/isWeekend';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import enUS from 'date-fns/locale/en-US';

const locales = {
  'en-US': enUS,
};


const LeaveCalendar = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchLeaves = async () => {
      const res = await fetch('http://localhost:3003/leaves'); // Update with your actual API
      const data = await res.json();

      const leaveEvents = data.map(leave => ({
        title: `${leave.name} (${leave.status})`,
        start: new Date(leave.start_date),
        end: addDays(new Date(leave.end_date), 1),
        allDay: true,
        status: leave.status,
      }));

      const weekends = generateWeekendsForYear(2025);
      const weekendEvents = weekends.map(date => ({
        title: 'Week Off',
        start: date,
        end: date,
        allDay: true,
        status: 'weekend',
      }));

      setEvents([...leaveEvents, ...weekendEvents]);
    };

    fetchLeaves();
  }, []);

  const generateWeekendsForYear = (year) => {
    const weekends = [];
    let date = new Date(`${year}-01-01`);
    while (date.getFullYear() === year) {
      if (isWeekend(date)) weekends.push(new Date(date));
      date = addDays(date, 1);
    }
    return weekends;
  };

  return (
    <div style={{ height: '80vh', margin: '20px' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        eventPropGetter={(event) => {
          let bg = '#3174ad';
          if (event.status === 'approved') bg = 'green';
          else if (event.status === 'pending') bg = 'orange';
          else if (event.status === 'rejected') bg = 'red';
          else if (event.status === 'weekend') bg = '#e0e0e0';

          return {
            style: {
              backgroundColor: bg,
              color: event.status === 'weekend' ? 'black' : 'white',
              borderRadius: '4px',
              border: 'none',
            }
          };
        }}
      />
    </div>
  );
};

export default LeaveCalendar;
