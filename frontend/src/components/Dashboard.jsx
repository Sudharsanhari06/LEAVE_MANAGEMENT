import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';
import LeaveRequest from './LeaveRequest';
import LeaveBalance from './LeaveBalance';
function Dashboard() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();



  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Unauthorized. Please login first.');
        navigate('/');
        return;
      }
      try {
        const response = await fetch('http://localhost:3003/api/dashboard', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });


        if (response.ok) {
          const data = await response.json();
          setUserData(data);
          console.log("DATA", data);
        } else {
          alert('Unauthorized or token expired');
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching dashboard:', error);
        navigate('/');
      }
    };

    fetchDashboard();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className='dashboard-container'>
      <div className="left-side">
        <button>Dashboard</button>
        <button onClick={logout}>Logout</button>
      </div>
      <div className="right-side">
        <div className="right-side__header">
          <h2>Welcome To Lumel</h2>
          <p> Name:  {userData ? userData.name : 'username'}</p>
          <p>Role:{userData ? userData.role : 'user role'}</p>
        </div>

        <div className="line"></div>
        <div className="leave-boxes__container">
          <h2 >Leaves</h2>
          <div className="leave-boxes">
          {userData &&
          <LeaveBalance employee_id={userData.employee_id} />
        }
            {/* <div className="leave-box total">Total leave Remaings</div>
            <div className="leave-box sick">Available Sick Leaves</div>
            <div className="leave-box casual">Available Casual Leaves</div> */}
          </div>
        </div>
      
        <div className="leave-request__container">
          {userData &&
            <LeaveRequest employee_id={userData.employee_id} />
          }
        </div>
      </div>



    </div>
  );
}
export default Dashboard;