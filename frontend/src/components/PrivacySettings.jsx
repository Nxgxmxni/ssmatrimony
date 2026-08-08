import React, { useState } from 'react';
import { profileAPI } from '../services/api';
import { Lock, EyeOff, ShieldAlert, Save } from 'lucide-react';

export default function PrivacySettings({ profile, onProfileUpdated }) {
  const [privacy, setPrivacy] = useState({
    hidePhone: profile?.privacy?.hidePhone || false,
    hideEmail: profile?.privacy?.hideEmail || false,
    hideFromSearch: profile?.privacy?.hideFromSearch || false,
    photoPrivacy: profile?.privacy?.photoPrivacy || 'Public',
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setPrivacy((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMsg('');
      await profileAPI.updatePrivacy(privacy);
      setMsg('Privacy preferences updated successfully!');
      if (onProfileUpdated) onProfileUpdated();
    } catch (err) {
      console.error('Save privacy error:', err);
      setMsg('Failed to update privacy settings.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card" style={{ padding: '1.75rem' }}>
      <h3 style={{ fontSize: '1.25rem', color: '#800020', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Lock size={20} color="#d4af37" /> Privacy & Visibility Control
      </h3>
      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.5rem' }}>
        Manage who can view your contact information, photos, and profile search listing.
      </p>

      {msg && (
        <div style={{ backgroundColor: '#e6f4ea', color: '#137333', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.25rem', fontWeight: '600' }}>
          {msg}
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', backgroundColor: '#faf6f0', borderRadius: '8px' }}>
          <div>
            <div style={{ fontWeight: '700', color: '#1f2937', fontSize: '0.95rem' }}>Hide Mobile Phone Number</div>
            <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Phone number will be hidden from public view</div>
          </div>
          <input
            type="checkbox"
            name="hidePhone"
            checked={privacy.hidePhone}
            onChange={handleChange}
            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', backgroundColor: '#faf6f0', borderRadius: '8px' }}>
          <div>
            <div style={{ fontWeight: '700', color: '#1f2937', fontSize: '0.95rem' }}>Hide Email Address</div>
            <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Email address will not be displayed on public profile</div>
          </div>
          <input
            type="checkbox"
            name="hideEmail"
            checked={privacy.hideEmail}
            onChange={handleChange}
            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', backgroundColor: '#faf6f0', borderRadius: '8px' }}>
          <div>
            <div style={{ fontWeight: '700', color: '#1f2937', fontSize: '0.95rem' }}>Hide Profile from Search Results</div>
            <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Temporarily hide your profile from search gallery</div>
          </div>
          <input
            type="checkbox"
            name="hideFromSearch"
            checked={privacy.hideFromSearch}
            onChange={handleChange}
            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
          />
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label style={{ fontWeight: '700', color: '#1f2937' }}>Photo Privacy</label>
          <select name="photoPrivacy" value={privacy.photoPrivacy} onChange={handleChange} className="form-select">
            <option value="Public">Visible to All Registered Members</option>
            <option value="ConnectedOnly">Visible Only to Accepted Connections</option>
          </select>
        </div>

        <div style={{ marginTop: '0.5rem' }}>
          <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '0.75rem 1.75rem' }}>
            <Save size={18} /> {loading ? 'Saving...' : 'Save Privacy Preferences'}
          </button>
        </div>
      </form>
    </div>
  );
}
