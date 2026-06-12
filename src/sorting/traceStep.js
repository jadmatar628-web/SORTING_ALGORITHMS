export function createTraceStep({
  array,
  algorithm,
  traceMode,
  passNumber = null,
  action,
  comparedIndices = null,
  swappedIndices = null,
  shiftedIndex = null,
  insertedIndex = null,
  pivotValue = null,
  pivotIndex = null,
  pivotOriginalIndex = null,
  left = null,
  right = null,
  low = null,
  high = null,
  note = ''
}) {
  return {
    array: [...array],
    algorithm,
    traceMode,
    passNumber,
    action,
    comparedIndices,
    swappedIndices,
    shiftedIndex,
    insertedIndex,
    pivotValue,
    pivotIndex,
    pivotOriginalIndex,
    left,
    right,
    low,
    high,
    note
  };
}
