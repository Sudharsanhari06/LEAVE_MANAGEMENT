import React from 'react';
import { useState, useEffect } from 'react';
import '../styles/leaverequest.css';


const LeaveRequest = ({ employee_id }) => {
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [leaveRequestData, setLeaveRequeastData] = useState([]);
    const [showPopup, setshowPopup] = useState(false);

    const [formData, setFormData] = useState({
        leavetype_id: '',
        start_date: '',
        end_date: '',
        days: 0,
    });

    useEffect(() => {
        const fetchLeaveTypes = async () => {
            try {
                const response = await fetch('http://localhost:3003/leavetypes');
                const b = await fetch(`http://localhost:3003/leaverequest/employee/${employee_id}`,{
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                const data = await response.json();
                const d = await b.json();
                console.log("leave types:", data);
                console.log('leave types ID:', data.leavetype_id)
                setLeaveTypes(data);
                console.log("leave request", d);
                setLeaveRequeastData(d);
            } catch (error) {
                console.error('Error fetching leave', error);
            }
        }
        fetchLeaveTypes();
    }, []);


    const userCancel = async (req_id) => {
        try {
            const response = await fetch(`http://localhost:3003/employee/leaverequest/${req_id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            })
            if(response.ok){
                const data = response.json();
                console.log("update status", data);
            }else{
                console.log("update status else part")
            }
        
        } catch (error) {
            console.error('Cancel failed:', error);
        }
    }






    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const submitLeave = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const leaveRequestData = {
            employee_id: employee_id,
            leavetype_id: formData.leavetype_id,
            start_date: formData.start_date,
            end_date: formData.end_date,
            days: formData.days,
            reason: formData.reason,
            status: 'pending'
        };
        try {
            const response = await fetch('http://localhost:3003/leaverequest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(leaveRequestData)
            })
            const result = await response.json();
            if (response.ok) {
                alert('Leave request is added')
            } else {
                console.error('Error', result.message);
            }
        } catch (error) {
            console.error('Error submitting request catch', error)
        }
    }

    const calculateLeaveDays = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        let count = 0;
        while (startDate <= endDate) {
            const day = startDate.getDay();
            if (day != 0 && day != 6) {
                count++;
            }
            startDate.setDate(startDate.getDate() + 1);
        }
        return count;
    }

    useEffect(() => {
        const { start_date, end_date } = formData;
        if (start_date && end_date) {
            const calculatedDays = calculateLeaveDays(start_date, end_date);
            setFormData(pre => ({
                ...pre,
                days: calculatedDays
            }))
        }
    }, [formData.start_date, formData.end_date]);



    const openPopup = () => {
        setshowPopup(true);
    }
    const closePopup = () => {
        setshowPopup(false);
    }



    return (
        <section className='leave-request__section'>
            <h2>All Leaves Requests</h2>
            <button onClick={openPopup} className='btn open-btn'>+ Apply Leave</button>
            <div className='leaverequest-popup'>
                {showPopup && (
                    <div className='leaverequest-form'>
                        <button onClick={closePopup} className='btn close-btn'>X</button>
                        <form onSubmit={submitLeave}>
                            <div className='form-date'>
                                <input type="date" name='start_date' value={formData.start_date} onChange={handleChange} required />
                                <p>{formData.days} days</p>

                                <input type="date" name='end_date' value={formData.end_date} onChange={handleChange} required />
                            </div>

                            <select name="leavetype_id" value={formData.leavetype_id} onChange={handleChange} required >
                                <option value="">Select Leave Type</option>
                                {
                                    leaveTypes.map((item) => (
                                        <option key={item.leavetype_id} value={item.leavetype_id}>{item.type_name}</option>
                                    ))
                                }
                            </select>
                            <textarea name="reason" value={formData.reason} onChange={handleChange} required>
                            </textarea>
                            <button type='submit'>Submit</button>
                        </form>

                    </div>
                )}
            </div>

            <section className='all-leaverequest'>
                <table>
                    <thead>
                        <tr>
                            <th>Leave Type</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Days</th>
                            <th>Reason</th>
                            <th>Status</th>
                            <th>User Cancel</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaveRequestData &&
                            leaveRequestData.map((request) => (
                                <tr key={request.request_id}>
                                    <td>{request.
                                        type_name}</td>
                                    <td>{request.
                                        start_date.split('T')[0]}</td>
                                    <td>{request.end_date.split('T')[0]}</td>
                                    <td>{request.days}</td>
                                    <td>{request.reason}</td>
                                    <td>{request.status}</td>
                                    <td><button onClick={()=>userCancel(request.request_id)}>Cancel</button></td>
                                </tr>
                            ))
                        }
                    </tbody>

                </table>

            </section>


        </section>
    )
}

export default LeaveRequest;
