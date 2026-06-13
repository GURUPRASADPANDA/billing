import React from 'react';
import { CheckCircle, XCircle, Info } from 'lucide-react';

export function Toast({ toasts, remove }) {
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8 }}>
      {toasts.map((t) => (
        <div key={t.id} onClick={() => remove(t.id)} style={{
          padding: "12px 20px", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 500,
          background: t.type === "error" ? "#fee2e2" : t.type === "success" ? "#dcfce7" : "#dbeafe",
          color: t.type === "error" ? "#991b1b" : t.type === "success" ? "#166534" : "#1e40af",
          border: `1px solid ${t.type === "error" ? "#fca5a5" : t.type === "success" ? "#86efac" : "#93c5fd"}`,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)", minWidth: 220, maxWidth: 320,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {t.type === "success" ? <CheckCircle size={16} /> : t.type === "error" ? <XCircle size={16} /> : <Info size={16} />}
            <span>{t.message}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
