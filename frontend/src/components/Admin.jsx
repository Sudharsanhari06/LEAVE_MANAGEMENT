import React from 'react';
import { useState } from 'react';
import '../styles/admin.css'

const Admin = () => {
    const[name,setName]=useState('');
    const[email,setEmail]=useState('');

    return (
        <section className='admin-container'>
            <div className='admin-leftside'>
                <h1>Welcome</h1>
                <button>
                    Add Employee
                </button>
            </div>
            <div className='admin-rightside'>
                <form action="">
                    <input type="text" placeholder='Enter the Name..' />
                    <select name="" id="">
                        <option value="Trainee">Trainee</option>
                        <option value="Hr">Hr</option>
                        <option value="Intern">Intern</option>
                        <option value="Manager">Manager</option>
                        <option value="Director">Director</option>
                        <option value="Developer">Developer</option>
                    </select>

                    <input type="email" placeholder='Enter the Email..' />
                    <input type="password" placeholder='Enter the password..' />
                    <label htmlFor="">Select Manager:</label>
                    <select name="" id="">
                        <option value=""></option>
                    </select>
                    <label htmlFor="">Select Hr:</label>
                    <select name="" id="">
                        <option value=""></option>
                    </select>
                    <label htmlFor="">Select Director:</label>
                    <select name="" id="">

                    </select>
                </form>
            </div>
        </section>
    )
}

export default Admin;
