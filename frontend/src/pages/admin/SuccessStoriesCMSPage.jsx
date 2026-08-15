import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import Toast from '../../components/Toast';
import {
  Sparkles,
  Heart,
  PlusCircle,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  ShieldCheck,
  Calendar,
  MapPin,
  FileText,
  Upload,
  Globe,
  Award,
  Clock,
  X,
} from 'lucide-react';

export default function SuccessStoriesCMSPage() {
  const [stories, setStories] = useState([]);
  const [stats, setStats] = useState({
    totalStories: 0,
    publishedStories: 0,
    draftStories: 0,
    featuredStories: 0,
    recentlyAdded: 0,
  });
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState({ type: '', text: '' });

  // Filters, Search & Pagination
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [featuredFilter, setFeaturedFilter] = useState('All');
  const [sortOption, setSortOption] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalFiltered, setTotalFiltered] = useState(0);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedStory, setSelectedStory] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    brideName: '',
    groomName: '',
    coupleNames: '',
    weddingDate: '',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    location: 'Hyderabad, Telangana',
    shortDescription: '',
    description: '',
    featuredImage: '',
    galleryText: '',
    rating: 5,
    displayOrder: 0,
    featured: false,
    status: 'Published',
    seoTitle: '',
    seoDescription: '',
  });

  const fetchStoriesData = async () => {
    try {
      setLoading(true);
      const params = {
        search,
        status: statusFilter,
        featured: featuredFilter === 'Featured' ? 'true' : featuredFilter === 'Non-Featured' ? 'false' : 'All',
        sort: sortOption,
        page,
        limit: 10,
      };
      const res = await adminAPI.getAdminStories(params);
      setStories(res.data.stories || []);
      setStats(res.data.stats || {});
      setTotalPages(res.data.totalPages || 1);
      setTotalFiltered(res.data.total || 0);
    } catch (err) {
      console.error('Error fetching admin success stories:', err);
      setToastMsg({ type: 'error', text: 'Failed to load success stories data.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStoriesData();
  }, [search, statusFilter, featuredFilter, sortOption, page]);

  const resetForm = () => {
    setFormData({
      title: '',
      brideName: '',
      groomName: '',
      coupleNames: '',
      weddingDate: '',
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      location: 'Hyderabad, Telangana',
      shortDescription: '',
      description: '',
      featuredImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      galleryText: '',
      rating: 5,
      displayOrder: 0,
      featured: false,
      status: 'Published',
      seoTitle: '',
      seoDescription: '',
    });
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleOpenEdit = (story) => {
    setSelectedStory(story);
    setFormData({
      title: story.title || '',
      brideName: story.brideName || '',
      groomName: story.groomName || '',
      coupleNames: story.coupleNames || '',
      weddingDate: story.weddingDate || '',
      city: story.city || 'Hyderabad',
      state: story.state || 'Telangana',
      country: story.country || 'India',
      location: story.location || 'Hyderabad, Telangana',
      shortDescription: story.shortDescription || '',
      description: story.description || story.story || '',
      featuredImage: story.featuredImage || story.coverImage || '',
      galleryText: Array.isArray(story.images) ? story.images.join('\n') : '',
      rating: story.rating || 5,
      displayOrder: story.displayOrder || 0,
      featured: story.featured || false,
      status: story.status || 'Published',
      seoTitle: story.seoTitle || '',
      seoDescription: story.seoDescription || '',
    });
    setShowEditModal(true);
  };

  const handleOpenView = (story) => {
    setSelectedStory(story);
    setShowViewModal(true);
  };

  const handleOpenDelete = (story) => {
    setSelectedStory(story);
    setShowDeleteModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.coupleNames && (!formData.brideName || !formData.groomName)) {
      setToastMsg({ type: 'error', text: 'Please provide couple names or bride/groom names.' });
      return;
    }

    try {
      setSubmitting(true);
      const galleryArray = formData.galleryText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        ...formData,
        coupleNames: formData.coupleNames || `${formData.groomName} & ${formData.brideName}`,
        location: `${formData.city}, ${formData.state}`,
        images: galleryArray.length > 0 ? galleryArray : [formData.featuredImage],
      };

      if (showEditModal && selectedStory) {
        await adminAPI.updateStory(selectedStory._id, payload);
        setToastMsg({ type: 'success', text: 'Success story updated successfully!' });
        setShowEditModal(false);
      } else {
        await adminAPI.addStory(payload);
        setToastMsg({ type: 'success', text: 'Success story published successfully!' });
        setShowAddModal(false);
      }

      fetchStoriesData();
    } catch (err) {
      console.error('Save story error:', err);
      setToastMsg({ type: 'error', text: err.response?.data?.message || 'Error saving success story.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (story) => {
    try {
      const res = await adminAPI.toggleStoryStatus(story._id);
      setToastMsg({
        type: 'success',
        text: `Story status updated to ${res.data.status}!`,
      });
      fetchStoriesData();
    } catch (err) {
      console.error('Toggle status error:', err);
    }
  };

  const handleToggleFeatured = async (story) => {
    try {
      const res = await adminAPI.toggleFeatureStory(story._id);
      setToastMsg({
        type: 'success',
        text: res.data.message,
      });
      fetchStoriesData();
    } catch (err) {
      console.error('Toggle featured error:', err);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedStory) return;
    try {
      setSubmitting(true);
      await adminAPI.deleteStory(selectedStory._id);
      setToastMsg({ type: 'success', text: 'Success story deleted permanently.' });
      setShowDeleteModal(false);
      fetchStoriesData();
    } catch (err) {
      console.error('Delete story error:', err);
      setToastMsg({ type: 'error', text: 'Failed to delete success story.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '1.5rem 2rem', fontFamily: 'Inter, sans-serif' }}>
      <Toast
        type={toastMsg.type}
        message={toastMsg.text}
        onClose={() => setToastMsg({ type: '', text: '' })}
      />

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Heart color="#D4A017" size={28} /> Success Stories CMS
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Publish, edit, feature, and manage real wedding stories on the public platform.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          style={{
            backgroundColor: '#0B3B91',
            color: '#FFFFFF',
            fontWeight: '700',
            fontSize: '0.9rem',
            padding: '0.75rem 1.4rem',
            borderRadius: '12px',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 14px rgba(11, 59, 145, 0.25)',
          }}
        >
          <PlusCircle size={18} /> Add Success Story
        </button>
      </div>

      {/* 1. TOP STAT CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase' }}>
            <span>Total Stories</span>
            <Heart size={18} color="#0B3B91" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0F172A', marginTop: '0.5rem' }}>
            {stats.totalStories || 0}
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase' }}>
            <span>Published</span>
            <CheckCircle size={18} color="#16A34A" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#16A34A', marginTop: '0.5rem' }}>
            {stats.publishedStories || 0}
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase' }}>
            <span>Drafts</span>
            <Clock size={18} color="#EA580C" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#EA580C', marginTop: '0.5rem' }}>
            {stats.draftStories || 0}
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase' }}>
            <span>Featured</span>
            <Star size={18} color="#D4A017" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#D4A017', marginTop: '0.5rem' }}>
            {stats.featuredStories || 0}
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase' }}>
            <span>Recently Added</span>
            <Sparkles size={18} color="#2563EB" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#2563EB', marginTop: '0.5rem' }}>
            {stats.recentlyAdded || 0}
          </div>
        </div>
      </div>

      {/* 2. SEARCH & FILTERS BAR */}
      <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '16px', border: '1px solid #E2E8F0', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#F8FAFC', padding: '0.6rem 1rem', borderRadius: '10px', border: '1px solid #CBD5E1', minWidth: '280px', flexGrow: 1 }}>
          <Search size={18} color="#64748B" />
          <input
            type="text"
            placeholder="Search couple name, bride, groom, or city..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{ background: 'none', border: 'none', outline: 'none', fontSize: '0.875rem', width: '100%', color: '#0F172A' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            style={{ padding: '0.6rem 0.85rem', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}
          >
            <option value="All">All Status</option>
            <option value="Published">Published Only</option>
            <option value="Draft">Drafts Only</option>
          </select>

          <select
            value={featuredFilter}
            onChange={(e) => { setFeaturedFilter(e.target.value); setPage(1); }}
            style={{ padding: '0.6rem 0.85rem', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}
          >
            <option value="All">All Featured</option>
            <option value="Featured">Featured Only</option>
            <option value="Non-Featured">Non-Featured</option>
          </select>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            style={{ padding: '0.6rem 0.85rem', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* 3. STORIES LIST TABLE */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 4px 14px rgba(0,0,0,0.02)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                <th style={{ padding: '1rem 1.25rem' }}>Couple Photo</th>
                <th style={{ padding: '1rem 1.25rem' }}>Couple Names</th>
                <th style={{ padding: '1rem 1.25rem' }}>Wedding Date</th>
                <th style={{ padding: '1rem 1.25rem' }}>Location</th>
                <th style={{ padding: '1rem 1.25rem' }}>Status</th>
                <th style={{ padding: '1rem 1.25rem' }}>Featured</th>
                <th style={{ padding: '1rem 1.25rem' }}>Created</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
                    Loading success stories from MongoDB...
                  </td>
                </tr>
              ) : stories.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
                    No success stories match your search or filter parameters.
                  </td>
                </tr>
              ) : (
                stories.map((s) => (
                  <tr key={s._id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '0.85rem 1.25rem' }}>
                      <img
                        src={s.featuredImage || s.images?.[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80'}
                        alt={s.coupleNames}
                        style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #CBD5E1' }}
                      />
                    </td>

                    <td style={{ padding: '0.85rem 1.25rem' }}>
                      <div style={{ fontWeight: '700', color: '#0F172A' }}>{s.coupleNames}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{s.title}</div>
                    </td>

                    <td style={{ padding: '0.85rem 1.25rem', color: '#334155' }}>
                      {s.weddingDate || 'N/A'}
                    </td>

                    <td style={{ padding: '0.85rem 1.25rem', color: '#334155' }}>
                      {s.location || 'N/A'}
                    </td>

                    <td style={{ padding: '0.85rem 1.25rem' }}>
                      <button
                        onClick={() => handleToggleStatus(s)}
                        style={{
                          backgroundColor: s.status === 'Published' ? '#DCFCE7' : '#FEF3C7',
                          color: s.status === 'Published' ? '#15803D' : '#B45309',
                          border: 'none',
                          padding: '0.3rem 0.65rem',
                          borderRadius: '20px',
                          fontWeight: '700',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                        }}
                      >
                        {s.status}
                      </button>
                    </td>

                    <td style={{ padding: '0.85rem 1.25rem' }}>
                      <button
                        onClick={() => handleToggleFeatured(s)}
                        style={{
                          backgroundColor: s.featured ? '#FEF08A' : '#F1F5F9',
                          color: s.featured ? '#854D0E' : '#64748B',
                          border: 'none',
                          padding: '0.3rem 0.65rem',
                          borderRadius: '20px',
                          fontWeight: '700',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                      >
                        <Star size={12} fill={s.featured ? '#854D0E' : 'none'} />
                        {s.featured ? 'Featured' : 'Standard'}
                      </button>
                    </td>

                    <td style={{ padding: '0.85rem 1.25rem', color: '#64748B', fontSize: '0.8rem' }}>
                      {new Date(s.createdAt).toLocaleDateString()}
                    </td>

                    <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem' }}>
                        <button
                          onClick={() => handleOpenView(s)}
                          title="View Details"
                          style={{ background: '#F1F5F9', border: 'none', padding: '0.45rem', borderRadius: '8px', cursor: 'pointer', color: '#334155' }}
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          onClick={() => handleOpenEdit(s)}
                          title="Edit Story"
                          style={{ background: '#E0F2FE', border: 'none', padding: '0.45rem', borderRadius: '8px', cursor: 'pointer', color: '#0369A1' }}
                        >
                          <Edit3 size={16} />
                        </button>

                        <button
                          onClick={() => handleOpenDelete(s)}
                          title="Delete Permanently"
                          style={{ background: '#FEE2E2', border: 'none', padding: '0.45rem', borderRadius: '8px', cursor: 'pointer', color: '#DC2626' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ color: '#64748B', fontSize: '0.85rem' }}>
            Showing {stories.length} of {totalFiltered} stories (Page {page} of {totalPages})
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              style={{ padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: page <= 1 ? '#F1F5F9' : '#FFFFFF', cursor: page <= 1 ? 'not-allowed' : 'pointer' }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              style={{ padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: page >= totalPages ? '#F1F5F9' : '#FFFFFF', cursor: page >= totalPages ? 'not-allowed' : 'pointer' }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* 4. ADD / EDIT STORY MODAL */}
      {(showAddModal || showEditModal) && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', maxWidth: '720px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #E2E8F0', pb: '1rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0F172A' }}>
                {showEditModal ? 'Edit Success Story' : 'Publish New Success Story'}
              </h2>
              <button onClick={() => { setShowAddModal(false); setShowEditModal(false); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.3rem' }}>Groom Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.groomName}
                    onChange={(e) => setFormData({ ...formData, groomName: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.3rem' }}>Bride Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sravani Rao"
                    value={formData.brideName}
                    onChange={(e) => setFormData({ ...formData, brideName: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.3rem' }}>Couple Display Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul & Sravani"
                  value={formData.coupleNames}
                  onChange={(e) => setFormData({ ...formData, coupleNames: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.3rem' }}>Wedding Date *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 14th February 2026"
                    value={formData.weddingDate}
                    onChange={(e) => setFormData({ ...formData, weddingDate: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.3rem' }}>City & State *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hyderabad, Telangana"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.3rem' }}>Cover Photo URL (JPG/PNG/WEBP) *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/photo-1610030469983-98e550d6193c..."
                  value={formData.featuredImage}
                  onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                />
                {formData.featuredImage && (
                  <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img src={formData.featuredImage} alt="Cover Preview" style={{ width: '80px', height: '60px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #CBD5E1' }} />
                    <span style={{ fontSize: '0.75rem', color: '#16A34A', fontWeight: '700' }}>✓ Cover Image Preview Loaded</span>
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.3rem' }}>
                  Optional Gallery Photos (One URL per line, max 10)
                </label>
                <textarea
                  rows="3"
                  placeholder="https://images.unsplash.com/photo-1..."
                  value={formData.galleryText}
                  onChange={(e) => setFormData({ ...formData, galleryText: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.3rem' }}>Full Story & Testimonial *</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Share how the couple met on SS Matrimony and their journey to the wedding..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.3rem' }}>Publish Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                  >
                    <option value="Published">Published (Live)</option>
                    <option value="Draft">Draft (Hidden)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.3rem' }}>Featured Story</label>
                  <select
                    value={formData.featured ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.value === 'true' })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                  >
                    <option value="false">Standard Story</option>
                    <option value="true">★ Mark as Featured</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.3rem' }}>Rating (1-5 Stars)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value, 10) || 5 })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setShowEditModal(false); }}
                  style={{ padding: '0.75rem 1.25rem', borderRadius: '10px', border: '1px solid #CBD5E1', backgroundColor: '#F8FAFC', fontWeight: '700', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ padding: '0.75rem 1.5rem', borderRadius: '10px', border: 'none', backgroundColor: '#0B3B91', color: '#FFFFFF', fontWeight: '700', cursor: 'pointer' }}
                >
                  {submitting ? 'Saving Story...' : showEditModal ? 'Save Changes' : 'Publish Story'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. VIEW STORY MODAL */}
      {showViewModal && selectedStory && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ backgroundColor: selectedStory.status === 'Published' ? '#DCFCE7' : '#FEF3C7', color: selectedStory.status === 'Published' ? '#15803D' : '#B45309', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800' }}>
                {selectedStory.status}
              </span>
              <button onClick={() => setShowViewModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={24} />
              </button>
            </div>

            <img
              src={selectedStory.featuredImage || selectedStory.images?.[0]}
              alt={selectedStory.coupleNames}
              style={{ width: '100%', height: '280px', objectFit: 'cover', borderRadius: '16px', marginBottom: '1.25rem' }}
            />

            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0F172A', marginBottom: '0.25rem' }}>
              {selectedStory.coupleNames}
            </h2>
            <div style={{ color: '#D4A017', fontSize: '0.9rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={16} /> {selectedStory.location} | <Calendar size={16} /> {selectedStory.weddingDate}
            </div>

            <p style={{ color: '#334155', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              {selectedStory.description || selectedStory.story}
            </p>

            {Array.isArray(selectedStory.images) && selectedStory.images.length > 1 && (
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569', marginBottom: '0.5rem' }}>Gallery Preview</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                  {selectedStory.images.slice(1).map((img, idx) => (
                    <img key={idx} src={img} alt="Gallery" style={{ width: '100%', height: '70px', borderRadius: '8px', objectFit: 'cover' }} />
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', color: '#94A3B8', fontSize: '0.75rem' }}>
              <span>Created By: {selectedStory.createdBy || 'Admin'}</span>
              <span>Date: {new Date(selectedStory.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* 6. DELETE CONFIRMATION MODAL */}
      {showDeleteModal && selectedStory && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', maxWidth: '440px', width: '100%', padding: '2rem', textAlign: 'center', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <Trash2 size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0F172A', marginBottom: '0.5rem' }}>
              Delete Success Story?
            </h3>
            <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Are you sure you want to permanently delete the success story for <strong>{selectedStory.coupleNames}</strong>? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={{ padding: '0.65rem 1.25rem', borderRadius: '10px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', fontWeight: '700', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={submitting}
                style={{ padding: '0.65rem 1.25rem', borderRadius: '10px', border: 'none', backgroundColor: '#DC2626', color: '#FFFFFF', fontWeight: '700', cursor: 'pointer' }}
              >
                {submitting ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
