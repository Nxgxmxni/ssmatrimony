import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import Logo from '../../components/Logo';
import { ShieldCheck, Lock, Mail, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      const res = await authAPI.login({ identifier, password });

      // Verify explicit Admin Role Separation
      if (res.data.role !== 'admin') {
        setError('Access Denied: This login portal is restricted to SS Matrimony Administrators only.');
        setLoading(false);
        return;
      }

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

      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Admin Login Error:', err);
      setError(err.response?.data?.message || 'Invalid administrator email/mobile or password credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ backgroundColor: '#1E293B', borderRadius: '24px', maxWidth: '440px', width: '100%', padding: '2.5rem', boxShadow: '0 25px 60px rgba(0,0,0,0.5)', border: '1px solid #334155' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', padding: '0.8rem', borderRadius: '16px', backgroundColor: '#0B3B91', color: '#D4A017', marginBottom: '1rem' }}>
            <ShieldCheck size={36} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#FFFFFF', letterSpacing: '-0.5px' }}>
            SS Matrimony Admin Portal
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginTop: '0.35rem' }}>
            Restricted access for system administrators
          </p>
        </div>

        {error && (
          <div style={{ backgroundColor: '#451A03', border: '1px solid #92400E', color: '#FDE68A', padding: '0.85rem', borderRadius: '12px', fontSize: '0.85rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} flexShrink={0} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#CBD5E1', marginBottom: '0.35rem' }}>
              Admin Email or Mobile *
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#0F172A', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #475569' }}>
              <Mail size={18} color="#94A3B8" />
              <input
                type="text"
                placeholder="admin@ssmatrimony.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                style={{ background: 'none', border: 'none', outline: 'none', color: '#FFFFFF', fontSize: '0.9rem', width: '100%' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#CBD5E1', marginBottom: '0.35rem' }}>
              Admin Password *
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#0F172A', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #475569' }}>
              <Lock size={18} color="#94A3B8" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ background: 'none', border: 'none', outline: 'none', color: '#FFFFFF', fontSize: '0.9rem', width: '100%' }}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: '#D4A017',
              color: '#0F172A',
              fontWeight: '800',
              padding: '0.85rem',
              borderRadius: '12px',
              border: 'none',
              fontSize: '0.95rem',
              cursor: 'pointer',
              marginTop: '0.5rem',
              transition: 'background-color 0.2s',
            }}
          >
            {loading ? 'Authenticating Admin Credentials...' : 'Sign In to Admin Console →'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', borderTop: '1px solid #334155', paddingTop: '1.25rem' }}>
          <a href="/login" style={{ color: '#64748B', fontSize: '0.8rem', textDecoration: 'none' }}>
            ← Return to Member Portal Login
          </a>
        </div>
      </div>
    </div>
  );
}
