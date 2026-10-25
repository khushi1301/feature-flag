import { useEffect } from "react";

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 6000);
    return () => clearTimeout(t);
  }, [toast.id, onClose]);

  return (
    <div className="toast" role="status">
      <span>{toast.message}</span>
      {toast.onUndo && (
        <button className="toast__undo" onClick={() => { toast.onUndo(); onClose(); }}>
          Undo
        </button>
      )}
    </div>
  );
}
