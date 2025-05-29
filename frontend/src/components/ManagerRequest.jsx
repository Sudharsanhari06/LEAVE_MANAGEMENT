import React, { useEffect, useState } from 'react';
import '../styles/manager.css';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const ManagerRequest = ({ role, approverId }) => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [currentRequestId, setCurrentRequestId] = useState(null);

  const notyf = new Notyf({
    duration: 1000,
    position: {
      x: 'right',
      y: 'top',
    },
  });

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      const token = localStorage.getItem('token');

      console.log("role approver", role, approverId);
      try {
        const response = await fetch(`http://localhost:3003/leaveapproval/mapped?role=${role}&approved_by=${approverId}`, {
          method: 'GET',
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


  async function handleDecision(requestId, decision, reason) {
    const token = localStorage.getItem('token');
    console.log("manager token", token);

    try {
      const response = await fetch(`http://localhost:3003/leaveapproval/decision`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          request_id: requestId,
          role,
          decision,
          approved_by: approverId,
          reason
        })
      });

      const result = await response.json();
      notyf.success(result.message);

      setLeaveRequests(prev => prev.filter(r => r.request_id !== requestId));
      setShowRejectModal(false);
      setRejectionReason('');

    } catch (error) {
      console.error("Approval error:", error);
    }
  }

  const cancelRequest = (requestId) => {
    const req = localStorage.getItem('canceledRequests');
    const canceled = JSON.parse(req) || [];
    console.log("canceledRequests", canceled)
    return canceled.includes(requestId)
  }


  return (
    <section className='leave-request-container'>

      {leaveRequests.map(request => {
        if (cancelRequest(request.request_id)) {
          return null;
        }

        return (
          <div className='leave-request-card-container'>
            <div className="leave-request-card" key={request.request_id}>

              <h2>{request.employee_name}</h2>
              <p className="leave-type">{request.leave_type}</p>

              <div className="date-range">
                <span>📅 {request.start_date.split('T')[0]}</span>
                <span>→</span>
                <span>{request.end_date.split('T')[0]}</span>
              </div>

              <p className="days-count">{request.days} day(s)</p>
              <p className="reason">{request.reason}</p>

              <div className="action-buttons">
                <button
                  className="approve-btn"
                  onClick={() => handleDecision(request.request_id, 'approved')}
                >
                  Approve
                </button>
                <button
                  className="reject-btn"
                  onClick={() => {
                    setCurrentRequestId(request.request_id);
                    setShowRejectModal(true);
                  }}
                >
                  Reject
                </button>
              </div>
            </div>

            { currentRequestId== request.request_id && showRejectModal && (
              <div className="modal-overlay">
                <div className="modal">
                  <h3>Enter Rejection Reason</h3>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Reason for rejection"
                    rows="4"
                    cols="40"
                    required
                  />
                  <div className="modal-buttons">
                    <button onClick={() => handleDecision(currentRequestId, 'rejected', rejectionReason)}>
                      Submit
                    </button>
                    <button onClick={() => setShowRejectModal(false)}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </div>

        );
      })}




    </section>
  )
}
export default ManagerRequest;
