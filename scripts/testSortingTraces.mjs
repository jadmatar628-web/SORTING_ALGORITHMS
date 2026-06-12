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
          assert(
            step.length === input.length,
            `${name} ${order} step ${stepIndex + 1} has wrong length`
          );
          assert(
            step.every(Number.isFinite),
            `${name} ${order} step ${stepIndex + 1} contains a non-number`
          );
          assert(
            sameMultiset(step, input),
            `${name} ${order} step ${stepIndex + 1} changes the original values`
          );
        });

        const finalStep = trace.at(-1);
        const expected = sortedCopy(input, order);
        assert(
          arraysEqual(finalStep, expected),
          `${name} ${order} final step ${finalStep} does not match ${expected}`
        );
      }
    }
  }
}

function testKnownMvpExamples() {
  for (const testCase of exactTraceCases) {
    const trace = testCase.fn(testCase.input, testCase.order);
    assert(
      arraysEqual(trace.flat(), testCase.expected.flat()),
      `${testCase.name} trace does not match the requested MVP example`
    );
  }
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
testKnownMvpExamples();
testGradingExample();

console.log('All sorting trace tests passed.');
