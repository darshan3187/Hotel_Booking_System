import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, ShieldCheck, LogOut, CheckCircle2 } from 'lucide-react';

const Profile = () => {
  const { user, logout, isAdmin } = useAuth();

  if (!user) return null;

  return (
    <main id="main-content" style={{ backgroundColor: 'var(--color-canvas)', padding: '40px 0 72px', minHeight: '80vh' }}>
      <div className="container container-narrow" style={{ maxWidth: '640px' }}>
        <div style={{ marginBottom: '28px' }}>
          <span className="section-eyebrow">Account Settings</span>
          <h1 className="editorial-headline" style={{ color: 'var(--color-ink)' }}>
            Personal Profile
          </h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '14px', marginTop: '6px' }}>
            Manage your personal profile, contact information, and membership credentials.
          </p>
        </div>

        <div className="admin-card-surface" style={{ padding: '28px' }}>
          {/* User Top Avatar Block */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '28px', borderBottom: '1px solid var(--color-hairline)', paddingBottom: '22px' }}>
            <div className="user-avatar-circle" style={{ width: '60px', height: '60px', fontSize: '22px', backgroundColor: 'var(--color-primary)', color: '#ffffff' }}>
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-family-serif)', fontSize: '20px', fontWeight: 600, color: 'var(--color-ink)' }}>
                {user.name}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <span className="badge badge-confirmed" style={{ textTransform: 'capitalize', fontSize: '11px', padding: '2px 8px' }}>
                  <CheckCircle2 size={12} aria-hidden="true" />
                  {user.role || 'Traveler'}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--color-muted)' }}>Verified Member</span>
              </div>
            </div>
          </div>

          {/* Details Stack */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--color-surface-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', flexShrink: 0 }}>
                <Mail size={16} aria-hidden="true" />
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--color-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Email Address</span>
                <span style={{ fontSize: '15px', fontWeight: 500, color: 'var(--color-ink)' }}>{user.email}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--color-surface-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', flexShrink: 0 }}>
                <Phone size={16} aria-hidden="true" />
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--color-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Phone Number</span>
                <span style={{ fontSize: '15px', fontWeight: 500, color: 'var(--color-ink)' }}>{user.phone || '+91 98765 43210'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--color-surface-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', flexShrink: 0 }}>
                <ShieldCheck size={16} aria-hidden="true" />
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--color-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Account Access Level</span>
                <span style={{ fontSize: '15px', fontWeight: 500, color: 'var(--color-ink)' }}>
                  {isAdmin ? 'Full Administrative Privileges' : 'Standard Guest Account'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div style={{ marginTop: '32px', paddingTop: '20px', borderTop: '1px solid var(--color-hairline)', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={logout}
              className="btn btn-outline"
              style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <LogOut size={16} aria-hidden="true" /> Sign Out of StayEase
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
