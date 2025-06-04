import React from 'react';
import '../styles/stepper.css';

const Stepper = ({ currentStep, approvals }) => {

  const steps = [{ label: 'Leave Requested', name: 'Employee' }, ...approvals.map(a => ({
    label: `${a.role.charAt(0).toUpperCase() + a.role.slice(1)} Approval`,
    name: a.approver_name
  }))];

 
  
  return (
    <div className="stepper-container">

      {steps.map((step, index) => {
        const stepNum = index + 1;
        const isCompleted = currentStep > stepNum;
        const isActive = currentStep === stepNum;
        
        return (
          <div key={index} className="step-wrapper">
            <div className={`step-circle ${isCompleted ? 'completed' : isActive ? 'active' : ''}`}>
              {isCompleted ? '✔' : stepNum}
            </div>
            <div className="step-label">
              <strong>{step.label}</strong>
              <div className="step-name">{step.name}</div>
            </div>
            {index !== steps.length - 1 && (
              <div className={`step-line ${currentStep > stepNum ? 'completed' : ''}`}></div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;
