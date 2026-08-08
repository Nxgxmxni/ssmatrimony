import React from 'react';
import { Check, X } from 'lucide-react';

export default function PasswordStrengthMeter({ password }) {
  const getChecks = (pwd) => {
    return {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
    };
  };

  const checks = getChecks(password || '');
  const passedCount = Object.values(checks).filter(Boolean).length;

  const getScoreColor = () => {
    if (passedCount <= 2) return '#ef4444'; // Red
    if (passedCount <= 4) return '#f59e0b'; // Amber / Gold
    return '#10b981'; // Green
  };

  const getScoreText = () => {
    if (!password) return '';
    if (passedCount <= 2) return 'Weak Password';
    if (passedCount <= 4) return 'Medium Strength';
    return 'Strong Password';
  };

  return (
    <div style={{ marginTop: '0.65rem' }}>
      {password && (
        <div style={{ marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '700', color: getScoreColor() }}>
            <span>{getScoreText()}</span>
            <span>{passedCount} / 5 Criteria</span>
          </div>
          <div style={{ height: '4px', backgroundColor: '#e2e8f0', borderRadius: '2px', overflow: 'hidden', marginTop: '0.25rem' }}>
            <div
              style={{
                height: '100%',
                width: `${(passedCount / 5) * 100}%`,
                backgroundColor: getScoreColor(),
                transition: 'all 0.3s ease',
              }}
            />
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem', fontSize: '0.72rem', color: '#64748b', marginTop: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: checks.length ? '#10b981' : '#94a3b8' }}>
          {checks.length ? <Check size={12} color="#10b981" /> : <X size={12} color="#94a3b8" />} At least 8 characters
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: checks.uppercase ? '#10b981' : '#94a3b8' }}>
          {checks.uppercase ? <Check size={12} color="#10b981" /> : <X size={12} color="#94a3b8" />} One uppercase letter (A-Z)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: checks.lowercase ? '#10b981' : '#94a3b8' }}>
          {checks.lowercase ? <Check size={12} color="#10b981" /> : <X size={12} color="#94a3b8" />} One lowercase letter (a-z)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: checks.number ? '#10b981' : '#94a3b8' }}>
          {checks.number ? <Check size={12} color="#10b981" /> : <X size={12} color="#94a3b8" />} One number (0-9)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: checks.special ? '#10b981' : '#94a3b8', gridColumn: 'span 2' }}>
          {checks.special ? <Check size={12} color="#10b981" /> : <X size={12} color="#94a3b8" />} One special character (!@#$%^&*)
        </div>
      </div>
    </div>
  );
}
