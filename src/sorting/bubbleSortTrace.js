import { createTraceStep } from './traceStep.js';

function shouldSwap(left, right, order) {
  return order === 'ascending' ? left > right : left < right;
}

export function generateBubbleSortTrace(
  array,
  order = 'ascending',
  traceMode = 'pass',
  optimized = false
) {
  if (typeof traceMode === 'boolean') {
    optimized = traceMode;
    traceMode = 'pass';
  }

  const values = [...array];
  const steps = [];
  const mode = traceMode === 'detailed' ? 'detailed' : 'pass';

  function addStep(details) {
    steps.push(
      createTraceStep({
        array: values,
        algorithm: 'bubble-sort',
        traceMode: mode,
        ...details
      })
    );
  }

  for (let pass = 0; pass < values.length - 1; pass += 1) {
    let swapped = false;

    for (let index = 0; index < values.length - 1 - pass; index += 1) {
      if (mode === 'detailed') {
        addStep({
          passNumber: pass + 1,
          action: 'compare',
          comparedIndices: [index, index + 1],
          note: `Compare A[${index}] and A[${index + 1}].`
        });
      }

      if (shouldSwap(values[index], values[index + 1], order)) {
        [values[index], values[index + 1]] = [values[index + 1], values[index]];
        swapped = true;

        if (mode === 'detailed') {
          addStep({
            passNumber: pass + 1,
            action: 'swap',
            comparedIndices: [index, index + 1],
            swappedIndices: [index, index + 1],
            note: `Swap A[${index}] and A[${index + 1}].`
          });
        }
      }
    }

    addStep({
      passNumber: pass + 1,
      action: 'pass-complete',
      note: `After pass ${pass + 1}, the largest remaining element is placed near the end.`
    });

    if (optimized && !swapped) {
      break;
    }
  }

  return steps;
}
