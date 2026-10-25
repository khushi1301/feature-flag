const base = {
  width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
  strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true,
};
const icon = (children) => (props) => <svg {...base} {...props}>{children}</svg>;

export const SearchIcon = icon(<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>);
export const PlusIcon = icon(<path d="M12 5v14M5 12h14" />);
export const EditIcon = icon(<><path d="M4 20h4L19 9l-4-4L4 16v4z" /><path d="m13.5 6.5 4 4" /></>);
export const TrashIcon = icon(<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6" />);
export const CloseIcon = icon(<path d="M6 6l12 12M18 6 6 18" />);
export const FlagIcon = icon(<path d="M5 21V4M5 4h11l-2 4 2 4H5" />);
export const ListIcon = icon(<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" />);
export const UsersIcon = icon(<><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c.5-3.5 3-5.5 6.5-5.5s6 2 6.5 5.5M16 4.5a3.5 3.5 0 0 1 0 7M18 14.8c2 .6 3.3 2.3 3.5 5.2" /></>);
export const SunIcon = icon(<><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>);
export const MoonIcon = icon(<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z" />);
