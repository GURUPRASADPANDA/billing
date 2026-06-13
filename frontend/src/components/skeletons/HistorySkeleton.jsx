import React from 'react';
import Skeleton from 'react-loading-skeleton';

export function HistorySkeleton({ isMobile }) {
  return (
    <div>
      <h2 style={{ margin: "0 0 24px" }}><Skeleton width={180} height={28} /></h2>
      
      <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div>
            <Skeleton width={80} height={14} style={{ marginBottom: 4 }} />
            <Skeleton width={130} height={36} borderRadius={8} />
          </div>
          <div>
            <Skeleton width={80} height={14} style={{ marginBottom: 4 }} />
            <Skeleton width={130} height={36} borderRadius={8} />
          </div>
          <Skeleton width={140} height={36} borderRadius={8} />
        </div>
        
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", width: isMobile ? "100%" : "auto" }}>
          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 16px", flex: isMobile ? "1" : "none" }}>
            <Skeleton width={80} height={12} style={{ marginBottom: 4 }} />
            <Skeleton width={100} height={20} />
          </div>
          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 16px", flex: isMobile ? "1" : "none" }}>
            <Skeleton width={80} height={12} style={{ marginBottom: 4 }} />
            <Skeleton width={100} height={20} />
          </div>
        </div>
      </div>

      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
        {isMobile ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ padding: 16, borderBottom: i < 4 ? "1px solid var(--border)" : "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <div>
                    <Skeleton width={80} height={18} style={{ marginBottom: 4 }} />
                    <Skeleton width={100} height={14} />
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <Skeleton width={120} height={16} style={{ marginBottom: 4 }} />
                    <Skeleton width={60} height={18} borderRadius={12} />
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px dashed var(--border)", paddingTop: 12 }}>
                  <div>
                    <Skeleton width={80} height={12} style={{ marginBottom: 4 }} />
                    <Skeleton width={100} height={20} />
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                     <Skeleton width={70} height={30} borderRadius={8} />
                     <Skeleton width={30} height={30} borderRadius={8} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: 16 }}>
            <Skeleton height={40} style={{ marginBottom: 12 }} />
            <Skeleton count={5} height={48} style={{ marginBottom: 8 }} />
          </div>
        )}
      </div>
    </div>
  );
}
