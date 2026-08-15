import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import {
  Heart,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  Phone,
  Mail,
  UserCheck,
  Sparkles,
  Calendar,
  MessageSquare,
  FileText,
  AlertCircle,
  X,
  ChevronRight,
  Eye,
  RefreshCw,
  User,
  Plus,
} from 'lucide-react';

export default function InterestManagementPage() {
  const [interests, setInterests] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
    underReview: 0,
    contactShared: 0,
    closed: 0,
  });
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Selected Interest Detail Modal State
  const [selectedInterestId, setSelectedInterestId] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Action / Note State inside Modal
  const [newNoteText, setNewNoteText] = useState('');
  const [noteCategory, setNoteCategory] = useState('Family contacted');
  const [actionLoading, setActionLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Meeting Details State
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingNotes, setMeetingNotes] = useState('');

  // Fetch Admin Interests List
  const fetchInterests = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getAdminInterests({
        status: activeFilter,
        search: searchQuery,
        page,
        limit: 10,
      });
      setInterests(res.data.interests || []);
      setStats(
        res.data.stats || {
          total: 0,
          pending: 0,
          accepted: 0,
          rejected: 0,
          underReview: 0,
          contactShared: 0,
          closed: 0,
        }
      );
      setTotalPages(res.data.pagination?.pages || 1);
    } catch (err) {
      console.error('Error fetching admin interests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterests();
  }, [activeFilter, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchInterests();
  };

  // Open Request Detail Drawer/Modal
  const handleOpenDetail = async (interestId) => {
    try {
      setSelectedInterestId(interestId);
      setLoadingDetail(true);
      const res = await adminAPI.getAdminInterestById(interestId);
      setDetailData(res.data);
    } catch (err) {
      console.error('Error fetching interest detail:', err);
    } finally {
      setLoadingDetail(false);
    }
  };

  // Execute Admin Action
  const handleAdminAction = async (action, extraData = {}) => {
    if (!selectedInterestId) return;

    if (action === 'share_contact') {
      const confirmShare = window.confirm(
        'Are you sure you want to Share Contact Details? This will allow the Bride and Groom to see each other\'s phone numbers on their dashboards.'
      );
      if (!confirmShare) return;
    }

    try {
      setActionLoading(true);
      await adminAPI.updateAdminInterestStatus(selectedInterestId, {
        action,
        ...extraData,
      });
      setSuccessMsg(`Action '${action}' executed successfully!`);
      setTimeout(() => setSuccessMsg(''), 3000);

      // Refresh Detail Data & Table
      const res = await adminAPI.getAdminInterestById(selectedInterestId);
      setDetailData(res.data);
      fetchInterests();
    } catch (err) {
      console.error('Admin action error:', err);
      alert(err.response?.data?.message || 'Failed to execute admin action');
    } finally {
      setActionLoading(false);
    }
  };

  // Add Admin Note
  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNoteText.trim() || !selectedInterestId) return;
    try {
      setActionLoading(true);
      await adminAPI.addAdminInterestNote(selectedInterestId, {
        text: newNoteText,
        category: noteCategory,
      });
      setNewNoteText('');
      const res = await adminAPI.getAdminInterestById(selectedInterestId);
      setDetailData(res.data);
    } catch (err) {
      console.error('Add note error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // Convert to Success Story
  const handleConvertToSuccessStory = async () => {
    if (!selectedInterestId) return;
    try {
      setActionLoading(true);
      const res = await adminAPI.convertInterestToSuccessStory(selectedInterestId, {});
      alert(`Success Story draft created! Story ID: ${res.data.story._id}`);
      fetchInterests();
    } catch (err) {
      console.error('Convert success story error:', err);
      alert('Failed to convert to success story');
    } finally {
      setActionLoading(false);
    }
  };

  // Status Badge Helper
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '30px',
              fontSize: '0.78rem',
              fontWeight: '700',
              backgroundColor: '#FEF3C7',
              color: '#92400E',
              border: '1px solid #F59E0B',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <Clock size={13} /> Pending Interest
          </span>
        );
      case 'accepted':
        return (
          <span
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '30px',
              fontSize: '0.78rem',
              fontWeight: '700',
              backgroundColor: '#DCFCE7',
              color: '#15803D',
              border: '1px solid #22C55E',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <Heart size={13} fill="#15803D" /> Mutual Interest (Accepted)
          </span>
        );
      case 'under_admin_review':
        return (
          <span
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '30px',
              fontSize: '0.78rem',
              fontWeight: '700',
              backgroundColor: '#EFF6FF',
              color: '#1D4ED8',
              border: '1px solid #3B82F6',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <ShieldCheck size={13} /> Under Admin Review
          </span>
        );
      case 'contact_shared':
        return (
          <span
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '30px',
              fontSize: '0.78rem',
              fontWeight: '700',
              backgroundColor: '#F0FDF4',
              color: '#166534',
              border: '1.5px solid #166534',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <Phone size={13} /> Contact Shared
          </span>
        );
      case 'rejected':
        return (
          <span
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '30px',
              fontSize: '0.78rem',
              fontWeight: '700',
              backgroundColor: '#FEE2E2',
              color: '#B91C1C',
              border: '1px solid #EF4444',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <XCircle size={13} /> Declined / Rejected
          </span>
        );
      case 'closed':
        return (
          <span
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '30px',
              fontSize: '0.78rem',
              fontWeight: '700',
              backgroundColor: '#F1F5F9',
              color: '#475569',
              border: '1px solid #94A3B8',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <CheckCircle2 size={13} /> Closed Case
          </span>
        );
      default:
        return status;
    }
  };

  return (
    <div style={{ padding: '1.75rem 2rem', color: '#0F172A' }}>
      {/* Header Title */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0B3B91 0%, #051329 100%)',
              border: '1.5px solid #D4A017',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#D4A017',
              boxShadow: '0 4px 14px rgba(11, 59, 145, 0.2)',
            }}
          >
            <Heart size={24} fill="#D4A017" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', margin: 0, color: '#0F172A' }}>
              Interest Management CRM
            </h1>
            <p style={{ color: '#64748B', fontSize: '0.92rem', margin: '0.2rem 0 0' }}>
              Manage matrimony interest requests, relationship team reviews, family contact approvals & cases.
            </p>
          </div>
        </div>
      </div>

      {/* DASHBOARD CARDS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        <div
          onClick={() => setActiveFilter('pending')}
          style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '1.25rem',
            border: activeFilter === 'pending' ? '2px solid #F59E0B' : '1px solid #E2E8F0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#B45309', textTransform: 'uppercase' }}>
            Pending Interests
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#D97706', marginTop: '0.35rem' }}>
            {stats.pending}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.2rem' }}>Awaiting Groom/Bride reply</div>
        </div>

        <div
          onClick={() => setActiveFilter('accepted')}
          style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '1.25rem',
            border: activeFilter === 'accepted' ? '2px solid #22C55E' : '1px solid #E2E8F0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#15803D', textTransform: 'uppercase' }}>
            Accepted (Mutual)
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#16A34A', marginTop: '0.35rem' }}>
            {stats.accepted}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.2rem' }}>Ready for Admin Review</div>
        </div>

        <div
          onClick={() => setActiveFilter('under_admin_review')}
          style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '1.25rem',
            border: activeFilter === 'under_admin_review' ? '2px solid #3B82F6' : '1px solid #E2E8F0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#1D4ED8', textTransform: 'uppercase' }}>
            Under Review
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#2563EB', marginTop: '0.35rem' }}>
            {stats.underReview}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.2rem' }}>Family contact in progress</div>
        </div>

        <div
          onClick={() => setActiveFilter('contact_shared')}
          style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '1.25rem',
            border: activeFilter === 'contact_shared' ? '2px solid #166534' : '1px solid #E2E8F0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#166534', textTransform: 'uppercase' }}>
            Contact Shared
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#15803D', marginTop: '0.35rem' }}>
            {stats.contactShared}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.2rem' }}>Phone details visible</div>
        </div>

        <div
          onClick={() => setActiveFilter('rejected')}
          style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '1.25rem',
            border: activeFilter === 'rejected' ? '2px solid #EF4444' : '1px solid #E2E8F0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#B91C1C', textTransform: 'uppercase' }}>
            Rejected Interests
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#DC2626', marginTop: '0.35rem' }}>
            {stats.rejected}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.2rem' }}>Declined by member/admin</div>
        </div>

        <div
          onClick={() => setActiveFilter('closed')}
          style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '1.25rem',
            border: activeFilter === 'closed' ? '2px solid #64748B' : '1px solid #E2E8F0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase' }}>
            Closed Cases
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#475569', marginTop: '0.35rem' }}>
            {stats.closed}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.2rem' }}>Completed matches</div>
        </div>
      </div>

      {/* FILTER TABS & SEARCH BAR */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          padding: '1.25rem 1.5rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          border: '1px solid #E2E8F0',
          marginBottom: '1.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem',
        }}
      >
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Requests' },
            { id: 'pending', label: 'Pending' },
            { id: 'accepted', label: 'Accepted (Mutual)' },
            { id: 'under_admin_review', label: 'Under Review' },
            { id: 'contact_shared', label: 'Contact Shared' },
            { id: 'rejected', label: 'Rejected' },
            { id: 'closed', label: 'Closed Cases' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveFilter(tab.id);
                setPage(1);
              }}
              style={{
                padding: '0.55rem 1.1rem',
                borderRadius: '30px',
                fontSize: '0.85rem',
                fontWeight: activeFilter === tab.id ? '700' : '500',
                backgroundColor: activeFilter === tab.id ? '#0B3B91' : '#F1F5F9',
                color: activeFilter === tab.id ? '#FFFFFF' : '#475569',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search ID, Bride or Groom..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '0.55rem 1rem 0.55rem 2.3rem',
                borderRadius: '30px',
                border: '1px solid #CBD5E1',
                fontSize: '0.85rem',
                outline: 'none',
                width: '230px',
              }}
            />
          </div>
          <button
            type="submit"
            className="btn-gold"
            style={{ padding: '0.55rem 1.1rem', borderRadius: '30px', fontSize: '0.85rem', fontWeight: '700' }}
          >
            Search
          </button>
        </form>
      </div>

      {/* DATA TABLE */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
        }}
      >
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#0B3B91', fontWeight: '700' }}>
            Loading Interest Requests...
          </div>
        ) : interests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1.5rem', color: '#64748B' }}>
            <Heart size={44} color="#94A3B8" style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1.25rem', color: '#0F172A' }}>No interest requests found.</h3>
            <p style={{ fontSize: '0.9rem' }}>Try switching filter tabs or refining your search term.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '1rem 1.25rem' }}>Interest ID</th>
                <th style={{ padding: '1rem 1.25rem' }}>Bride Details</th>
                <th style={{ padding: '1rem 1.25rem' }}>Groom Details</th>
                <th style={{ padding: '1rem 1.25rem' }}>Sent Date</th>
                <th style={{ padding: '1rem 1.25rem' }}>Current Status</th>
                <th style={{ padding: '1rem 1.25rem' }}>Assigned Admin</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {interests.map((item) => {
                const senderGender = (item.senderProfile?.gender || '').toLowerCase();
                const isSenderBride = senderGender === 'bride' || senderGender === 'female';

                const brideProfile = isSenderBride ? item.senderProfile : item.recipientProfile;
                const groomProfile = isSenderBride ? item.recipientProfile : item.senderProfile;

                return (
                  <tr
                    key={item._id}
                    style={{ borderBottom: '1px solid #F1F5F9', transition: 'background-color 0.15s ease' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '1rem 1.25rem', fontWeight: '800', color: '#0B3B91' }}>
                      {item.interestId || `INT-${item._id.slice(-5).toUpperCase()}`}
                    </td>

                    {/* Bride */}
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={brideProfile?.photos?.[0] || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80'}
                          alt={brideProfile?.fullName}
                          style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #EC4899' }}
                        />
                        <div>
                          <div style={{ fontWeight: '700', color: '#0F172A' }}>{brideProfile?.fullName || 'Bride Member'}</div>
                          <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                            {brideProfile?.age ? `${brideProfile.age} Yrs` : ''} {brideProfile?.city ? `• ${brideProfile.city}` : ''}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Groom */}
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={groomProfile?.photos?.[0] || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80'}
                          alt={groomProfile?.fullName}
                          style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #3B82F6' }}
                        />
                        <div>
                          <div style={{ fontWeight: '700', color: '#0F172A' }}>{groomProfile?.fullName || 'Groom Member'}</div>
                          <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                            {groomProfile?.age ? `${groomProfile.age} Yrs` : ''} {groomProfile?.city ? `• ${groomProfile.city}` : ''}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Sent Date */}
                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', color: '#475569' }}>
                      {new Date(item.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>

                    {/* Status */}
                    <td style={{ padding: '1rem 1.25rem' }}>{renderStatusBadge(item.status)}</td>

                    {/* Assigned Admin */}
                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', color: '#475569' }}>
                      {item.adminAssigned?.fullName || item.adminAssigned?.email || 'Unassigned'}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <button
                        onClick={() => handleOpenDetail(item._id)}
                        className="btn-primary"
                        style={{
                          padding: '0.45rem 0.9rem',
                          borderRadius: '30px',
                          fontSize: '0.8rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                        }}
                      >
                        <Eye size={14} /> Open Request
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', backgroundColor: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748B' }}>Page {page} of {totalPages}</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Previous</button>
              <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Next</button>
            </div>
          </div>
        )}
      </div>

      {/* DETAILED REQUEST MODAL / DRAWER */}
      {selectedInterestId && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '1.5rem',
          }}
        >
          <div
            className="glass-card animate-fade-in"
            style={{
              width: '100%',
              maxWidth: '1000px',
              maxHeight: '92vh',
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              overflowY: 'auto',
              position: 'relative',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid #CBD5E1',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '1.5rem 2rem',
                borderBottom: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#F8FAFC',
                position: 'sticky',
                top: 0,
                zIndex: 10,
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                    Interest Request #{detailData?.interest?.interestId || `INT-${selectedInterestId.slice(-5)}`}
                  </h3>
                  {renderStatusBadge(detailData?.interest?.status)}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.2rem' }}>
                  Submitted on {detailData?.interest?.createdAt ? new Date(detailData.interest.createdAt).toLocaleString() : 'N/A'}
                </div>
              </div>

              <button
                onClick={() => setSelectedInterestId(null)}
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '0.3rem' }}
              >
                <X size={24} />
              </button>
            </div>

            {loadingDetail ? (
              <div style={{ textAlign: 'center', padding: '5rem', color: '#0B3B91', fontWeight: '700' }}>
                Fetching complete match profile details...
              </div>
            ) : detailData ? (
              <div style={{ padding: '2rem' }}>
                {successMsg && (
                  <div style={{ backgroundColor: '#DCFCE7', color: '#15803D', padding: '0.85rem 1.25rem', borderRadius: '12px', marginBottom: '1.5rem', fontWeight: '700', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={18} /> {successMsg}
                  </div>
                )}

                {/* ADMIN ACTION TOOLBAR */}
                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    border: '1.5px solid #E2E8F0',
                    borderRadius: '18px',
                    padding: '1.25rem',
                    marginBottom: '2rem',
                  }}
                >
                  <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0B3B91', textTransform: 'uppercase', marginBottom: '0.85rem', letterSpacing: '0.5px' }}>
                    ⚡ Admin Workflow & Communication Actions
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <button
                      onClick={() => handleAdminAction('review_match')}
                      disabled={actionLoading}
                      className="btn-secondary"
                      style={{ padding: '0.6rem 1.1rem', fontSize: '0.85rem', borderRadius: '30px' }}
                    >
                      🟡 Mark Under Review
                    </button>

                    <button
                      onClick={() => handleAdminAction('mark_family_contacted')}
                      disabled={actionLoading}
                      className="btn-secondary"
                      style={{ padding: '0.6rem 1.1rem', fontSize: '0.85rem', borderRadius: '30px' }}
                    >
                      📞 Mark Family Contacted
                    </button>

                    <button
                      onClick={() => handleAdminAction('schedule_meeting')}
                      disabled={actionLoading}
                      className="btn-secondary"
                      style={{ padding: '0.6rem 1.1rem', fontSize: '0.85rem', borderRadius: '30px' }}
                    >
                      🤝 Mark Meeting Scheduled
                    </button>

                    <button
                      onClick={() => handleAdminAction('share_contact')}
                      disabled={actionLoading}
                      style={{
                        backgroundColor: '#166534',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '0.6rem 1.25rem',
                        fontSize: '0.85rem',
                        fontWeight: '800',
                        borderRadius: '30px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        boxShadow: '0 4px 12px rgba(22, 101, 52, 0.3)',
                      }}
                    >
                      <Phone size={15} /> Share Contact Details
                    </button>

                    <button
                      onClick={() => handleAdminAction('reject_match')}
                      disabled={actionLoading}
                      style={{
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        color: '#DC2626',
                        border: '1px solid #FCA5A5',
                        padding: '0.6rem 1.1rem',
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        borderRadius: '30px',
                        cursor: 'pointer',
                      }}
                    >
                      ❌ Reject Match
                    </button>

                    <button
                      onClick={() => handleAdminAction('close_request')}
                      disabled={actionLoading}
                      className="btn-secondary"
                      style={{ padding: '0.6rem 1.1rem', fontSize: '0.85rem', borderRadius: '30px' }}
                    >
                      ✅ Close Request
                    </button>

                    <button
                      onClick={handleConvertToSuccessStory}
                      disabled={actionLoading}
                      className="btn-gold"
                      style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem', borderRadius: '30px', fontWeight: '800' }}
                    >
                      💖 Convert to Success Story
                    </button>
                  </div>
                </div>

                {/* SIDE-BY-SIDE BRIDE & GROOM PROFILE COMPARISON */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.75rem', marginBottom: '2rem' }}>
                  {/* Bride Profile Card */}
                  <div style={{ background: '#FFF5F7', borderRadius: '20px', padding: '1.5rem', border: '1.5px solid #FBCFE8' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                      <img
                        src={detailData.brideProfile?.photos?.[0] || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'}
                        alt={detailData.brideProfile?.fullName}
                        style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #EC4899' }}
                      />
                      <div>
                        <span style={{ backgroundColor: '#EC4899', color: '#FFFFFF', fontSize: '0.7rem', fontWeight: '800', padding: '0.15rem 0.55rem', borderRadius: '10px', textTransform: 'uppercase' }}>
                          Bride Profile
                        </span>
                        <h4 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#831843', margin: '0.2rem 0 0' }}>
                          {detailData.brideProfile?.fullName || 'Bride Member'}
                        </h4>
                        <div style={{ fontSize: '0.85rem', color: '#9D174D' }}>
                          {detailData.brideProfile?.age} Yrs • {detailData.brideProfile?.city}, {detailData.brideProfile?.state}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem', color: '#334155' }}>
                      <div><strong>Phone / Mobile:</strong> <span style={{ color: '#0B3B91', fontWeight: '800' }}>{detailData.brideProfile?.user?.mobile || 'N/A'}</span></div>
                      <div><strong>Email Address:</strong> <span style={{ color: '#0B3B91', fontWeight: '800' }}>{detailData.brideProfile?.user?.email || 'N/A'}</span></div>
                      <div><strong>Religion & Caste:</strong> {detailData.brideProfile?.religion} / {detailData.brideProfile?.caste}</div>
                      <div><strong>Education & Profession:</strong> {detailData.brideProfile?.highestEducation} • {detailData.brideProfile?.occupation}</div>
                      <div><strong>Father's Occupation:</strong> {detailData.brideProfile?.fatherOccupation || 'N/A'}</div>
                      <div><strong>Mother's Occupation:</strong> {detailData.brideProfile?.motherOccupation || 'N/A'}</div>
                      <div><strong>Verification Status:</strong> {detailData.brideProfile?.isVerified ? '✅ Verified Badge' : '🟡 Pending Verification'}</div>
                    </div>
                  </div>

                  {/* Groom Profile Card */}
                  <div style={{ background: '#F0F9FF', borderRadius: '20px', padding: '1.5rem', border: '1.5px solid #BAE6FD' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                      <img
                        src={detailData.groomProfile?.photos?.[0] || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80'}
                        alt={detailData.groomProfile?.fullName}
                        style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #0284C7' }}
                      />
                      <div>
                        <span style={{ backgroundColor: '#0284C7', color: '#FFFFFF', fontSize: '0.7rem', fontWeight: '800', padding: '0.15rem 0.55rem', borderRadius: '10px', textTransform: 'uppercase' }}>
                          Groom Profile
                        </span>
                        <h4 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0369A1', margin: '0.2rem 0 0' }}>
                          {detailData.groomProfile?.fullName || 'Groom Member'}
                        </h4>
                        <div style={{ fontSize: '0.85rem', color: '#075985' }}>
                          {detailData.groomProfile?.age} Yrs • {detailData.groomProfile?.city}, {detailData.groomProfile?.state}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem', color: '#334155' }}>
                      <div><strong>Phone / Mobile:</strong> <span style={{ color: '#0B3B91', fontWeight: '800' }}>{detailData.groomProfile?.user?.mobile || 'N/A'}</span></div>
                      <div><strong>Email Address:</strong> <span style={{ color: '#0B3B91', fontWeight: '800' }}>{detailData.groomProfile?.user?.email || 'N/A'}</span></div>
                      <div><strong>Religion & Caste:</strong> {detailData.groomProfile?.religion} / {detailData.groomProfile?.caste}</div>
                      <div><strong>Education & Profession:</strong> {detailData.groomProfile?.highestEducation} • {detailData.groomProfile?.occupation}</div>
                      <div><strong>Father's Occupation:</strong> {detailData.groomProfile?.fatherOccupation || 'N/A'}</div>
                      <div><strong>Mother's Occupation:</strong> {detailData.groomProfile?.motherOccupation || 'N/A'}</div>
                      <div><strong>Verification Status:</strong> {detailData.groomProfile?.isVerified ? '✅ Verified Badge' : '🟡 Pending Verification'}</div>
                    </div>
                  </div>
                </div>

                {/* PRIVATE ADMIN NOTES SECTION */}
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '1.5rem', border: '1px solid #E2E8F0', marginBottom: '2rem' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0F172A', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileText size={18} color="#0B3B91" /> Internal Private Admin Notes & History Log
                  </h4>

                  {/* Add Note Form */}
                  <form onSubmit={handleAddNote} style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <select
                        value={noteCategory}
                        onChange={(e) => setNoteCategory(e.target.value)}
                        style={{ padding: '0.6rem 1rem', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.85rem', fontWeight: '600' }}
                      >
                        <option value="Family contacted">Family contacted</option>
                        <option value="Parents interested">Parents interested</option>
                        <option value="Meeting arranged">Meeting arranged</option>
                        <option value="Follow-up required">Follow-up required</option>
                        <option value="Wedding fixed">Wedding fixed</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="General">General</option>
                      </select>

                      <textarea
                        rows={2}
                        value={newNoteText}
                        onChange={(e) => setNewNoteText(e.target.value)}
                        placeholder="Record confidential admin notes (e.g. Talked to Lakshmi's father, interested in horoscope match)..."
                        style={{ flex: 1, padding: '0.6rem 1rem', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                      />
                    </div>

                    <button type="submit" disabled={actionLoading} className="btn-primary" style={{ alignSelf: 'flex-end', padding: '0.55rem 1.25rem', borderRadius: '30px', fontSize: '0.85rem' }}>
                      <Plus size={16} /> Add Private Note
                    </button>
                  </form>

                  {/* Notes Timeline */}
                  {detailData.interest?.notes?.length === 0 ? (
                    <div style={{ fontSize: '0.85rem', color: '#94A3B8', fontStyle: 'italic' }}>No internal notes recorded yet.</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {detailData.interest?.notes?.map((note, idx) => (
                        <div key={idx} style={{ backgroundColor: '#F8FAFC', padding: '0.85rem 1.1rem', borderRadius: '12px', borderLeft: '4px solid #0B3B91' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#64748B', fontWeight: '700', marginBottom: '0.25rem' }}>
                            <span>Tag: {note.category} • By {note.addedByName || 'Admin'}</span>
                            <span>{new Date(note.createdAt).toLocaleString()}</span>
                          </div>
                          <div style={{ fontSize: '0.875rem', color: '#1E293B', fontWeight: '500' }}>{note.text}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
