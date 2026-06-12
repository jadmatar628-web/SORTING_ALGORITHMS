function compare(left, right, order) {
  return order === 'ascending' ? left <= right : left >= right;
}

export function generateMergeSortTrace(array, order = 'ascending') {
  const values = [...array];
  const steps = [];

  function merge(start, middle, end) {
    const merged = [];
    let leftIndex = start;
    let rightIndex = middle + 1;

    while (leftIndex <= middle && rightIndex <= end) {
      if (compare(values[leftIndex], values[rightIndex], order)) {
        merged.push(values[leftIndex]);
        leftIndex += 1;
      } else {
        merged.push(values[rightIndex]);
        rightIndex += 1;
      }
    }

    while (leftIndex <= middle) {
      merged.push(values[leftIndex]);
      leftIndex += 1;
    }

    while (rightIndex <= end) {
      merged.push(values[rightIndex]);
      rightIndex += 1;
    }

    merged.forEach((value, index) => {
      values[start + index] = value;
    });
    steps.push([...values]);
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
