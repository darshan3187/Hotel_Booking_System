import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', padding: '6rem 1rem', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container container-narrow" style={{ textAlign: 'center' }}>
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--border-radius-lg)',
          padding: '3.5rem 2rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--bg-subtle)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}>
            <Compass size={32} />
          </div>
          <span className="section-eyebrow" style={{ color: 'var(--color-accent)' }}>404 Error</span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '0.75rem' }}>
            Page Not Found
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto 2rem', fontSize: '0.95rem' }}>
            The sanctuary you are looking for seems to have moved or does not exist. Let us guide you back to our curated collections.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <Link to="/" className="btn btn-primary">
              <Home size={16} /> Return to Home
            </Link>
            <Link to="/hotels" className="btn btn-secondary">
              Browse Hotels
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
