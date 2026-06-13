import React from 'react';

export function Btn({ children, variant = "primary", loading, ...props }) {
  const styles = {
    primary: { background: "#2563eb", color: "#fff", border: "1px solid #2563eb" },
    secondary: { background: "var(--bg)", color: "var(--text)", border: "1px solid var(--border)" },
    danger: { background: "#dc2626", color: "#fff", border: "1px solid #dc2626" },
    ghost: { background: "transparent", color: "var(--text-muted)", border: "1px solid transparent" },
    success: { background: "#16a34a", color: "#fff", border: "1px solid #16a34a" },
  };
  return (
    <button {...props} disabled={loading || props.disabled} style={{
      padding: "10px 18px", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: "pointer",
      display: "inline-flex", alignItems: "center", gap: 6, transition: "opacity 0.15s, transform 0.1s",
      opacity: (loading || props.disabled) ? 0.6 : 1, ...styles[variant],
      ...props.style,
    }}>
      {loading ? "⏳" : ""}{children}
    </button>
  );
}
