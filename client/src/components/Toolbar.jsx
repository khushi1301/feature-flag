import { SearchIcon } from "./Icons";

export default function Toolbar({ search, onSearch, prodStatus, onProdStatus, sort, onSort }) {
  return (
    <div className="toolbar">
      <label className="search">
        <SearchIcon />
        <input
          type="search"
          placeholder="Search flags by name or key"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          aria-label="Search flags"
        />
      </label>
      <select className="input" value={prodStatus} onChange={(e) => onProdStatus(e.target.value)} aria-label="Filter by production status">
        <option value="all">Production: any</option>
        <option value="live">Production: live</option>
        <option value="rolling">Production: rolling out</option>
        <option value="off">Production: off</option>
      </select>
      <select className="input" value={sort} onChange={(e) => onSort(e.target.value)} aria-label="Sort flags">
        <option value="updated">Newest first</option>
        <option value="name">Name A–Z</option>
        <option value="rollout">Top rollout</option>
      </select>
    </div>
  );
}
