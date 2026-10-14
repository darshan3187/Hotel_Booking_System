import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  BedDouble, 
  CalendarCheck2, 
  Users, 
  ArrowLeft,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

const AdminSidebar = ({ isMobileOpen, onCloseMobile }) => {
  return (
    <aside className={`admin-sidebar-refined ${isMobileOpen ? 'mobile-open' : ''}`}>
      {/* Brand header */}
      <div className="admin-brand-header">
        <Link to="/admin" className="admin-brand-link">
          <div className="admin-brand-icon">
            <span className="brand-dot-terracotta"></span>
          </div>
          <div>
            <span className="admin-brand-name">StayEase</span>
            <span className="admin-brand-role">Host Console</span>
          </div>
        </Link>
      </div>

      {/* Nav List */}
      <nav className="admin-nav-list" aria-label="Admin Navigation">
        <NavLink 
          to="/admin" 
          end
          onClick={onCloseMobile}
          className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
        >
          <LayoutDashboard size={18} aria-hidden="true" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink 
          to="/admin/hotels" 
          onClick={onCloseMobile}
          className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
        >
          <Building2 size={18} aria-hidden="true" />
          <span>Properties</span>
        </NavLink>

        <NavLink 
          to="/admin/rooms" 
          onClick={onCloseMobile}
          className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
        >
          <BedDouble size={18} aria-hidden="true" />
          <span>Suites & Rooms</span>
        </NavLink>

        <NavLink 
          to="/admin/bookings" 
          onClick={onCloseMobile}
          className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
        >
          <CalendarCheck2 size={18} aria-hidden="true" />
          <span>Guest Bookings</span>
        </NavLink>

        <NavLink 
          to="/admin/users" 
          onClick={onCloseMobile}
          className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
        >
          <Users size={18} aria-hidden="true" />
          <span>Registered Users</span>
        </NavLink>
      </nav>

      {/* Return to Guest Site Footer */}
      <div className="admin-sidebar-footer">
        <Link 
          to="/" 
          className="admin-return-link"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          <span>Return to Guest Site</span>
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
