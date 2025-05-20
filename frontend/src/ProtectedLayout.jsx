import React from 'react'
import { Outlet } from 'react-router-dom';
import './styles/admin.css'
import Sidebar from './components/Sidebar';

const ProtectedLayout = () => {
    return (
        <section className='admin-container'>
                <Sidebar />
            <div className='admin-rightside'>
                <h2>Welcome To Admin..</h2>
                <Outlet />
            </div>

        </section>
    )
}
export default ProtectedLayout;
