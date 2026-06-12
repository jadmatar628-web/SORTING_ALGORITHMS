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
  'merge-complete': 'Merge complete',
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

export default function ResultTable({ results, onTryAgain }) {
  if (!results) {
    return null;
  }

  return (
    <section className="results-panel">
      <div className="score-grid">
        <div>
          <span>Score</span>
          <strong>
            {results.correctSteps} / {results.totalSteps}
          </strong>
          <small>steps correct</small>
        </div>
        <div>
          <span>Cell accuracy</span>
          <strong>
            {results.correctCells} / {results.totalCells}
          </strong>
          <small>cells correct</small>
        </div>
        <div>
          <span>Percentage</span>
          <strong>{results.percentage}%</strong>
          <small>overall</small>
        </div>
      </div>

      <div className="comparison-table">
        <div className="table-header">Step</div>
        <div className="table-header">User answer</div>
        <div className="table-header">Correct answer</div>
        <div className="table-header">Result</div>

        {results.steps.map((step) => (
          <div className="table-row" key={step.stepIndex}>
            <div className="table-cell step-number">{step.stepIndex + 1}</div>
            <div className="table-cell">
              <ArrayInput
                values={step.user.map(String)}
                comparison={step.cellResults}
                correctValues={step.correct}
                disabled
              />
            </div>
            <div className="table-cell answer-text">
              {step.details && (
                <div className="result-detail">
                  {actionLabels[step.details.action] ?? step.details.action}
                  {step.details.passNumber != null ? `, pass ${step.details.passNumber}` : ''}
                  {step.details.pivotValue != null ? `, pivot ${step.details.pivotValue}` : ''}
                  {step.details.left != null ? `, left ${step.details.left}` : ''}
                  {step.details.right != null ? `, right ${step.details.right}` : ''}
                  {step.details.note ? `: ${step.details.note}` : ''}
                </div>
              )}
              {step.correct.join(' ')}
            </div>
            <div className={`table-cell result-badge ${step.isCorrect ? 'good' : 'bad'}`}>
              {step.isCorrect ? 'Correct' : 'Incorrect'}
            </div>
          </div>
        ))}
      </div>

      <button className="secondary-button" type="button" onClick={onTryAgain}>
        Edit answers
      </button>
    </section>
  );
}
