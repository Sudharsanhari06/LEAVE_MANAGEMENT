import React, {useState,useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import UserSidebar from './UserSidebar';
import Sidebar from './Sidebar';
import '../styles/dashboard.css';
import '../styles/admin.css';


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

  return (
    <div className='dashboard-container'>
     {userData &&
      userData.role==='Hr'?<Sidebar/>:<UserSidebar />
     }
      <div className='right-side'>
        <Outlet/>
      </div>
    </div>
  );
}
export default Dashboard;

