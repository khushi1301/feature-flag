import { useEffect, useMemo, useState } from "react";
import Toggle from "./Toggle";
import { CloseIcon } from "./Icons";
import { ENVIRONMENTS, ENV_META, FLAG_TYPES, ROLLOUT_PRESETS } from "../constants";
import { KEY_PATTERN, slugify } from "../utils/flagKey";

const emptyFlag = () => ({
  name: "",
  key: "",
  description: "",
  type: "release",
  environments: Object.fromEntries(ENVIRONMENTS.map((e) => [e, { enabled: false, rollout: 0 }])),
});

export default function FlagFormModal({ flag, existingKeys, onSave, onClose }) {
  const isEdit = Boolean(flag);
  const initial = useMemo(() => (flag ? structuredClone(flag) : emptyFlag()), [flag]);
  const [form, setForm] = useState(initial);
  const [keyTouched, setKeyTouched] = useState(isEdit);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState("");

  const dirty = JSON.stringify(form) !== JSON.stringify(initial);

  const errors = {};
  if (!form.name.trim()) errors.name = "Enter a name.";
  if (!form.key) errors.key = "Enter a key.";
  else if (!KEY_PATTERN.test(form.key)) errors.key = "Use lowercase letters, numbers and single hyphens.";
  else if (existingKeys.includes(form.key)) errors.key = "This key is already used by another flag.";
  const valid = Object.keys(errors).length === 0;

  function requestClose() {
    if (dirty && !window.confirm("Discard your unsaved changes?")) return;
    onClose();
  }

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && requestClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const setField = (field, value) => setForm((f) => ({ ...f, [field]: value }));
  const onNameChange = (value) => setForm((f) => ({ ...f, name: value, key: keyTouched ? f.key : slugify(value) }));
  const setEnv = (env, patch) =>
    setForm((f) => ({ ...f, environments: { ...f.environments, [env]: { ...f.environments[env], ...patch } } }));

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    if (!valid || saving) return;
    setSaving(true);
    setServerError("");
    try {
      await onSave({ ...form, name: form.name.trim(), description: form.description.trim() });
      onClose();
    } catch (err) {
      setServerError(err.message);
      setSaving(false);
    }
  }

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && requestClose()}>
      <form className="modal" onSubmit={handleSubmit} noValidate role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <header className="modal__head">
          <h2 id="modal-title">{isEdit ? "Edit flag" : "Create flag"}</h2>
          <button type="button" className="icon-btn" onClick={requestClose} aria-label="Close"><CloseIcon /></button>
        </header>

        <div className="modal__body">
          <label className="field">
            <span>Name</span>
            <input className="input" value={form.name} onChange={(e) => onNameChange(e.target.value)} autoFocus />
            {submitted && errors.name && <small className="error">{errors.name}</small>}
          </label>

          <label className="field">
            <span>Key</span>
            <input
              className="input input--mono"
              value={form.key}
              disabled={isEdit}
              onChange={(e) => { setKeyTouched(true); setField("key", e.target.value); }}
            />
            {isEdit && <small className="muted">The key is used in code, so it can't change after creation.</small>}
            {submitted && errors.key && <small className="error">{errors.key}</small>}
          </label>

          <label className="field">
            <span>Description</span>
            <textarea className="input" rows={2} value={form.description} onChange={(e) => setField("description", e.target.value)} />
          </label>

          <label className="field">
            <span>Type</span>
            <select className="input" value={form.type} onChange={(e) => setField("type", e.target.value)}>
              {FLAG_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>

          <div className="envs">
            <h3>Rollout per environment</h3>
            {ENVIRONMENTS.map((env) => {
              const s = form.environments[env];
              return (
                <div className="env-block" data-env={env} key={env}>
                  <div className="env-block__head">
                    <span className="env-block__name"><i className="dot" />{ENV_META[env].label}</span>
                    <Toggle checked={s.enabled} onChange={() => setEnv(env, { enabled: !s.enabled })} label={`Enable in ${ENV_META[env].label}`} />
                  </div>
                  <div className={`env-block__slider ${s.enabled ? "" : "is-off"}`}>
                    <input
                      type="range" min="0" max="100" step="5"
                      value={s.rollout}
                      onChange={(e) => setEnv(env, { rollout: Number(e.target.value) })}
                      aria-label={`Rollout percentage in ${ENV_META[env].label}`}
                    />
                    <output>{s.rollout}%</output>
                  </div>
                  <div className="presets">
                    {ROLLOUT_PRESETS.map((p) => (
                      <button type="button" key={p} className={`preset ${s.rollout === p ? "is-active" : ""}`} aria-pressed={s.rollout === p} onClick={() => setEnv(env, { rollout: p })}>
                        {p}%
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {serverError && <p className="banner banner--error" role="alert">{serverError}</p>}

        <footer className="modal__foot">
          <button type="button" className="btn btn--ghost" onClick={requestClose}>Cancel</button>
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving ? "Saving…" : isEdit ? "Save changes" : "Create flag"}
          </button>
        </footer>
      </form>
    </div>
  );
}
