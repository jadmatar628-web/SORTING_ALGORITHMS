import { createTraceStep } from './traceStep.js';

function shouldMoveLeft(value, pivot, order) {
  return order === 'ascending' ? value <= pivot : value >= pivot;
}

function shouldMoveRight(value, pivot, order) {
  return order === 'ascending' ? value > pivot : value < pivot;
}

export function generateI2206QuickSortTrace(array, order = 'ascending', traceMode = 'detailed') {
  const values = [...array];
  const steps = [];
  const mode = traceMode === 'pass' ? 'pass' : 'detailed';

  function addStep({
    low,
    high,
    pivotOriginalIndex,
    pivotIndex = null,
    pivotValue,
    left,
    right,
    action,
    swappedLeft = null,
    swappedRight = null
  }) {
    steps.push(
      createTraceStep({
        array: values,
        algorithm: 'quick-sort',
        traceMode: mode,
        passNumber: null,
        low,
        high,
        pivotOriginalIndex,
        pivotIndex,
        pivotValue,
        left,
        right,
        action,
        swappedIndices:
          swappedLeft === null || swappedRight === null ? null : [swappedLeft, swappedRight],
        note:
          action === 'partition-complete'
            ? `Pivot ${pivotValue} placed at index ${pivotIndex}.`
            : action === 'choose-pivot'
              ? `Choose leftmost pivot ${pivotValue} at index ${pivotOriginalIndex}.`
              : action === 'move-left'
                ? `Move left pointer to ${left}.`
                : action === 'move-right'
                  ? `Move right pointer to ${right}.`
                  : action === 'swap-left-right'
                    ? `Swap A[${swappedLeft}] and A[${swappedRight}].`
                    : `Place pivot ${pivotValue} at index ${pivotIndex}.`
      })
    );
  }

  function partition(low, high) {
    const pivotValue = values[low];
    const pivotOriginalIndex = low;
    let left = low + 1;
    let right = high;

    if (mode === 'detailed') {
      addStep({
        low,
        high,
        pivotOriginalIndex,
        pivotValue,
        left,
        right,
        action: 'choose-pivot'
      });
    }

    while (left <= right) {
      while (left <= right && shouldMoveLeft(values[left], pivotValue, order)) {
        if (mode === 'detailed') {
          addStep({
            low,
            high,
            pivotOriginalIndex,
            pivotValue,
            left,
            right,
            action: 'move-left'
          });
        }
        left += 1;
      }

      while (left <= right && shouldMoveRight(values[right], pivotValue, order)) {
        if (mode === 'detailed') {
          addStep({
            low,
            high,
            pivotOriginalIndex,
            pivotValue,
            left,
            right,
            action: 'move-right'
          });
        }
        right -= 1;
      }

      if (left < right) {
        const swappedLeft = left;
        const swappedRight = right;
        [values[left], values[right]] = [values[right], values[left]];
        if (mode === 'detailed') {
          addStep({
            low,
            high,
            pivotOriginalIndex,
            pivotValue,
            left,
            right,
            action: 'swap-left-right',
            swappedLeft,
            swappedRight
          });
        }
        left += 1;
        right -= 1;
      }
    }

    values[low] = values[right];
    values[right] = pivotValue;

    if (mode === 'detailed') {
      addStep({
        low,
        high,
        pivotOriginalIndex,
        pivotIndex: right,
        pivotValue,
        left,
        right,
        action: 'place-pivot'
      });
    }
    addStep({
      low,
      high,
      pivotOriginalIndex,
      pivotIndex: right,
      pivotValue,
      left,
      right,
      action: 'partition-complete'
    });

    return right;
  }

  function quickSort(low, high) {
    if (low < high) {
      const pivotIndex = partition(low, high);
      quickSort(low, pivotIndex - 1);
      quickSort(pivotIndex + 1, high);
    }
  }

  quickSort(0, values.length - 1);
  return steps;
}

export const generateQuickSortTracePDFStyle = generateI2206QuickSortTrace;
export const generateQuickSortTrace = generateI2206QuickSortTrace;
