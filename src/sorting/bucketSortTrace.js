function getBucketIndex(value, min, max, bucketCount) {
  if (min === max) {
    return 0;
  }

  const normalized = (value - min) / (max - min);
  return Math.min(bucketCount - 1, Math.floor(normalized * bucketCount));
}

export function generateBucketSortTrace(array, order = 'ascending') {
  const bucketCount = Math.max(2, array.length);
  const min = Math.min(...array);
  const max = Math.max(...array);
  const buckets = Array.from({ length: bucketCount }, () => []);
  const steps = [];
  const output = [];

  array.forEach((value) => {
    buckets[getBucketIndex(value, min, max, bucketCount)].push(value);
  });

  buckets.forEach((bucket) => {
    bucket.sort((left, right) => left - right);
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

    steps.push([...output, ...remaining]);
  });

  return steps;
}
