import React from 'react';
import { useState,useEffect} from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import lumel_logo from '../assets/lumel_logo.png';
import '../styles/dashboard.css'


const UserSidebar = () => {
    const [userData, setUserData] = useState(null);

    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };


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
        <section className="left-side">
            <img src={lumel_logo} alt="lumel Logo" loading='lazy' />
            <ul>
                <li><NavLink to='/dashboard/userdashboard' className={({ isActive }) => isActive ? 'sidebar-btn active' : 'sidebar-btn'} ><span><i class="fa-solid fa-arrow-up-right-dots"></i></span>Dashboard</NavLink></li>
                <li><NavLink className={({ isActive }) => isActive ? 'sidebar-btn active' : 'sidebar-btn'} to='/dashboard/leaveapproval'>Leave Approvals</NavLink></li>
                {/* {userData && ['manager', 'Hr', 'Director'].includes(userData.role) && (
                    <li>
                        <NavLink
                            className={({ isActive }) => isActive ? 'sidebar-btn active' : 'sidebar-btn'}
                            to='/dashboard/leaverequest'
                        >
                            Leave Requests
                        </NavLink>
                    </li>
                )} */}
                <li onClick={logout} ><NavLink className='sidebar-btn' to='/'>Logout</NavLink></li>
            </ul>
        </section>
    )
}

export default UserSidebar;