import React from 'react';
import Skeleton from 'react-loading-skeleton';

export function BillingSkeleton({ isMobile }) {
  return (
    <div>
      <h2 style={{ margin: "0 0 24px" }}><Skeleton width={180} height={28} /></h2>
      
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 16 }}>
          <Skeleton width={80} height={12} style={{ marginBottom: 8 }} />
          <Skeleton width={100} height={32} />
        </div>
        <div>
          <Skeleton width={100} height={14} style={{ marginBottom: 6 }} />
          <Skeleton height={42} borderRadius={8} />
        </div>
        <div>
          <Skeleton width={80} height={14} style={{ marginBottom: 6 }} />
          <Skeleton height={42} borderRadius={8} />
        </div>
      </div>

      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, marginBottom: 20, overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
          <Skeleton width={60} height={20} />
          <Skeleton width={90} height={32} borderRadius={8} />
        </div>
        <div style={{ padding: 16 }}>
          {isMobile ? (
             <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
               {[1, 2].map(i => (
                 <div key={i} style={{ padding: 12, border: "1px solid var(--border)", borderRadius: 8, background: "var(--sidebar)" }}>
                   <Skeleton width={80} height={12} style={{ marginBottom: 6 }} />
                   <Skeleton height={36} borderRadius={6} style={{ marginBottom: 12 }} />
                   <div style={{ display: "flex", gap: 10 }}>
                      <div style={{ flex: 1 }}>
                        <Skeleton width={60} height={12} style={{ marginBottom: 6 }} />
                        <Skeleton height={36} borderRadius={6} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <Skeleton width={60} height={12} style={{ marginBottom: 6 }} />
                        <Skeleton height={36} borderRadius={6} />
                      </div>
                   </div>
                 </div>
               ))}
             </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", gap: 16 }}>
                 <Skeleton width="40%" height={20} />
                 <Skeleton width="20%" height={20} />
                 <Skeleton width="20%" height={20} />
                 <Skeleton width="20%" height={20} />
              </div>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ display: "flex", gap: 16 }}>
                  <div style={{ width: "40%" }}><Skeleton height={36} borderRadius={6} /></div>
                  <div style={{ width: "20%" }}><Skeleton height={36} borderRadius={6} /></div>
                  <div style={{ width: "20%" }}><Skeleton height={36} borderRadius={6} /></div>
                  <div style={{ width: "20%" }}><Skeleton height={36} borderRadius={6} /></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 320px", gap: 20, alignItems: "start" }}>
        <div>
          <Skeleton width={120} height={14} style={{ marginBottom: 6 }} />
          <Skeleton height={80} borderRadius={8} />
        </div>
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <Skeleton width={60} height={16} />
            <Skeleton width={80} height={16} />
          </div>
          <Skeleton width={50} height={14} style={{ marginBottom: 6 }} />
          <Skeleton height={36} borderRadius={6} style={{ marginBottom: 16 }} />
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, borderTop: "1px solid var(--border)", paddingTop: 16 }}>
            <Skeleton width={80} height={22} />
            <Skeleton width={100} height={22} />
          </div>
          <Skeleton height={44} borderRadius={8} />
        </div>
      </div>
    </div>
  );
}
