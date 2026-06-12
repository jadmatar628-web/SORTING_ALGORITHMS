import AlgorithmSelector from './AlgorithmSelector.jsx';

export default function SetupForm({
  setup,
  customArrayText,
  onSetupChange,
  onCustomArrayTextChange,
  onGenerate
}) {
  return (
    <form className="setup-form" onSubmit={onGenerate}>
      <div className="form-grid">
        <label className="field">
          <span>Array size</span>
          <input
            min="2"
            max="12"
            type="number"
            value={setup.size}
            onChange={(event) => onSetupChange({ ...setup, size: Number(event.target.value) })}
          />
        </label>

        <label className="field">
          <span>Input type</span>
          <select
            value={setup.inputType}
            onChange={(event) => onSetupChange({ ...setup, inputType: event.target.value })}
          >
            <option value="auto">Auto-generate array</option>
            <option value="custom">Custom user-entered array</option>
          </select>
        </label>

        <AlgorithmSelector
          value={setup.algorithm}
          onChange={(algorithm) => onSetupChange({ ...setup, algorithm })}
        />

        <label className="field">
          <span>Sorting order</span>
          <select
            value={setup.order}
            onChange={(event) => onSetupChange({ ...setup, order: event.target.value })}
          >
            <option value="ascending">Ascending</option>
            <option value="descending">Descending</option>
          </select>
        </label>
      </div>

      {setup.algorithm === 'bubble' && (
        <label className="check-field">
          <input
            type="checkbox"
            checked={setup.optimizedBubble}
            onChange={(event) =>
              onSetupChange({ ...setup, optimizedBubble: event.target.checked })
            }
          />
          <span>Optimized bubble mode: stop when a pass makes no swaps</span>
        </label>
      )}

      {setup.inputType === 'custom' && (
        <label className="field wide-field">
          <span>Custom array values</span>
          <input
            placeholder="Example: 7 3 9 2 6"
            value={customArrayText}
            onChange={(event) => onCustomArrayTextChange(event.target.value)}
          />
        </label>
      )}

      <button className="primary-button" type="submit">
        Generate exercise
      </button>
    </form>
  );
}
