const confetti = Array.from({ length: 42 }, (_, index) => index);

export default function PerfectScoreCelebration({ onClose }) {
  return (
    <div className="celebration-overlay" role="dialog" aria-modal="true" aria-label="Perfect score">
      <div className="confetti-field" aria-hidden="true">
        {confetti.map((piece) => (
          <span
            className="confetti-piece"
            key={piece}
            style={{
              '--x': `${(piece * 37) % 100}%`,
              '--delay': `${(piece % 12) * 0.12}s`,
              '--duration': `${2.4 + (piece % 7) * 0.18}s`,
              '--spin': `${piece % 2 === 0 ? 1 : -1}`
            }}
          />
        ))}
      </div>

      <div className="celebration-card">
        <div className="pinata-string" aria-hidden="true" />
        <div className="pinata" aria-hidden="true">
          <div className="pinata-ear left" />
          <div className="pinata-ear right" />
          <div className="pinata-body">
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="pinata-tail" />
          <div className="pinata-leg one" />
          <div className="pinata-leg two" />
          <div className="pinata-leg three" />
          <div className="pinata-leg four" />
        </div>

        <p className="celebration-kicker">Perfect score</p>
        <h2>100% correct</h2>
        <p>You nailed every sorting step.</p>
        <button className="celebration-button" type="button" onClick={onClose}>
          Back to results
        </button>
      </div>
    </div>
  );
}
