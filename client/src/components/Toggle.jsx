export default function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`toggle ${checked ? "toggle--on" : ""}`}
      onClick={onChange}
    >
      <span className="toggle__thumb" />
    </button>
  );
}
