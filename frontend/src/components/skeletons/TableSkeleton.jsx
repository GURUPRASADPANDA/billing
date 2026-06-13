import React from 'react';
import Skeleton from 'react-loading-skeleton';

export function TableSkeleton({ hideTitle }) {
  return (
    <div>
      {!hideTitle && <h2 style={{ margin: "0 0 24px" }}><Skeleton width={200} height={28} /></h2>}
      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 16 }}>
        <Skeleton height={40} style={{ marginBottom: 12 }} />
        <Skeleton count={5} height={48} style={{ marginBottom: 8 }} />
      </div>
    </div>
  );
}
