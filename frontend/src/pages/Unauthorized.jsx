import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

export default function Unauthorized() {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #FAF9F6 0%, #EBF4FF 50%, #FFFFFF 100%)',
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
      }}
    >
      <div
        className="glass-card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '3rem 2.25rem',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '28px',
          border: '1.5px solid rgba(212, 175, 55, 0.45)',
          boxShadow: '0 25px 60px rgba(11, 59, 145, 0.12)',
          backdropFilter: 'blur(16px)',
          textAlign: 'center',
        }}
      >
        <div style={{ marginBottom: '1.75rem' }}>
          <Logo height={44} variant="light" />
        </div>

        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            backgroundColor: '#FEF2F2',
            color: '#DC2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            border: '2px solid #FCA5A5',
          }}
        >
          <ShieldAlert size={40} color="#DC2626" />
        </div>

        <h2 style={{ fontSize: '1.75rem', color: '#0F172A', fontWeight: '800', fontFamily: 'Outfit, sans-serif' }}>
          403 Access <span style={{ color: '#0B3B91' }}>Denied</span>
        </h2>
        <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: '1.6', margin: '0.75rem 0 2rem' }}>
          You do not have administrative permissions to view this protected page.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Link
            to="/dashboard"
            className="btn-gold"
            style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', borderRadius: '50px' }}
          >
            <ArrowLeft size={18} /> Back to My Dashboard
          </Link>

          <Link
            to="/"
            className="btn-secondary"
            style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', borderRadius: '50px' }}
          >
            <Home size={18} /> Go to Home Page
          </Link>
        </div>
      </div>
    </div>
  );
}
