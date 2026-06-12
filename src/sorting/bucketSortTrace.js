import { createTraceStep } from './traceStep.js';

function getBucketIndex(value, min, max, bucketCount) {
  if (min === max) {
    return 0;
  }

  const normalized = (value - min) / (max - min);
  return Math.min(bucketCount - 1, Math.floor(normalized * bucketCount));
}

export function generateBucketSortTrace(array, order = 'ascending', traceMode = 'pass') {
  const bucketCount = Math.max(2, array.length);
  const min = Math.min(...array);
  const max = Math.max(...array);
  const buckets = Array.from({ length: bucketCount }, () => []);
  const steps = [];
  const output = [];
  const mode = traceMode === 'detailed' ? 'detailed' : 'pass';

  function addStep(arrayState, details) {
    steps.push(
      createTraceStep({
        array: arrayState,
        algorithm: 'bucket-sort',
        traceMode: mode,
        ...details,
        note: `${details.note} Not directly verified from PDF.`
      })
    );
  }

  array.forEach((value, index) => {
    const bucketIndex = getBucketIndex(value, min, max, bucketCount);
    buckets[bucketIndex].push(value);

    if (mode === 'detailed') {
      addStep(array, {
        action: 'bucket-insert',
        insertedIndex: index,
        note: `Place ${value} into bucket ${bucketIndex}.`
      });
    }
  });

  buckets.forEach((bucket, bucketIndex) => {
    bucket.sort((left, right) => left - right);

    if (mode === 'detailed' && bucket.length > 1) {
      addStep(array, {
        action: 'sort-bucket',
        note: `Sort bucket ${bucketIndex}.`
      });
    }
  });

  const bucketOrder =
    order === 'ascending'
      ? buckets.map((_, index) => index)
      : buckets.map((_, index) => buckets.length - 1 - index);

  bucketOrder.forEach((bucketIndex, orderIndex) => {
    const bucket = buckets[bucketIndex];
    if (bucket.length === 0) {
      return;
    }

    output.push(...(order === 'ascending' ? bucket : [...bucket].reverse()));

    const remaining = bucketOrder
      .slice(orderIndex + 1)
      .flatMap((index) => (order === 'ascending' ? buckets[index] : [...buckets[index]].reverse()));

    addStep([...output, ...remaining], {
      action: mode === 'detailed' ? 'bucket-read' : 'bucket-complete',
      note: `Read bucket ${bucketIndex} into the output.`
    });
  });

  return steps;
}
