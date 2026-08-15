import React from 'react';
import { ShieldCheck, Heart, Lock } from 'lucide-react';

export default function MemberFooter() {
  return (
    <footer
      style={{
        backgroundColor: '#0F172A',
        color: '#94A3B8',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '1.5rem 0',
        fontSize: '0.85rem',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Heart size={16} color="#D4AF37" fill="#D4AF37" />
          <span style={{ fontWeight: '700', color: '#FFFFFF' }}>SS Matrimony Member Portal</span>
          <span style={{ color: '#64748B' }}>• Confidential Managed Matrimonial Platform</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#CBD5E1' }}>
            <ShieldCheck size={14} color="#22C55E" /> 100% ID Verified Profiles
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#CBD5E1' }}>
            <Lock size={14} color="#D4AF37" /> Strict Contact Privacy
          </span>
          <span>© 2026 SS Matrimony. All Rights Reserved.</span>
        </div>
      </div>
    </footer>
  );
}
