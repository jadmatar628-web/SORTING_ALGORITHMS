export function parseNumberList(value) {
  return value
    .trim()
    .split(/[\s,]+/)
    .filter(Boolean)
    .map((item) => Number(item));
}

export function hasOnlyNumbers(values) {
  return values.every((value) => Number.isFinite(value));
}

export function sameMultiset(left, right) {
  if (left.length !== right.length) {
    return false;
  }

  const counts = new Map();
  left.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));

  for (const value of right) {
    const count = counts.get(value);
    if (!count) {
      return false;
    }
    counts.set(value, count - 1);
  }

  return [...counts.values()].every((count) => count === 0);
}

export function validateStepArray(values, expectedLength, originalArray) {
  if (values.length !== expectedLength) {
    return `Expected ${expectedLength} values.`;
  }

  if (!hasOnlyNumbers(values)) {
    return 'Every value must be a number.';
  }

  if (!sameMultiset(values, originalArray)) {
    return 'Values must match the original array with no extras or missing items.';
  }

  return '';
}
