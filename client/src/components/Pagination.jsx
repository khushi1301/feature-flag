export default function Pagination({ page, totalPages, total, onPage }) {
  return (
    <div className="pagination">
      <span className="muted">{total} {total === 1 ? "flag" : "flags"}</span>
      <div className="pagination__controls">
        <button className="btn btn--ghost" disabled={page <= 1} onClick={() => onPage(page - 1)}>Previous</button>
        <span className="muted">Page {page} of {totalPages}</span>
        <button className="btn btn--ghost" disabled={page >= totalPages} onClick={() => onPage(page + 1)}>Next</button>
      </div>
    </div>
  );
}
