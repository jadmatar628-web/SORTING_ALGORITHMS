function shouldMoveLeft(value, pivot, order) {
  return order === 'ascending' ? value <= pivot : value >= pivot;
}

function shouldMoveRight(value, pivot, order) {
  return order === 'ascending' ? value > pivot : value < pivot;
}

export function generateI2206QuickSortTrace(array, order = 'ascending') {
  const values = [...array];
  const steps = [];

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
    steps.push({
      array: [...values],
      low,
      high,
      pivotOriginalIndex,
      pivotIndex,
      pivotValue,
      left,
      right,
      action,
      swappedLeft,
      swappedRight
    });
  }

  function partition(low, high) {
    const pivotValue = values[low];
    const pivotOriginalIndex = low;
    let left = low + 1;
    let right = high;

    addStep({
      low,
      high,
      pivotOriginalIndex,
      pivotValue,
      left,
      right,
      action: 'choose-pivot'
    });

    while (left <= right) {
      while (left <= right && shouldMoveLeft(values[left], pivotValue, order)) {
        left += 1;
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

      while (left <= right && shouldMoveRight(values[right], pivotValue, order)) {
        right -= 1;
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

      if (left < right) {
        const swappedLeft = left;
        const swappedRight = right;
        [values[left], values[right]] = [values[right], values[left]];
        left += 1;
        right -= 1;
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
    }

    values[low] = values[right];
    values[right] = pivotValue;

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
