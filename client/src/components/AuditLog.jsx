import { useState } from "react";
import { SearchIcon } from "./Icons";
import { ENV_META } from "../constants";
import { avatarColor, initials } from "../utils/avatar";
import { timeAgo } from "../utils/time";
import { useAuditLogs } from "../hooks/useFlags";
import { ErrorState, ListSkeleton } from "./States";

const ACTIONS = {
  CREATED: { label: "Created", tone: "good" },
  ENABLED: { label: "Enabled", tone: "good" },
  RESTORED: { label: "Restored", tone: "good" },
  ROLLOUT: { label: "Rollout", tone: "info" },
  UPDATED: { label: "Updated", tone: "info" },
  DISABLED: { label: "Disabled", tone: "bad" },
  DELETED: { label: "Deleted", tone: "bad" },
};

const formatDate = (iso) =>
  new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

export default function AuditLog() {
  const { data: audit = [], isPending, isError, error, refetch } = useAuditLogs();
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const rows = audit.filter(
    (a) => !q || a.flagKey.includes(q) || a.user.name.toLowerCase().includes(q) || ACTIONS[a.action].label.toLowerCase().includes(q)
  );

  return (
    <>
      <header className="page-head">
        <div>
          <h1>Audit log</h1>
          <p className="muted">Every change to a flag, with who made it and when.</p>
        </div>
      </header>

      <div className="toolbar">
        <label className="search">
          <SearchIcon />
          <input type="search" placeholder="Filter by flag, person or action" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Filter audit log" />
        </label>
      </div>

      {isPending ? (
        <ListSkeleton />
      ) : isError ? (
        <ErrorState message={error.message} onRetry={refetch} />
      ) : rows.length === 0 ? (
        <div className="empty card">
          <p className="empty__title">No matching changes</p>
          <p className="muted">Try a different search.</p>
        </div>
      ) : (
        <div className="audit card">
          <div className="audit-head" aria-hidden="true">
            <span>User</span><span>Flag</span><span>Action</span><span>Environment</span><span>Change</span><span>Time</span>
          </div>
          <ul>
            {rows.map((a) => {
              const meta = ACTIONS[a.action];
              return (
                <li className="audit-row" key={a.id}>
                  <div className="a-user">
                    <span className="avatar" style={{ background: avatarColor(a.user.name) }}>{initials(a.user.name)}</span>
                    <div className="a-user__meta"><strong>{a.user.name}</strong><span>{a.user.role}</span></div>
                  </div>
                  <div className="a-flag"><code className="flag-key flag-key--pill">{a.flagKey}</code></div>
                  <div className="a-action"><span className={`pill pill--${meta.tone}`}>{meta.label}</span></div>
                  <div className="a-env">
                    {a.env ? <span className="env-tag" data-env={a.env}><i className="dot" />{ENV_META[a.env].label}</span> : <span className="muted">All</span>}
                  </div>
                  <div className="a-change">{a.change}</div>
                  <div className="a-time"><span>{formatDate(a.at)}</span><span className="muted small">{timeAgo(a.at)}</span></div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
}
