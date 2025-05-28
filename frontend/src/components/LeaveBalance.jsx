import React from 'react'
import { useState, useEffect } from 'react';
import '../styles/dashboard.css';
import CountUp from 'react-countup';

const LeaveBalance = ({ employee_id }) => {
    const [leavebBalance, setLeaveBalance] = useState({});
    useEffect(() => {
        const fetchLeaveBalance = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`http://localhost:3003/leavebalance/employee/${employee_id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (response.ok) {
                    var data = await response.json();
                    console.log("leave balance now", data);

                    setLeaveBalance(data);
                    console.log("total remailnkg", data.total_available_days);
                    console.log("total leavebalance", leavebBalance);

                }
            } catch (error) {
                console.error('Failed to fetch leave balane', error)
            }
        }
        fetchLeaveBalance()

    }, [employee_id])

    return (
        <section>
            <div className="leave-boxes">
                {leavebBalance &&
                    <div className="leave-box total">
                        <h2><CountUp end={leavebBalance.total_available_days} duration={3} /></h2>
                        <p>Total Available Leaves </p>
                    </div>
                }
                {leavebBalance.leave_types && leavebBalance.leave_types.map((leave, index) => (
                    <div className={`leave-box ${leave.type_name}`} key={index}>
                        <h2>  <CountUp end={leave.remaining_days} duration={3} />  </h2>
                        <p>Total {leave.type_name} Leaves</p>
                    </div>
                ))}
            </div>
        </section>
    )

}
export default LeaveBalance;

