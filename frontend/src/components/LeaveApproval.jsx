import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaHourglassHalf } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import '../styles/approve.css';

const LeaveApproval = () => {
  const [statuses, setStatuses] = useState({ manager: 'pending', hr: 'pending' }); // ✅ moved here
  const steps = ['Leave Requested', 'Manager Approval', 'HR Approval'];
  const { requestId } = useParams();

  useEffect(() => {
    const fetchApprovalStatus = async () => {
      try {
        console.log("requestId", requestId);
        const res = await fetch(`http://localhost:3003/leaveapproval/status/${requestId}`);
        const data = await res.json();

        const newStatuses = { manager: 'pending', hr: 'pending' };
        data.forEach(item => {
          if (item.role === 'manager') newStatuses.manager = item.status;
          if (item.role === 'hr') newStatuses.hr = item.status;
        });

        setStatuses(newStatuses);
      } catch (err) {
        console.error('Failed to fetch approval status', err);
      }
    };

    fetchApprovalStatus();
  }, [requestId]);

  const getStepClass = (stepIndex) => {
    if (stepIndex === 0) return 'step completed'; // Leave Requested is always done
    if (stepIndex === 1 && statuses.manager === 'approved') return 'step completed';
    if (stepIndex === 2 && statuses.hr === 'approved') return 'step completed';
    return 'step';
  };

  const getIcon = (stepIndex) => {
    if (
      stepIndex === 0 ||
      (stepIndex === 1 && statuses.manager === 'approved') ||
      (stepIndex === 2 && statuses.hr === 'approved')
    ) {
      return <FaCheckCircle className="step-icon done" />;
    }
    return <FaHourglassHalf className="step-icon pending" />;
  };

  return (
    <div className="progress-container">
      <h2>Leave Request Progress</h2>
      <div className="progress-bar">
        {steps.map((label, index) => (
          <div key={index} className={getStepClass(index)}>
            {getIcon(index)}
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaveApproval;
