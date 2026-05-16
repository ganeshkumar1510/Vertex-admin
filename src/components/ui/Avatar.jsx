import React from 'react';
import './Avatar.css';

// Fallback colors matching the prompt
const bgColors = ['#FCA5A5', '#FCD34D', '#6EE7B7', '#93C5FD', '#C4B5FD', '#F9A8D4', '#FDBA74'];

export function Avatar({ name, src, size = 'md', className = '' }) {
  const getInitials = (name) => {
    if (!name) return '?';
    const split = name.split(' ');
    if (split.length > 1) return (split[0][0] + split[split.length - 1][0]).toUpperCase();
    return name[0].toUpperCase();
  };

  const getColorIndex = (name) => {
    if (!name) return 0;
    let sum = 0;
    for (let i = 0; i < name.length; i++) {
      sum += name.charCodeAt(i);
    }
    return sum % bgColors.length;
  };

  const bgColor = src ? 'transparent' : bgColors[getColorIndex(name)];

  return (
    <div 
      className={`avatar avatar-${size} ${className}`}
      style={{ backgroundColor: bgColor }}
      title={name}
    >
      {src ? (
        <img src={src} alt={name} className="avatar-img" />
      ) : (
        <span className="avatar-initials">{getInitials(name)}</span>
      )}
    </div>
  );
}
