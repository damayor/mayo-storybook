import React from 'react';

interface SoftPanelProps {
  children: React.ReactNode;
  className?: string;
}

// Soft, borderless backdrop for content sitting over the PLY point-cloud
// background — blur + fill fade out radially via mask-image instead of
// stopping at a hard rectangular edge, so it reads as haze rather than a card.
export function SoftPanel({ children, className = '' }: SoftPanelProps) {
  return (
    <div className={`relative ${className}`}>
      <div
        className="absolute "
        style={{
          top: '50%',
          left: '50%',
          width: '150%',
          height: '120%',
          transform: 'translate(-50%, -50%)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(2, 6, 8, 0.7)',
          maskImage: 'radial-gradient(ellipse 80% 80% at center, black 50%, transparent 60%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at center, black 40%, transparent 60%)',
          willChange: 'backdrop-filter',
          zIndex: 0,
        }}
      />
      <div className="relative" style={{ zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
