import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import Logo from '../components/Logo';
import GoogleLoginButton from '../components/GoogleLoginButton';
import Toast from '../components/Toast';
import { LogIn, Key, Mail, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      const res = await authAPI.login({ identifier, password });
      login(
        res.data.token,
        res.data.refreshToken,
        {
          _id: res.data._id,
          fullName: res.data.fullName,
          email: res.data.email,
          mobile: res.data.mobile,
          role: res.data.role,
          emailVerified: res.data.emailVerified,
        },
        res.data.profile
      );
      setToastMsg('Welcome back! Login successful.');
      const dest = res.data.role === 'admin' ? '/admin' : '/dashboard';
      setTimeout(() => {
        navigate(dest);
      }, 500);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid email/mobile or password credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleCredentialReceived = async (credential) => {
    try {
      setLoading(true);
      setError('');
      const res = await authAPI.googleSignIn({ credential });
      login(
        res.data.token,
        res.data.refreshToken,
        {
          _id: res.data._id,
          fullName: res.data.fullName,
          email: res.data.email,
          role: res.data.role,
        },
        res.data.profile
      );
      setToastMsg('Google Authentication successful!');
      
      const dest = res.data.role === 'admin'
        ? '/admin'
        : res.data.isNewUser
          ? '/onboarding'
          : '/dashboard';
          
      setTimeout(() => {
        navigate(dest);
      }, 500);
    } catch (err) {
      console.error('Google Sign-In error:', err);
      setError(err.response?.data?.message || 'Google Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleButtonClick = async () => {
    // If standard click without Google GIS popup (e.g. fallback or manual prompt)
    if (window.google?.accounts?.id) {
      try {
        window.google.accounts.id.prompt();
        return;
      } catch (err) {
        console.warn('Google prompt fallback:', err);
      }
    }
    setError('Please select your Google Account in the Google sign-in popup.');
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #FAF9F6 0%, #EBF4FF 50%, #FFFFFF 100%)',
        minHeight: '88vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        position: 'relative',
        overflow: 'hidden',
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
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-block', marginBottom: '0.85rem' }}>
            <Logo height={60} variant="light" />
          </div>
          <h2
            style={{
              fontSize: '1.85rem',
              color: '#0F172A',
              fontWeight: '800',
              fontFamily: 'Outfit, sans-serif',
            }}
          >
            Welcome <span style={{ color: '#0B3B91', fontFamily: 'serif', fontStyle: 'italic' }}>Back</span>
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.92rem', marginTop: '0.35rem' }}>
            Sign in to access your verified matches & proposals
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

        <form onSubmit={handleSubmit}>
          {/* Email / Mobile Input */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>
              Email Address or Mobile Phone
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#D4AF37" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
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
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. sravani@example.com or 9876543210"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '700', color: '#334155' }}>Password</label>
              <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: '#0B3B91', fontWeight: '700', textDecoration: 'none' }}>
                Forgot Password?
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <Key size={18} color="#D4AF37" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                style={{
                  width: '100%',
                  paddingLeft: '2.75rem',
                  paddingRight: '2.75rem',
                  paddingTop: '0.75rem',
                  paddingBottom: '0.75rem',
                  borderRadius: '12px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '0.95rem',
                  outline: 'none',
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748B',
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ accentColor: '#0B3B91', width: '16px', height: '16px', cursor: 'pointer' }}
            />
            <label htmlFor="remember" style={{ fontSize: '0.85rem', color: '#475569', cursor: 'pointer' }}>
              Keep me signed in on this device
            </label>
          </div>

          {/* Submit Button */}
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
            }}
          >
            {loading ? 'Signing In...' : <><LogIn size={18} /> Sign In</>}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '1.75rem 0', gap: '0.85rem' }}>
          <div style={{ flexGrow: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
          <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: '700', letterSpacing: '1px' }}>OR</span>
          <div style={{ flexGrow: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
        </div>

        {/* Real Google OAuth 2.0 Button */}
        <GoogleLoginButton
          onClick={handleGoogleButtonClick}
          onCredentialReceived={handleGoogleCredentialReceived}
          loading={loading}
          text="Continue with Google"
        />

        {/* Footer Register Link */}
        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: '#64748B' }}>
          Don't have an SS Matrimony account yet?{' '}
          <Link to="/register" style={{ fontWeight: '800', color: '#0B3B91', textDecoration: 'none' }}>
            Create Free Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
