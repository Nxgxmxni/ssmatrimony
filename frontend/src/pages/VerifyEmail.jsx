import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import Logo from '../components/Logo';
import { CheckCircle2, AlertCircle, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Missing email verification token.');
        return;
      }

      try {
        const res = await authAPI.verifyEmail(token);
        setStatus('success');
        setMessage(res.data?.message || 'Email address successfully verified!');
      } catch (err) {
        console.error('Email verification error:', err);
        setStatus('error');
        setMessage(err.response?.data?.message || 'Invalid or expired email verification link.');
      }
    };

    verifyToken();
  }, [token]);

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
          maxWidth: '480px',
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

        {status === 'verifying' && (
          <div style={{ padding: '2rem 0' }}>
            <Loader2 size={48} color="#0B3B91" className="animate-spin" style={{ margin: '0 auto 1.25rem' }} />
            <h3 style={{ fontSize: '1.35rem', color: '#0F172A', fontWeight: '800', fontFamily: 'Outfit, sans-serif' }}>
              Verifying Email Address...
            </h3>
            <p style={{ color: '#64748B', fontSize: '0.92rem', marginTop: '0.5rem' }}>
              Please wait while we confirm your email verification token with SS Matrimony servers.
            </p>
          </div>
        )}

        {status === 'success' && (
          <div style={{ padding: '1rem 0' }}>
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: '#ECFDF5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                border: '2px solid #A7F3D0',
                boxShadow: '0 10px 25px rgba(5, 150, 105, 0.2)',
              }}
            >
              <CheckCircle2 size={42} color="#059669" />
            </div>

            <h3 style={{ fontSize: '1.6rem', color: '#0F172A', fontWeight: '800', fontFamily: 'Outfit, sans-serif' }}>
              Email Verified <span style={{ color: '#0B3B91' }}>Successfully!</span>
            </h3>
            <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.6', margin: '0.75rem 0 2rem' }}>
              {message} Your SS Matrimony account is now fully active with verified badge credentials.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link
                to="/dashboard"
                className="btn-gold"
                style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', borderRadius: '50px', fontSize: '0.95rem' }}
              >
                Go to My Dashboard <ArrowRight size={18} />
              </Link>
              <Link
                to="/profiles"
                className="btn-secondary"
                style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', borderRadius: '50px', fontSize: '0.9rem' }}
              >
                Explore Verified Profiles
              </Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div style={{ padding: '1rem 0' }}>
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
              <AlertCircle size={42} color="#DC2626" />
            </div>

            <h3 style={{ fontSize: '1.5rem', color: '#0F172A', fontWeight: '800', fontFamily: 'Outfit, sans-serif' }}>
              Verification Failed
            </h3>
            <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: '1.6', margin: '0.75rem 0 2rem' }}>
              {message}
            </p>

            <Link
              to="/login"
              className="btn-gold"
              style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', borderRadius: '50px' }}
            >
              Return to Login Page
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
