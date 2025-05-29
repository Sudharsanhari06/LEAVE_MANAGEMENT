import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../styles/dashboard.css';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';


function Dashboard() {
const navigate = useNavigate();

  const notyf = new Notyf({
    duration: 1000,
    position: {
      x: 'right',
      y: 'top',
    },
  });


  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        notyf.error('Unauthorized. Please login first.');
        navigate('/');
        return;
      }
    }
    fetchDashboard();
  }, [])
  return (
    <div className='dashboard-container'>
      <Sidebar />
      <div className='right-side'>
        <Outlet />
      </div>
    </div>
  );
}
export default Dashboard;
