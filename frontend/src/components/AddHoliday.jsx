import React from 'react'
import { useState, useEffect } from "react";
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import '../styles/admin.css';

const AddHoliday = () => {

    const [holidayData, setHolidayData] = useState({
        holiday_name: '',
        holiday_date: ''
    });


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

    const holidaySubmit = async (e) => {
        try {
            e.preventDefault();
            const token = localStorage.getItem('token');
            const holidayResponse = await fetch('http://localhost:3003/holidays', {
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
            <form onSubmit={holidaySubmit}>
                <input type="text" placeholder='Holiday Name.' name='holiday_name' value={holidayData.holiday_name} onChange={handleChange} required />
                <input type="date" name='holiday_date' value={holidayData.holiday_date} onChange={handleChange} required />
                <button type='submit'>Submit</button>
            </form>
        </section>
    )
}

export default AddHoliday;