import React from 'react';
import Skeleton from 'react-loading-skeleton';

export function PartiesSkeleton({ isMobile }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Skeleton circle width={20} height={20} />
          <h2 style={{ margin: 0 }}><Skeleton width={120} height={28} /></h2>
        </div>
        <Skeleton width={120} height={36} borderRadius={8} />
      </div>
      
      <div style={{ marginBottom: 16 }}>
        <Skeleton width={300} height={40} borderRadius={8} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr": "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <Skeleton width={40} height={40} borderRadius={10} />
              <div style={{ display: "flex", gap: 6 }}>
                <Skeleton width={32} height={32} borderRadius={8} />
                <Skeleton width={32} height={32} borderRadius={8} />
              </div>
            </div>
            <Skeleton width={150} height={20} style={{ marginBottom: 8 }} />
            <Skeleton width={120} height={14} style={{ marginBottom: 4 }} />
            <Skeleton width={140} height={14} style={{ marginBottom: 4 }} />
            <Skeleton width={180} height={14} style={{ marginTop: 4 }} />
          </div>
        ))}
      </div>
    </div>
  );
}
