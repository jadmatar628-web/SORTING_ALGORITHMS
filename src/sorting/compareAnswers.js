export function compareUserSteps(userSteps, correctSteps) {
  const steps = correctSteps.map((correct, stepIndex) => {
    const user = userSteps[stepIndex] ?? [];
    const cellResults = correct.map((value, cellIndex) => user[cellIndex] === value);
    const isCorrect = cellResults.every(Boolean);

    return {
      stepIndex,
      isCorrect,
      user,
      correct,
      cellResults
    };
  });

  const totalSteps = correctSteps.length;
  const correctStepsCount = steps.filter((step) => step.isCorrect).length;
  const totalCells = correctSteps.reduce((sum, step) => sum + step.length, 0);
  const correctCells = steps.reduce(
    (sum, step) => sum + step.cellResults.filter(Boolean).length,
    0
  );
  const percentage = totalCells === 0 ? 100 : Math.round((correctCells / totalCells) * 100);

  return {
    totalSteps,
    correctSteps: correctStepsCount,
    totalCells,
    correctCells,
    percentage,
    steps
  };
}
