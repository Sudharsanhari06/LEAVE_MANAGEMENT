import React, { useEffect, useState } from 'react';
import '../styles/manager.css';

const ManagerRequest = ({role, approverId}) => {
    const [leaveRequests, setLeaveRequests] = useState([]);


    useEffect(() => {
        const fetchLeaveRequests = async () => {


            const token=localStorage.getItem('token');

            console.log("role approver",role, approverId);
            try {
                const response = await fetch(`http://localhost:3003/leaveapproval/mapped?role=${role}&approved_by=${approverId}`,{
                   
                    method:'GET',
                     headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setLeaveRequests(data);
                console.log("leave requests data", data);

            } catch (error) {
                console.error("Failed to fetch leave requests:", error);
            }
        };

        fetchLeaveRequests();
    }, [role, approverId]);


    async function handleDecision(requestId, decision) {
        const token=localStorage.getItem('token');
        console.log("manager token",token)

        try {
            const response = await fetch(`http://localhost:3003/leaveapproval/decision`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                 },
                body: JSON.stringify({ 
                    request_id:requestId,
                    role,
                    decision, 
                    approved_by: approverId })
            });

            const result = await response.json();
            alert(result.message);
            setLeaveRequests(prev => prev.filter(r => r.request_id !== requestId));
        } catch (error) {
            console.error("Approval error:", error);
        }
    }
    return (
        <section className='leave-request-container'>
            {
                leaveRequests.map(request => (
                    <div className="leave-request-card" key={request.request_id}>
                        <h2>{request.employee_name}</h2>
                        <p>{request.leave_type}</p>
                        <p>{request.start_date.split('T')[0]} to {request.end_date.split('T')[0]}</p>
                        <p>{request.days}</p>
                        <p>{request.reason}</p>
                        <button onClick={() => handleDecision(request.request_id, 'approved')}>Approve</button>
                        <button onClick={() => handleDecision(request.request_id, 'rejected')}>Reject</button>
                    </div>

                ))}
        </section>
    )
}
export default ManagerRequest;
