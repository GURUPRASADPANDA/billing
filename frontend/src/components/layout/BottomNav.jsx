import React from 'react';
import { NavLink } from 'react-router-dom';
import { Receipt, History, Users, Box, User, Archive } from "lucide-react";

export function BottomNav() {
  const navItems = [
    { id: "/", label: "Bill", icon: Receipt },
    { id: "/history", label: "History", icon: History },
    { id: "/parties", label: "Parties", icon: Users },
    { id: "/items", label: "Items", icon: Box },
    { id: "/profile", label: "Profile", icon: User },
    { id: "/trash", label: "Trash", icon: Archive },
  ];

  return (
    <nav
      style={{
        position: "fixed", bottom: 0, left: 0, right: 0, background: "var(--sidebar)", borderTop: "1px solid var(--border)",
        display: "flex", justifyContent: "space-around", padding: "10px 8px 14px", zIndex: 100, boxShadow: "0 -4px 20px rgba(0,0,0,0.1)",
      }}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.id}
            to={item.id}
            style={({ isActive }) => ({
              background: isActive ? "rgba(37, 99, 235, 0.1)" : "transparent",
              border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer",
              padding: "6px 10px", borderRadius: 10, textDecoration: "none", boxSizing: "border-box",
              color: isActive ? "#2563eb" : "var(--text-muted)",
              transform: isActive ? "scale(1.08)" : "scale(1)",
              transition: "all 0.2s ease",
            })}
          >
            {({ isActive }) => (
              <>
                <Icon size={20} strokeWidth={2} />
                <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 500 }}>{item.label}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
