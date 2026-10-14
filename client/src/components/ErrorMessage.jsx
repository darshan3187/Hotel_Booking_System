import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorMessage = ({ message = 'Something went wrong. Please try again.', onRetry }) => {
  return (
    <div
      role="alert"
      aria-live="polite"
      style={{
        background: 'var(--color-danger-bg)',
        border: '1px solid rgba(180, 56, 56, 0.2)',
        borderRadius: 'var(--border-radius-md)',
        padding: '1.25rem 1.5rem',
        margin: '1.5rem 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        color: 'var(--color-danger)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <AlertCircle size={20} aria-hidden="true" style={{ flexShrink: 0 }} />
        <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{message}</span>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="btn btn-sm"
          style={{
            background: 'white',
            borderColor: 'var(--color-danger)',
            color: 'var(--color-danger)'
          }}
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
