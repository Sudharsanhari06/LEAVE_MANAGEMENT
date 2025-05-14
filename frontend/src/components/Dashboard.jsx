import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
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
    <div style={{ padding: '50px' }}>
      <h2>Dashboard</h2>
      {userData ? (
        <div>
          <p>Welcome, {userData.name}</p>
          <p>Role: {userData.role}</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
export default Dashboard;