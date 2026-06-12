import { useEffect, useMemo, useState } from 'react';
import SetupForm from './components/SetupForm.jsx';
import StepForm from './components/StepForm.jsx';
import ResultTable from './components/ResultTable.jsx';
import { generateBubbleSortTrace } from './sorting/bubbleSortTrace.js';
import { generateSelectionSortTrace } from './sorting/selectionSortTrace.js';
import { generateInsertionSortTrace } from './sorting/insertionSortTrace.js';
import { generateMergeSortTrace } from './sorting/mergeSortTrace.js';
import { generateQuickSortTrace } from './sorting/quickSortTrace.js';
import { generateHeapSortTrace } from './sorting/heapSortTrace.js';
import { generateCountingSortTrace } from './sorting/countingSortTrace.js';
import { generateRadixSortTrace } from './sorting/radixSortTrace.js';
import { generateBucketSortTrace } from './sorting/bucketSortTrace.js';
import { compareUserSteps } from './sorting/compareAnswers.js';
import { generateRandomArray } from './utils/generateRandomArray.js';
import { parseNumberList, validateStepArray } from './utils/validateArray.js';

const STORAGE_KEY = 'sorting-step-practice-progress';

const defaultSetup = {
  size: 5,
  inputType: 'auto',
  algorithm: 'bubble',
  order: 'ascending',
  optimizedBubble: false
};

const algorithmLabels = {
  bubble: 'Bubble Sort',
  selection: 'Selection Sort',
  insertion: 'Insertion Sort',
  merge: 'Merge Sort',
  quick: 'Quick Sort',
  heap: 'Heap Sort',
  counting: 'Counting Sort',
  radix: 'Radix Sort',
  bucket: 'Bucket Sort'
};

function getTrace(array, setup) {
  if (setup.algorithm === 'bubble') {
    return generateBubbleSortTrace(array, setup.order, setup.optimizedBubble);
  }

  if (setup.algorithm === 'selection') {
    return generateSelectionSortTrace(array, setup.order);
  }

  if (setup.algorithm === 'insertion') {
    return generateInsertionSortTrace(array, setup.order);
  }

  if (setup.algorithm === 'merge') {
    return generateMergeSortTrace(array, setup.order);
  }

  if (setup.algorithm === 'quick') {
    return generateQuickSortTrace(array, setup.order);
  }

  if (setup.algorithm === 'heap') {
    return generateHeapSortTrace(array, setup.order);
  }

  if (setup.algorithm === 'counting') {
    return generateCountingSortTrace(array, setup.order);
  }

  if (setup.algorithm === 'radix') {
    return generateRadixSortTrace(array, setup.order);
  }

  return generateBucketSortTrace(array, setup.order);
}

function blankSteps(stepCount, size) {
  return Array.from({ length: stepCount }, () => Array.from({ length: size }, () => ''));
}

function readSavedProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved && typeof saved === 'object' ? saved : null;
  } catch {
    return null;
  }
}

export default function App() {
  const saved = useMemo(readSavedProgress, []);
  const [setup, setSetup] = useState(saved?.setup ?? defaultSetup);
  const [customArrayText, setCustomArrayText] = useState(saved?.customArrayText ?? '');
  const [initialArray, setInitialArray] = useState(saved?.initialArray ?? []);
  const [correctSteps, setCorrectSteps] = useState(saved?.correctSteps ?? []);
  const [userSteps, setUserSteps] = useState(saved?.userSteps ?? []);
  const [stepErrors, setStepErrors] = useState({});
  const [setupError, setSetupError] = useState('');
  const [results, setResults] = useState(null);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ setup, customArrayText, initialArray, correctSteps, userSteps })
    );
  }, [setup, customArrayText, initialArray, correctSteps, userSteps]);

  function handleGenerate(event) {
    event.preventDefault();
    setSetupError('');
    setStepErrors({});
    setResults(null);

    const size = Math.max(2, Math.min(12, Number(setup.size) || 5));
    const nextSetup = { ...setup, size };
    let array;

    if (setup.inputType === 'custom') {
      array = parseNumberList(customArrayText);

      if (array.length !== size) {
        setSetupError(`Custom array must contain exactly ${size} numbers.`);
        return;
      }

      if (array.some((value) => !Number.isFinite(value))) {
        setSetupError('Custom array can only contain numbers.');
        return;
      }

      if (['counting', 'radix'].includes(setup.algorithm) && array.some((value) => !Number.isInteger(value))) {
        setSetupError(`${algorithmLabels[setup.algorithm]} needs whole numbers.`);
        return;
      }

      if (setup.algorithm === 'radix' && array.some((value) => value < 0)) {
        setSetupError('Radix Sort needs non-negative whole numbers.');
        return;
      }
    } else {
      array = generateRandomArray(size);
    }

    const trace = getTrace(array, nextSetup);
    setSetup(nextSetup);
    setInitialArray(array);
    setCorrectSteps(trace);
    setUserSteps(blankSteps(trace.length, array.length));
  }

  function handleStepChange(stepIndex, nextStep) {
    const nextSteps = userSteps.map((step, index) => (index === stepIndex ? nextStep : step));
    setUserSteps(nextSteps);
    setResults(null);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const errors = {};
    const parsedSteps = userSteps.map((step, index) => {
      const parsed = step.map((value) => {
        const trimmed = String(value).trim();
        return trimmed === '' ? Number.NaN : Number(trimmed);
      });
      const error = validateStepArray(parsed, initialArray.length, initialArray);

      if (error) {
        errors[index] = error;
      }

      return parsed;
    });

    setStepErrors(errors);

    if (Object.keys(errors).length > 0) {
      setResults(null);
      return;
    }

    setResults(compareUserSteps(parsedSteps, correctSteps));
  }

  const algorithmName = algorithmLabels[setup.algorithm] ?? 'Insertion Sort';

  return (
    <main className="app-shell">
      <section className="intro">
        <div>
          <p className="eyebrow">Manual sorting practice</p>
          <h1>Sorting Step Practice</h1>
          <p>
            Generate a trace, fill each intermediate array yourself, and submit for instant
            grading.
          </p>
        </div>
      </section>

      <SetupForm
        setup={setup}
        customArrayText={customArrayText}
        onSetupChange={setSetup}
        onCustomArrayTextChange={setCustomArrayText}
        onGenerate={handleGenerate}
      />
      {setupError && <div className="error-banner">{setupError}</div>}

      {initialArray.length > 0 && (
        <section className="exercise-panel">
          <div className="section-heading">
            <h2>{algorithmName}</h2>
            <p>
              Order: {setup.order}. Initial array:
              <span className="initial-array"> {initialArray.join(' ')}</span>
            </p>
          </div>

          <StepForm
            userSteps={userSteps}
            errors={stepErrors}
            onStepChange={handleStepChange}
            onSubmit={handleSubmit}
          />
        </section>
      )}

      <ResultTable results={results} onTryAgain={() => setResults(null)} />
    </main>
  );
}
