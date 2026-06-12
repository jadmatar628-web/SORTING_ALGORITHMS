import { createTraceStep } from './traceStep.js';

function belongsBefore(left, right, order) {
  return order === 'ascending' ? left > right : left < right;
}

export function generateInsertionSortTrace(array, order = 'ascending', traceMode = 'pass') {
  const values = [...array];
  const steps = [];
  const mode = traceMode === 'detailed' ? 'detailed' : 'pass';

  function addStep(details) {
    steps.push(
      createTraceStep({
        array: values,
        algorithm: 'insertion-sort',
        traceMode: mode,
        ...details
      })
    );
  }

  for (let index = 1; index < values.length; index += 1) {
    const current = values[index];
    let position = index - 1;

    while (position >= 0 && belongsBefore(values[position], current, order)) {
      values[position + 1] = values[position];

      if (mode === 'detailed') {
        addStep({
          passNumber: index,
          action: 'shift',
          comparedIndices: [position, position + 1],
          shiftedIndex: position + 1,
          note: `Shift A[${position}] to index ${position + 1}.`
        });
      }

      position -= 1;
    }

    values[position + 1] = current;
    addStep({
      passNumber: index,
      action: mode === 'detailed' ? 'insert' : 'pass-complete',
      insertedIndex: position + 1,
      note:
        mode === 'detailed'
          ? `Insert ${current} at index ${position + 1}.`
          : `After pass ${index}, the first ${index + 1} elements are sorted.`
    });
  }

  return steps;
}
