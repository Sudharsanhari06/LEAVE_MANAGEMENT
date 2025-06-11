import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import lumel_logo from '../assets/lumel_logo.png';
import { LuLayoutDashboard } from "react-icons/lu";
import { BsPersonFillAdd } from "react-icons/bs";
import { IoIosAddCircleOutline } from "react-icons/io";
import { BiLogOut } from "react-icons/bi";
import { FaRegCalendarAlt } from "react-icons/fa";
import { SiPivotaltracker } from "react-icons/si";
import '../styles/dashboard.css';

const Sidebar = () => {

    const [userData, setUserData] = useState(null);
    const [leaveRequests, setLeaveRequests] = useState([]);
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Unauthorized. Please login first.');
            navigate('/');
            return;
        }

        const fetchUserData = async () => {
            try {
                const res = await fetch('http://localhost:3006/api/dashboard', {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.ok) {
                    const data = await res.json();
                    console.log("USER DATA", data)
                    setUserData(data);
                } else {
                    alert('Unauthorized token');
                    navigate('/');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                navigate('/');
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        if (userData?.employee_id) {
            console.log("userData employee_id", typeof (userData.employee_id))
            const fetchLeaveRequests = async () => {
                try {
                    const res = await fetch(`http://localhost:3006/leaverequest/employee/${userData.employee_id}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    const data = await res.json();
                    setLeaveRequests(data);
                } catch (error) {
                    console.error("Error fetching leave requests:", error);
                }
            };
            fetchLeaveRequests();
        }
    }, [userData]);

    const isHR = userData?.role === 'hr';

    return (
        <section className="left-side">
            <img src={lumel_logo} alt="Lumel Logo" loading='lazy' />
            <ul>
                <li>
                    <NavLink to='/dashboard/userdashboard' className='sidebar-btn'>
                        <span><LuLayoutDashboard className='sidebar-icon' /></span> Dashboard
                    </NavLink>
                </li>

                {['manager','hr','director'].includes(userData?.role) && (
                    <>
                        <li>
                            <NavLink to='/dashboard/add-employee' className='sidebar-btn'>
                                <span><BsPersonFillAdd className='sidebar-icon' /></span> Employee
                            </NavLink>
                        </li>

                    </>
                )}


                    <li>
                        <NavLink to={`leaveapproval/${leaveRequests[0]?.request_id}`}   className='sidebar-btn'>
                            <span><SiPivotaltracker className='sidebar-icon' /></span> Leave Approvals
                        </NavLink>
                    </li>
             
                <li>
                    <NavLink to='/dashboard/add-holiday' className='sidebar-btn'>
                        <span><IoIosAddCircleOutline className='sidebar-icon' /></span> Holidays
                    </NavLink>
                </li>
                {/* <li>
                    <NavLink to='/dashboard/team-calender' className='sidebar-btn'>
                        <span><FaRegCalendarAlt className='sidebar-icon' /></span> Team Calender
                    </NavLink>
                </li> */}


                <li>
                    <NavLink to='/dashboard/calender' className='sidebar-btn'>
                        <span><FaRegCalendarAlt className='sidebar-icon' /></span> Calendar
                    </NavLink>
                </li>

                <li onClick={logout}>
                    <NavLink to='/' className='sidebar-btn'>
                        <span><BiLogOut className='sidebar-icon' /></span> Logout
                    </NavLink>
                </li>
                
            </ul>
        </section>
    );
};

export default Sidebar;
