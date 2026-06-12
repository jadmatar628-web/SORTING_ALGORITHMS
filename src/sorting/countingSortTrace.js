export function generateCountingSortTrace(array, order = 'ascending') {
  const min = Math.min(...array);
  const max = Math.max(...array);
  const counts = new Map();
  const result = [];
  const steps = [];

  array.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));

  const values =
    order === 'ascending'
      ? Array.from({ length: max - min + 1 }, (_, index) => min + index)
      : Array.from({ length: max - min + 1 }, (_, index) => max - index);

  values.forEach((value) => {
    const count = counts.get(value) ?? 0;
    if (count === 0) {
      return;
    }

    for (let index = 0; index < count; index += 1) {
      result.push(value);
    }

    steps.push([...result, ...array.slice(result.length)]);
  });

  return steps;
}
