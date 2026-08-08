import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import Logo from '../components/Logo';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';
import Toast from '../components/Toast';
import { Key, ShieldCheck, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      return setError('Passwords do not match. Please re-enter.');
    }

    try {
      setLoading(true);
      await authAPI.resetPassword({ token, newPassword });
      setSuccess(true);
      setToastMsg('Password has been reset successfully!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Reset password error:', err);
      setError(err.response?.data?.message || 'Invalid or expired password reset link.');
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
      <Toast type="success" message={toastMsg} onClose={() => setToastMsg('')} />

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
            Set New <span style={{ color: '#0B3B91', fontFamily: 'serif', fontStyle: 'italic' }}>Password</span>
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.92rem', marginTop: '0.35rem' }}>
            Choose a strong, secure password for your SS Matrimony account
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

        {success ? (
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
              Password Reset Complete!
            </h3>
            <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Your new password is now active. Redirecting to login page...
            </p>
            <Link
              to="/login"
              className="btn-gold"
              style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', borderRadius: '50px' }}
            >
              Proceed to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>
                New Password
              </label>
              <div style={{ position: 'relative' }}>
                <Key size={18} color="#D4AF37" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="password"
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
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              <PasswordStrengthMeter password={newPassword} />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>
                Confirm New Password
              </label>
              <div style={{ position: 'relative' }}>
                <ShieldCheck size={18} color="#D4AF37" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="password"
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
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
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
              {loading ? 'Updating Password...' : 'Reset & Save Password'}
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
                <ArrowLeft size={16} /> Return to Login Page
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
