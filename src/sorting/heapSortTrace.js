function isPreferred(parent, child, order) {
  return order === 'ascending' ? parent >= child : parent <= child;
}

export function generateHeapSortTrace(array, order = 'ascending') {
  const values = [...array];
  const steps = [];

  function heapify(size, root) {
    let selected = root;
    const left = root * 2 + 1;
    const right = root * 2 + 2;

    if (left < size && !isPreferred(values[selected], values[left], order)) {
      selected = left;
    }

    if (right < size && !isPreferred(values[selected], values[right], order)) {
      selected = right;
    }

    if (selected !== root) {
      [values[root], values[selected]] = [values[selected], values[root]];
      heapify(size, selected);
    }
  }

  for (let index = Math.floor(values.length / 2) - 1; index >= 0; index -= 1) {
    heapify(values.length, index);
  }

  steps.push([...values]);

  for (let end = values.length - 1; end > 0; end -= 1) {
    [values[0], values[end]] = [values[end], values[0]];
    heapify(end, 0);
    steps.push([...values]);
  }

  return steps;
}
