import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MemberNavbar from './MemberNavbar';
import Logo from './Logo';
import {
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { user, profile, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // If user is logged in, render Member Portal Navbar!
  if (isAuthenticated) {
    return <MemberNavbar />;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Our Services', path: '/services' },
    { label: 'Success Stories', path: '/success-stories' },
    { label: 'Contact Us', path: '/contact' },
  ];

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
      {/* 
        ====================================================
        PUBLIC WEBSITE NAVIGATION BAR (VISITORS ONLY)
        ====================================================
      */}
      <nav style={{
        backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.98)' : '#FFFFFF',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: '1px solid #E2E8F0',
        boxShadow: scrolled ? '0 12px 32px rgba(11, 59, 145, 0.08)' : '0 2px 12px rgba(0,0,0,0.02)',
        transition: 'all 0.35s ease',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1.5rem' }}>
          {/* Official Brand Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <Logo height={80} variant="light" />
          </Link>

          {/* Public Desktop Menu */}
          <div className="desktop-menu" style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
            {navLinks.map((link, idx) => {
              const active = link.path ? isActive(link.path) : false;

              return (
                <Link
                  key={idx}
                  to={link.path}
                  className={`nav-link-item ${active ? 'active' : ''}`}
                  style={{
                    fontWeight: active ? '700' : '600',
                    color: active ? '#0A3D91' : '#334155',
                    fontSize: '0.95rem',
                    textDecoration: 'none',
                    position: 'relative',
                    padding: '0.4rem 0',
                    transition: 'color 0.25s ease'
                  }}
                >
                  {link.label}
                  <span className={`nav-underline ${active ? 'active-underline' : ''}`} />
                </Link>
              );
            })}
          </div>

          {/* Guest Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/login" className="btn-secondary" style={{ padding: '0.55rem 1.35rem', fontSize: '0.9rem' }}>
                Login
              </Link>
              <Link to="/register" className="btn-gold" style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}>
                Create Profile
              </Link>
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              className="mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'none',
                background: '#EAF4FF',
                color: '#0B3B91',
                padding: '0.55rem',
                borderRadius: '10px',
                border: 'none',
                marginLeft: '0.5rem'
              }}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Public Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: '#FFFFFF',
              borderBottom: '3px solid #0B3B91',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              padding: '1.5rem',
              zIndex: 999
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {navLinks.map((link, idx) => (
                <Link
                  key={idx}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    color: '#0F172A',
                    fontWeight: '600',
                    fontSize: '1.05rem',
                    textDecoration: 'none',
                    padding: '0.5rem 0',
                    borderBottom: '1px solid #F1F5F9'
                  }}
                >
                  {link.label}
                </Link>
              ))}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn-secondary" style={{ textAlign: 'center', justifyContent: 'center' }}>
                  Login
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn-gold" style={{ textAlign: 'center', justifyContent: 'center' }}>
                  Create Profile
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .nav-link-item:hover {
          color: #0B3B91 !important;
        }
        .nav-underline {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0%;
          height: 2.5px;
          background: linear-gradient(90deg, #0B3B91 0%, #D4AF37 100%);
          border-radius: 4px;
          transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .nav-link-item:hover .nav-underline {
          width: 100%;
        }
        .active-underline {
          width: 100% !important;
        }
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
