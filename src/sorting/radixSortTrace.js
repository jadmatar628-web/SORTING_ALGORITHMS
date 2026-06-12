function radixPass(values, divisor) {
  const buckets = Array.from({ length: 10 }, () => []);

  values.forEach((value) => {
    const digit = Math.floor(value / divisor) % 10;
    buckets[digit].push(value);
  });

  return buckets.flat();
}

export function generateRadixSortTrace(array, order = 'ascending') {
  let values = [...array];
  const steps = [];
  const max = Math.max(...values);

  for (let divisor = 1; Math.floor(max / divisor) > 0; divisor *= 10) {
    values = radixPass(values, divisor);
    steps.push(order === 'ascending' ? [...values] : [...values].reverse());
  }

  return steps;
}
