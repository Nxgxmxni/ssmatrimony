import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import {
  ShieldCheck,
  Users,
  Heart,
  Award,
  CheckCircle,
  XCircle,
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Sparkles,
  X,
  Image as ImageIcon,
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [storiesList, setStoriesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'stories'

  // CMS Modal & Form State
  const [showModal, setShowModal] = useState(false);
  const [editingStory, setEditingStory] = useState(null);
  const [storyForm, setStoryForm] = useState({
    title: '',
    brideName: '',
    groomName: '',
    coupleNames: '',
    weddingDate: '',
    location: '',
    description: '',
    featuredImage: '',
    imagesText: '',
    status: 'Published',
    featured: false,
  });
  const [cmsMsg, setCmsMsg] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, storiesRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getUsers(),
        adminAPI.getAdminStories(),
      ]);
      setStats(statsRes.data);
      setUsersList(usersRes.data || []);
      setStoriesList(storiesRes.data || []);
    } catch (err) {
      console.error('Admin data fetch error:', err);
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

  const handleOpenAddModal = () => {
    setEditingStory(null);
    setStoryForm({
      title: '',
      brideName: '',
      groomName: '',
      coupleNames: '',
      weddingDate: '',
      location: 'Hyderabad, Telangana',
      description: '',
      featuredImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      imagesText: '',
      status: 'Published',
      featured: false,
    });
    setCmsMsg({ type: '', text: '' });
    setShowModal(true);
  };

  const handleOpenEditModal = (story) => {
    setEditingStory(story);
    setStoryForm({
      title: story.title || '',
      brideName: story.brideName || '',
      groomName: story.groomName || '',
      coupleNames: story.coupleNames || '',
      weddingDate: story.weddingDate || '',
      location: story.location || '',
      description: story.description || story.story || '',
      featuredImage: story.featuredImage || story.image || '',
      imagesText: Array.isArray(story.images) ? story.images.join('\n') : '',
      status: story.status || 'Published',
      featured: story.featured || false,
    });
    setCmsMsg({ type: '', text: '' });
    setShowModal(true);
  };

  const handleSaveStory = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setCmsMsg({ type: '', text: '' });

      const imagesArray = storyForm.imagesText
        ? storyForm.imagesText.split('\n').map((url) => url.trim()).filter(Boolean)
        : storyForm.featuredImage ? [storyForm.featuredImage] : [];

      const payload = {
        title: storyForm.title,
        brideName: storyForm.brideName,
        groomName: storyForm.groomName,
        coupleNames: storyForm.coupleNames || [storyForm.groomName, storyForm.brideName].filter(Boolean).join(' & '),
        weddingDate: storyForm.weddingDate,
        location: storyForm.location,
        description: storyForm.description,
        featuredImage: storyForm.featuredImage,
        images: imagesArray,
        status: storyForm.status,
        featured: storyForm.featured,
      };

      if (editingStory) {
        await adminAPI.updateStory(editingStory._id, payload);
        setCmsMsg({ type: 'success', text: 'Success story updated successfully!' });
      } else {
        await adminAPI.addStory(payload);
        setCmsMsg({ type: 'success', text: 'New success story created successfully!' });
      }

      setTimeout(() => {
        setShowModal(false);
        fetchAdminData();
      }, 600);
    } catch (err) {
      console.error('Save story error:', err);
      setCmsMsg({ type: 'error', text: err.response?.data?.message || 'Failed to save success story.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStoryStatus = async (storyId) => {
    try {
      await adminAPI.toggleStoryStatus(storyId);
      fetchAdminData();
    } catch (err) {
      console.error('Toggle status error:', err);
    }
  };

  const handleDeleteStory = async (storyId, coupleNames) => {
    if (!window.confirm(`Are you sure you want to delete the success story for "${coupleNames}"?`)) {
      return;
    }
    try {
      await adminAPI.deleteStory(storyId);
      fetchAdminData();
    } catch (err) {
      console.error('Delete story error:', err);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2.2rem', color: '#0B3B91', display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: '800' }}>
          <ShieldCheck size={32} color="#D4AF37" /> SS Matrimony Admin Console
        </h2>
        <p style={{ color: '#64748B', fontSize: '0.95rem', marginTop: '0.25rem' }}>
          Real-time user management, profile verification badges, and Success Stories CMS
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#0B3B91', fontWeight: '700' }}>
          Loading system metrics and MongoDB data...
        </div>
      ) : (
        <>
          {/* Metrics Overview */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
            <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center', borderRadius: '16px' }}>
              <Users size={28} color="#0B3B91" style={{ marginBottom: '0.2rem' }} />
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0F172A' }}>{stats?.totalUsers}</div>
              <div style={{ fontSize: '0.85rem', color: '#64748B' }}>Total Registered Accounts</div>
            </div>

            <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center', borderRadius: '16px' }}>
              <Heart size={28} color="#D4AF37" style={{ marginBottom: '0.2rem' }} />
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0F172A' }}>{stats?.totalBrides} / {stats?.totalGrooms}</div>
              <div style={{ fontSize: '0.85rem', color: '#64748B' }}>Brides / Grooms</div>
            </div>

            <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center', borderRadius: '16px' }}>
              <ShieldCheck size={28} color="#166534" style={{ marginBottom: '0.2rem' }} />
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0F172A' }}>{stats?.verifiedProfiles}</div>
              <div style={{ fontSize: '0.85rem', color: '#64748B' }}>Verified Member Badges</div>
            </div>

            <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center', borderRadius: '16px' }}>
              <Sparkles size={28} color="#D4AF37" style={{ marginBottom: '0.2rem' }} />
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0F172A' }}>{storiesList.length}</div>
              <div style={{ fontSize: '0.85rem', color: '#64748B' }}>Success Stories</div>
            </div>
          </div>

          {/* Module Tab Switcher */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.75rem', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.5rem' }}>
            <button
              onClick={() => setActiveTab('users')}
              style={{
                padding: '0.7rem 1.35rem',
                borderRadius: '12px',
                fontWeight: '700',
                fontSize: '0.925rem',
                backgroundColor: activeTab === 'users' ? '#0B3B91' : 'transparent',
                color: activeTab === 'users' ? '#FFFFFF' : '#475569',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                transition: 'all 0.2s ease',
              }}
            >
              <Users size={16} /> User Management ({usersList.length})
            </button>

            <button
              onClick={() => setActiveTab('stories')}
              style={{
                padding: '0.7rem 1.35rem',
                borderRadius: '12px',
                fontWeight: '700',
                fontSize: '0.925rem',
                backgroundColor: activeTab === 'stories' ? '#0B3B91' : 'transparent',
                color: activeTab === 'stories' ? '#FFFFFF' : '#475569',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                transition: 'all 0.2s ease',
              }}
            >
              <Sparkles size={16} /> Success Stories CMS ({storiesList.length})
            </button>
          </div>

          {/* TAB 1: USERS MANAGEMENT TABLE */}
          {activeTab === 'users' && (
            <div className="glass-card" style={{ overflowX: 'auto', borderRadius: '18px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#0B3B91', color: '#FFFFFF' }}>
                    <th style={{ padding: '0.9rem 1.1rem' }}>User Email</th>
                    <th style={{ padding: '0.9rem 1.1rem' }}>Full Name</th>
                    <th style={{ padding: '0.9rem 1.1rem' }}>Gender</th>
                    <th style={{ padding: '0.9rem 1.1rem' }}>City</th>
                    <th style={{ padding: '0.9rem 1.1rem' }}>Role</th>
                    <th style={{ padding: '0.9rem 1.1rem' }}>Verification</th>
                    <th style={{ padding: '0.9rem 1.1rem' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map(({ user: u, profile: p }) => (
                    <tr key={u._id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                      <td style={{ padding: '0.85rem 1.1rem', fontWeight: '600', color: '#1E293B' }}>{u.email}</td>
                      <td style={{ padding: '0.85rem 1.1rem', color: '#334155' }}>{p?.fullName || u.fullName || 'N/A'}</td>
                      <td style={{ padding: '0.85rem 1.1rem', textTransform: 'capitalize', color: '#475569' }}>{p?.gender || 'N/A'}</td>
                      <td style={{ padding: '0.85rem 1.1rem', color: '#475569' }}>{p?.city || 'N/A'}</td>
                      <td style={{ padding: '0.85rem 1.1rem', fontWeight: '700', color: u.role === 'admin' ? '#0B3B91' : '#475569' }}>{u.role}</td>
                      <td style={{ padding: '0.85rem 1.1rem' }}>
                        {p?.isVerified ? (
                          <span style={{ color: '#166534', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <CheckCircle size={15} /> Verified
                          </span>
                        ) : (
                          <span style={{ color: '#94A3B8' }}>Unverified</span>
                        )}
                      </td>
                      <td style={{ padding: '0.85rem 1.1rem' }}>
                        {p && (
                          <button
                            onClick={() => handleToggleVerify(p._id)}
                            style={{
                              backgroundColor: p.isVerified ? '#FEF2F2' : '#F0FDF4',
                              color: p.isVerified ? '#991B1B' : '#166534',
                              border: `1px solid ${p.isVerified ? '#FCA5A5' : '#86EFAC'}`,
                              padding: '0.35rem 0.75rem',
                              borderRadius: '20px',
                              fontWeight: '700',
                              fontSize: '0.78rem',
                              cursor: 'pointer',
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

          {/* TAB 2: SUCCESS STORIES CMS MODULE */}
          {activeTab === 'stories' && (
            <div>
              {/* Module Header Action */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                    Success Stories Management
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#64748B', margin: '0.2rem 0 0' }}>
                    Publish, edit, unpublish, or delete wedded couple stories displayed live on the website.
                  </p>
                </div>

                <button
                  onClick={handleOpenAddModal}
                  className="btn-gold"
                  style={{ padding: '0.7rem 1.35rem', fontSize: '0.9rem', borderRadius: '50px' }}
                >
                  <PlusCircle size={17} /> Add New Success Story
                </button>
              </div>

              {/* Stories List Table */}
              <div className="glass-card" style={{ overflowX: 'auto', borderRadius: '18px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#0B3B91', color: '#FFFFFF' }}>
                      <th style={{ padding: '0.9rem 1.1rem' }}>Photo</th>
                      <th style={{ padding: '0.9rem 1.1rem' }}>Couple / Title</th>
                      <th style={{ padding: '0.9rem 1.1rem' }}>Wedding Date & Location</th>
                      <th style={{ padding: '0.9rem 1.1rem' }}>Featured</th>
                      <th style={{ padding: '0.9rem 1.1rem' }}>Status</th>
                      <th style={{ padding: '0.9rem 1.1rem' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {storiesList.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
                          No success stories found in MongoDB. Click "Add New Success Story" to publish one.
                        </td>
                      </tr>
                    ) : (
                      storiesList.map((story) => (
                        <tr key={story._id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                          <td style={{ padding: '0.85rem 1.1rem' }}>
                            <img
                              src={story.featuredImage || story.images?.[0] || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=150&q=80'}
                              alt={story.coupleNames}
                              style={{ width: '54px', height: '54px', borderRadius: '10px', objectFit: 'cover', border: '1.5px solid #D4AF37' }}
                            />
                          </td>

                          <td style={{ padding: '0.85rem 1.1rem' }}>
                            <div style={{ fontWeight: '800', color: '#0B3B91' }}>{story.coupleNames}</div>
                            {story.title && (
                              <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '0.15rem' }}>{story.title}</div>
                            )}
                          </td>

                          <td style={{ padding: '0.85rem 1.1rem', color: '#334155' }}>
                            <div style={{ fontWeight: '600' }}>{story.weddingDate}</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748B' }}>{story.location}</div>
                          </td>

                          <td style={{ padding: '0.85rem 1.1rem' }}>
                            {story.featured ? (
                              <span style={{ backgroundColor: '#FEF3C7', color: '#92400E', padding: '0.25rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Star size={12} fill="#D4AF37" color="#D4AF37" /> Featured
                              </span>
                            ) : (
                              <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>Standard</span>
                            )}
                          </td>

                          <td style={{ padding: '0.85rem 1.1rem' }}>
                            {story.status === 'Published' ? (
                              <span style={{ backgroundColor: '#DCFCE7', color: '#166534', padding: '0.25rem 0.65rem', borderRadius: '12px', fontSize: '0.78rem', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Eye size={13} /> Published
                              </span>
                            ) : (
                              <span style={{ backgroundColor: '#F1F5F9', color: '#64748B', padding: '0.25rem 0.65rem', borderRadius: '12px', fontSize: '0.78rem', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                <EyeOff size={13} /> Draft
                              </span>
                            )}
                          </td>

                          <td style={{ padding: '0.85rem 1.1rem' }}>
                            <div style={{ display: 'flex', gap: '0.4rem' }}>
                              <button
                                onClick={() => handleOpenEditModal(story)}
                                title="Edit Story"
                                style={{
                                  backgroundColor: '#EFF6FF',
                                  color: '#1D4ED8',
                                  border: '1px solid #BFDBFE',
                                  padding: '0.4rem 0.6rem',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.2rem',
                                  fontWeight: '700',
                                  fontSize: '0.78rem',
                                }}
                              >
                                <Edit size={14} /> Edit
                              </button>

                              <button
                                onClick={() => handleToggleStoryStatus(story._id)}
                                title={story.status === 'Published' ? 'Unpublish Story' : 'Publish Story'}
                                style={{
                                  backgroundColor: story.status === 'Published' ? '#FEF2F2' : '#F0FDF4',
                                  color: story.status === 'Published' ? '#991B1B' : '#166534',
                                  border: `1px solid ${story.status === 'Published' ? '#FCA5A5' : '#86EFAC'}`,
                                  padding: '0.4rem 0.6rem',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                  fontWeight: '700',
                                  fontSize: '0.78rem',
                                }}
                              >
                                {story.status === 'Published' ? 'Unpublish' : 'Publish'}
                              </button>

                              <button
                                onClick={() => handleDeleteStory(story._id, story.coupleNames)}
                                title="Delete Story"
                                style={{
                                  backgroundColor: '#FEF2F2',
                                  color: '#991B1B',
                                  border: '1px solid #FCA5A5',
                                  padding: '0.4rem 0.6rem',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                }}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* CREATE / EDIT SUCCESS STORY MODAL */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            zIndex: 2000,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '2.25rem',
              position: 'relative',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: '#F1F5F9',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748B',
              }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#0B3B91', marginBottom: '0.25rem' }}>
              {editingStory ? 'Edit Success Story' : 'Add New Success Story'}
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#64748B', marginBottom: '1.5rem' }}>
              Enter wedded couple details, wedding date, location, story description, and photos.
            </p>

            {cmsMsg.text && (
              <div
                style={{
                  backgroundColor: cmsMsg.type === 'success' ? '#DCFCE7' : '#FEF2F2',
                  color: cmsMsg.type === 'success' ? '#166534' : '#991B1B',
                  padding: '0.85rem 1rem',
                  borderRadius: '12px',
                  marginBottom: '1.25rem',
                  fontWeight: '700',
                  fontSize: '0.875rem',
                }}
              >
                {cmsMsg.text}
              </div>
            )}

            <form onSubmit={handleSaveStory}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label className="form-label" style={{ fontWeight: '700', fontSize: '0.85rem' }}>Groom Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={storyForm.groomName}
                    onChange={(e) => setStoryForm({ ...storyForm, groomName: e.target.value })}
                    placeholder="e.g. Kalyan"
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontWeight: '700', fontSize: '0.85rem' }}>Bride Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={storyForm.brideName}
                    onChange={(e) => setStoryForm({ ...storyForm, brideName: e.target.value })}
                    placeholder="e.g. Sravanthi"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ fontWeight: '700', fontSize: '0.85rem' }}>Couple Names Display Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={storyForm.coupleNames}
                  onChange={(e) => setStoryForm({ ...storyForm, coupleNames: e.target.value })}
                  placeholder="e.g. Kalyan & Sravanthi"
                  required
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ fontWeight: '700', fontSize: '0.85rem' }}>Headline Title (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  value={storyForm.title}
                  onChange={(e) => setStoryForm({ ...storyForm, title: e.target.value })}
                  placeholder="e.g. A Match Made in Tradition"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label className="form-label" style={{ fontWeight: '700', fontSize: '0.85rem' }}>Wedding Date</label>
                  <input
                    type="text"
                    className="form-input"
                    value={storyForm.weddingDate}
                    onChange={(e) => setStoryForm({ ...storyForm, weddingDate: e.target.value })}
                    placeholder="e.g. 15th December 2025"
                    required
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontWeight: '700', fontSize: '0.85rem' }}>Location</label>
                  <input
                    type="text"
                    className="form-input"
                    value={storyForm.location}
                    onChange={(e) => setStoryForm({ ...storyForm, location: e.target.value })}
                    placeholder="e.g. Hyderabad, Telangana"
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ fontWeight: '700', fontSize: '0.85rem' }}>Featured Main Image URL</label>
                <input
                  type="text"
                  className="form-input"
                  value={storyForm.featuredImage}
                  onChange={(e) => setStoryForm({ ...storyForm, featuredImage: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  required
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ fontWeight: '700', fontSize: '0.85rem' }}>Additional Photo URLs (One URL per line)</label>
                <textarea
                  rows={2}
                  className="form-textarea"
                  value={storyForm.imagesText}
                  onChange={(e) => setStoryForm({ ...storyForm, imagesText: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label" style={{ fontWeight: '700', fontSize: '0.85rem' }}>Couple Story &amp; Testimonial</label>
                <textarea
                  rows={4}
                  className="form-textarea"
                  value={storyForm.description}
                  onChange={(e) => setStoryForm({ ...storyForm, description: e.target.value })}
                  placeholder="Share how the couple connected on SS Matrimony and their wedding story..."
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label className="form-label" style={{ fontWeight: '700', fontSize: '0.85rem' }}>Publication Status</label>
                  <select
                    className="form-select"
                    value={storyForm.status}
                    onChange={(e) => setStoryForm({ ...storyForm, status: e.target.value })}
                  >
                    <option value="Published">Published (Visible on Website)</option>
                    <option value="Draft">Draft (Hidden from Public)</option>
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', paddingTop: '1.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: '700', fontSize: '0.875rem', color: '#334155' }}>
                    <input
                      type="checkbox"
                      checked={storyForm.featured}
                      onChange={(e) => setStoryForm({ ...storyForm, featured: e.target.checked })}
                      style={{ accentColor: '#0B3B91', width: '18px', height: '18px' }}
                    />
                    Set as Featured Story on Top Banner
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.85rem', paddingTop: '1rem', borderTop: '1px solid #E2E8F0' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                  style={{ padding: '0.7rem 1.5rem', borderRadius: '30px' }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-gold"
                  style={{ padding: '0.7rem 1.8rem', borderRadius: '30px' }}
                >
                  {submitting ? 'Saving...' : editingStory ? 'Update Story' : 'Publish Story'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
