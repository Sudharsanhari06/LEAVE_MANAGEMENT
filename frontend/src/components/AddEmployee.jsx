import React from 'react'
import { useState, useEffect } from "react";
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import '../styles/admin.css';


const AddEmployee = () => {
    const [formData, setFormData] = useState({
        name: '',
        manager_id: '' || null,
        hr_id: '' || null,
        director_id: '' || null,
        join_date: '',
        role: '',
        email: '',
        password: ''
    });
    const notyf = new Notyf({
        duration: 3000,
        position: {
            x: 'right',
            y: 'top',
        },
    });

    const [managers, setManagers] = useState([]);
    const [hr, setHr] = useState([]);
    const [directors, setDirectors] = useState([]);
    const [employeeData, setEmployeeData] = useState([]);

    useEffect(() => {
        const fetchRoles = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch('http://localhost:3003/employees/roles', {
                    method: 'GET',
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                });
                const response2 = await fetch('http://localhost:3003/employees', {
                    method: 'GET',
                    headers: {
                        authorization: `Bearer ${token}`
                    }
                })


                const data = await response.json();
                const employee = await response2.json()
                console.log("employee roles", data);
                console.log("Employee data", employee)
                setEmployeeData(employee);

                const hrEmployees = data.users.filter((emp) => emp.role == 'Hr');
                const managerEmployees = data.users.filter((emp) => emp.role == 'manager');
                const directorEmployees = data.users.filter((emp) => emp.role == 'Director');

                setHr(hrEmployees);
                setManagers(managerEmployees);
                setDirectors(directorEmployees);
                // setEmployeeData(employee)

                console.log('HR:', hrEmployees);
                console.log('Managers:', managerEmployees);
                console.log('Directors:', directorEmployees);

            } catch (error) {
                console.error('failed to fetch the data', error);
            }
        }
        fetchRoles();
    }, []);

    //------
    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const submitForm = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:3003/employees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            })

            const data = await response.json();

            if (response.ok) {
                // setMessage(notyf.su);
                notyf.success('Successfully add the Employee')

                setFormData({
                    name: '',
                    manager_id: '',
                    hr_id: '',
                    director_id: '',
                    join_date: '',
                    role: '',
                    email: '',
                    password: ''
                })

            } else {
                // setMessage('Failed to add employee');
                notyf.error('Fail to add Employee');

            }
        } catch (error) {
            console.error('Fail to error', error);
            // setMessage('Internal server'
        }
    }

    return (
        <section className='add-employee-container'>

            {/* <p>{message}</p> */}
            <h2>Add Employee</h2>

            <form onSubmit={submitForm} className='employee-form'>
                <div className='form-column'>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder='Enter the Name..' required />

                    <select name="manager_id" value={formData.manager_id} onChange={handleChange} >
                        <option value="">Select Manager</option>
                        {managers.map(item => (
                            <option key={item.employee_id} value={item.employee_id}>{item.name}</option>
                        ))}
                    </select>
                    <select name="hr_id" value={formData.hr_id} onChange={handleChange}>
                        <option value="">Select Hr</option>
                        {hr.map(h => (
                            <option key={h.employee_id} value={h.employee_id}>{h.name}</option>
                        ))}
                    </select>

                    <select name="director_id" value={formData.director_id} onChange={handleChange}>
                        <option value="">Select Director</option>
                        {directors.map(d => (
                            <option key={d.employee_id} value={d.employee_id}>{d.name}</option>
                        ))}
                    </select>
                </div>

                <div className='form-column'>
                    <input type="email" value={formData.email} onChange={handleChange} name='email' placeholder='Enter the Email..' required />

                    <input type="password" value={formData.password} onChange={handleChange} name='password' placeholder='Enter the password..' required />
                    <select name="role" value={formData.value} onChange={handleChange}>
                        <option value="">Select role</option>
                        <option value="Trainee">Trainee</option>
                        <option value="Hr">Hr</option>
                        <option value="Intern">Intern</option>
                        <option value="Manager">Manager</option>
                        <option value="Director">Director</option>
                        <option value="Developer">Developer</option>
                    </select>

                    <input type="date" name="join_date" value={formData.join_date} onChange={handleChange} />

                    <button type='submit'>Add</button>
                </div>

            </form>

            <div className="employees-container">
                <h2>All Employees</h2>
                {
                    employeeData && employeeData.map((emp) => (
                        <div className='employee'>
                            <p>LMT{emp.employee_id}</p>
                            <p>Name: {emp.name}</p>
                            <p>Role: {emp.role}</p>
                            <p>Email: {emp.email}</p>
                        </div>
                    ))}

            </div>

        </section>

    )
}


export default AddEmployee;
