import React from 'react';

export function Select({ label, children, error, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-muted)", marginBottom: 6 }}>{label}</label>}
      <select {...props} style={{
        width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${error ? "#fca5a5" : "var(--border)"}`,
        background: "var(--bg)", color: "var(--text)", fontSize: 14, outline: "none", boxSizing: "border-box",
        ...props.style,
      }}>
        {children}
      </select>
      {error && <p style={{ margin: "4px 0 0", fontSize: 12, color: "#dc2626" }}>{error}</p>}
    </div>
  );
}
