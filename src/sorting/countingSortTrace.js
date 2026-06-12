import { createTraceStep } from './traceStep.js';

function withoutUsedValues(values, usedValues) {
  const used = new Map();
  usedValues.forEach((value) => used.set(value, (used.get(value) ?? 0) + 1));

  return values.filter((value) => {
    const count = used.get(value) ?? 0;
    if (count === 0) {
      return true;
    }

    used.set(value, count - 1);
    return false;
  });
}

export function generateCountingSortTrace(array, order = 'ascending', traceMode = 'pass') {
  const min = Math.min(...array);
  const max = Math.max(...array);
  const counts = new Map();
  const values = [...array];
  const result = [];
  const steps = [];
  const mode = traceMode === 'detailed' ? 'detailed' : 'pass';

  function addStep(arrayState, details) {
    steps.push(
      createTraceStep({
        array: arrayState,
        algorithm: 'counting-sort',
        traceMode: mode,
        ...details,
        note: `${details.note} Not directly verified from PDF.`
      })
    );
  }

  array.forEach((value, index) => {
    counts.set(value, (counts.get(value) ?? 0) + 1);

    if (mode === 'detailed') {
      addStep(values, {
        action: 'count-value',
        insertedIndex: index,
        note: `Count value ${value}.`
      });
    }
  });

  const sortedValues =
    order === 'ascending'
      ? Array.from({ length: max - min + 1 }, (_, index) => min + index)
      : Array.from({ length: max - min + 1 }, (_, index) => max - index);

  sortedValues.forEach((value) => {
    const count = counts.get(value) ?? 0;
    if (count === 0) {
      return;
    }

    for (let index = 0; index < count; index += 1) {
      result.push(value);

      if (mode === 'detailed') {
        addStep([...result, ...withoutUsedValues(values, result)], {
          action: 'write-value',
          insertedIndex: result.length - 1,
          note: `Write ${value} into the output prefix.`
        });
      }
    }

    if (mode === 'pass') {
      addStep([...result, ...withoutUsedValues(values, result)], {
        action: 'value-group-complete',
        note: `Placed all copies of ${value}.`
      });
    }
  });

  return steps;
}
