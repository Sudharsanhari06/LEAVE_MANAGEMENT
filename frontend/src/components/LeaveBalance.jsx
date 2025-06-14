import React from 'react';
import { useState, useEffect } from 'react';
import '../styles/dashboard.css';
import CountUp from 'react-countup';

const LeaveBalance = ({ employee_id,refreshKey }) => {

    const [leaveBalance, setLeaveBalance] = useState({});

    useEffect(() => {

        const fetchLeaveBalance = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`http://localhost:3006/leavebalance/employee/${employee_id}`, {
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
                    console.log("total leavebalance", leaveBalance);

                }
            } catch (error) {
                console.error('Failed to fetch leave balane', error)
            }
        }
        fetchLeaveBalance()

    }, [employee_id,refreshKey])

    return (
        <section>
            <div className="leave-boxes">
                {leaveBalance &&
                    <div className="leave-box total">
                        <h2><CountUp end={leaveBalance.total_available_days} duration={3} /></h2>
                        <p>Total Available Leaves </p>
                    </div>
                }
                {leaveBalance.leave_types && leaveBalance.leave_types.map((leave, index) => (
                    <div className={`leave-box ${leave.type_name}`} key={index}>
                        {
                            leave.remaining_days > 0 ? (
                                <>
                                    <h2>  <CountUp end={leave.remaining_days} duration={3} />  </h2>
                                    <p>Total {leave.type_name} Leaves</p>
                                </>
                            ) : (
                                <p className='no-leaves'>No Leaves Available</p>
                            )
                        }

                    </div>
                ))}
            </div>
        </section>
    )

}
export default LeaveBalance;

