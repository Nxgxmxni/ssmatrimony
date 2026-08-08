import React from 'react';
import { FileText, CheckCircle2 } from 'lucide-react';

export default function TermsConditions() {
  return (
    <div style={{ paddingBottom: '4rem' }}>
      <section style={{ background: 'linear-gradient(135deg, #002266 0%, #003399 60%, #0284c7 100%)', color: 'white', padding: '3.5rem 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3rem)', color: '#ffffff', fontWeight: '800', marginBottom: '0.75rem' }}>
            Terms & Conditions
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#e0f2fe' }}>
            Terms of service governing the usage of SS Matrimony platform services.
          </p>
        </div>
      </section>

      <div className="container" style={{ padding: '3.5rem 1.5rem 0', maxWidth: '900px' }}>
        <div className="glass-card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', color: '#334155', lineHeight: '1.8' }}>
          <div>
            <h3 style={{ fontSize: '1.4rem', color: '#003399', marginBottom: '0.5rem' }}>1. Acceptance of Terms</h3>
            <p>
              By creating an account, browsing, or using SS Matrimony services, you agree to comply with and be bound by these Terms & Conditions. If you do not agree with any part of these terms, you should refrain from using this website.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '1.4rem', color: '#003399', marginBottom: '0.5rem' }}>2. Eligibility Criteria</h3>
            <p>
              Membership is strictly intended for individuals seeking matrimonial partnerships. Females must be at least 18 years of age and Males must be at least 21 years of age to register a profile.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '1.4rem', color: '#003399', marginBottom: '0.5rem' }}>3. Member Conduct & Authenticity</h3>
            <p>
              Members agree to provide authentic, truthful information during profile registration. Submitting fake credentials, misleading photographs, or impersonating another person is strictly prohibited and results in immediate account termination.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '1.4rem', color: '#003399', marginBottom: '0.5rem' }}>4. Safety & Respectful Interaction</h3>
            <p>
              Harassment, offensive language, or commercial solicitation over the messaging platform is strictly forbidden. SS Matrimony reserves the right to suspend any account violating safety guidelines.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
