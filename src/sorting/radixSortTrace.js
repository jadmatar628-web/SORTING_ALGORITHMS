import { createTraceStep } from './traceStep.js';

function digitName(divisor) {
  if (divisor === 1) {
    return 'ones';
  }

  if (divisor === 10) {
    return 'tens';
  }

  if (divisor === 100) {
    return 'hundreds';
  }

  return `${divisor}s`;
}

function withoutUsedValues(values, usedValues) {
  const used = new Map();
  usedValues.forEach((value) => used.set(value, (used.get(value) ?? 0) + 1));

  return values.filter((value) => {
    const count = used.get(value) ?? 0;
    if (count === 0) {
      return true;
    }

    used.set(value, count - 1);
    return false;
  });
}

function radixPass(values, divisor) {
  const buckets = Array.from({ length: 10 }, () => []);

  values.forEach((value) => {
    const digit = Math.floor(value / divisor) % 10;
    buckets[digit].push(value);
  });

  return buckets.flat();
}

export function generateRadixSortTrace(array, order = 'ascending', traceMode = 'pass') {
  let values = [...array];
  const steps = [];
  const max = Math.max(...values);
  const mode = traceMode === 'detailed' ? 'detailed' : 'pass';

  function addStep(arrayState, details) {
    steps.push(
      createTraceStep({
        array: arrayState,
        algorithm: 'radix-sort',
        traceMode: mode,
        ...details,
        note:
          order === 'descending'
            ? `${details.note} Descending radix sort is an app-only extension.`
            : details.note
      })
    );
  }

  for (let divisor = 1; Math.floor(max / divisor) > 0; divisor *= 10) {
    const buckets = Array.from({ length: 10 }, () => []);
    const passNumber = Math.log10(divisor) + 1;
    const name = digitName(divisor);

    values.forEach((value, index) => {
      const digit = Math.floor(value / divisor) % 10;
      buckets[digit].push(value);

      if (mode === 'detailed') {
        addStep(values, {
          passNumber,
          action: 'bucket-insert',
          insertedIndex: index,
          note: `Place ${value} into bucket ${digit} for the ${name} digit.`
        });
      }
    });

    const bucketOrder =
      order === 'ascending'
        ? buckets.map((_, index) => index)
        : buckets.map((_, index) => buckets.length - 1 - index);
    const nextValues = [];

    bucketOrder.forEach((bucketIndex) => {
      buckets[bucketIndex].forEach((value) => {
        nextValues.push(value);

        if (mode === 'detailed') {
          addStep([...nextValues, ...withoutUsedValues(values, nextValues)], {
            passNumber,
            action: 'bucket-read',
            insertedIndex: nextValues.length - 1,
            note: `Read ${value} back from bucket ${bucketIndex}.`
          });
        }
      });
    });

    values = nextValues;
    addStep(values, {
      passNumber,
      action: 'digit-pass-complete',
      note: `After sorting by ${name} digit.`
    });
  }

  return steps;
}
