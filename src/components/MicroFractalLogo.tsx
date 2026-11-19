import React from 'react';

export const MicroFractalLogo: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <polygon
      points="16,2 28,9 28,23 16,30 4,23 4,9"
      stroke="#ff6a00"
      strokeWidth="1.75"
      fill="#0d0d10"
    />
    <polygon
      points="16,7 23.8,11.5 23.8,20.5 16,25 8.2,20.5 8.2,11.5"
      stroke="#ff9438"
      strokeWidth="1.25"
      fill="none"
    />
    <line x1="4" y1="16" x2="28" y2="16" stroke="#ff6a00" strokeWidth="1" strokeOpacity="0.55" />
    <circle cx="16" cy="16" r="2.7" fill="#ff6a00" />
  </svg>
);
