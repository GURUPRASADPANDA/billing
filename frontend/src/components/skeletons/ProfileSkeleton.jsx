import React from 'react';
import Skeleton from 'react-loading-skeleton';

export function ProfileSkeleton() {
  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h2 style={{ margin: "0 0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Skeleton circle width={20} height={20} />
          <Skeleton width={180} height={28} />
        </div>
      </h2>

      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
        <div style={{ marginBottom: 16 }}>
           <Skeleton width={120} height={14} style={{ marginBottom: 6 }} />
           <Skeleton height={42} borderRadius={8} />
        </div>
        <div style={{ marginBottom: 16 }}>
           <Skeleton width={100} height={14} style={{ marginBottom: 6 }} />
           <Skeleton height={42} borderRadius={8} />
        </div>
        <div style={{ marginBottom: 16 }}>
           <Skeleton width={110} height={14} style={{ marginBottom: 6 }} />
           <Skeleton height={42} borderRadius={8} />
        </div>
        <div style={{ marginBottom: 24 }}>
           <Skeleton width={80} height={14} style={{ marginBottom: 6 }} />
           <Skeleton height={90} borderRadius={8} />
        </div>
        <Skeleton height={44} borderRadius={8} />
      </div>
    </div>
  );
}
