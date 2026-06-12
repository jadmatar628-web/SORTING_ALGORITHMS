import { createTraceStep } from './traceStep.js';

function shouldTakeLeft(left, right, order, strict) {
  if (order === 'ascending') {
    return strict ? left < right : left <= right;
  }

  return strict ? left > right : left >= right;
}

export function generateMergeSortTrace(
  array,
  order = 'ascending',
  traceMode = 'pass',
  options = {}
) {
  const values = [...array];
  const steps = [];
  const mode = traceMode === 'detailed' ? 'detailed' : 'pass';
  const { pdfStrictMergeComparison = true } = options;

  function addStep(details) {
    steps.push(
      createTraceStep({
        array: values,
        algorithm: 'merge-sort',
        traceMode: mode,
        ...details
      })
    );
  }

  function merge(start, middle, end) {
    const leftValues = values.slice(start, middle + 1);
    const rightValues = values.slice(middle + 1, end + 1);
    let leftIndex = 0;
    let rightIndex = 0;
    let targetIndex = start;

    while (leftIndex < leftValues.length && rightIndex < rightValues.length) {
      const originalLeftIndex = start + leftIndex;
      const originalRightIndex = middle + 1 + rightIndex;

      if (mode === 'detailed') {
        addStep({
          action: 'compare',
          comparedIndices: [originalLeftIndex, originalRightIndex],
          low: start,
          high: end,
          note: `Compare left value ${leftValues[leftIndex]} with right value ${rightValues[rightIndex]}.`
        });
      }

      if (shouldTakeLeft(leftValues[leftIndex], rightValues[rightIndex], order, pdfStrictMergeComparison)) {
        values[targetIndex] = leftValues[leftIndex];
        leftIndex += 1;
      } else {
        values[targetIndex] = rightValues[rightIndex];
        rightIndex += 1;
      }

      if (mode === 'detailed') {
        addStep({
          action: 'place',
          insertedIndex: targetIndex,
          low: start,
          high: end,
          note: `Place value at index ${targetIndex}.`
        });
      }

      targetIndex += 1;
    }

    while (leftIndex < leftValues.length) {
      values[targetIndex] = leftValues[leftIndex];
      if (mode === 'detailed') {
        addStep({
          action: 'place-left-remainder',
          insertedIndex: targetIndex,
          low: start,
          high: end,
          note: `Copy remaining left value to index ${targetIndex}.`
        });
      }
      leftIndex += 1;
      targetIndex += 1;
    }

    while (rightIndex < rightValues.length) {
      values[targetIndex] = rightValues[rightIndex];
      if (mode === 'detailed') {
        addStep({
          action: 'place-right-remainder',
          insertedIndex: targetIndex,
          low: start,
          high: end,
          note: `Copy remaining right value to index ${targetIndex}.`
        });
      }
      rightIndex += 1;
      targetIndex += 1;
    }

    addStep({
      action: 'merge-complete',
      low: start,
      high: end,
      note: `Merged subarray ${start}..${end}.`
    });
  }

  function mergeSort(start, end) {
    if (start >= end) {
      return;
    }

    const middle = Math.floor((start + end) / 2);
    mergeSort(start, middle);
    mergeSort(middle + 1, end);
    merge(start, middle, end);
  }

  mergeSort(0, values.length - 1);
  return steps;
}
