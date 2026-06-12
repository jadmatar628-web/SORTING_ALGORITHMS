import { createTraceStep } from './traceStep.js';

function isPreferred(parent, child, order) {
  return order === 'ascending' ? parent >= child : parent <= child;
}

export function generateHeapSortTrace(array, order = 'ascending', traceMode = 'pass') {
  const values = [...array];
  const steps = [];
  const mode = traceMode === 'detailed' ? 'detailed' : 'pass';

  function addStep(details) {
    steps.push(
      createTraceStep({
        array: values,
        algorithm: 'heap-sort',
        traceMode: mode,
        ...details,
        note:
          order === 'descending'
            ? `${details.note} Descending heap sort is an app-only extension.`
            : details.note
      })
    );
  }

  function heapify(size, root) {
    let selected = root;
    const left = root * 2 + 1;
    const right = root * 2 + 2;

    if (left < size && mode === 'detailed') {
      addStep({
        action: 'compare-left-child',
        comparedIndices: [selected, left],
        low: 0,
        high: size - 1,
        note: `Compare node ${selected} with left child ${left}.`
      });
    }

    if (left < size && !isPreferred(values[selected], values[left], order)) {
      selected = left;
    }

    if (right < size && mode === 'detailed') {
      addStep({
        action: 'compare-right-child',
        comparedIndices: [selected, right],
        low: 0,
        high: size - 1,
        note: `Compare selected node ${selected} with right child ${right}.`
      });
    }

    if (right < size && !isPreferred(values[selected], values[right], order)) {
      selected = right;
    }

    if (selected !== root) {
      [values[root], values[selected]] = [values[selected], values[root]];
      if (mode === 'detailed') {
        addStep({
          action: 'heapify-swap',
          swappedIndices: [root, selected],
          low: 0,
          high: size - 1,
          note: `Swap node ${root} with child ${selected} during percolate down.`
        });
      }
      heapify(size, selected);
    }
  }

  for (let index = Math.floor((values.length - 1) / 2); index >= 0; index -= 1) {
    heapify(values.length, index);
  }

  addStep({
    action: 'heap-built',
    note: 'Heap construction complete.'
  });

  for (let end = values.length - 1; end > 0; end -= 1) {
    [values[0], values[end]] = [values[end], values[0]];
    if (mode === 'detailed') {
      addStep({
        action: 'extract-swap',
        swappedIndices: [0, end],
        high: end,
        note: `Swap root with index ${end} to extract the heap root.`
      });
    }
    heapify(end, 0);
    addStep({
      passNumber: values.length - end,
      action: 'extraction-complete',
      high: end - 1,
      note: `After extraction ${values.length - end}, one more largest element is fixed.`
    });
  }

  return steps;
}
