import React from 'react'
import { NavLink, useNavigate } from "react-router-dom";
// import '../styles/admin.css';
import '../styles/dashboard.css'
import lumel_logo from '../assets/lumel_logo.png'

const Sidebar = () => {

    const navigate = useNavigate();
    const logout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <section className="left-side">
            <img src={lumel_logo} alt="Lumel Logo" loading='lazy' />
            <ul>
                <li><NavLink className='sidebar-btn' to='/dashboard/userdashboard'>Dashboard</NavLink></li>
                <li><NavLink className='sidebar-btn' to='/dashboard/add-employee'>Add Employee</NavLink></li>
                <li><NavLink className='sidebar-btn' to='/dashboard/add-holiday'>Add Holidays</NavLink></li>
                <li><NavLink className='sidebar-btn' to='/dashboard/calender'>Calender</NavLink></li>
                <li onClick={logout}>
                    <NavLink className='sidebar-btn' to='/'>Logout</NavLink>
                </li>
            </ul>
        </section>
    )
}
export default Sidebar;
