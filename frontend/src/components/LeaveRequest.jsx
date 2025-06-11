import React from 'react';
import { useState, useEffect } from 'react';
import '../styles/leaverequest.css';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { IoClose } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const LeaveRequest = ({ employee_id,refreshKey,setRefreshKey }) => {
    const navigate = useNavigate();
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [leaveRequestData, setLeaveRequeastData] = useState([]);
    const [showPopup, setshowPopup] = useState(false);
    const [holidayData, setHolidayData] = useState([]);
    const [requestDate, setRequestDate] = useState([]);
    const [selectedLeave, setSelectedLeave] = useState(null);

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

            const token = localStorage.getItem('token');
            try {
                const response = await fetch('http://localhost:3006/leavetypes', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const response3 = await fetch('http://localhost:3006/holidays', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                const response4 = await fetch(`http://localhost:3006/leaverequest/date-overlap/${employee_id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                const data = await response.json();
                const holi = await response3.json();
                const dbDate = await response4.json();
                setRequestDate(dbDate.result);
                console.log("request date", dbDate.result);
                setHolidayData(holi);
                console.log("holiday data", holi);
                console.log("leave types:", data);
                console.log('leave types ID:', data.leavetype_id)
                setLeaveTypes(data);

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
            const response = await fetch(`http://localhost:3006/employee/leaverequest/${request_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (response.ok) {
                const data = await response.json();
                console.log("update status", data);
                setRefreshKey((item)=>item+1);

                setLeaveRequeastData(prev =>
                    prev.map(req =>
                        req.request_id === request_id ? { ...req, status: 'cancelled' } : req
                    )
                );

            } else {
                console.log("Cancel failed.");
            }
        } catch (error) {
            console.error('Cancel failed:', error);
        }
    }


    const fetchLeaveRequest = async (employee_id) => {
        try {
            const response2 = await fetch(`http://localhost:3006/leaverequest/employee/${employee_id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            const d = await response2.json();
            setLeaveRequeastData(d);

            console.log("leave request", d);
        } catch (error) {
            console.error('Error fetching leave', error);
        }
    }


    useEffect(() => {
        fetchLeaveRequest(employee_id);
    }, [refreshKey])



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
            const response = await fetch('http://localhost:3006/leaverequest', {
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
                setRefreshKey((item) => item + 1);

            } else {
                console.error('Error', result.message);
            }
        } catch (error) {
            console.error('Error submitting request catch', error)
        }
    }

    const holidays = holidayData?.result?.map(item =>
        new Date(item.holiday_date).toISOString().split('T')[0]
    );

    const calculateLeaveDays = (start, end, holidays) => {
        let tempDate = new Date(start);
        const endDate = new Date(end);
        let count = 0;
        while (tempDate <= endDate) {
            const day = tempDate.getDay();
            const dateStr = tempDate.toISOString().split('T')[0];
            if (day !== 0 && day !== 6 && !holidays.includes(dateStr)) {
                count++;
            }
            tempDate.setDate(tempDate.getDate() + 1);
        }
        return count;
    };

    useEffect(() => {
        const { start_date, end_date } = formData;
        if (start_date && end_date && holidays.length > 0) {
            const calculatedDays = calculateLeaveDays(start_date, end_date, holidays);
            if (formData.days !== calculatedDays) {
                setFormData(prev => ({
                    ...prev,
                    days: calculatedDays
                }));
            }
        }
    }, [formData.start_date, formData.end_date, holidays]);




    const openPopup = () => {
        setshowPopup(true);
    }

    const closePopup = () => {
        setshowPopup(false);
    }

    const dateReverse = (date) => {
        if (!date) return '';
        const da = date.split('T')[0];
        const reversed = da.split('-').reverse().join('-');
        return reversed;
    }

    const viewApprovals = (requestId) => {
        navigate(`/dashboard/leaveapproval/${requestId}`)
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
                                <tr key={request.request_id} >  
                                    <td>{request.leavetype_id.
                                        type_name}</td>
                                    <td>{dateReverse(request.start_date)}</td>
                                    <td>{dateReverse(request.end_date)}</td>
                                    <td>{request.days}</td>
                                    <td className='leaverequest-reason'>
                                        <Tippy content={request.reason} placement="top">
                                            <span style={{ cursor: 'pointer' }}>
                                                {request.reason.length > 10
                                                    ? request.reason.slice(0, 20) + '...'
                                                    : request.reason
                                                }
                                            </span>
                                        </Tippy>
                                    </td>
                                    <td className={`leavestatus ${request.status}`} onClick={() => {
                                        // if (request.status === 'rejected') {
                                        //     setSelectedLeave(request);
                                        // }
                                        // else{
                                            viewApprovals(request.request_id)
                                        // }
                                    }} style={{ cursor: request.status === 'rejected' ? 'pointer' : 'default' }} >{request.status}</td>

                                    <td><button onClick={() => handleCancelClick(request.request_id)}
                                        className='action-btn' disabled={request.status === 'cancelled' || request.status=='rejected'}
                                    ><i className="fa-regular fa-circle-xmark"></i></button></td>
                                </tr>
                            ))
                        }
                    </tbody>


                    {selectedLeave && (
                        <div className="leave-modal-overlay">
                            <div className="leave-modal-content">
                                <button className="leave-modal-close-btn" onClick={() => setSelectedLeave(null)}><IoClose /></button>
                                <h3>Leave Request Details</h3>
                                <p><strong>Leave Type:</strong> {selectedLeave.leavetype_id.type_name}</p>
                                <p><strong>From:</strong> {selectedLeave.start_date}</p>
                                <p><strong>To:</strong> {selectedLeave.end_date}</p>
                                <p><strong>Reason:</strong> {selectedLeave.reason}</p>
                                <p><strong>Comments:</strong>  {
                                    selectedLeave.approvals.map((approve) => {
                                        if (approve.status == 'rejected') {
                                            return approve.reason
                                        }
                                    })
                                }</p>
                            </div>
                        </div>
                    )}
                </table>
            </section>
        </section>
    )
}

export default LeaveRequest;
