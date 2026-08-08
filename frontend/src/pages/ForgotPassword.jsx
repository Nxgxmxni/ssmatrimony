import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import Logo from '../components/Logo';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, Send } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      const res = await authAPI.forgotPassword({ email });
      setSubmitted(true);
      if (res.data?.resetToken) {
        setResetToken(res.data.resetToken);
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setError(err.response?.data?.message || 'Failed to request password reset. Please check email.');
    } finally {
      setLoading(false);
    }
  };

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
          padding: '2.75rem 2.25rem',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '28px',
          border: '1.5px solid rgba(212, 175, 55, 0.45)',
          boxShadow: '0 25px 60px rgba(11, 59, 145, 0.12)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-block', marginBottom: '0.85rem' }}>
            <Logo height={44} variant="light" />
          </div>
          <h2
            style={{
              fontSize: '1.85rem',
              color: '#0F172A',
              fontWeight: '800',
              fontFamily: 'Outfit, sans-serif',
            }}
          >
            Forgot <span style={{ color: '#0B3B91', fontFamily: 'serif', fontStyle: 'italic' }}>Password?</span>
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.92rem', marginTop: '0.35rem' }}>
            Enter your registered email address to receive password reset instructions
          </p>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: '#FEF2F2',
              color: '#991B1B',
              border: '1px solid #FCA5A5',
              padding: '0.85rem 1rem',
              borderRadius: '12px',
              fontSize: '0.875rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: '600',
            }}
          >
            <AlertCircle size={18} color="#DC2626" />
            <span>{error}</span>
          </div>
        )}

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#ECFDF5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                border: '2px solid #A7F3D0',
              }}
            >
              <CheckCircle2 size={36} color="#059669" />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: '#0F172A', fontWeight: '700', marginBottom: '0.5rem' }}>
              Reset Link Issued!
            </h3>
            <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              We have dispatched password reset instructions to <strong>{email}</strong>. Please check your inbox and follow the steps provided.
            </p>

            {/* Local Dev Testing Quick Link */}
            {resetToken && (
              <div
                style={{
                  backgroundColor: '#FEF3C7',
                  border: '1px dashed #F59E0B',
                  borderRadius: '12px',
                  padding: '1rem',
                  fontSize: '0.825rem',
                  color: '#92400E',
                  marginBottom: '1.5rem',
                }}
              >
                <div style={{ fontWeight: '700', marginBottom: '0.35rem' }}>⚡ DEV QUICK ACCESS LINK</div>
                <Link
                  to={`/reset-password/${resetToken}`}
                  style={{ color: '#0B3B91', fontWeight: '800', wordBreak: 'break-all', textDecoration: 'underline' }}
                >
                  Click Here to Set New Password Now
                </Link>
              </div>
            )}

            <Link
              to="/login"
              className="btn-secondary"
              style={{ width: '100%', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem' }}
            >
              <ArrowLeft size={16} /> Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>
                Account Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="#D4AF37" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  className="form-input"
                  style={{
                    width: '100%',
                    paddingLeft: '2.75rem',
                    paddingRight: '1rem',
                    paddingTop: '0.75rem',
                    paddingBottom: '0.75rem',
                    borderRadius: '12px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '0.95rem',
                    outline: 'none',
                  }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '0.85rem',
                fontSize: '1rem',
                borderRadius: '50px',
                marginBottom: '1.25rem',
              }}
            >
              {loading ? 'Sending Instructions...' : <><Send size={18} /> Send Password Reset Link</>}
            </button>

            <div style={{ textAlign: 'center' }}>
              <Link
                to="/login"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  color: '#64748B',
                  fontSize: '0.875rem',
                  fontWeight: '700',
                  textDecoration: 'none',
                }}
              >
                <ArrowLeft size={16} /> Back to Member Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
