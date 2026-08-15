import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Sparkles,
  Mail,
  CreditCard,
  FileSpreadsheet,
  Globe,
  BarChart2,
  Settings,
  LogOut,
  X,
  Heart,
} from 'lucide-react';

export default function AdminSidebar({ isMobileOpen, onCloseMobile }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Interest Management', path: '/admin/interests', icon: Heart },
    { label: 'User Management', path: '/admin/users', icon: Users },
    { label: 'Profile Verification', path: '/admin/verifications', icon: ShieldCheck },
    { label: '📥 Import Profiles', path: '/admin/import-profiles', icon: FileSpreadsheet },
    { label: 'Success Stories', path: '/admin/success-stories', icon: Sparkles },
    { label: 'Contact Enquiries', path: '/admin/contact', icon: Mail },
    { label: 'Website CMS', path: '/admin/cms', icon: Globe },
    { label: 'Reports & Analytics', path: '/admin/reports', icon: BarChart2 },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 998,
          }}
        />
      )}

      {/* Sidebar Container */}
      <aside
        style={{
          width: '260px',
          backgroundColor: '#0F172A',
          color: '#F8FAFC',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 999,
          transition: 'transform 0.3s ease',
          transform: isMobileOpen ? 'translateX(0)' : undefined,
          boxShadow: '4px 0 25px rgba(0, 0, 0, 0.15)',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        }}
        className={`admin-sidebar ${isMobileOpen ? 'open' : ''}`}
      >
        <div>
          {/* Sidebar Header Brand */}
          <div
            style={{
              padding: '1.5rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #0B3B91 0%, #051329 100%)',
                  border: '1.5px solid #D4A017',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(212, 160, 23, 0.25)',
                }}
              >
                <Heart size={20} color="#D4A017" fill="#D4A017" />
              </div>
              <div>
                <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#FFFFFF', letterSpacing: '0.5px' }}>
                  SS Matrimony
                </div>
                <div style={{ fontSize: '0.72rem', color: '#D4A017', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  Admin CRM Panel
                </div>
              </div>
            </div>

            {/* Mobile Close Button */}
            {isMobileOpen && (
              <button
                onClick={onCloseMobile}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: '0.2rem',
                }}
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav style={{ padding: '1.25rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onCloseMobile}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.8rem',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                    fontWeight: isActive ? '700' : '500',
                    color: isActive ? '#FFFFFF' : '#94A3B8',
                    backgroundColor: isActive ? '#0B3B91' : 'transparent',
                    borderLeft: isActive ? '3.5px solid #D4A017' : '3.5px solid transparent',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                  })}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Logout Action */}
        <div style={{ padding: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              color: '#FCA5A5',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              fontWeight: '700',
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <LogOut size={18} />
            <span>Logout Administrator</span>
          </button>
        </div>
      </aside>
    </>
  );
}
