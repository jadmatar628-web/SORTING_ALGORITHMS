import { generateBubbleSortTrace } from '../src/sorting/bubbleSortTrace.js';
import { generateBucketSortTrace } from '../src/sorting/bucketSortTrace.js';
import { generateCountingSortTrace } from '../src/sorting/countingSortTrace.js';
import { generateHeapSortTrace } from '../src/sorting/heapSortTrace.js';
import { generateInsertionSortTrace } from '../src/sorting/insertionSortTrace.js';
import { generateMergeSortTrace } from '../src/sorting/mergeSortTrace.js';
import { generateQuickSortTrace } from '../src/sorting/quickSortTrace.js';
import { generateRadixSortTrace } from '../src/sorting/radixSortTrace.js';
import { generateSelectionSortTrace } from '../src/sorting/selectionSortTrace.js';
import { compareUserSteps } from '../src/sorting/compareAnswers.js';
import { sameMultiset } from '../src/utils/validateArray.js';

const algorithms = [
  ['bubble', generateBubbleSortTrace],
  ['selection', generateSelectionSortTrace],
  ['insertion', generateInsertionSortTrace],
  ['merge', generateMergeSortTrace],
  ['quick', generateQuickSortTrace],
  ['heap', generateHeapSortTrace],
  ['counting', generateCountingSortTrace],
  ['radix', generateRadixSortTrace],
  ['bucket', generateBucketSortTrace]
];

const sharedCases = [
  [7, 3, 9, 2, 6],
  [7, 3, 9, 2, 6, 2],
  [1, 2, 3, 4, 5],
  [5, 4, 3, 2, 1],
  [4, 4, 4, 4],
  [10, 0, 5, 10, 1],
  [-3, 5, 0, -3, 2],
  [2.5, 1.5, 3.5, 1.5]
];

const exactTraceCases = [
  {
    name: 'bubble',
    fn: generateBubbleSortTrace,
    input: [7, 3, 9, 2, 6],
    order: 'ascending',
    expected: [
      [3, 7, 2, 6, 9],
      [3, 2, 6, 7, 9],
      [2, 3, 6, 7, 9],
      [2, 3, 6, 7, 9]
    ]
  },
  {
    name: 'selection',
    fn: generateSelectionSortTrace,
    input: [7, 3, 9, 2, 6],
    order: 'ascending',
    expected: [
      [2, 3, 9, 7, 6],
      [2, 3, 9, 7, 6],
      [2, 3, 6, 7, 9],
      [2, 3, 6, 7, 9]
    ]
  },
  {
    name: 'insertion',
    fn: generateInsertionSortTrace,
    input: [7, 3, 9, 2, 6],
    order: 'ascending',
    expected: [
      [3, 7, 9, 2, 6],
      [3, 7, 9, 2, 6],
      [2, 3, 7, 9, 6],
      [2, 3, 6, 7, 9]
    ]
  }
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function sortedCopy(values, order) {
  return [...values].sort((left, right) => (order === 'ascending' ? left - right : right - left));
}

function arraysEqual(left, right) {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function getStepArray(step) {
  return Array.isArray(step) ? step : step.array;
}

function assertStepObject(step, name, mode) {
  assert(step && !Array.isArray(step), `${name} ${mode} should return step objects`);
  assert(Array.isArray(step.array), `${name} ${mode} step should include array`);
  assert(step.traceMode === mode, `${name} ${mode} step should include selected trace mode`);
  assert(typeof step.algorithm === 'string', `${name} ${mode} step should include algorithm`);
  assert('comparedIndices' in step, `${name} ${mode} step should include comparedIndices`);
  assert('swappedIndices' in step, `${name} ${mode} step should include swappedIndices`);
  assert('note' in step, `${name} ${mode} step should include note`);
}

function supportsCase(name, values) {
  if (name === 'radix') {
    return values.every((value) => Number.isInteger(value) && value >= 0);
  }

  if (name === 'counting') {
    return values.every(Number.isInteger);
  }

  return true;
}

function testTraceInvariants() {
  for (const [name, fn] of algorithms) {
    for (const input of sharedCases) {
      if (!supportsCase(name, input)) {
        continue;
      }

      for (const order of ['ascending', 'descending']) {
        const trace = fn(input, order);
        assert(trace.length > 0, `${name} ${order} produced no steps for ${input}`);

        trace.forEach((step, stepIndex) => {
          const stepArray = getStepArray(step);
          assert(
            stepArray.length === input.length,
            `${name} ${order} step ${stepIndex + 1} has wrong length`
          );
          assert(
            stepArray.every(Number.isFinite),
            `${name} ${order} step ${stepIndex + 1} contains a non-number`
          );
          assert(
            sameMultiset(stepArray, input),
            `${name} ${order} step ${stepIndex + 1} changes the original values`
          );
        });

        const finalStep = getStepArray(trace.at(-1));
        const expected = sortedCopy(input, order);
        assert(
          arraysEqual(finalStep, expected),
          `${name} ${order} final step ${finalStep} does not match ${expected}`
        );
      }
    }
  }
}

function testTraceStepObjects() {
  for (const [name, fn] of algorithms) {
    for (const mode of ['pass', 'detailed']) {
      const input = name === 'radix' ? [17, 3, 42, 8, 25] : [7, 3, 9, 2, 6];
      const trace =
        name === 'bubble'
          ? fn(input, 'ascending', mode, false)
          : fn(input, 'ascending', mode);

      assert(trace.length > 0, `${name} ${mode} produced no trace steps`);
      trace.forEach((step) => assertStepObject(step, name, mode));
      assert(
        arraysEqual(getStepArray(trace.at(-1)), sortedCopy(input, 'ascending')),
        `${name} ${mode} final step should be sorted`
      );
    }
  }
}

function testKnownMvpExamples() {
  for (const testCase of exactTraceCases) {
    const trace = testCase.fn(testCase.input, testCase.order).map(getStepArray);
    assert(
      arraysEqual(trace.flat(), testCase.expected.flat()),
      `${testCase.name} trace does not match the requested MVP example`
    );
  }
}

function testI2206QuickSortTraceDetails() {
  const trace = generateQuickSortTrace([7, 3, 9, 2, 6], 'ascending');
  const actions = trace.map((step) => step.action);

  assert(trace[0].pivotOriginalIndex === 0, 'quick sort should choose the leftmost pivot');
  assert(trace[0].pivotValue === 7, 'quick sort first pivot should be A[low]');
  assert(actions.includes('choose-pivot'), 'quick sort trace should include pivot choice');
  assert(actions.includes('move-left'), 'quick sort trace should include left pointer movement');
  assert(actions.includes('move-right'), 'quick sort trace should include right pointer movement');
  assert(actions.includes('swap-left-right'), 'quick sort trace should include internal swaps');
  assert(actions.includes('place-pivot'), 'quick sort trace should include final pivot placement');
  assert(actions.includes('partition-complete'), 'quick sort trace should mark partition completion');
  assert(
    arraysEqual(getStepArray(trace.at(-1)), [2, 3, 6, 7, 9]),
    'quick sort final step should be sorted ascending'
  );

  const descendingTrace = generateQuickSortTrace([7, 3, 9, 2, 6], 'descending');
  assert(
    arraysEqual(getStepArray(descendingTrace.at(-1)), [9, 7, 6, 3, 2]),
    'quick sort final step should be sorted descending'
  );
}

function testDetailedModeActions() {
  const bubble = generateBubbleSortTrace([2, 1], 'ascending', 'detailed');
  assert(bubble.some((step) => step.action === 'compare'), 'bubble detailed should compare');
  assert(bubble.some((step) => step.action === 'swap'), 'bubble detailed should swap');

  const insertion = generateInsertionSortTrace([3, 2, 1], 'ascending', 'detailed');
  assert(insertion.some((step) => step.action === 'shift'), 'insertion detailed should shift');
  assert(insertion.some((step) => step.action === 'insert'), 'insertion detailed should insert');

  const merge = generateMergeSortTrace([2, 1], 'ascending', 'detailed');
  assert(merge.some((step) => step.action === 'compare'), 'merge detailed should compare');
  assert(merge.some((step) => step.action === 'place'), 'merge detailed should place values');

  const heap = generateHeapSortTrace([3, 1, 2], 'ascending', 'detailed');
  assert(heap.some((step) => step.action === 'extract-swap'), 'heap detailed should extract');

  const radix = generateRadixSortTrace([17, 3, 42], 'ascending', 'detailed');
  assert(radix.some((step) => step.action === 'bucket-insert'), 'radix detailed should fill buckets');
  assert(radix.some((step) => step.action === 'bucket-read'), 'radix detailed should read buckets');
}

function testPassModeSkipsInternalActions() {
  const bubble = generateBubbleSortTrace([2, 1], 'ascending', 'pass');
  assert(!bubble.some((step) => step.action === 'compare'), 'bubble pass should skip comparisons');

  const quick = generateQuickSortTrace([7, 3, 9, 2, 6], 'ascending', 'pass');
  assert(
    quick.every((step) => step.action === 'partition-complete'),
    'quick pass should only record completed partitions'
  );
}

function testGradingExample() {
  const correct = generateBubbleSortTrace([7, 3, 9, 2, 6], 'ascending');
  const user = [
    [3, 7, 2, 6, 9],
    [3, 2, 7, 6, 9],
    [2, 3, 6, 7, 9],
    [2, 3, 6, 7, 9]
  ];
  const result = compareUserSteps(user, correct);

  assert(result.correctSteps === 3, 'grading example should have 3 correct steps');
  assert(result.correctCells === 18, 'grading example should have 18 correct cells');
  assert(result.percentage === 90, 'grading example should be 90 percent');
}

testTraceInvariants();
testTraceStepObjects();
testKnownMvpExamples();
testI2206QuickSortTraceDetails();
testDetailedModeActions();
testPassModeSkipsInternalActions();
testGradingExample();

console.log('All sorting trace tests passed.');
