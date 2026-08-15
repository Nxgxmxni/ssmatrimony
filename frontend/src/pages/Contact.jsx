import React, { useState } from 'react';
import { Phone, Mail, Clock, Send, CheckCircle2, MessageSquare, HelpCircle, Users } from 'lucide-react';
import { adminAPI } from '../services/api';

// Official SS Matrimony Contact Details
const CUSTOMER_SUPPORT_PHONE = "+91 78930 69580";
const WHATSAPP_SUPPORT_PHONE = "+91 78930 69580";
const SUPPORT_EMAIL = "ssmatrimony2018@gmail.com";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [subjectError, setSubjectError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject) {
      setSubjectError('Please select a subject.');
      return;
    }
    setSubjectError('');
    setApiError('');
    setLoading(true);

    try {
      await adminAPI.submitContact(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      console.error('Contact Form Submit Error:', err);
      setApiError(err.response?.data?.message || 'Failed to submit message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Banner */}
      <section style={{ background: 'linear-gradient(135deg, #002266 0%, #003399 60%, #0284c7 100%)', color: 'white', padding: '3.5rem 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3rem)', color: '#ffffff', fontWeight: '800', marginBottom: '0.75rem' }}>
            Contact Us
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#e0f2fe' }}>
            We're here to assist you throughout your matrimonial journey. Reach out to our dedicated relationship team.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="container" style={{ padding: '3.5rem 1.5rem 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
        {/* Contact Info Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Customer Helpline */}
          <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ background: '#eff6ff', padding: '0.75rem', borderRadius: '12px' }}>
              <Phone size={24} color="#003399" />
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem', color: '#003399', marginBottom: '0.2rem' }}>Customer Helpline</h4>
              <div style={{ fontWeight: '700', fontSize: '1.1rem', color: '#0f172a' }}>📞 {CUSTOMER_SUPPORT_PHONE}</div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>
                Call us for profile registration, matchmaking assistance, premium membership and customer support.
              </div>
            </div>
          </div>

          {/* WhatsApp Support */}
          <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ background: '#e0f2fe', padding: '0.75rem', borderRadius: '12px' }}>
              <MessageSquare size={24} color="#0284c7" />
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem', color: '#003399', marginBottom: '0.2rem' }}>WhatsApp Support</h4>
              <div style={{ fontWeight: '700', fontSize: '1.1rem', color: '#0f172a' }}>📱 {WHATSAPP_SUPPORT_PHONE}</div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>
                Chat with our relationship team for quick assistance.
              </div>
            </div>
          </div>

          {/* Email Support */}
          <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ background: '#eff6ff', padding: '0.75rem', borderRadius: '12px' }}>
              <Mail size={24} color="#003399" />
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem', color: '#003399', marginBottom: '0.2rem' }}>Email Support</h4>
              <div style={{ fontWeight: '700', fontSize: '1rem', color: '#0f172a' }}>📧 {SUPPORT_EMAIL}</div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>
                We usually respond within one business day.
              </div>
            </div>
          </div>

          {/* Relationship Support */}
          <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ background: '#e0f2fe', padding: '0.75rem', borderRadius: '12px' }}>
              <Users size={24} color="#0284c7" />
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem', color: '#003399', marginBottom: '0.4rem' }}>Relationship Support</h4>
              <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: '1.5', marginBottom: '0.75rem' }}>
                SS Matrimony provides personalized matchmaking assistance through phone, WhatsApp, email and online meetings for Telugu families worldwide.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem', color: '#003399', fontWeight: '600' }}>
                <li>• Personalized Guidance</li>
                <li>• Family Assistance</li>
                <li>• Online Support Available</li>
              </ul>
            </div>
          </div>

          {/* Working Hours */}
          <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ background: '#eff6ff', padding: '0.75rem', borderRadius: '12px' }}>
              <Clock size={24} color="#003399" />
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem', color: '#003399', marginBottom: '0.2rem' }}>Working Hours</h4>
              <div style={{ fontSize: '0.9rem', color: '#334155', lineHeight: '1.5' }}>
                <strong>Monday – Saturday:</strong> 9:30 AM – 6:30 PM<br />
                <strong>Sunday:</strong> Closed
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.5rem', color: '#003399', marginBottom: '0.5rem' }}>Send Us a Message</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Fill in the form below and our relationship team will get back to you promptly.
          </p>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#e0f2fe', borderRadius: '12px', color: '#0284c7' }}>
              <CheckCircle2 size={48} style={{ margin: '0 auto 1rem' }} />
              <h4 style={{ fontSize: '1.25rem', color: '#003399' }}>Message Received!</h4>
              <p style={{ marginTop: '0.5rem', color: '#0369a1' }}>
                Thank you for contacting SS Matrimony. Our team will reach out to you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    className="form-input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter your mobile number"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Subject *</label>
                <select
                  className="form-select"
                  value={formData.subject}
                  onChange={(e) => {
                    setFormData({ ...formData, subject: e.target.value });
                    if (e.target.value) setSubjectError('');
                  }}
                  required
                  style={{
                    borderColor: subjectError ? '#ef4444' : undefined
                  }}
                >
                  <option value="" disabled>Select a Subject</option>
                  <option value="New Registration">New Registration</option>
                  <option value="Profile Verification">Profile Verification</option>
                  <option value="Matchmaking Assistance">Matchmaking Assistance</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="General Enquiry">General Enquiry</option>
                  <option value="Feedback">Feedback</option>
                </select>
                {subjectError && (
                  <div style={{ color: '#ef4444', fontSize: '0.82rem', marginTop: '0.35rem', fontWeight: '600' }}>
                    {subjectError}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Message *</label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us how we can help you with your matrimonial journey..."
                  required
                />
              </div>

              <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.8rem', marginTop: '0.5rem' }}>
                {loading ? 'Sending Message...' : <><Send size={18} /> Submit Message</>}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom Section: Premium Trust Section */}
      <div className="container" style={{ marginTop: '3rem' }}>
        <div className="glass-card-gold" style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ fontSize: '1.05rem', color: '#0f172a', fontWeight: '600', maxWidth: '800px', margin: '0 auto 1.25rem', lineHeight: '1.6' }}>
            "Every enquiry is handled with complete privacy and confidentiality. Our relationship team is here to assist you throughout your matrimonial journey."
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.25rem', marginTop: '1rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '0.92rem', color: '#003399', background: '#ffffff', padding: '0.5rem 1.25rem', borderRadius: '50px', border: '1px solid rgba(212, 160, 23, 0.3)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              🔒 Your information is kept completely private and confidential.
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '0.92rem', color: '#003399', background: '#ffffff', padding: '0.5rem 1.25rem', borderRadius: '50px', border: '1px solid rgba(212, 160, 23, 0.3)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              💙 Dedicated support for Telugu families.
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '0.92rem', color: '#003399', background: '#ffffff', padding: '0.5rem 1.25rem', borderRadius: '50px', border: '1px solid rgba(212, 160, 23, 0.3)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              👨‍👩‍👧 Our relationship team is here to assist you throughout your matchmaking journey.
            </span>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container" style={{ marginTop: '3rem' }}>
        <div className="glass-card" style={{ padding: '2.5rem 2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <HelpCircle size={28} color="#003399" />
            <h3 style={{ fontSize: '1.5rem', color: '#003399' }}>Frequently Asked Questions</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', borderLeft: '4px solid #003399' }}>
              <h4 style={{ fontSize: '1rem', color: '#0f172a', fontWeight: '700', marginBottom: '0.5rem' }}>
                How quickly will I receive a response?
              </h4>
              <p style={{ fontSize: '0.9rem', color: '#475569', margin: 0 }}>
                Within one business day.
              </p>
            </div>
            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', borderLeft: '4px solid #D4A017' }}>
              <h4 style={{ fontSize: '1rem', color: '#0f172a', fontWeight: '700', marginBottom: '0.5rem' }}>
                Do I need to visit in person?
              </h4>
              <p style={{ fontSize: '0.9rem', color: '#475569', margin: 0 }}>
                No. Most consultations, profile discussions and matchmaking guidance are provided through phone, WhatsApp and online meetings, making the process convenient for families.
              </p>
            </div>
            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', borderLeft: '4px solid #0284c7' }}>
              <h4 style={{ fontSize: '1rem', color: '#0f172a', fontWeight: '700', marginBottom: '0.5rem' }}>
                Can families contact directly?
              </h4>
              <p style={{ fontSize: '0.9rem', color: '#475569', margin: 0 }}>
                Absolutely. We encourage family participation throughout the matchmaking journey.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



