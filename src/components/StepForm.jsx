import React from 'react';
import ArrayInput from './ArrayInput.jsx';

const actionLabels = {
  compare: 'Compare',
  swap: 'Swap',
  'pass-complete': 'Pass complete',
  'select-min': 'Select min',
  'swap-selected': 'Swap selected',
  shift: 'Shift',
  insert: 'Insert',
  'choose-pivot': 'Choose pivot',
  'move-left': 'Move left',
  'move-right': 'Move right',
  'swap-left-right': 'Swap left/right',
  'place-pivot': 'Place pivot',
  'partition-complete': 'Partition complete',
  place: 'Place',
  'place-left-remainder': 'Place left remainder',
  'place-right-remainder': 'Place right remainder',
  'merge-complete': 'Merge complete',
  'compare-left-child': 'Compare left child',
  'compare-right-child': 'Compare right child',
  'heapify-swap': 'Heapify swap',
  'heap-built': 'Heap built',
  'extract-swap': 'Extraction swap',
  'extraction-complete': 'Extraction complete',
  'bucket-insert': 'Bucket insert',
  'bucket-read': 'Bucket read',
  'digit-pass-complete': 'Digit pass complete',
  'count-value': 'Count value',
  'write-value': 'Write value',
  'value-group-complete': 'Value group complete',
  'sort-bucket': 'Sort bucket',
  'bucket-complete': 'Bucket complete'
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
      {details.passNumber != null && <span>pass {details.passNumber}</span>}
      {details.low != null && <span>low {formatIndex(details.low)}</span>}
      {details.high != null && <span>high {formatIndex(details.high)}</span>}
      {details.comparedIndices && <span>compare {details.comparedIndices.join(' and ')}</span>}
      {details.swappedIndices && <span>swap {details.swappedIndices.join(' and ')}</span>}
      {details.shiftedIndex != null && <span>shifted {details.shiftedIndex}</span>}
      {details.insertedIndex != null && <span>inserted {details.insertedIndex}</span>}
      {details.pivotValue != null && <span>pivot {details.pivotValue}</span>}
      {(details.pivotIndex != null || details.pivotOriginalIndex != null) && (
        <span>pivot pos {formatIndex(details.pivotIndex ?? details.pivotOriginalIndex)}</span>
      )}
      {details.left != null && <span>left {formatIndex(details.left)}</span>}
      {details.right != null && <span>right {formatIndex(details.right)}</span>}
      {details.note && <span>{details.note}</span>}
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
