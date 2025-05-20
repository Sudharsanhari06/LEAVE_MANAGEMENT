import React from 'react'
import { Link } from "react-router-dom";
import '../styles/admin.css';
import lumel_logo from '../assets/lumel_logo.png'
const Sidebar = () => {
    return (
        <div className='admin-leftside'>
            <img src={lumel_logo} alt="lumel Logo" loading='lazy' />

            <ul>
                <li><Link  className='sidebar-btn' to='/add-employee'>Add Employee</Link></li>
                <li><Link  className='sidebar-btn'  to='/add-holiday'>Add Holidays</Link></li> 
                {/* <li><Link    className='sidebar-btn' to='/add-leavetype'>Add LeaveTypes</Link></li>  */}
            </ul>
        </div>
)}
export default Sidebar;