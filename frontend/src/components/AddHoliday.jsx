import React, { useContext } from 'react'
import { useState, useEffect } from "react";
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import '../styles/holiday.css';
import { AuthContext } from './AuthContext';

const AddHoliday = () => {
    const { user } = useContext(AuthContext);
    const [holidayData, setHolidayData] = useState({
        holiday_name: '',
        holiday_date: ''
    });
    const [holiday, setHoliday] = useState([]);

    const handleChange = (e) => {
        setHolidayData(pre => ({
            ...pre,
            [e.target.name]: e.target.value

        }))
    };
    const notyf = new Notyf({
        duration: 3000,
        position: {
            x: 'right',
            y: 'top',
        },
    });

    useEffect(() => {

        const fetchHoliday = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch('http://localhost:3006/holidays', {
                    method: 'GET',
                    headers: {
                        authorization: `Bearer ${token}`,
                    }
                });
                const data = await response.json();
                setHoliday(data.result);
                console.log("holiday data", data);
            } catch (error) {
                console.log("Error to fetch the holiday", error);
            }
        }

        fetchHoliday()
    }, [])


    const holidaySubmit = async (e) => {
        try {
            e.preventDefault();
            const token = localStorage.getItem('token');
            const holidayResponse = await fetch('http://localhost:3006/holidays', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(holidayData)
            })

            if (holidayResponse.ok) {
                notyf.success('Successfully Added Holiday')
                setHolidayData({
                    holiday_name: '',
                    holiday_date: ''
                })
            } else {
                notyf.error('Fail to add Holiday')

            }

        } catch (error) {
            console.error('Fail to error', error);
        }
    }


    return (
        <section className="holidays-container">

            {user?.role == 'hr' ? (
                <form onSubmit={holidaySubmit}>
                    <input type="text" placeholder='Holiday Name.' name='holiday_name' value={holidayData.holiday_name} onChange={handleChange} required />
                    <input type="date" name='holiday_date' value={holidayData.holiday_date} onChange={handleChange} required />
                    <button type='submit'>Submit</button>
                </form>
            ) : (<div className="holidays-show">
                <h2>Holidays</h2>
                <table >
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Holiday Name</th>
                            <th>Holiday Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {holiday && holiday.map((holi) => (
                            <tr key={holi.holiday_id}>
                                <td>{holi.holiday_id}</td>
                                <td>{holi.holiday_name}</td>
                                <td>{holi.holiday_date.split('T')[0]}</td>
                            </tr>
                        ))
                        }
                    </tbody>
                </table>

            </div>

            )}
        </section>
    )
}

export default AddHoliday;