import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import Logo from '../components/Logo';
import GoogleLoginButton from '../components/GoogleLoginButton';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';
import Toast from '../components/Toast';
import { User, Mail, Phone, Key, UserCheck, AlertCircle, Sparkles, ShieldCheck } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    gender: 'bride',
    profileManagedBy: 'Self',
    agreeTerms: false,
  });

  const [error, setError] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validations
    if (!formData.fullName || !formData.fullName.trim()) {
      return setError('Please enter your full name.');
    }

    if (!formData.email || !formData.email.trim()) {
      return setError('Please enter your email address.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      return setError('Please enter a valid email address.');
    }

    if (!formData.mobile || !formData.mobile.trim()) {
      return setError('Please enter your mobile number.');
    }

    if (!formData.password) {
      return setError('Please create a password.');
    }

    if (formData.password.length < 8) {
      return setError('Password must be at least 8 characters long.');
    }

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match. Please re-enter.');
    }

    if (!formData.agreeTerms) {
      return setError('You must agree to the Terms & Conditions and Privacy Policy to register.');
    }

    try {
      setLoading(true);
      const res = await authAPI.register({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile.trim(),
        password: formData.password,
      });

      login(
        res.data.token,
        res.data.refreshToken,
        res.data.user,
        res.data.profile
      );

      setToastMsg('Account created! Proceeding to Profile Setup...');
      setTimeout(() => {
        navigate('/onboarding');
      }, 600);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please check your information and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setLoading(true);
      const res = await authAPI.googleSignIn({
        email: 'google.newuser@example.com',
        name: 'New Google User',
        googleId: 'google-oauth-signup-999',
        picture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
        gender: formData.gender || 'bride',
      });

      login(
        res.data.token,
        res.data.refreshToken,
        { _id: res.data._id, fullName: res.data.fullName, email: res.data.email, role: res.data.role },
        res.data.profile
      );

      setToastMsg('Registered with Google successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 600);
    } catch (err) {
      console.error('Google Sign Up Error:', err);
      setError('Google Sign Up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #FAF9F6 0%, #EBF4FF 50%, #FFFFFF 100%)',
        minHeight: '92vh',
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
          maxWidth: '560px',
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
            Create Your Free <span style={{ color: '#0B3B91', fontFamily: 'serif', fontStyle: 'italic' }}>Profile</span>
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.92rem', marginTop: '0.35rem' }}>
            Join 10,000+ verified Telugu brides, grooms, and families
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

          {/* Full Name */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>
              Full Name
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} color="#D4AF37" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                name="fullName"
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
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Sravani Rao"
                required
              />
            </div>
          </div>

          {/* Email & Mobile Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="#D4AF37" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  style={{
                    width: '100%',
                    paddingLeft: '2.75rem',
                    paddingRight: '1rem',
                    paddingTop: '0.75rem',
                    paddingBottom: '0.75rem',
                    borderRadius: '12px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>
                Mobile Number
              </label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} color="#D4AF37" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="tel"
                  name="mobile"
                  className="form-input"
                  style={{
                    width: '100%',
                    paddingLeft: '2.75rem',
                    paddingRight: '1rem',
                    paddingTop: '0.75rem',
                    paddingBottom: '0.75rem',
                    borderRadius: '12px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  required
                />
              </div>
            </div>
          </div>

          {/* Password & Strength Meter */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>
              Create Password
            </label>
            <div style={{ position: 'relative' }}>
              <Key size={18} color="#D4AF37" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                name="password"
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
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>
            {/* Real-time Password Strength Meter */}
            <PasswordStrengthMeter password={formData.password} />
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>
              Confirm Password
            </label>
            <div style={{ position: 'relative' }}>
              <ShieldCheck size={18} color="#D4AF37" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                name="confirmPassword"
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
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Terms Checkbox */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <input
              type="checkbox"
              id="agreeTerms"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              style={{ accentColor: '#0B3B91', width: '16px', height: '16px', marginTop: '3px', cursor: 'pointer' }}
            />
            <label htmlFor="agreeTerms" style={{ fontSize: '0.825rem', color: '#475569', lineHeight: '1.5', cursor: 'pointer' }}>
              I agree to the{' '}
              <Link to="/terms-conditions" style={{ color: '#0B3B91', fontWeight: '700' }}>
                Terms & Conditions
              </Link>{' '}
              and{' '}
              <Link to="/privacy-policy" style={{ color: '#0B3B91', fontWeight: '700' }}>
                Privacy Policy
              </Link>.
            </label>
          </div>

          {/* Register Button */}
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
            {loading ? 'Creating Account...' : <><UserCheck size={18} /> Register Free Account</>}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '1.75rem 0', gap: '0.85rem' }}>
          <div style={{ flexGrow: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
          <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: '700', letterSpacing: '1px' }}>OR</span>
          <div style={{ flexGrow: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
        </div>

        {/* Google OAuth Button */}
        <GoogleLoginButton onClick={handleGoogleSignUp} loading={loading} text="Sign Up with Google" />

        {/* Footer Login Link */}
        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: '#64748B' }}>
          Already registered on SS Matrimony?{' '}
          <Link to="/login" style={{ fontWeight: '800', color: '#0B3B91', textDecoration: 'none' }}>
            Member Login
          </Link>
        </div>
      </div>
    </div>
  );
}
