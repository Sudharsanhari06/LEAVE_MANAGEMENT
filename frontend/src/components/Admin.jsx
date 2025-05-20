import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import '../styles/admin.css';
// import AddEmployee from './AddEmployee';



const Admin = () => {
const navigate=useNavigate();

    const [employeeData, setEmployeeData] = useState([]);


    //------
    // const handleChange = (e) => {
    //     setFormData(prev => ({
    //         ...prev,
    //         [e.target.name]: e.target.value
    //     }));
    //     setHolidayData(pre => ({
    //         ...pre,
    //         [e.target.name]: e.target.value

    //     }))
    // };





    return (

        <section className='admin-container'>

            {/* <div className='admin-leftside'>
            </div> */}

          
                <div className='admin-rightside'>
                    {/* <h2>Add Employee</h2> */}
              
                    {/* <div className="employee-details">
                    
                     {employeeData && employeeData.map((employee) => (
                        <div key={employee.employee_id}>
                            <p>{employee.name}</p>
                            <p>{employee.email}</p>
                            <p>{employee.role}</p>
                            <p>{employee.join_date}</p>
                        </div>
                        
                    ))}
                     
                </div> */}

                </div>
        </section>
    )
}


export default Admin;