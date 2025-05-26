import React from 'react';
import { useState, useEffect } from 'react';
import '../styles/leaverequest.css';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';


const LeaveRequest = ({ employee_id }) => {
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [leaveRequestData, setLeaveRequeastData] = useState([]);
    const [showPopup, setshowPopup] = useState(false);
    const [canceledRequests, setCanceledRequests] = useState([]);

    const [formData, setFormData] = useState({
        leavetype_id: '',
        start_date: '',
        end_date: '',
        days: 0,
    });

    const notyf = new Notyf({
        duration: 3000,
        position: {
            x: 'right',
            y: 'top',
        }
    });


    useEffect(() => {
        const fetchLeaveTypes = async () => {
            try {
                const response = await fetch('http://localhost:3003/leavetypes');
                const b = await fetch(`http://localhost:3003/leaverequest/employee/${employee_id}`, {
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


    const todayDate = new Date().toISOString().split('T')[0];
    console.log("todayDate", todayDate);

    const userCancel = async (request_id) => {
        try {
            const response = await fetch(`http://localhost:3003/employee/leaverequest/${request_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (response.ok) {
                const data = response.json();
                console.log("update status", data);
                setCanceledRequests(prev => {
                    const updated = [...prev, request_id];
                    localStorage.setItem('canceledRequests', JSON.stringify(updated));
                    return updated;
                });

            } else {
                console.log("update status else part");
            }
        } catch (error) {
            console.error('Cancel failed:', error);
        }
    }

    
useEffect(() => {
    const stored = localStorage.getItem('canceledRequests');
    if (stored) {
      setCanceledRequests(JSON.parse(stored));
    }
  }, []);
  

    const handleCancelClick = async (request_id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to cancel the leave request?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Cancel',
            cancelButtonText: 'No',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
        });

        if (result.isConfirmed) {
            userCancel(request_id);
            await Swal.fire('Cancelled!', 'The leave request has been cancelled.', 'success');
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
                notyf.success('Leave request is added')
                closePopup();
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

    const dateReverse = (date) => {
        const da = date.split('T')[0];
        const reversed = da.split('-').reverse().join('-');
        return reversed;
    }

  

    return (
        <section className='leave-request__section'>
            <h2>Latest Leaves</h2>
            <button onClick={openPopup} className='btn open-btn'>+ Apply Leave</button>
            <div className='leaverequest-popup'>
                {showPopup && (
                    <div className='leaverequest-form'>
                        <button onClick={closePopup} className='btn close-btn'><i class="fa-regular fa-circle-xmark"></i></button>

                        <form onSubmit={submitLeave}>
                            <div className='form-date'>
                                <input type="date" name='start_date' value={formData.start_date} onChange={handleChange} min={todayDate} required />
                                <p>{formData.days} days</p>

                                <input type="date" name='end_date' value={formData.end_date} onChange={handleChange} min={todayDate} required />
                            </div>

                            <select name="leavetype_id" value={formData.leavetype_id} onChange={handleChange} required >
                                <option value="">Select Leave Type</option>
                                {
                                    leaveTypes.map((item) => (
                                        <option key={item.leavetype_id} value={item.leavetype_id}>{item.type_name}</option>
                                    ))
                                }
                            </select>
                            <textarea name="reason" value={formData.reason} onChange={handleChange} placeholder='Reason' required>
                            </textarea>
                            <button type='submit'>Apply</button>
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
                            <th colSpan={2}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaveRequestData &&
                            leaveRequestData.map((request) => (
                                <tr key={request.request_id}>
                                    <td>{request.
                                        type_name}</td>
                                    <td>{dateReverse(request.start_date)}</td>
                                    <td>{dateReverse(request.end_date)}</td>
                                    <td>{request.days}</td>
                                    <td className='leaverequest-reason'>{request.reason}</td>
                                    <td className={`leavestatus ${request.status}`}>{request.status}</td>
                                    <td><button onClick={() => handleCancelClick(request.request_id)} className='action-btn' disabled={canceledRequests.includes(request.request_id)}><i className="fa-regular fa-circle-xmark"></i></button></td>
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
