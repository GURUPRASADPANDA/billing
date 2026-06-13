import React from 'react';
import { NavLink } from 'react-router-dom';
import { Receipt, History, Users, Box, User, Archive, Download, Sun, Moon, RefreshCw } from "lucide-react";

export function Sidebar({ dark, setDark, company, showInstall, onInstall, updateAvailable, onUpdate }) {
  const navItems = [
    { id: "/", label: "Create Bill", icon: Receipt },
    { id: "/history", label: "Bill History", icon: History },
    { id: "/parties", label: "Parties", icon: Users },
    { id: "/items", label: "Items", icon: Box },
    { id: "/profile", label: "Profile", icon: User },
    { id: "/trash", label: "Trash", icon: Archive },
  ];

  return (
    <aside
      style={{
        width: 220,
        minHeight: "100vh",
        background: "var(--sidebar)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ padding: "24px 20px 16px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: dark ? "#fff" : "#111", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
          <img src="/favicon.png" alt="logo" style={{ width: 22, height: 22, objectFit: "contain" }} />
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{company?.companyName || "Mahavir"}</div>
        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Enterprises</div>
      </div>

      <nav style={{ flex: 1, padding: "12px 8px" }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={item.id}
              style={({ isActive }) => ({
                width: "100%", padding: "10px 14px", borderRadius: 10, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, marginBottom: 6, textAlign: "left", position: "relative", textDecoration: "none", boxSizing: "border-box",
                background: isActive ? "rgba(37, 99, 235, 0.1)" : "transparent",
                color: isActive ? "#2563eb" : "var(--text-muted)",
                fontWeight: isActive ? 600 : 400,
                transition: "all 0.2s ease",
              })}
            >
              {({ isActive }) => (
                <>
                  {isActive && <div style={{ position: "absolute", left: 0, top: "20%", bottom: "20%", width: 4, borderRadius: 4, background: "#2563eb" }} />}
                  <Icon size={18} />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)" }}>
        {showInstall && (
          <button onClick={onInstall} style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "none", background: "#16a34a", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8, transition: "background 0.2s" }}>
            <Download size={16} /> Install App
          </button>
        )}
        <button onClick={() => setDark(!dark)} style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text-muted)", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s ease" }}>
          {dark ? <><Sun size={16} /> Light Mode</> : <><Moon size={16} /> Dark Mode</>}
        </button>
        <button onClick={onUpdate} style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: updateAvailable ? "none" : "1px solid var(--border)", background: updateAvailable ? "#f59e0b" : "var(--bg)", color: updateAvailable ? "#fff" : "var(--text-muted)", cursor: "pointer", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 8, transition: "all 0.2s", boxShadow: updateAvailable ? "0 0 10px rgba(245, 158, 11, 0.6)" : "none" }}>
          <RefreshCw size={16} /> Update App
        </button>
      </div>
    </aside>
  );
}
