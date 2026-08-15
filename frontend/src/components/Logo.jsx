import React from 'react';

export default function Logo({ height = 76, variant = 'light', showTagline = true, style = {} }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        textDecoration: 'none',
        transition: 'all 0.3s ease',
        ...style,
      }}
    >
      <img
        src="/ss_logo.png"
        alt="SS MATRIMONY - CONNECTING HEARTS, CREATING FUTURES"
        style={{
          height: `${height}px`,
          width: 'auto',
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
          display: 'block',
          borderRadius: variant === 'dark' ? '8px' : '0px',
          padding: variant === 'dark' ? '4px 10px' : '0',
          backgroundColor: variant === 'dark' ? '#FFFFFF' : 'transparent',
          filter: 'drop-shadow(0 2px 10px rgba(11, 59, 145, 0.12))',
          transition: 'transform 0.3s ease, filter 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.02)';
          e.currentTarget.style.filter = 'drop-shadow(0 4px 16px rgba(11, 59, 145, 0.20))';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.filter = 'drop-shadow(0 2px 10px rgba(11, 59, 145, 0.12))';
        }}
      />
    </div>
  );
}

