import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { ShieldCheck, Users, Heart, Award, CheckCircle, XCircle, PlusCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'stories'

  // New Story Form State
  const [storyForm, setStoryForm] = useState({
    coupleNames: '',
    weddingDate: '',
    story: '',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80',
    location: 'India',
  });
  const [storyMsg, setStoryMsg] = useState('');

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getUsers(),
      ]);
      setStats(statsRes.data);
      setUsersList(usersRes.data || []);
    } catch (err) {
      console.error('Admin data error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleVerify = async (profileId) => {
    if (!profileId) return;
    try {
      await adminAPI.toggleVerify(profileId);
      fetchAdminData();
    } catch (err) {
      console.error('Toggle verify error:', err);
    }
  };

  const handleAddStory = async (e) => {
    e.preventDefault();
    try {
      setStoryMsg('');
      await adminAPI.addStory(storyForm);
      setStoryMsg('Success story published!');
      setStoryForm({
        coupleNames: '',
        weddingDate: '',
        story: '',
        image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80',
        location: 'India',
      });
    } catch (err) {
      console.error('Add story error:', err);
      setStoryMsg('Failed to publish success story.');
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2.2rem', color: '#800020', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <ShieldCheck size={28} color="#d4af37" /> SS Matrimony Admin Console
        </h2>
        <p style={{ color: '#6b7280' }}>Platform analytics, profile verifications, and success story management</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>Loading system metrics...</div>
      ) : (
        <>
          {/* Stats Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
            <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <Users size={28} color="#800020" style={{ marginBottom: '0.2rem' }} />
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#800020' }}>{stats?.totalUsers}</div>
              <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>Total Accounts</div>
            </div>

            <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <Heart size={28} color="#d4af37" style={{ marginBottom: '0.2rem' }} />
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#800020' }}>{stats?.totalBrides} / {stats?.totalGrooms}</div>
              <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>Brides / Grooms</div>
            </div>

            <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <ShieldCheck size={28} color="#137333" style={{ marginBottom: '0.2rem' }} />
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#800020' }}>{stats?.verifiedProfiles}</div>
              <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>Verified Badges</div>
            </div>

            <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <Award size={28} color="#b8860b" style={{ marginBottom: '0.2rem' }} />
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#800020' }}>{stats?.acceptedInterests}</div>
              <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>Successful Matches</div>
            </div>
          </div>

          {/* Sub Navigation */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <button
              onClick={() => setActiveTab('users')}
              className={activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}
            >
              User Management ({usersList.length})
            </button>
            <button
              onClick={() => setActiveTab('stories')}
              className={activeTab === 'stories' ? 'btn-primary' : 'btn-secondary'}
            >
              Publish Success Story
            </button>
          </div>

          {/* Users Table */}
          {activeTab === 'users' && (
            <div className="glass-card" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#2c0814', color: '#ffffff' }}>
                    <th style={{ padding: '0.85rem 1rem' }}>User Email</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Full Name</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Gender</th>
                    <th style={{ padding: '0.85rem 1rem' }}>City</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Role</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Verification</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map(({ user: u, profile: p }) => (
                    <tr key={u._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: '600' }}>{u.email}</td>
                      <td style={{ padding: '0.85rem 1rem' }}>{p?.fullName || 'N/A'}</td>
                      <td style={{ padding: '0.85rem 1rem', textTransform: 'capitalize' }}>{p?.gender || 'N/A'}</td>
                      <td style={{ padding: '0.85rem 1rem' }}>{p?.city || 'N/A'}</td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: '700', color: u.role === 'admin' ? '#800020' : '#4b5563' }}>{u.role}</td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        {p?.isVerified ? (
                          <span style={{ color: '#137333', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                            <CheckCircle size={15} /> Verified
                          </span>
                        ) : (
                          <span style={{ color: '#6b7280' }}>Unverified</span>
                        )}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        {p && (
                          <button
                            onClick={() => handleToggleVerify(p._id)}
                            style={{
                              backgroundColor: p.isVerified ? '#fde8e8' : '#e6f4ea',
                              color: p.isVerified ? '#c5221f' : '#137333',
                              border: 'none',
                              padding: '0.35rem 0.7rem',
                              borderRadius: '6px',
                              fontWeight: '600',
                              fontSize: '0.8rem'
                            }}
                          >
                            {p.isVerified ? 'Remove Badge' : 'Grant Verified'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Add Success Story Tab */}
          {activeTab === 'stories' && (
            <div className="glass-card" style={{ padding: '2rem', maxWidth: '600px' }}>
              <h3 style={{ fontSize: '1.3rem', color: '#800020', marginBottom: '1.25rem' }}>Publish Wedding Announcement</h3>

              {storyMsg && (
                <div style={{ backgroundColor: '#e6f4ea', color: '#137333', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontWeight: '600' }}>
                  {storyMsg}
                </div>
              )}

              <form onSubmit={handleAddStory} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Couple Names</label>
                  <input type="text" className="form-input" value={storyForm.coupleNames} onChange={(e) => setStoryForm({ ...storyForm, coupleNames: e.target.value })} placeholder="e.g. Ankit & Neha" required />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Wedding Date</label>
                  <input type="text" className="form-input" value={storyForm.weddingDate} onChange={(e) => setStoryForm({ ...storyForm, weddingDate: e.target.value })} placeholder="e.g. 10th January 2026" required />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Location</label>
                  <input type="text" className="form-input" value={storyForm.location} onChange={(e) => setStoryForm({ ...storyForm, location: e.target.value })} placeholder="e.g. Delhi NCR" />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Photo Image URL</label>
                  <input type="text" className="form-input" value={storyForm.image} onChange={(e) => setStoryForm({ ...storyForm, image: e.target.value })} required />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Couple Story / Testimonial</label>
                  <textarea rows={4} className="form-textarea" value={storyForm.story} onChange={(e) => setStoryForm({ ...storyForm, story: e.target.value })} required />
                </div>

                <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem', justifyContent: 'center' }}>
                  <PlusCircle size={18} /> Publish Story
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
}
