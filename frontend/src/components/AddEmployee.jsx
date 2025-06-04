import React from 'react'
import { useState, useEffect, useContext } from "react";
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import '../styles/employee.css';
import { IoClose } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import { AuthContext } from './AuthContext';


const AddEmployee = () => {
    const { user } = useContext(AuthContext);

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

    const [popup, setpopup] = useState(false);
    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const [currentEmployeeId, setCurrentEmployeeId] = useState(null);


    const openPopup = () => setpopup(true);
    const closePopup = () => setpopup(false);

    useEffect(() => {
        const fetchRoles = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch('http://localhost:3006/employees/roles', {
                    method: 'GET',
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                });

                const response2 = await fetch('http://localhost:3006/employees', {
                    method: 'GET',
                    headers: {
                        authorization: `Bearer ${token}`
                    }
                })
                const managerId = user?.employee_id;
                const response3 = await fetch(`http://localhost:3006/employees/manager/${managerId}`, {
                    method: 'GET',
                    headers: {
                        authorization: `Bearer ${token}`
                    }
                })
                const data = await response.json();
                const employee = await response2.json()
                console.log("employee roles", data);
                console.log("Employee data", employee)
                // setEmployeeData(employee);

                const managerEmployee = await response3.json();
                console.log("managerEmployee", managerEmployee.result)


                if (user?.role == 'hr' || user?.role == 'director') {
                    setEmployeeData(managerEmployee.result)
                } else {
                    setEmployeeData(employee);
                }
                const hrEmployees = data.users.filter((emp) => emp.role == 'hr');
                const managerEmployees = data.users.filter((emp) => emp.role == 'manager');
                const directorEmployees = data.users.filter((emp) => emp.role == 'director');

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
        const url = isUpdateMode
            ? `http://localhost:3006/employees/${currentEmployeeId}`
            : 'http://localhost:3006/employees';
        const method = isUpdateMode ? 'PUT' : 'POST';


        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            })

            if (response.ok) {
                notyf.success(isUpdateMode ? 'Employee Updated Successfully' : 'Employee Added Successfully')
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
                const errorData = await response.json();
                console.error('Error details:', errorData);
                notyf.error('Fail to add Employee');
            }
        } catch (error) {
            console.error('Fail to error', error);
        }
    }

    const handleEdit = (id) => {
        const emp = employeeData.find(e => e.employee_id === id);
        setFormData({
            name: emp.name,
            manager_id: emp.manager_id || '',
            hr_id: emp.hr_id || '',
            director_id: emp.director_id || '',
            join_date: emp.join_date.split('T')[0],
            role: emp.role,
            email: emp.email,
            password: ''
        });

        setCurrentEmployeeId(id);
        setIsUpdateMode(true);
        setpopup(true);
    }








    return (
        <section className={`add-employee-container`} >
            {/* <h2>Add Employee</h2> */}
            {user?.role == 'hr' ? (
                <>
                    <button onClick={openPopup} className='btn add-employee'> + Add Employee</button>
                    {popup &&
                        <form onSubmit={submitForm} className='employee-form'>
                            <div className='close-popup'>
                                <div>
                                    <button onClick={closePopup}><IoClose /></button>

                                </div>
                            </div>
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

                                <input type="password" value={formData.password} onChange={handleChange} name='password' placeholder='Enter the password..' />
                                <select name="role" value={formData.role} onChange={handleChange}>
                                    <option value="">Select role</option>
                                    <option value="Trainee">Trainee</option>
                                    <option value="Hr">Hr</option>
                                    <option value="Intern">Intern</option>
                                    <option value="Manager">Manager</option>
                                    <option value="Director">Director</option>
                                    <option value="Developer">Developer</option>
                                </select>

                                <input type="date" name="join_date" value={formData.join_date} onChange={handleChange} />

                                <button type='submit'>{isUpdateMode ? 'Update' : 'Add'}</button>
                            </div>

                        </form>
                    }

                    <div className="employees-entire-container">
                        <h2>Employees</h2>
                        <div className='employees-container'>
                            {
                                employeeData && employeeData.map((emp) => (
                                    <div className='employee' key={emp.employee_id}>
                                        <div className="employee-header">
                                            <p>LMT{emp.employee_id}</p>
                                            <button className="edit-btn" onClick={() => handleEdit(emp.employee_id)}>
                                                <FiEdit />
                                            </button>
                                        </div>
                                        <p>Name: {emp.name}</p>
                                        <p>Role: {emp.role}</p>
                                        <p>Email: {emp.email}</p>
                                        <p>Join Date:{emp.join_date}</p>
                                    </div>
                                ))}
                        </div>
                    </div>
                </>
            ) : (
                <div className="employees-entire-container">
                    <h2>Employees</h2>
                    <div className='employees-container'>
                        {
                            employeeData && employeeData.map((emp) => (
                                <div className='employee' key={emp.employee_id}>
                                    <div className="employee-header">
                                        <p>LMT{emp.employee_id}</p>
                                    </div>
                                    <p>Name: {emp.name}</p>
                                    <p>Role: {emp.role}</p>
                                    <p>Email: {emp.email}</p>
                                    <p>Join Date:{emp.join_date}</p>
                                </div>
                            ))}
                    </div>
                </div>
            )}





        </section>

    )
}


export default AddEmployee;
