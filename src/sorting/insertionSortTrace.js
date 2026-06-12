function belongsBefore(left, right, order) {
  return order === 'ascending' ? left > right : left < right;
}

export function generateInsertionSortTrace(array, order = 'ascending') {
  const values = [...array];
  const steps = [];

  for (let index = 1; index < values.length; index += 1) {
    const current = values[index];
    let position = index - 1;

    while (position >= 0 && belongsBefore(values[position], current, order)) {
      values[position + 1] = values[position];
      position -= 1;
    }

    values[position + 1] = current;
    steps.push([...values]);
  }

  return steps;
}
