import ArrayInput from './ArrayInput.jsx';

export default function StepForm({ userSteps, errors, onStepChange, onSubmit }) {
  return (
    <form className="steps-panel" onSubmit={onSubmit}>
      <div className="section-heading">
        <h2>Fill the intermediate arrays</h2>
        <p>{userSteps.length} step{userSteps.length === 1 ? '' : 's'} required.</p>
      </div>

      <div className="step-list">
        {userSteps.map((step, index) => (
          <div className="step-item" key={index}>
            <ArrayInput
              label={`Step ${index + 1}`}
              values={step}
              onChange={(nextStep) => onStepChange(index, nextStep)}
            />
            {errors[index] && <div className="error-text">{errors[index]}</div>}
          </div>
        ))}
      </div>

      <button className="primary-button" type="submit">
        Submit answers
      </button>
    </form>
  );
}
