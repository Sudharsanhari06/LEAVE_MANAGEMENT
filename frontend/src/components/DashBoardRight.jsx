import React from 'react'
import LeaveBalance from './LeaveBalance';
import LeaveRequest from './LeaveRequest';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
const DashBoardRight = () => {

    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("dashboard right side")
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
        <section className="right-side">
            <div className="right-side__header">
                <p> Hey, <span>{userData ? userData.name : 'username'} </span> Welcome To Lumel </p>
                <p>Role: <span>{userData ? userData.role : 'user role'}</span></p>
                
            </div>
            <div className="line"></div>
            <div className="leave-boxes__container">
                <h2>Leaves</h2>
                {userData &&
                    <LeaveBalance employee_id={userData.employee_id} />
                }

            </div>

            <div className="leave-request__container">
                {userData &&
                    <LeaveRequest employee_id={userData.employee_id} />
                }
            </div>
        </section>
    )
}

export default DashBoardRight;
