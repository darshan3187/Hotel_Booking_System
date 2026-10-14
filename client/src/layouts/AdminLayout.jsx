import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { useAuth } from '../context/AuthContext';
import { ExternalLink, Menu, X, ShieldAlert, Sparkles } from 'lucide-react';

const AdminLayout = () => {
  const { user } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="admin-shell">
        {/* Mobile Backdrop */}
        {mobileSidebarOpen && (
          <div 
            className="admin-backdrop" 
            onClick={() => setMobileSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Sidebar */}
        <AdminSidebar 
          isMobileOpen={mobileSidebarOpen} 
          onCloseMobile={() => setMobileSidebarOpen(false)} 
        />

        {/* Main Canvas */}
        <div className="admin-main">
          {/* Topbar */}
          <header className="admin-topbar-clean">
            <div className="admin-topbar-left">
              <button
                type="button"
                className="admin-mobile-toggle"
                onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                aria-label="Toggle admin navigation"
              >
                {mobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <div>
                <span className="admin-eyebrow">StayEase Operations</span>
                <h2 className="admin-topbar-title">Platform Administration</h2>
              </div>
            </div>

            <div className="admin-topbar-right">
              <Link 
                to="/" 
                target="_blank" 
                rel="noreferrer"
                className="btn btn-outline btn-sm admin-live-link"
              >
                <span>Live Guest Site</span>
                <ExternalLink size={13} aria-hidden="true" />
              </Link>

              <div className="admin-profile-pill">
                <div className="admin-avatar-orb">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="admin-profile-meta">
                  <span className="admin-profile-name">{user?.name || 'Administrator'}</span>
                  <span className="admin-role-badge">Superhost</span>
                </div>
              </div>
            </div>
          </header>

          {/* Admin Page Body */}
          <main className="admin-canvas-content">
            <Outlet />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminLayout;
