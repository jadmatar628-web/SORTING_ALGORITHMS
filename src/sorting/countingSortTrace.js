export function generateCountingSortTrace(array, order = 'ascending') {
  const min = Math.min(...array);
  const max = Math.max(...array);
  const counts = new Map();
  const values = [...array];
  const result = [];
  const steps = [];

  array.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));

  const sortedValues =
    order === 'ascending'
      ? Array.from({ length: max - min + 1 }, (_, index) => min + index)
      : Array.from({ length: max - min + 1 }, (_, index) => max - index);

  sortedValues.forEach((value) => {
    const count = counts.get(value) ?? 0;
    if (count === 0) {
      return;
    }

    for (let index = 0; index < count; index += 1) {
      result.push(value);
    }

    const used = new Map();
    result.forEach((item) => used.set(item, (used.get(item) ?? 0) + 1));
    const remainder = values.filter((item) => {
      const countUsed = used.get(item) ?? 0;
      if (countUsed === 0) {
        return true;
      }

      used.set(item, countUsed - 1);
      return false;
    });

    steps.push([...result, ...remainder]);
  });

  return steps;
}
