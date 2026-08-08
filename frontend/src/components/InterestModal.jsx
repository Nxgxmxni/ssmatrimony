import React, { useState } from 'react';
import { X, Heart, Send } from 'lucide-react';
import { interestAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function InterestModal({ targetProfile, onClose, onSuccess }) {
  const { isAuthenticated } = useAuth();
  const [message, setMessage] = useState(
    `Hi ${targetProfile?.fullName}, I found your matrimony profile interesting and would love to connect.`
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!targetProfile) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError('Please login to send an express interest request.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await interestAPI.sendInterest(targetProfile._id, message);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Express interest error:', err);
      setError(err.response?.data?.message || 'Failed to send interest request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '1rem'
    }}>
      <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '480px', padding: '1.75rem', position: 'relative' }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            color: '#6b7280'
          }}
        >
          <X size={22} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{
            background: '#fff0f3',
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Heart size={22} color="#800020" fill="#800020" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: '#800020' }}>Express Interest</h3>
            <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
              Connect with {targetProfile.fullName} ({targetProfile.age} yrs, {targetProfile.city})
            </div>
          </div>
        </div>

        {error && (
          <div style={{ backgroundColor: '#fde8e8', color: '#9b1c1c', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Personal Message</label>
            <textarea
              className="form-textarea"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write a polite note explaining why you'd like to connect..."
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="button" onClick={onClose} className="btn-secondary" style={{ padding: '0.6rem 1.25rem' }}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '0.6rem 1.5rem' }}>
              {loading ? 'Sending...' : <><Send size={16} /> Send Interest</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
