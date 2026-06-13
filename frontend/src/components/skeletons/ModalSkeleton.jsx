import React from 'react';
import Skeleton from 'react-loading-skeleton';

export function ModalSkeleton() {
  return (
    <div style={{ padding: "20px" }}>
      <Skeleton width="60%" height={24} style={{ marginBottom: 24 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div>
          <Skeleton width={80} height={14} style={{ marginBottom: 6 }} />
          <Skeleton height={42} borderRadius={8} />
        </div>
        <div>
          <Skeleton width={80} height={14} style={{ marginBottom: 6 }} />
          <Skeleton height={42} borderRadius={8} />
        </div>
      </div>
      <Skeleton width="100%" height={44} borderRadius={8} />
    </div>
  );
}
