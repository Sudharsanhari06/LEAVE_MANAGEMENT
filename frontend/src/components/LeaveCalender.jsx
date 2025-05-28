import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const [events, setEvents] = useState([]);
  const [visibleRange, setVisibleRange] = useState({
    start: moment().startOf('month'),
    end: moment().endOf('month'),
  });
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('month');


  useEffect(() => {
    const token = localStorage.getItem('token');
    const startDate = visibleRange.start.format('YYYY-MM-DD');
    const endDate = visibleRange.end.format('YYYY-MM-DD');

    const fetchData = async () => {
      try {
        const [leavesResponse, holidaysResponse] = await Promise.all([
          fetch(`http://localhost:3003/leaverequest/statusapproved?start=${startDate}&end=${endDate}`, {
            headers: { authorization: `Bearer ${token}` },
          }),
          fetch(`http://localhost:3003/holidays/calender?start=${startDate}&end=${endDate}`, {
            headers: { authorization: `Bearer ${token}` },
          }),
        ]);

        const leavesData = await leavesResponse.json();
        const holidaysData = await holidaysResponse.json();


        const leaveEvents = leavesData.result.map(leave => ({
          title: leave.type_name,
          start: new Date(leave.start_date),
          end: new Date(leave.end_date),
          type: 'leave',
        }));


        const holidayEvents = holidaysData.result.map(holi => ({
          title: holi.holiday_name,
          start: new Date(holi.holiday_date),
          end: new Date(holi.holiday_date),
          type: 'holiday',
        }));

        setEvents([...leaveEvents, ...holidayEvents]);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [visibleRange]);


  const eventStyleGetter = event => {
    const color = event.type === 'holiday' ? '#f44336' : '#4caf50';
    return { style: { backgroundColor: color, color: 'white' } };
  };

  const dayPropGetter = date => {
    const day = moment(date).day();
    if (day === 0 || day === 6) return { style: { backgroundColor: '#e0e0e0' } };
  };

  const onRangeChange = (range, view) => {
    if (view === 'month') {
      setVisibleRange({
        start: moment(range).startOf('month'),
        end: moment(range).endOf('month'),
      });
    } else if (Array.isArray(range)) {
      setVisibleRange({
        start: moment(range[0]),
        end: moment(range[range.length - 1]),
      });
    } else if (range.start && range.end) {
      setVisibleRange({
        start: moment(range.start),
        end: moment(range.end),
      });
    }
  };

  const onNavigate = (date) => {
    setCurrentDate(date);
    if (currentView === 'month') {
      setVisibleRange({
        start: moment(date).startOf('month'),
        end: moment(date).endOf('month'),
      });
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
        onRangeChange={onRangeChange}
        onNavigate={onNavigate}
        view={currentView}
        date={currentDate}
        onView={view => setCurrentView(view)}
        views={['month']}
      />
    </div>
  );
};

export default MyCalendar;
