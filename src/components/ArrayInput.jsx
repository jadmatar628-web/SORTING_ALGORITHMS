import { parseNumberList } from '../utils/validateArray.js';

export default function ArrayInput({
  label,
  values,
  onChange,
  comparison,
  correctValues,
  disabled = false
}) {
  function updateCell(index, nextValue) {
    const next = [...values];
    next[index] = nextValue;
    onChange(next);
  }

  function handlePaste(event, startIndex) {
    const text = event.clipboardData.getData('text');
    const parsed = parseNumberList(text);

    if (parsed.length <= 1) {
      return;
    }

    event.preventDefault();
    const next = [...values];
    parsed.forEach((number, offset) => {
      const targetIndex = startIndex + offset;
      if (targetIndex < next.length) {
        next[targetIndex] = String(number);
      }
    });
    onChange(next);
  }

  return (
    <div className="array-input">
      {label && <div className="array-label">{label}</div>}
      <div className="array-row">
        {values.map((value, index) => {
          const result = comparison?.[index];
          const cellClass =
            result === undefined ? '' : result ? 'cell-correct' : 'cell-incorrect';

          return (
            <div className="cell-wrap" key={index}>
              <input
                className={`array-cell ${cellClass}`}
                disabled={disabled}
                inputMode="numeric"
                value={value}
                aria-label={`${label || 'Array'} value ${index + 1}`}
                onChange={(event) => updateCell(index, event.target.value)}
                onPaste={(event) => handlePaste(event, index)}
              />
              {result === false && (
                <span className="cell-hint">should be {correctValues[index]}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
