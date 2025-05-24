import React from 'react'
import { NavLink } from "react-router-dom";
import '../styles/admin.css';
import lumel_logo from '../assets/lumel_logo.png'

const Sidebar = () => {
    return (
        <div className='admin-leftside'>
            <img src={lumel_logo} alt="lumel Logo" loading='lazy' />
            <ul>
                <li><NavLink className='sidebar-btn' to='/dashboard/userdashboard'>Dashboard</NavLink></li>
                <li><NavLink className='sidebar-btn' to='/dashboard/add-employee'>Add Employee</NavLink></li>
                <li><NavLink className='sidebar-btn' to='/dashboard/add-holiday'>Add Holidays</NavLink></li>
            </ul>
        </div>
    )}
export default Sidebar;