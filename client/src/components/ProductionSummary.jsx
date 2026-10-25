import { flagState } from "../utils/status";

const SEGMENTS = [
  ["live", "Live for everyone"],
  ["rolling", "Gradual rollout"],
  ["off", "Off"],
];

export default function ProductionSummary({ flags }) {
  const counts = { live: 0, rolling: 0, off: 0 };
  flags.forEach((f) => counts[flagState(f.environments.production)]++);

  return (
    <section className="summary card" aria-label="Production summary">
      <div className="summary__head">
        <h2>Production at a glance</h2>
        <span className="muted">{flags.length} flags</span>
      </div>
      <div className="stack" role="img" aria-label={SEGMENTS.map(([k, l]) => `${counts[k]} ${l}`).join(", ")}>
        {SEGMENTS.map(([k]) => counts[k] > 0 && <span key={k} className={`stack__seg stack__seg--${k}`} style={{ flexGrow: counts[k] }} />)}
      </div>
      <ul className="legend">
        {SEGMENTS.map(([k, label]) => (
          <li key={k}>
            <i className={`dot dot--${k}`} />
            <strong>{counts[k]}</strong> {label}
          </li>
        ))}
      </ul>
    </section>
  );
}
