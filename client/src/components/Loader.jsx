import React from 'react';

const Loader = ({ message = 'Loading StayEase…' }) => {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        gap: '1rem',
        color: 'var(--color-muted)'
      }}
    >
      <div
        aria-hidden="true"
        style={{
          width: '38px',
          height: '38px',
          border: '3px solid var(--color-hairline)',
          borderTopColor: 'var(--color-primary)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }}
      />
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          div[aria-hidden="true"] {
            animation: none !important;
            opacity: 0.7;
          }
        }
      `}</style>
      <p style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--color-ink)' }}>{message}</p>
    </div>
  );
};

export default Loader;
