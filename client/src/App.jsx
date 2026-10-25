import { useCallback, useMemo, useState } from "react";
import { useFlags } from "./hooks/useFlags";
import { useTheme } from "./hooks/useTheme";
import { PAGE_SIZE } from "./constants";
import { effectiveRollout, flagState } from "./utils/status";
import Sidebar from "./components/Sidebar";
import ProductionSummary from "./components/ProductionSummary";
import Toolbar from "./components/Toolbar";
import FlagList from "./components/FlagList";
import Pagination from "./components/Pagination";
import FlagFormModal from "./components/FlagFormModal";
import AuditLog from "./components/AuditLog";
import Toast from "./components/Toast";
import { ErrorState, ListSkeleton } from "./components/States";
import { PlusIcon } from "./components/Icons";

export default function App() {
  const { flags, isLoading, isError, error, refetch, toggle, save, remove, restore } = useFlags();
  const [theme, toggleTheme] = useTheme();
  const [view, setView] = useState("flags");
  const [search, setSearch] = useState("");
  const [prodStatus, setProdStatus] = useState("all");
  const [sort, setSort] = useState("updated");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(undefined); // undefined = closed, null = create, object = edit
  const [toast, setToast] = useState(null);

  const showToast = (message, onUndo) => setToast({ id: Date.now(), message, onUndo });
  const closeToast = useCallback(() => setToast(null), []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = flags.filter((f) => {
      const matchesText = !q || f.name.toLowerCase().includes(q) || f.key.includes(q);
      const matchesStatus = prodStatus === "all" || flagState(f.environments.production) === prodStatus;
      return matchesText && matchesStatus;
    });
    const sorters = {
      updated: (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
      name: (a, b) => a.name.localeCompare(b.name),
      rollout: (a, b) => effectiveRollout(b.environments.production) - effectiveRollout(a.environments.production),
    };
    return list.sort(sorters[sort]);
  }, [flags, search, prodStatus, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const hasFilters = search !== "" || prodStatus !== "all";

  const resetPageThen = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const fail = (err) => showToast(err.message);

  function changeEnabled(flag, env, enabled, withUndo) {
    toggle.mutate(
      { id: flag.id, env, enabled },
      {
        onSuccess: () =>
          showToast(
            `${flag.key} turned ${enabled ? "on" : "off"} in ${env}`,
            withUndo ? () => changeEnabled(flag, env, !enabled, false) : undefined
          ),
        onError: fail,
      }
    );
  }

  const handleToggle = (flag, env) => changeEnabled(flag, env, !flag.environments[env].enabled, true);

  function handleDelete(flag) {
    remove.mutate(flag.id, {
      onSuccess: (deleted) =>
        showToast(`Deleted ${flag.key}`, () => restore.mutate(deleted, { onError: fail })),
      onError: fail,
    });
  }

  // Resolves on success (the modal closes); rejects with the server's message (the modal shows it).
  async function handleSave(data) {
    await save.mutateAsync(data);
    showToast(data.id ? `Saved ${data.key}` : `Created ${data.key}`);
  }

  const existingKeys = flags.filter((f) => f.id !== editing?.id).map((f) => f.key);

  return (
    <div className="app">
      <Sidebar view={view} onView={setView} theme={theme} onToggleTheme={toggleTheme} />

      <main className="main">
        <div className="page">
          {view === "audit" ? (
            <AuditLog />
          ) : (
            <>
              <header className="page-head">
                <div>
                  <h1>Flags</h1>
                  <p className="muted">Control who sees what, without deploying.</p>
                </div>
                <button className="btn btn--primary" onClick={() => setEditing(null)}>
                  <PlusIcon /> Create flag
                </button>
              </header>

              {!isLoading && !isError && <ProductionSummary flags={flags} />}

              <Toolbar
                search={search}
                onSearch={resetPageThen(setSearch)}
                prodStatus={prodStatus}
                onProdStatus={resetPageThen(setProdStatus)}
                sort={sort}
                onSort={resetPageThen(setSort)}
              />

              {isLoading ? (
                <ListSkeleton />
              ) : isError ? (
                <ErrorState message={error.message} onRetry={refetch} />
              ) : (
                <FlagList
                  flags={visible}
                  onToggle={handleToggle}
                  onEdit={setEditing}
                  onDelete={handleDelete}
                  hasFilters={hasFilters}
                  onClearFilters={() => {
                    setSearch("");
                    setProdStatus("all");
                  }}
                />
              )}

              {!isLoading && !isError && filtered.length > 0 && (
                <Pagination page={safePage} totalPages={totalPages} total={filtered.length} onPage={setPage} />
              )}
            </>
          )}
        </div>
      </main>

      {editing !== undefined && (
        <FlagFormModal
          key={editing ? editing.id : "new"}
          flag={editing}
          existingKeys={existingKeys}
          onSave={handleSave}
          onClose={() => setEditing(undefined)}
        />
      )}

      {toast && <Toast toast={toast} onClose={closeToast} />}
    </div>
  );
}
