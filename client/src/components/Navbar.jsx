import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  Compass, 
  Info,
  Headphones,
  CalendarDays, 
  User, 
  ShieldCheck, 
  LogIn, 
  UserPlus,
  LogOut 
} from 'lucide-react';
import { Dock, DockCard, DockDivider } from './Dock';
import '../styles/dock.css';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Dock>
      {/* Brand / Home */}
      <DockCard 
        label="StayEase Home" 
        onClick={() => navigate('/')} 
        isActive={isActive('/')}
      >
        <Building2 size={21} strokeWidth={2.2} />
      </DockCard>

      {/* Explore Stays */}
      <DockCard 
        label="Explore Hotels" 
        onClick={() => navigate('/hotels')} 
        isActive={isActive('/hotels')}
      >
        <Compass size={21} strokeWidth={2.2} />
      </DockCard>

      {/* About Us */}
      <DockCard 
        label="About Us" 
        onClick={() => navigate('/about')}
        isActive={isActive('/about')}
      >
        <Info size={21} strokeWidth={2.2} />
      </DockCard>

      {/* Contact Us */}
      <DockCard 
        label="Contact Us" 
        onClick={() => navigate('/contact')}
        isActive={isActive('/contact')}
      >
        <Headphones size={21} strokeWidth={2.2} />
      </DockCard>

      <DockDivider />

      {/* Authenticated User Items */}
      {user ? (
        <>
          <DockCard 
            label="My Bookings" 
            onClick={() => navigate('/bookings')} 
            isActive={isActive('/bookings')}
          >
            <CalendarDays size={21} strokeWidth={2.2} />
          </DockCard>

          <DockCard 
            label={user.name ? `Account (${user.name})` : "Account Profile"} 
            onClick={() => navigate('/profile')} 
            isActive={isActive('/profile')}
          >
            {user.name ? (
              <div className="dock-avatar">
                {user.name.charAt(0).toUpperCase()}
              </div>
            ) : (
              <User size={21} strokeWidth={2.2} />
            )}
          </DockCard>

          {isAdmin && (
            <DockCard 
              label="Admin Dashboard" 
              onClick={() => navigate('/admin')} 
              isActive={isActive('/admin')}
            >
              <ShieldCheck size={21} strokeWidth={2.2} color="#e11d48" />
            </DockCard>
          )}

          <DockDivider />

          <DockCard 
            label="Log Out" 
            onClick={handleLogout}
          >
            <LogOut size={20} strokeWidth={2.2} color="#ef4444" />
          </DockCard>
        </>
      ) : (
        <>
          <DockCard 
            label="Log In" 
            onClick={() => navigate('/login')} 
            isActive={isActive('/login')}
          >
            <LogIn size={21} strokeWidth={2.2} />
          </DockCard>

          <DockCard 
            label="Sign Up" 
            onClick={() => navigate('/register')} 
            isActive={isActive('/register')}
          >
            <UserPlus size={21} strokeWidth={2.2} />
          </DockCard>
        </>
      )}
    </Dock>
  );
};

export default Navbar;
