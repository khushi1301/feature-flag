export function ListSkeleton({ rows = 5 }) {
  return (
    <div className="card skeleton" aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }, (_, i) => (
        <div className="skeleton__row" key={i}>
          <span className="skeleton__bar skeleton__bar--wide" />
          <span className="skeleton__bar" />
          <span className="skeleton__bar" />
          <span className="skeleton__bar" />
        </div>
      ))}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="empty card" role="alert">
      <p className="empty__title">Couldn't load data</p>
      <p className="muted">{message}</p>
      <button className="btn btn--ghost" onClick={onRetry}>Try again</button>
    </div>
  );
}
