import React from 'react';
import { Search } from 'lucide-react';

const EmptyState = ({
  icon: Icon = Search,
  title = 'No items found',
  description = 'Try adjusting your search criteria or filters to find what you are looking for.',
  actionText,
  onAction
}) => {
  return (
    <div style={{
      textAlign: 'center',
      padding: '4rem 2rem',
      background: 'var(--bg-surface)',
      border: '1px dashed var(--border-color)',
      borderRadius: 'var(--border-radius-lg)',
      margin: '2rem 0'
    }}>
      <div style={{
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: 'var(--bg-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 1.25rem',
        color: 'var(--text-muted)'
      }}>
        <Icon size={26} aria-hidden="true" />
      </div>
      <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', color: 'var(--color-ink)', fontWeight: 600 }}>
        {title}
      </h3>
      <p style={{ maxWidth: '420px', margin: '0 auto 1.5rem', fontSize: '0.925rem', color: 'var(--color-muted)' }}>
        {description}
      </p>
      {actionText && onAction && (
        <button type="button" onClick={onAction} className="btn btn-primary btn-sm">
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
