import React, { useEffect, useState ,useContext} from 'react';
import '../styles/teamcalender.css'
import { AuthContext } from './AuthContext';

const TeamLeaveCalendar = () => {
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [month, setMonth] = useState(4); // May (0-indexed)
  const [year, setYear] = useState(2025);
  const { user } = useContext(AuthContext);


  console.log("user team calender",user);

  useEffect(() => {
    const fetchLeaves = async () => {
     

      const start = `${year}-${String(month + 1).padStart(2, '0')}-01`;
      const end = `${year}-${String(month + 1).padStart(2, '0')}-${getDaysInMonth(year, month)}`;

      const res = await fetch(`http://localhost:3006/leaverequest/team-calender?start=${start}&end=${end}`,{
        method:'GET',
        headers:{
            'Authorization':`Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      setLeaves(data);
    };

    fetchLeaves();
  }, [month, year]);

  useEffect(() => {
    const names = [...new Set(leaves.map(l => l.employee_name))];
    setEmployees(names);
  }, [leaves]);

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate(); // last day of current month
  };

  const getLeaveDates = (employee) => {
    const result = new Set();

    leaves
      .filter(l => l.employee_name === employee)
      .forEach(leave => {
        const start = new Date(leave.start_date);
        const end = new Date(leave.end_date);

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          if (d.getMonth() === month && d.getFullYear() === year) {
            result.add(d.getDate());
          }
        }
      });

    return result;
  };

  const handleMonthChange = (direction) => {
    if (direction === 'prev') {
      setMonth(prev => (prev === 0 ? 11 : prev - 1));
      if (month === 0) setYear(y => y - 1);
    } else {
      setMonth(prev => (prev === 11 ? 0 : prev + 1));
      if (month === 11) setYear(y => y + 1);
    }
  };

  const daysInMonth = getDaysInMonth(year, month);
  const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });

  return (
    <div className="team-calendar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={() => handleMonthChange('prev')}>◀</button>
        <h2>{monthName} {year}</h2>
        <button onClick={() => handleMonthChange('next')}>▶</button>
      </div>

      <table border="1" cellPadding="4" cellSpacing="0">
        <thead>
          <tr>
            <th>Employee</th>
            {[...Array(daysInMonth)].map((_, i) => (
              <th key={i + 1}>{i + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => {
            const leaveDays = getLeaveDates(emp);
            return (
              <tr key={emp}>
                <td>{emp}</td>
                {[...Array(daysInMonth)].map((_, dayIndex) => {
                  const day = dayIndex + 1;
                  const isLeave = leaveDays.has(day);
                  return (
                    <td
                      key={day}
                      style={{
                        backgroundColor: isLeave ? '#facc15' : 'white',
                        textAlign: 'center'
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
