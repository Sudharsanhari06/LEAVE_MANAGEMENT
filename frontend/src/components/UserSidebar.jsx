import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import lumel_logo from '../assets/lumel_logo.png';
import { LuLayoutDashboard } from "react-icons/lu";
import { SiPivotaltracker } from "react-icons/si";
import { BiLogOut } from "react-icons/bi";

const UserSidebar = () => {
    const [userData, setUserData] = useState(null);
    const [leaveRequests, setLeaveRequests] = useState([]);
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };
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
                    console.log("Sidebar User Data:", data);
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

   
    useEffect(() => {
        if (userData?.employee_id) {
            const fetchLeaveRequests = async () => {
                try {
                    const res = await fetch(`http://localhost:3003/leaverequest/employee/${userData.employee_id}`, {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    const data = await res.json();
                    setLeaveRequests(data);
                    console.log("Leave Requests:", data);
                } catch (error) {
                    console.error("Fetching leave request error:", error);
                }
            };
            fetchLeaveRequests();
        }
    }, [userData]);

    return (
        <section className="left-side">
            <img src={lumel_logo} alt="Lumel Logo" loading='lazy' />
            <ul>
                <li>
                    <NavLink
                        to='/dashboard/userdashboard'
                        className={({ isActive }) => isActive ? 'sidebar-btn active' : 'sidebar-btn'}
                    >
                        <span><LuLayoutDashboard /></span>Dashboard
                    </NavLink>
                </li>

                {leaveRequests.length > 0 && (
                    <li>
                        <NavLink
                            className={({ isActive }) => isActive ? 'sidebar-btn active' : 'sidebar-btn'}
                            to={`/dashboard/leaveapproval/${leaveRequests[0].request_id}`}
                        ><span><SiPivotaltracker />
</span>
                            Leave Approvals
                        </NavLink>
                    </li>
                )}

                <li onClick={logout}>
                    <NavLink className='sidebar-btn' to='/'><span><BiLogOut /></span>Logout</NavLink>
                </li>
            </ul>
        </section>
    );
};

export default UserSidebar;
