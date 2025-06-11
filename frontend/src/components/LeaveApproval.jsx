import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/approve.css';
import { IoMdClose } from "react-icons/io";

const LeaveApproval = () => {
  const [approvals, setApprovals] = useState([]);
  const { requestId } = useParams();

  useEffect(() => {
    const fetchApprovalStatus = async () => {
      try {
        const res = await fetch(`http://localhost:3006/leaveapproval/status/${requestId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!res.ok) throw new Error('Failed to fetch approval status');
        
        const data = await res.json();
        setApprovals(data);
      } catch (err) {
        setError(err.message);
      } 
    };

    fetchApprovalStatus();
  }, [requestId]);

  const getStatusInfo = (status) => {
    switch (status) {
      case 'approved':
        return { color: '#4CAF50', icon: '✓', label: 'Approved' };
      case 'rejected':
        return { color: '#F44336', icon: <IoMdClose />, label: 'Rejected' };
      default:
        return { color: '#FF9800', icon: '...', label: 'Pending' };
    }
  };

  
  return (
    <div className="approval-container">
      <h2 className="approval-title">Leave Approval Status</h2>
      <div className="approval-timeline">
       
        <div className="timeline-step completed">
          <div className="step-marker" style={{ backgroundColor: '#4CAF50' }}>
            ✓
          </div>
          <div className="step-content">
            <h3>Request Submitted</h3>
            <p className="step-date">Initial request</p>
          </div>
        </div>

        {approvals.map((approval, index) => {
          const statusInfo = getStatusInfo(approval.status);
          const isLast = index === approvals.length - 1;

          return (
            <div 
              key={index} 
              className={`timeline-step ${approval.status}`}
              style={{ borderLeftColor: statusInfo.color }}
            >
              <div className="step-marker" style={{ backgroundColor:statusInfo.color}}>
                {statusInfo.icon}
              </div>
              <div className="step-content">
                <h3>{approval.role.charAt(0).toUpperCase() + approval.role.slice(1)} Approval</h3>
                <p className="approver-name">
                  <strong>Approver:</strong> {approval.approved_by_name || 'Pending'}
                </p>
                <p className="step-status" style={{ color: statusInfo.color }}>
                  {statusInfo.label}
                </p>
                {approval.reason && (
                  <div className="reason-box">
                    <strong>Reason:</strong> {approval.reason}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeaveApproval;