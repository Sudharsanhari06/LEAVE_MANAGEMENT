import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
  
      try {
        const leavesResponse = await fetch('http://localhost:3003/leaverequest/statusapproved', {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        const leavesData = await leavesResponse.json();
  
        const holidaysResponse = await fetch('http://localhost:3003/holidays', {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        const holidaysData = await holidaysResponse.json();
  
        const leaveEvents = leavesData.result.map(leave => ({
          title: `${leave.type_name}`,
          start: new Date(leave.start_date),
          end: new Date(leave.end_date),
          type: 'leave'
        }));
  
        const holidayEvents = holidaysData.result.map(holi => ({
          title: holi.holiday_name,
          start: new Date(holi.holiday_date),
          end: new Date(holi.holiday_date),
          type: 'holiday'
        }));
  
        setEvents([...leaveEvents, ...holidayEvents]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);
  

  const eventStyleGetter = (event) => {
    let backgroundColor = '#3174ad';
    if (event.type === 'holiday') backgroundColor = '#f44336'; // red for holiday
    if (event.type === 'leave') backgroundColor = '#4caf50';   // green for leave

    return { style: { backgroundColor, color: 'white' } };
  };

  const isWeekend = date => {
    const day = moment(date).day();
    return day === 0 || day === 6; 
  };

  const dayPropGetter = date => {
    if (isWeekend(date)) {
      return { style: { backgroundColor: '#e0e0e0' } }; // gray for weekends
    }
  };

  return (
    <div style={{ height: '80vh', padding: '20px' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        eventPropGetter={eventStyleGetter}
        dayPropGetter={dayPropGetter}
      />
    </div>
  );
};

export default MyCalendar;
