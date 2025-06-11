import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import '../styles/teamcalender.css';

const leaveTypeColors = {
  sick: '#f87171',
  paid: '#06b6d4',
  unpaid: '#9ca3af',
};

const TeamLeaveCalendar = () => {
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [month, setMonth] = useState(5); // June (0-indexed)
  const [year, setYear] = useState(2025);
  const [holidays, setHolidays] = useState([]);
  const { user } = useContext(AuthContext);

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

  useEffect(() => {
    const fetchLeavesAndHolidays = async () => {
      const start = `${year}-${String(month + 1).padStart(2, '0')}-01`;
      const end = `${year}-${String(month + 1).padStart(2, '0')}-${getDaysInMonth(year, month)}`;
      const token = localStorage.getItem('token');

      const [leavesRes, holidaysRes] = await Promise.all([
        fetch(`http://localhost:3006/leaverequest/team-calender?start=${start}&end=${end}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`http://localhost:3006/holidays/calender?start=${start}&end=${end}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const leavesData = await leavesRes.json();
      const holidayData = await holidaysRes.json();

      setLeaves(leavesData);
      setHolidays(holidayData.result); // Save holidays
      console.log("leavesData", leavesData);
      console.log("holidayData", holidayData);
    };

    fetchLeavesAndHolidays();
  }, [month, year]);

  useEffect(() => {
    const names = [...new Set(leaves.map(l => l.employee_name))];
    setEmployees(names);
  }, [leaves]);

  const groupConsecutiveLeaves = (employeeLeaves) => {
    const result = [];
    employeeLeaves.forEach(leave => {
      let current = new Date(leave.start_date);
      const end = new Date(leave.end_date);
      while (current <= end) {
        if (current.getMonth() === month && current.getFullYear() === year) {
          result.push({ day: current.getDate(), type: leave.leave_type });
        }
        current.setDate(current.getDate() + 1);
      }
    });

    result.sort((a, b) => a.day - b.day);

    const blocks = [];

    let i = 0;
    while (i < result.length) {
      const type = result[i].type;
      let start = result[i].day;
      let end = start;
      while (i + 1 < result.length && result[i + 1].type === type && result[i + 1].day === result[i].day + 1) {
        end = result[i + 1].day;
        i++;
      }
      blocks.push({ start, end, type });
      i++;
    }

    return blocks;
  };

  const handleMonthChange = (direction) => {
    if (direction === 'prev') {
      setMonth(prev => prev === 0 ? 11 : prev - 1);
      if (month === 0) setYear(y => y - 1);
    } else {
      setMonth(prev => prev === 11 ? 0 : prev + 1);
      if (month === 11) setYear(y => y + 1);
    }
  };





  const daysInMonth = getDaysInMonth(year, month);
  const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });

  return (
    <div className="team-calendar">
      <div className="calendar-header">
        <button onClick={() => handleMonthChange('prev')}>◀</button>
        <h2>{monthName} {year}</h2>
        <button onClick={() => handleMonthChange('next')}>▶</button>
      </div>

      <table className="calendar-table">
        <thead>

          <tr className='employee-head'>
        
            <th className="employee-name-head">Employee</th>
        
            {[...Array(daysInMonth)].map((_, i) => {
              const date = new Date(year, month, i + 1);
              const dayName = date.toLocaleString('en-us', { weekday: 'short' });
              return (
              <th key={i + 1}>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>{dayName}</div>
                  <div>{i + 1}</div>
                </th>
              
              );
            })}
           
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => {
            const empLeaves = leaves.filter(l => l.employee_name === emp);
            const blocks = groupConsecutiveLeaves(empLeaves);
            return (
              <tr key={emp}>
                <td className="employee-name">{emp}</td>
                {[...Array(daysInMonth)].map((_, dayIndex) => {
                  const day = dayIndex + 1;
                  const date = new Date(year, month, day);

                  const isHoliday = holidays.some(h => {
                    const holidayDate = new Date(h.holiday_date);
                    return (
                      holidayDate.getDate() === day &&
                      holidayDate.getMonth() === month &&
                      holidayDate.getFullYear() === year
                    );
                  });
                  console.log(isHoliday);

                  const block = blocks.find(b => b.start <= day && b.end >= day);
                  const isStart = block?.start === day;
                  const isEnd = block?.end === day;

                  const isWeekend = date.getDay() === 0 || date.getDay() === 6;

                  return (
                    <td
                      key={day}
                      style={{
                        backgroundColor: isHoliday
                          ? '#dc2626' // red for holiday
                          : block
                            ? leaveTypeColors[block.type] || '#facc15'
                            : isWeekend
                              ? '#1e293b'
                              : 'transparent',
                        borderRadius: block
                          ? isStart && isEnd
                            ? '999px'
                            : isStart
                              ? '999px 0 0 999px'
                              : isEnd
                                ? '0 999px 999px 0'
                                : '0'
                          : '',
                        color: block || isHoliday ? 'white' : '#cbd5e1',
                        textAlign: 'center',
                        padding: '4px 8px',
                      }}
                    >
                      {day}
                    </td>
                  );
                })}

              </tr>
            );
          })}
        </tbody>

      </table>
    </div>
  );
};

export default TeamLeaveCalendar;
