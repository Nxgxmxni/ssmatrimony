import React from 'react';
import { ShieldCheck, Lock, FileText } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div style={{ paddingBottom: '4rem' }}>
      <section style={{ background: 'linear-gradient(135deg, #002266 0%, #003399 60%, #0284c7 100%)', color: 'white', padding: '3.5rem 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3rem)', color: '#ffffff', fontWeight: '800', marginBottom: '0.75rem' }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#e0f2fe' }}>
            Our commitment to protecting your personal data, contact information, and photographs.
          </p>
        </div>
      </section>

      <div className="container" style={{ padding: '3.5rem 1.5rem 0', maxWidth: '900px' }}>
        <div className="glass-card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', color: '#334155', lineHeight: '1.8' }}>
          <div>
            <h3 style={{ fontSize: '1.4rem', color: '#003399', marginBottom: '0.5rem' }}>1. Overview & Commitment</h3>
            <p>
              SS Matrimony ("We", "Our", or "Us") values your trust and is committed to maintaining strict confidentiality regarding all member data. This Privacy Policy details how we collect, store, process, and protect your personal information in compliance with the Indian Information Technology Act, 2000 and international privacy frameworks.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '1.4rem', color: '#003399', marginBottom: '0.5rem' }}>2. Information We Collect</h3>
            <p>
              To deliver matrimony matching services, we collect user-provided details including Full Name, Gender, Date of Birth, Email Address, Mobile Phone Number, Educational Qualification, Occupation, Annual Income, Family Background, Horoscope parameters, and Photograph uploads.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '1.4rem', color: '#003399', marginBottom: '0.5rem' }}>3. How We Use Your Data</h3>
            <p>
              Your data is processed strictly for matrimony profile creation, calculating compatibility match percentages, facilitating express interest connections, and verifying government identity documents. We do not sell or rent member contact lists to third-party telemarketers.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '1.4rem', color: '#003399', marginBottom: '0.5rem' }}>4. Member Privacy Settings</h3>
            <p>
              SS Matrimony empowers members with granular privacy controls:
            </p>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
              <li><strong>Hide Mobile Number:</strong> Prevent public display of phone contact info.</li>
              <li><strong>Hide Email Address:</strong> Prevent display of email info on public profiles.</li>
              <li><strong>Photo Privacy:</strong> Restrict photograph viewing to accepted connections only.</li>
              <li><strong>Hide from Search:</strong> Temporarily remove profile from public search results.</li>
            </ul>
          </div>

          <div>
            <h3 style={{ fontSize: '1.4rem', color: '#003399', marginBottom: '0.5rem' }}>5. Security & Cookie Policy</h3>
            <p>
              We implement industry-standard encryption, HTTP-Only secure cookies, and access tokens to safeguard member login sessions against unauthorized access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
