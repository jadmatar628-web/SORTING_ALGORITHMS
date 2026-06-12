import React from 'react';
import ArrayInput from './ArrayInput.jsx';

const actionLabels = {
  'choose-pivot': 'Choose pivot',
  'move-left': 'Move left',
  'move-right': 'Move right',
  'swap-left-right': 'Swap left/right',
  'place-pivot': 'Place pivot',
  'partition-complete': 'Partition complete'
};

function formatIndex(value) {
  return Number.isInteger(value) ? value : '-';
}

function StepDetails({ details }) {
  if (!details) {
    return null;
  }

  return (
    <div className="step-details">
      <span>{actionLabels[details.action] ?? details.action}</span>
      <span>low {formatIndex(details.low)}</span>
      <span>high {formatIndex(details.high)}</span>
      <span>pivot {details.pivotValue}</span>
      <span>pivot pos {formatIndex(details.pivotIndex ?? details.pivotOriginalIndex)}</span>
      <span>left {formatIndex(details.left)}</span>
      <span>right {formatIndex(details.right)}</span>
      {details.swappedLeft !== null && details.swappedRight !== null && (
        <span>
          swapped {details.swappedLeft} and {details.swappedRight}
        </span>
      )}
    </div>
  );
}

export default function StepForm({ userSteps, stepDetails = [], errors, onStepChange, onSubmit }) {
  return (
    <form className="steps-panel" onSubmit={onSubmit}>
      <div className="section-heading">
        <h2>Fill the intermediate arrays</h2>
        <p>{userSteps.length} step{userSteps.length === 1 ? '' : 's'} required.</p>
      </div>

      <div className="step-list">
        {userSteps.map((step, index) => (
          <div className="step-item" key={index}>
            <StepDetails details={stepDetails[index]} />
            <ArrayInput
              label={`Step ${index + 1}`}
              values={step}
              onChange={(nextStep) => onStepChange(index, nextStep)}
            />
            {errors[index] && <div className="error-text">{errors[index]}</div>}
          </div>
        ))}
      </div>

      <button className="primary-button" type="submit">
        Submit answers
      </button>
    </form>
  );
}
