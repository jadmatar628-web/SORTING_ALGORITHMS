function shouldSwap(left, right, order) {
  return order === 'ascending' ? left > right : left < right;
}

export function generateBubbleSortTrace(array, order = 'ascending', optimized = false) {
  const values = [...array];
  const steps = [];

  for (let pass = 0; pass < values.length - 1; pass += 1) {
    let swapped = false;

    for (let index = 0; index < values.length - 1 - pass; index += 1) {
      if (shouldSwap(values[index], values[index + 1], order)) {
        [values[index], values[index + 1]] = [values[index + 1], values[index]];
        swapped = true;
      }
    }

    steps.push([...values]);

    if (optimized && !swapped) {
      break;
    }
  }

  return steps;
}
