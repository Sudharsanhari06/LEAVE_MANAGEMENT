import React from 'react'
import LeaveBalance from './LeaveBalance';
import LeaveRequest from './LeaveRequest';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaBell } from 'react-icons/fa';
import ManagerRequest from './ManagerRequest';

const DashBoardRight = () => {

    const [userData, setUserData] = useState(null);
    // const [showRequest, setShowRequest] = useState(false);
    const [leaveCount, setLeaveCount] = useState(0);
    const [showRequest, setShowRequest] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {

        console.log("dashboard right side");
        const fetchDashboard = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Unauthorized. Please login first.');
                navigate('/');
                return;
            }
            try {
                const response = await fetch('http://localhost:3006/api/dashboard', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                    console.log("USER DATA", data);
                } else {
                    alert('Unauthorized token');
                    navigate('/');
                }
            } catch (error) {
                console.error('Error fetching dashboard:', error);
                navigate('/');
            }
        };
        fetchDashboard();
    }, []);


    useEffect(() => {
        const fetchLeaveCount = async () => {
            const token = localStorage.getItem('token');
            try {
                const role = userData?.role;
                const approverId = userData?.employee_id;

                const response = await fetch(
                    `http://localhost:3006/leaveapproval/mapped?role=${role}&approved_by=${approverId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    }
                );
                const data = await response.json();
                setLeaveCount(data.length); // Set notification count
            } catch (error) {
                console.error("Error fetching initial leave count:", error);
            }
        };


        fetchLeaveCount();
    }, [userData]);




    return (
        <section className="right-side">
            <div className="right-side__header">
                <div className='header-firstside'>
                    <p> Hey, <span>{userData ? userData.name : 'username'} </span> Welcome To Lumel </p>
                    <div className='employee_role'>-  {userData ? userData.role : 'userrole'}</div>
                </div>
                {['manager', 'hr', 'director'].includes(userData?.role) && (
                    <p onClick={() => {
                        setShowRequest(prev => !prev)
                    }} >
                        <FaBell className='bell-icon' />
                        {leaveCount > 0 && (
                            <span className='bell-circle'>{leaveCount}</span>
                        )}

                    </p>
                )}

            </div>

            {showRequest && userData ? (
                <ManagerRequest role={userData.role} approverId={userData.employee_id} setLeaveCount={setLeaveCount} />
            ) : (
                <div>

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
                </div>
            )}
        </section>
    )
}

export default DashBoardRight;
