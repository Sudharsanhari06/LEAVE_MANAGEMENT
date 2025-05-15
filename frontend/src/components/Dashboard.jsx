import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';



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
        <h2>Welcome To Lumel</h2>

        <p> Name:  { userData ? userData.name:'username'}</p>
        <p>Role:{ userData ? userData.role:'user role'}</p>


        <div className="line"></div>
        <div className="leave-boxes">
           <div className="leave-box">Total leave Remaings:</div>
           <div className="leave-box"></div>
           <div className="leave-box"></div>
        </div>
      </div>







    </div>
  );
}
export default Dashboard;