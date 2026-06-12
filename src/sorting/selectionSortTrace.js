function isBetterCandidate(candidate, current, order) {
  return order === 'ascending' ? candidate < current : candidate > current;
}

export function generateSelectionSortTrace(array, order = 'ascending') {
  const values = [...array];
  const steps = [];

  for (let start = 0; start < values.length - 1; start += 1) {
    let selectedIndex = start;

    for (let index = start + 1; index < values.length; index += 1) {
      if (isBetterCandidate(values[index], values[selectedIndex], order)) {
        selectedIndex = index;
      }
    }

    [values[start], values[selectedIndex]] = [values[selectedIndex], values[start]];
    steps.push([...values]);
  }

  return steps;
}
