import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/approve.css';
import Stepper from './Stepper';

const LeaveApproval = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [approvals, setApprovals] = useState([]);
  const { requestId } = useParams();

  useEffect(() => {
    const fetchApprovalStatus = async () => {
      try {
        console.log("requestId", requestId);
        const res = await fetch(`http://localhost:3003/leaveapproval/status/${requestId}`);
        const data = await res.json();
        console.log("leave approval",data);
        setApprovals(data);

        let step = 1;
      data.forEach(item => {
        if (item.role === 'manager' && item.status === 'approved') step = 2;
        if (item.role === 'hr' && item.status === 'approved') step = 3;
        if (item.role === 'director' && item.status === 'approved') step = 4;
      });

      // if (step === 3) step = 4; // final completed
      setCurrentStep(step);

      } catch (err) {
        console.error('Failed to fetch approval status', err);
      }
    };

    fetchApprovalStatus();
  }, [requestId]);

  
  return (
    <div>
    <h2 style={{ textAlign: 'center' }}>Leave Request Progress</h2>
    <Stepper currentStep={currentStep} approvals={approvals}/>
  </div>
  );
};

export default LeaveApproval;
