import React, { useState } from 'react';
import { profileAPI } from '../services/api';
import { ShieldCheck, Upload, FileText, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

export default function IdVerification({ profile, onProfileUpdated }) {
  const [docUrl, setDocUrl] = useState(profile?.idDocumentUrl || '');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const status = profile?.idVerificationStatus || 'Unverified';

  const handleUploadId = async (url) => {
    if (!url) return;
    try {
      setLoading(true);
      setMsg('');
      const res = await profileAPI.uploadIdDocument(url);
      setMsg('Government ID document submitted! Verification in progress.');
      if (onProfileUpdated) onProfileUpdated();
    } catch (err) {
      console.error('ID document upload error:', err);
      setMsg('Failed to submit ID document.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleUploadId(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="glass-card" style={{ padding: '1.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', color: '#800020', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={22} color="#d4af37" /> Government ID Verification
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.2rem' }}>
            Verified profiles display a blue badge and get 10x higher trust ratings from families.
          </p>
        </div>

        <div>
          {status === 'Verified' && (
            <span className="badge-verified" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
              <CheckCircle2 size={16} /> ID Verified
            </span>
          )}
          {status === 'Pending' && (
            <span style={{ backgroundColor: '#fff3c4', color: '#856404', padding: '0.4rem 0.8rem', borderRadius: '50px', fontSize: '0.85rem', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <Clock size={16} /> Review Pending
            </span>
          )}
          {status === 'Unverified' && (
            <span style={{ backgroundColor: '#fde8e8', color: '#c5221f', padding: '0.4rem 0.8rem', borderRadius: '50px', fontSize: '0.85rem', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <AlertCircle size={16} /> Unverified
            </span>
          )}
        </div>
      </div>

      {msg && (
        <div style={{ backgroundColor: '#e6f4ea', color: '#137333', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.25rem', fontWeight: '600' }}>
          {msg}
        </div>
      )}

      {status !== 'Verified' && (
        <div style={{ backgroundColor: '#faf6f0', border: '1px solid #d4af37', borderRadius: '12px', padding: '1.5rem', marginTop: '1rem' }}>
          <h4 style={{ color: '#800020', marginBottom: '0.5rem', fontSize: '1rem' }}>Upload ID Document (Aadhaar / Passport / Voter ID / Driving License)</h4>
          <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '1.25rem' }}>
            Your ID document is kept strictly confidential and is used only by our verification team.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <label className="btn-primary" style={{ cursor: 'pointer', padding: '0.6rem 1.25rem', fontSize: '0.875rem' }}>
              <Upload size={16} /> Select ID Image File
              <input type="file" accept="image/*,.pdf" onChange={handleFileInput} style={{ display: 'none' }} />
            </label>

            <div style={{ flexGrow: 1, display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Or paste ID Document Image URL"
                value={docUrl}
                onChange={(e) => setDocUrl(e.target.value)}
              />
              <button
                onClick={() => handleUploadId(docUrl)}
                disabled={loading || !docUrl}
                className="btn-gold"
                style={{ padding: '0.6rem 1.25rem', fontSize: '0.875rem', whiteSpace: 'nowrap' }}
              >
                Submit ID
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
