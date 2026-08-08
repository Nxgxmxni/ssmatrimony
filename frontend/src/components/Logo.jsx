import React from 'react';

export default function Logo({ height = 50, variant = 'light' }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
      <img
        src="/ss_logo.png"
        alt="SS Matrimony Logo - Your Partner for a Lifetime"
        style={{
          height: `${height}px`,
          width: 'auto',
          objectFit: 'contain',
          display: 'block',
          borderRadius: variant === 'dark' ? '8px' : '0px',
          padding: variant === 'dark' ? '4px 8px' : '0',
          backgroundColor: variant === 'dark' ? '#FFFFFF' : 'transparent',
          transition: 'transform 0.3s ease',
        }}
      />
    </div>
  );
}
