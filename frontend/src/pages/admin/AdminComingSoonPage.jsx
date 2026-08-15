import React from 'react';
import { Clock, ShieldAlert, Sparkles } from 'lucide-react';

export default function AdminComingSoonPage({ title, description, icon: IconComponent }) {
  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px' }}>
          {title}
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.925rem', marginTop: '0.2rem' }}>
          {description || `SS Matrimony System Administration Module: ${title}`}
        </p>
      </div>

      {/* CRM Placeholder Card */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          padding: '4rem 2rem',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.03)',
          textAlign: 'center',
          maxWidth: '680px',
          margin: '2rem auto 0',
        }}
      >
        <div
          style={{
            width: '68px',
            height: '68px',
            borderRadius: '20px',
            backgroundColor: '#EFF6FF',
            color: '#0B3B91',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            border: '1.5px solid #BFDBFE',
            boxShadow: '0 8px 20px rgba(11, 59, 145, 0.1)',
          }}
        >
          {IconComponent ? <IconComponent size={34} /> : <Clock size={34} />}
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            backgroundColor: '#FEF3C7',
            color: '#92400E',
            fontSize: '0.78rem',
            fontWeight: '800',
            padding: '0.35rem 0.9rem',
            borderRadius: '20px',
            marginBottom: '1rem',
            border: '1px solid #FDE68A',
          }}
        >
          <Sparkles size={14} color="#D4A017" fill="#D4A017" /> Phase 2 CRM Module
        </div>

        <h2 style={{ fontSize: '1.6rem', color: '#0F172A', fontWeight: '800', marginBottom: '0.75rem' }}>
          {title} Module Coming Soon
        </h2>

        <p style={{ fontSize: '0.95rem', color: '#64748B', lineHeight: '1.6', maxWidth: '500px', margin: '0 auto 2rem' }}>
          This administration module is scheduled for full deployment in Phase 2. The core system architecture, routing, and role-based permissions are active and secure.
        </p>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#166534', backgroundColor: '#DCFCE7', padding: '0.65rem 1.25rem', borderRadius: '30px', fontWeight: '700', border: '1px solid #86EFAC' }}>
          ✓ Role-Based JWT Route Protection Enforced
        </div>
      </div>
    </div>
  );
}
