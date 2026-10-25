import Toggle from "./Toggle";
import { EditIcon, TrashIcon, FlagIcon } from "./Icons";
import { ENVIRONMENTS, ENV_META } from "../constants";
import { timeAgo } from "../utils/time";

function EnvCell({ flag, env, onToggle }) {
  const s = flag.environments[env];
  return (
    <div className={`env-cell ${s.enabled ? "" : "env-cell--off"}`} data-env={env}>
      <span className="env-cell__label"><i className="dot" />{ENV_META[env].short}</span>
      <div className="env-cell__top">
        <Toggle checked={s.enabled} onChange={() => onToggle(flag, env)} label={`${flag.name} in ${ENV_META[env].label}`} />
        <span className="env-cell__state">{s.enabled ? `${s.rollout}%` : "Off"}</span>
      </div>
      <div className="bar" role="img" aria-label={`${s.enabled ? s.rollout : 0}% rollout`}>
        <i style={{ width: `${s.rollout}%` }} />
      </div>
    </div>
  );
}

export default function FlagList({ flags, onToggle, onEdit, onDelete, hasFilters, onClearFilters }) {
  if (flags.length === 0) {
    return (
      <div className="empty card">
        <span className="empty__icon"><FlagIcon width={22} height={22} /></span>
        <p className="empty__title">{hasFilters ? "No flags match these filters" : "No flags yet"}</p>
        <p className="muted">{hasFilters ? "Try a different search or status." : "Create your first flag to start a rollout."}</p>
        {hasFilters && <button className="btn btn--ghost" onClick={onClearFilters}>Clear filters</button>}
      </div>
    );
  }

  return (
    <div className="flag-list card">
      <div className="flag-head" aria-hidden="true">
        <span>Flag</span>
        {ENVIRONMENTS.map((env) => (
          <span key={env} className="head-env" data-env={env}><i className="dot" />{ENV_META[env].label}</span>
        ))}
        <span />
      </div>
      <ul>
        {flags.map((flag) => (
          <li className="flag-row" key={flag.id}>
            <div className="flag-info">
              <button className="flag-name" onClick={() => onEdit(flag)}>{flag.name}</button>
              <div className="flag-meta">
                <code className="flag-key">{flag.key}</code>
                <span className={`chip chip--${flag.type}`}>{flag.type}</span>
                <span className="muted small">{timeAgo(flag.updatedAt)}</span>
              </div>
              <p className="flag-desc">{flag.description}</p>
            </div>

            <div className="env-cells">
              {ENVIRONMENTS.map((env) => (
                <EnvCell key={env} flag={flag} env={env} onToggle={onToggle} />
              ))}
            </div>

            <div className="row-actions">
              <button className="icon-btn" onClick={() => onEdit(flag)} aria-label={`Edit ${flag.name}`} title="Edit"><EditIcon /></button>
              <button className="icon-btn icon-btn--danger" onClick={() => onDelete(flag)} aria-label={`Delete ${flag.name}`} title="Delete"><TrashIcon /></button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
