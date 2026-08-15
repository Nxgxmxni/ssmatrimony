import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, ShieldCheck, User, Lock, Heart } from 'lucide-react';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: 'How do I register a matrimony profile on SS Matrimony?',
      answer: 'Registration is 100% free and simple. Click on the "Register Free" button, choose who you are creating the profile for (Myself, Bride, Groom, Parent, Guardian, Sibling), enter your basic details, email, and mobile number. You can then complete the 6-step profile wizard to add details about education, career, family, and partner preferences.'
    },
    {
      question: 'How does the ID Verification process work?',
      answer: 'To earn the Verified Member Badge, upload a copy of your Government photo ID (Aadhaar Card, Passport, Driving License, or Voter ID). Our verification team manually reviews the document against your profile details to ensure authenticity before granting the badge.'
    },
    {
      question: 'Is my mobile phone number and photograph safe and private?',
      answer: 'Yes! SS Matrimony provides complete privacy controls. You can choose to hide your phone number and email address from public view, or set photo privacy to "Visible Only to Accepted Connections" from your Privacy Settings dashboard.'
    },
    {
      question: 'How are profile recommendations prioritized?',
      answer: 'Our smart recommendation algorithm orders profiles based on mutual parameters: age preferences, height range, religion, education alignment, marital status, and location preferences.'
    },
    {
      question: 'How does Express Interest and Messaging work?',
      answer: 'When you find a profile you like, click "Express Interest" to send a connection request. Once the recipient accepts your interest request, direct interactive messaging is automatically unlocked between both profiles.'
    },
    {
      question: 'Can parents or siblings manage a profile on behalf of a bride/groom?',
      answer: 'Absolutely. During registration, select "Parent", "Guardian", or "Sibling" under "Profile Managed By". You can enter contact details for family management while keeping the bride/groom candidate details distinct.'
    },
    {
      question: 'Do I need to visit in person?',
      answer: 'No. Most consultations, profile discussions and matchmaking guidance are provided through phone, WhatsApp and online meetings, making the process convenient for families.'
    }
  ];

  return (
    <div style={{ paddingBottom: '4rem' }}>
      <section style={{ background: 'linear-gradient(135deg, #002266 0%, #003399 60%, #0284c7 100%)', color: 'white', padding: '3.5rem 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3rem)', color: '#ffffff', fontWeight: '800', marginBottom: '0.75rem' }}>
            Frequently Asked Questions
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#e0f2fe' }}>
            Find answers to common questions about registration, privacy, verification, and matchmaking.
          </p>
        </div>
      </section>

      <div className="container" style={{ padding: '3.5rem 1.5rem 0', maxWidth: '840px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="glass-card"
                style={{
                  padding: '1.25rem 1.5rem',
                  cursor: 'pointer',
                  borderLeft: isOpen ? '4px solid #003399' : '4px solid transparent',
                  transition: 'all 0.2s ease',
                }}
                onClick={() => setOpenIndex(isOpen ? null : idx)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                  <h3 style={{ fontSize: '1.1rem', color: isOpen ? '#003399' : '#0f172a', fontWeight: '700' }}>
                    {faq.question}
                  </h3>
                  {isOpen ? <ChevronUp size={20} color="#003399" /> : <ChevronDown size={20} color="#64748b" />}
                </div>

                {isOpen && (
                  <p style={{ marginTop: '0.85rem', paddingTop: '0.85rem', borderTop: '1px solid #e2e8f0', color: '#475569', lineHeight: '1.7', fontSize: '0.95rem' }}>
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
