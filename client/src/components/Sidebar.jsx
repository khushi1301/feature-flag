import { FlagIcon, ListIcon, UsersIcon, SunIcon, MoonIcon } from "./Icons";
import { avatarColor, initials } from "../utils/avatar";
import { CURRENT_USER } from "../constants";

export default function Sidebar({ view, onView, theme, onToggleTheme }) {
  const item = (id, label, Icon) => (
    <button
      className={`nav__item ${view === id ? "is-active" : ""}`}
      onClick={() => onView(id)}
      aria-current={view === id ? "page" : undefined}
      title={label}
    >
      <Icon />
      <span>{label}</span>
    </button>
  );
  const dark = theme === "dark";

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand__mark"><FlagIcon /></span>
        <span className="brand__name">FeatureFlag</span>
      </div>

      <nav className="nav" aria-label="Main">
        {item("flags", "Flags", FlagIcon)}
        {item("audit", "Audit log", ListIcon)}
        <span className="nav__item nav__item--soon" aria-disabled="true" title="Coming in Phase 5">
          <UsersIcon />
          <span>Team</span>
        </span>
      </nav>

      <div className="sidebar__foot">
        <button className="nav__item" onClick={onToggleTheme} title={dark ? "Light mode" : "Dark mode"}>
          {dark ? <SunIcon /> : <MoonIcon />}
          <span>{dark ? "Light mode" : "Dark mode"}</span>
        </button>
        <div className="user">
          <span className="avatar" style={{ background: avatarColor(CURRENT_USER.name) }}>{initials(CURRENT_USER.name)}</span>
          <div className="user__meta">
            <strong>{CURRENT_USER.name}</strong>
            <span>{CURRENT_USER.role}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
