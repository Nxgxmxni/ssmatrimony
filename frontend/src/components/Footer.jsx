import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MemberFooter from './MemberFooter';
import Logo from './Logo';
import { Phone, Mail, Globe, Instagram, MessageCircle, Heart } from 'lucide-react';

export default function Footer() {
  const { isAuthenticated } = useAuth();

  // If user is logged in, render Member Portal Footer!
  if (isAuthenticated) {
    return <MemberFooter />;
  }

  return (
    <footer style={{
      backgroundColor: '#051329',
      color: '#CBD5E1',
      marginTop: 'auto',
      borderTop: '4px solid #D4AF37',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Gold Radial Glow */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        right: '-100px',
        width: '350px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, rgba(5, 19, 41, 0) 70%)',
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ padding: '4.5rem 1.5rem 2.5rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3.5rem'
        }}>
          {/* Column 1: Brand Info & Social Media */}
          <div>
            <Link to="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: '1.25rem' }}>
              <Logo height={72} variant="dark" />
            </Link>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.7', color: '#94A3B8', marginBottom: '1.5rem' }}>
              <strong style={{ color: '#FFFFFF' }}>SS MATRIMONY</strong> is a premier Telugu matrimonial platform built on trust, traditional values, and verified family matching. Helping brides and grooms find their forever soulmate.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <a
                href="https://www.instagram.com/ssmatrimony2018/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Official SS Matrimony Instagram Page"
                className="social-icon-link"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  color: '#FFFFFF',
                  padding: '0.65rem',
                  borderRadius: '50%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  textDecoration: 'none'
                }}
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 style={{ color: '#D4AF37', marginBottom: '1.25rem', fontSize: '1rem', fontFamily: 'Outfit, sans-serif', fontWeight: '700', letterSpacing: '0.5px' }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <li><Link to="/" style={{ color: '#CBD5E1', textDecoration: 'none' }}>Home</Link></li>
              <li><Link to="/about" style={{ color: '#CBD5E1', textDecoration: 'none' }}>About Us</Link></li>
              <li><Link to="/services" style={{ color: '#CBD5E1', textDecoration: 'none' }}>Our Services</Link></li>
              <li><Link to="/profiles" style={{ color: '#CBD5E1', textDecoration: 'none' }}>Browse Profiles</Link></li>
              <li><Link to="/success-stories" style={{ color: '#CBD5E1', textDecoration: 'none' }}>Success Stories</Link></li>
            </ul>
          </div>

          {/* Column 3: Support & Legal */}
          <div>
            <h4 style={{ color: '#D4AF37', marginBottom: '1.25rem', fontSize: '1rem', fontFamily: 'Outfit, sans-serif', fontWeight: '700', letterSpacing: '0.5px' }}>
              Support &amp; Legal
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <li><Link to="/faq" style={{ color: '#CBD5E1', textDecoration: 'none' }}>Frequently Asked Questions</Link></li>
              <li><Link to="/contact" style={{ color: '#CBD5E1', textDecoration: 'none' }}>Contact Us</Link></li>
              <li><Link to="/privacy-policy" style={{ color: '#CBD5E1', textDecoration: 'none' }}>Privacy Policy</Link></li>
              <li><Link to="/terms-conditions" style={{ color: '#CBD5E1', textDecoration: 'none' }}>Terms &amp; Conditions</Link></li>
            </ul>
          </div>

          {/* Column 4: Direct Support Contact */}
          <div>
            <h4 style={{ color: '#D4AF37', marginBottom: '1.25rem', fontSize: '1rem', fontFamily: 'Outfit, sans-serif', fontWeight: '700', letterSpacing: '0.5px' }}>
              Customer Support
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.875rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: '#CBD5E1' }}>
                <Phone size={16} color="#D4AF37" /> +91 78930 69580
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: '#CBD5E1' }}>
                <Mail size={16} color="#D4AF37" /> ssmatrimony2018@gmail.com
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', color: '#CBD5E1' }}>
                <Globe size={16} color="#D4AF37" style={{ marginTop: '2px' }} />
                <span>Online Support for Telugu Families</span>
              </li>

              <li style={{ marginTop: '0.5rem' }}>
                <a
                  href="https://wa.me/917893069580"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: '#25D366',
                    color: '#FFFFFF',
                    padding: '0.5rem 1rem',
                    borderRadius: '50px',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    textDecoration: 'none'
                  }}
                >
                  <MessageCircle size={15} /> WhatsApp Assistance
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Trust Tagline Bar */}
        <div style={{
          marginTop: '3.5rem',
          paddingTop: '1.75rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.825rem',
          color: '#64748B'
        }}>
          <div>
            © {new Date().getFullYear()} <strong style={{ color: '#FFFFFF' }}>SS MATRIMONY</strong>. All Rights Reserved. MSME Registered &amp; Govt Recognized.
          </div>
          <div style={{ color: '#D4AF37', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            Trusted Telugu Matrimony Since 2018 <Heart size={14} fill="#D4AF37" color="#D4AF37" />
          </div>
        </div>
      </div>

      <style>{`
        .social-icon-link:hover {
          background: linear-gradient(135deg, #E1306C 0%, #C13584 100%) !important;
          color: #FFFFFF !important;
          transform: translateY(-3px) scale(1.08);
          box-shadow: 0 8px 20px rgba(225, 48, 108, 0.4);
          border-color: rgba(225, 48, 108, 0.6) !important;
        }
      `}</style>
    </footer>
  );
}
