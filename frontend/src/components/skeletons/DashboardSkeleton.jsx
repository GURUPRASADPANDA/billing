import React from 'react';
import Skeleton from 'react-loading-skeleton';

export function DashboardSkeleton({ isMobile }) {
  return (
    <div>
      <h2 style={{ margin: "0 0 24px" }}><Skeleton width={200} height={28} /></h2>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 16 }}>
            <Skeleton width={100} height={14} style={{ marginBottom: 12 }} />
            <Skeleton width={140} height={28} />
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr", gap: 16 }}>
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
          <Skeleton width={150} height={20} style={{ marginBottom: 16 }} />
          <Skeleton count={5} height={40} style={{ marginBottom: 8, borderRadius: 8 }} />
        </div>
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
          <Skeleton width={120} height={20} style={{ marginBottom: 16 }} />
          <Skeleton count={3} height={60} style={{ marginBottom: 8, borderRadius: 8 }} />
        </div>
      </div>
    </div>
  );
}
