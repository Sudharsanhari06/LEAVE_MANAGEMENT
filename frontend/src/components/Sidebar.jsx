import React from 'react'
import { NavLink, useNavigate } from "react-router-dom";
// import '../styles/admin.css';
import '../styles/dashboard.css'
import lumel_logo from '../assets/lumel_logo.png';
import { LuLayoutDashboard } from "react-icons/lu";
import { BsPersonFillAdd } from "react-icons/bs";
import { IoIosAddCircleOutline } from "react-icons/io";
import { BiLogOut } from "react-icons/bi";
import { FaRegCalendarAlt } from "react-icons/fa";





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
                <li><NavLink className='sidebar-btn' to='/dashboard/userdashboard'><span><LuLayoutDashboard  className='sidebar-icon'/> </span>  Dashboard</NavLink></li>
                <li><NavLink className='sidebar-btn' to='/dashboard/add-employee'> <span><BsPersonFillAdd className='sidebar-icon'/></span>Employee</NavLink></li>
                <li><NavLink className='sidebar-btn' to='/dashboard/add-holiday'><span><IoIosAddCircleOutline className='sidebar-icon' /></span>Holidays</NavLink></li>
                <li><NavLink className='sidebar-btn' to='/dashboard/calender'> <span><FaRegCalendarAlt className='sidebar-icon'/></span> Calender</NavLink></li>
                <li onClick={logout}>
                    <NavLink className='sidebar-btn' to='/'> <span><BiLogOut className='sidebar-icon'/></span>Logout</NavLink>
                </li>
            </ul>
        </section>
    )
}
export default Sidebar;
