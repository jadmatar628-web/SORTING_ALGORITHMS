function shouldComeBefore(left, right, order) {
  return order === 'ascending' ? left <= right : left >= right;
}

export function generateQuickSortTrace(array, order = 'ascending') {
  const values = [...array];
  const steps = [];

  function partition(low, high) {
    const pivot = values[high];
    let boundary = low - 1;

    for (let index = low; index < high; index += 1) {
      if (shouldComeBefore(values[index], pivot, order)) {
        boundary += 1;
        [values[boundary], values[index]] = [values[index], values[boundary]];
      }
    }

    [values[boundary + 1], values[high]] = [values[high], values[boundary + 1]];
    steps.push([...values]);
    return boundary + 1;
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
