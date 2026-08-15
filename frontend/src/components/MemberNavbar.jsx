import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notificationAPI } from '../services/api';
import Logo from './Logo';
import {
  LayoutDashboard,
  Heart,
  Star,
  Bell,
  User,
  Edit3,
  Sparkles,
  HelpCircle,
  LogOut,
  ChevronDown,
  Menu,
  X,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MemberNavbar() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const dropdownRef = useRef(null);

  const isBride = (profile?.gender || '').toLowerCase() === 'bride' || (profile?.gender || '').toLowerCase() === 'female';
  const profileIdDisplay = profile?._id ? `SS-${profile._id.slice(-6).toUpperCase()}` : 'SS-MEMBER';
  const defaultPhoto = isBride
    ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'
    : 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80';
  const avatarPhoto = profile?.photos?.[0] || defaultPhoto;

  const isProfileIncomplete = !profile?.isWizardCompleted || (profile?.completeness?.score || 0) < 100;

  // Fetch Unread Notification Count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await notificationAPI.getNotifications();
        setUnreadNotifications(res.data.unreadCount || 0);
      } catch (err) {
        // Fallback silently
      }
    };
    fetchUnreadCount();
  }, [location.pathname, location.search]);

  // Handle outside click for dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Helper to check active navigation link
  const currentTab = new URLSearchParams(location.search).get('tab') || 'matches';
  const isDashboard = location.pathname === '/dashboard';

  const memberNavLinks = [
    { label: 'Dashboard', path: '/dashboard?tab=matches', active: isDashboard && currentTab === 'matches', icon: LayoutDashboard },
    { label: 'My Interests', path: '/dashboard?tab=interests', active: isDashboard && currentTab === 'interests', icon: Heart },
    { label: 'Shortlisted', path: '/dashboard?tab=shortlist', active: isDashboard && currentTab === 'shortlist', icon: Star },
    { label: 'Notifications', path: '/dashboard?tab=notifications', active: isDashboard && currentTab === 'notifications', icon: Bell, badge: unreadNotifications },
  ];

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 1000, backgroundColor: '#0B3B91', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)' }}>
      {/* 
        ====================================================
        CLEAN MEMBER PORTAL HEADER BAR
        ====================================================
      */}
      <nav style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.7rem 1.5rem' }}>
          
          {/* Brand Logo & Portal Tag */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <Logo height={72} variant="dark" />
            </Link>
            <span
              style={{
                backgroundColor: 'rgba(212, 175, 55, 0.15)',
                color: '#FDE047',
                border: '1px solid #D4AF37',
                fontSize: '0.72rem',
                fontWeight: '800',
                padding: '0.2rem 0.6rem',
                borderRadius: '12px',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}
            >
              Member Portal
            </span>
          </div>

          {/* Desktop Member Navigation Menu */}
          <div className="desktop-menu" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {memberNavLinks.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link
                  key={idx}
                  to={item.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.55rem 0.95rem',
                    borderRadius: '30px',
                    fontSize: '0.88rem',
                    fontWeight: item.active ? '700' : '600',
                    color: item.active ? '#0F172A' : '#E2E8F0',
                    backgroundColor: item.active ? '#FDE047' : 'transparent',
                    textDecoration: 'none',
                    position: 'relative',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Icon size={16} color={item.active ? '#0F172A' : '#E2E8F0'} />
                  <span>{item.label}</span>

                  {item.badge > 0 && (
                    <span
                      style={{
                        backgroundColor: '#EF4444',
                        color: '#FFFFFF',
                        fontSize: '0.7rem',
                        fontWeight: '800',
                        padding: '0.1rem 0.45rem',
                        borderRadius: '10px',
                        marginLeft: '0.2rem',
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Member Profile Dropdown & Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            
            {/* User Avatar Dropdown */}
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  borderRadius: '50px',
                  padding: '0.3rem 0.75rem 0.3rem 0.35rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <img
                  src={avatarPhoto}
                  alt={profile?.fullName || 'Member Avatar'}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '1.5px solid #FDE047',
                  }}
                />
                <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#FFFFFF', lineHeight: 1.2 }}>
                    {profile?.fullName ? profile.fullName.split(' ')[0] : 'Member'}
                  </span>
                  <span style={{ fontSize: '0.68rem', color: '#FDE047', fontWeight: '700' }}>
                    {profileIdDisplay}
                  </span>
                </div>
                <ChevronDown size={14} color="#E2E8F0" />
              </button>

              {/* Dropdown Menu Modal */}
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      position: 'absolute',
                      top: '115%',
                      right: 0,
                      width: '230px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      boxShadow: '0 12px 32px rgba(11, 59, 145, 0.2)',
                      border: '1px solid #E2E8F0',
                      padding: '0.5rem',
                      zIndex: 1050,
                      color: '#0F172A',
                    }}
                  >
                    {/* User Header Summary inside Dropdown */}
                    <div style={{ padding: '0.75rem 0.85rem', borderBottom: '1px solid #F1F5F9' }}>
                      <div style={{ fontWeight: '800', fontSize: '0.9rem', color: '#0B3B91' }}>
                        {profile?.fullName || user?.fullName || 'Member Account'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.1rem' }}>
                        ID: {profileIdDisplay}
                      </div>
                    </div>

                    {/* Menu Options: My Profile, Edit Profile, Complete Profile (if incomplete), Help & Support, Logout */}
                    <div style={{ padding: '0.35rem 0', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <Link
                        to="/edit-profile"
                        onClick={() => setDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.65rem',
                          padding: '0.55rem 0.85rem',
                          borderRadius: '10px',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          color: '#334155',
                          textDecoration: 'none',
                          transition: 'background-color 0.15s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <User size={16} color="#0B3B91" /> My Profile
                      </Link>

                      <Link
                        to="/edit-profile"
                        onClick={() => setDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.65rem',
                          padding: '0.55rem 0.85rem',
                          borderRadius: '10px',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          color: '#334155',
                          textDecoration: 'none',
                          transition: 'background-color 0.15s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <Edit3 size={16} color="#0B3B91" /> Edit Profile
                      </Link>

                      {isProfileIncomplete && (
                        <Link
                          to={`/onboarding?step=${profile?.wizardStep || 1}`}
                          onClick={() => setDropdownOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.65rem',
                            padding: '0.55rem 0.85rem',
                            borderRadius: '10px',
                            fontSize: '0.85rem',
                            fontWeight: '700',
                            color: '#92400E',
                            backgroundColor: '#FFFBEB',
                            textDecoration: 'none',
                          }}
                        >
                          <Sparkles size={16} color="#D97706" /> Complete Profile
                        </Link>
                      )}

                      <Link
                        to="/contact"
                        onClick={() => setDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.65rem',
                          padding: '0.55rem 0.85rem',
                          borderRadius: '10px',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          color: '#334155',
                          textDecoration: 'none',
                          transition: 'background-color 0.15s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <HelpCircle size={16} color="#0B3B91" /> Help & Support
                      </Link>
                    </div>

                    <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '0.35rem' }}>
                      <button
                        onClick={handleLogout}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.65rem',
                          padding: '0.55rem 0.85rem',
                          borderRadius: '10px',
                          fontSize: '0.85rem',
                          fontWeight: '700',
                          color: '#DC2626',
                          backgroundColor: 'rgba(239, 68, 68, 0.08)',
                          border: 'none',
                          cursor: 'pointer',
                          textAlign: 'left',
                        }}
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              className="mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'none',
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                padding: '0.5rem',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
              }}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              backgroundColor: '#072B6B',
              borderBottom: '3px solid #FDE047',
              padding: '1.25rem 1.5rem',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {memberNavLinks.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={idx}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      color: item.active ? '#FDE047' : '#FFFFFF',
                      fontWeight: item.active ? '800' : '600',
                      fontSize: '1rem',
                      textDecoration: 'none',
                      padding: '0.5rem 0',
                      borderBottom: '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    <Icon size={18} color={item.active ? '#FDE047' : '#FFFFFF'} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  color: '#FCA5A5',
                  fontWeight: '700',
                  background: 'none',
                  border: 'none',
                  padding: '0.6rem 0',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 1024px) {
          .desktop-menu {
            display: none !important;
          }
          .mobile-toggle {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
}
