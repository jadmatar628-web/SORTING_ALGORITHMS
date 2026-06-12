import { createTraceStep } from './traceStep.js';

function isBetterCandidate(candidate, current, order) {
  return order === 'ascending' ? candidate < current : candidate > current;
}

export function generateSelectionSortTrace(array, order = 'ascending', traceMode = 'pass') {
  const values = [...array];
  const steps = [];
  const mode = traceMode === 'detailed' ? 'detailed' : 'pass';

  function addStep(details) {
    steps.push(
      createTraceStep({
        array: values,
        algorithm: 'selection-sort',
        traceMode: mode,
        ...details
      })
    );
  }

  for (let start = 0; start < values.length - 1; start += 1) {
    let selectedIndex = start;

    for (let index = start + 1; index < values.length; index += 1) {
      if (mode === 'detailed') {
        addStep({
          passNumber: start + 1,
          action: 'compare',
          comparedIndices: [selectedIndex, index],
          note: `Compare current minimum at index ${selectedIndex} with index ${index}.`
        });
      }

      if (isBetterCandidate(values[index], values[selectedIndex], order)) {
        selectedIndex = index;

        if (mode === 'detailed') {
          addStep({
            passNumber: start + 1,
            action: 'select-min',
            comparedIndices: [start, index],
            note: `New selected index is ${selectedIndex}.`
          });
        }
      }
    }

    if (selectedIndex !== start) {
      [values[start], values[selectedIndex]] = [values[selectedIndex], values[start]];

      if (mode === 'detailed') {
        addStep({
          passNumber: start + 1,
          action: 'swap-selected',
          swappedIndices: [start, selectedIndex],
          note: `Swap index ${start} with selected index ${selectedIndex}.`
        });
      }
    }

    if (mode === 'pass') {
      addStep({
        passNumber: start + 1,
        action: 'pass-complete',
        swappedIndices: selectedIndex === start ? null : [start, selectedIndex],
        note: `After pass ${start + 1}, the minimum of the unsorted part is placed at index ${start}.`
      });
    }
  }

  return steps;
}
