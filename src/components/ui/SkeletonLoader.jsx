import React from 'react';
import './SkeletonLoader.css';

export function SkeletonLoader({ type = 'list', count = 5 }) {
  if (type === 'card') {
    return (
      <div className="skeleton-grid">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton-header"></div>
            <div className="skeleton-body"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'detail') {
    return (
      <div className="skeleton-detail">
        <div className="skeleton-title"></div>
        <div className="skeleton-section"></div>
        <div className="skeleton-section-large"></div>
      </div>
    );
  }

  // Default 'list'
  return (
    <div className="skeleton-list">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-row"></div>
      ))}
    </div>
  );
}
