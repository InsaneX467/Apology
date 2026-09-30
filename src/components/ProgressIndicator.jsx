import React from 'react';

export default function ProgressIndicator({ currentStep, totalSteps = 8 }) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="progress-container">
      <div className="progress-tracker">
        {steps.map((stepNum, idx) => {
          const isActive = stepNum === currentStep;
          const isCompleted = stepNum < currentStep;

          return (
            <React.Fragment key={stepNum}>
              <div 
                className={`progress-heart ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                title={`Step ${stepNum}`}
              >
                {isActive ? '💖' : isCompleted ? '💗' : '♡'}
              </div>

              {idx < steps.length - 1 && (
                <div className={`progress-line ${isCompleted ? 'completed' : ''}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
      <div className="progress-step-text">
        Step {currentStep} of {totalSteps}
      </div>
    </div>
  );
}
