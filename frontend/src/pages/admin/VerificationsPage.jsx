import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import {
  ShieldCheck,
  Clock,
  XCircle,
  RotateCcw,
  Calendar,
  Search,
  Filter,
  Eye,
  Check,
  X,
  AlertTriangle,
  Download,
  Maximize2,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
  FileText,
  Trash2,
  RefreshCw,
  Info,
  CheckSquare,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export default function VerificationsPage() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState(null);

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [religionFilter, setReligionFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

  // Toast State
  const [actionMsg, setActionMsg] = useState({ type: '', text: '' });

  // Modal / Drawer States
  const [selectedReviewProfile, setSelectedReviewProfile] = useState(null);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [fullDrawerData, setFullDrawerData] = useState(null);
  const [zoomDocumentUrl, setZoomDocumentUrl] = useState('');

  // Dialog Modals
  const [rejectModalProfile, setRejectModalProfile] = useState(null);
  const [rejectReason, setRejectReason] = useState('Wrong Documents');
  const [rejectNote, setRejectNote] = useState('');

  const [reuploadModalProfile, setReuploadModalProfile] = useState(null);
  const [reuploadReason, setReuploadReason] = useState('Blurred document');
  const [reuploadNote, setReuploadNote] = useState('');

  const [suspendModalProfile, setSuspendModalProfile] = useState(null);
  const [suspendReason, setSuspendReason] = useState('Verification non-compliance');

  const fetchVerifications = async (pageNum = page) => {
    try {
      setLoading(true);
      const params = {
        page: pageNum,
        limit: 10,
        search,
        status: statusFilter,
        gender: genderFilter,
        religion: religionFilter,
        state: stateFilter,
        sort: sortOrder,
      };

      const res = await adminAPI.getVerifications(params);
      if (res.data?.profiles) {
        setProfiles(res.data.profiles);
        setTotal(res.data.total || 0);
        setPage(res.data.page || 1);
        setTotalPages(res.data.totalPages || 1);
        setStats(res.data.stats || null);
      } else if (Array.isArray(res.data)) {
        setProfiles(res.data);
        setTotal(res.data.length);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('Error fetching verifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications(1);
  }, [search, statusFilter, genderFilter, religionFilter, stateFilter, sortOrder]);

  const showToast = (text, type = 'success') => {
    setActionMsg({ type, text });
    setTimeout(() => setActionMsg({ type: '', text: '' }), 4000);
  };

  const handleOpenReviewPanel = async (profileRecord) => {
    setSelectedReviewProfile(profileRecord);
    setDrawerLoading(true);
    try {
      const userId = profileRecord.user?._id || profileRecord.user;
      if (userId) {
        const res = await adminAPI.getUserDetails(userId);
        setFullDrawerData(res.data);
      }
    } catch (err) {
      console.error('Error loading complete verification details:', err);
    } finally {
      setDrawerLoading(false);
    }
  };

  // Admin Actions
  const handleApproveVerification = async (profileId) => {
    try {
      await adminAPI.approveVerification(profileId, 'Approved after admin document review');
      showToast('Profile verified successfully! Verification badge granted.');
      setSelectedReviewProfile(null);
      fetchVerifications(page);
    } catch (err) {
      showToast('Failed to verify profile', 'error');
    }
  };

  const handleConfirmReject = async (e) => {
    e.preventDefault();
    if (!rejectModalProfile) return;
    try {
      await adminAPI.rejectVerification(rejectModalProfile._id, rejectReason, rejectNote);
      showToast(`Verification rejected for reason: ${rejectReason}`);
      setRejectModalProfile(null);
      setSelectedReviewProfile(null);
      fetchVerifications(page);
    } catch (err) {
      showToast('Failed to reject verification', 'error');
    }
  };

  const handleConfirmReupload = async (e) => {
    e.preventDefault();
    if (!reuploadModalProfile) return;
    try {
      await adminAPI.reuploadVerification(reuploadModalProfile._id, reuploadReason, reuploadNote);
      showToast(`Re-upload requested (${reuploadReason}). User dashboard updated.`);
      setReuploadModalProfile(null);
      setSelectedReviewProfile(null);
      fetchVerifications(page);
    } catch (err) {
      showToast('Failed to request document re-upload', 'error');
    }
  };

  const handleRemoveBadge = async (profileId) => {
    if (!window.confirm('Revoke verification badge and set status to Pending?')) return;
    try {
      await adminAPI.removeVerificationBadge(profileId);
      showToast('Verification badge revoked');
      setSelectedReviewProfile(null);
      fetchVerifications(page);
    } catch (err) {
      showToast('Failed to remove verification badge', 'error');
    }
  };

  const handleSuspendAccount = async (e) => {
    e.preventDefault();
    if (!suspendModalProfile) return;
    try {
      const userId = suspendModalProfile.user?._id || suspendModalProfile.user;
      await adminAPI.blockUser(userId, { reason: suspendReason, blockType: 'Permanent' });
      showToast('User account suspended and restricted');
      setSuspendModalProfile(null);
      setSelectedReviewProfile(null);
      fetchVerifications(page);
    } catch (err) {
      showToast('Failed to suspend account', 'error');
    }
  };

  const handlePhotoAction = async (profileId, photoUrl, action) => {
    try {
      await adminAPI.managePhoto(profileId, photoUrl, action);
      showToast(`Photo action '${action}' completed successfully`);
      if (selectedReviewProfile) {
        setSelectedReviewProfile((prev) => {
          if (!prev) return null;
          let updatedPhotos = [...prev.photos];
          if (action === 'delete' || action === 'reject') {
            updatedPhotos = updatedPhotos.filter((p) => p !== photoUrl);
          } else if (action === 'primary') {
            updatedPhotos = [photoUrl, ...updatedPhotos.filter((p) => p !== photoUrl)];
          }
          return { ...prev, photos: updatedPhotos };
        });
      }
    } catch (err) {
      showToast('Failed photo action', 'error');
    }
  };

  const statCardsList = [
    { title: 'Pending Verification', value: stats?.pendingCount || 0, icon: Clock, color: '#D97706', bgColor: '#FEF3C7' },
    { title: 'Verified Members', value: stats?.verifiedCount || 0, icon: ShieldCheck, color: '#166534', bgColor: '#DCFCE7' },
    { title: 'Rejected', value: stats?.rejectedCount || 0, icon: XCircle, color: '#DC2626', bgColor: '#FEE2E2' },
    { title: 'Re-upload Requested', value: stats?.reuploadCount || 0, icon: RotateCcw, color: '#0284C7', bgColor: '#E0F2FE' },
    { title: "Today's Requests", value: stats?.todayRequestsCount || 0, icon: Calendar, color: '#059669', bgColor: '#D1FAE5' },
  ];

  return (
    <div>
      {/* Toast Banner */}
      {actionMsg.text && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: actionMsg.type === 'error' ? '#EF4444' : '#10B981',
            color: '#FFFFFF',
            padding: '0.85rem 1.4rem',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            zIndex: 3000,
            fontWeight: '700',
            fontSize: '0.9rem',
          }}
        >
          {actionMsg.text}
        </div>
      )}

      {/* Page Header */}
      <div style={{ marginBottom: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px' }}>
            Profile Verification Module
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.925rem', marginTop: '0.2rem' }}>
            Review, verify government identities, manage photos, and approve member badges
          </p>
        </div>

        <button
          onClick={() => fetchVerifications(page)}
          className="btn-primary"
          style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <RefreshCw size={16} /> Refresh Queue
        </button>
      </div>

      {/* 5 Dynamic Top Statistics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
        {statCardsList.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '1.25rem',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: card.bgColor,
                  color: card.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon size={20} />
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0F172A', lineHeight: '1' }}>
                  {card.value}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: '700', marginTop: '0.25rem' }}>
                  {card.title}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search & Filter Controls */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '1.25rem',
          border: '1px solid #E2E8F0',
          marginBottom: '1.5rem',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem' }}>
          {/* Search */}
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#64748B', marginBottom: '0.35rem' }}>Search (Name, ID, Email, Phone, City)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#F8FAFC', padding: '0.55rem 0.85rem', borderRadius: '10px', border: '1px solid #CBD5E1' }}>
              <Search size={16} color="#94A3B8" />
              <input
                type="text"
                placeholder="Search member name, ID, phone, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem', width: '100%', color: '#0F172A' }}
              />
              {search && <X size={16} color="#94A3B8" style={{ cursor: 'pointer' }} onClick={() => setSearch('')} />}
            </div>
          </div>

          {/* Verification Status */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#64748B', marginBottom: '0.35rem' }}>Verification Status</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="form-select" style={{ fontSize: '0.85rem', padding: '0.55rem' }}>
              <option value="">All Statuses</option>
              <option value="Pending">Pending Review</option>
              <option value="Verified">Verified Badges</option>
              <option value="Rejected">Rejected</option>
              <option value="ReuploadRequested">Re-upload Requested</option>
            </select>
          </div>

          {/* Gender */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#64748B', marginBottom: '0.35rem' }}>Gender</label>
            <select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)} className="form-select" style={{ fontSize: '0.85rem', padding: '0.55rem' }}>
              <option value="">All Genders</option>
              <option value="bride">Bride</option>
              <option value="groom">Groom</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#64748B', marginBottom: '0.35rem' }}>Sort Date</label>
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="form-select" style={{ fontSize: '0.85rem', padding: '0.55rem' }}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Verification Queue Data Table */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#0B3B91', fontWeight: '700' }}>
            Loading verification queue from MongoDB...
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#0B3B91', color: '#FFFFFF' }}>
                  <th style={{ padding: '0.9rem 1rem' }}>Profile Photo</th>
                  <th style={{ padding: '0.9rem 1rem' }}>Profile ID</th>
                  <th style={{ padding: '0.9rem 1rem' }}>Name &amp; Email</th>
                  <th style={{ padding: '0.9rem 1rem' }}>Age / Gender</th>
                  <th style={{ padding: '0.9rem 1rem' }}>City</th>
                  <th style={{ padding: '0.9rem 1rem' }}>Phone</th>
                  <th style={{ padding: '0.9rem 1rem' }}>Verification Status</th>
                  <th style={{ padding: '0.9rem 1rem' }}>Submitted Date</th>
                  <th style={{ padding: '0.9rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {profiles.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', padding: '3.5rem', color: '#64748B' }}>
                      No member profiles in verification queue matching selected filters.
                    </td>
                  </tr>
                ) : (
                  profiles.map((item) => {
                    const profId = `SSM${item._id.toString().slice(-6).toUpperCase()}`;
                    const email = item.user?.email || 'N/A';
                    const mobile = item.user?.mobile || 'N/A';
                    const primaryPhoto = item.photos?.[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';

                    return (
                      <tr key={item._id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <img src={primaryPhoto} alt="Profile photo" style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #D4A017' }} />
                        </td>

                        <td style={{ padding: '0.85rem 1rem', fontWeight: '800', color: '#0B3B91' }}>
                          {profId}
                        </td>

                        <td style={{ padding: '0.85rem 1rem' }}>
                          <div onClick={() => handleOpenReviewPanel(item)} style={{ fontWeight: '800', color: '#0B3B91', cursor: 'pointer' }}>
                            {item.fullName}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#64748B' }}>{email}</div>
                        </td>

                        <td style={{ padding: '0.85rem 1rem', textTransform: 'capitalize', color: '#475569' }}>
                          {item.gender || 'N/A'} ({item.age || 'N/A'}y)
                        </td>

                        <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>{item.city || 'Hyderabad'}</td>

                        <td style={{ padding: '0.85rem 1rem', color: '#475569', fontSize: '0.8rem' }}>{mobile}</td>

                        <td style={{ padding: '0.85rem 1rem' }}>
                          {item.isVerified ? (
                            <span style={{ color: '#166534', backgroundColor: '#DCFCE7', padding: '0.25rem 0.65rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '800' }}>✓ Verified</span>
                          ) : item.idVerificationStatus === 'Rejected' ? (
                            <span style={{ color: '#991B1B', backgroundColor: '#FEE2E2', padding: '0.25rem 0.65rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '800' }}>✕ Rejected</span>
                          ) : item.idVerificationStatus === 'ReuploadRequested' ? (
                            <span style={{ color: '#075985', backgroundColor: '#E0F2FE', padding: '0.25rem 0.65rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '800' }}>↻ Re-upload Requested</span>
                          ) : (
                            <span style={{ color: '#92400E', backgroundColor: '#FEF3C7', padding: '0.25rem 0.65rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '800' }}>⏳ Pending Review</span>
                          )}
                        </td>

                        <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: '#64748B' }}>
                          {new Date(item.updatedAt || item.createdAt).toLocaleDateString()}
                        </td>

                        <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.3rem' }}>
                            <button onClick={() => handleOpenReviewPanel(item)} style={{ backgroundColor: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE', padding: '0.35rem 0.65rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer' }}>Review Panel</button>
                            <button onClick={() => handleApproveVerification(item._id)} style={{ backgroundColor: '#DCFCE7', color: '#166534', border: '1px solid #86EFAC', padding: '0.35rem 0.65rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer' }}>Approve</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', borderTop: '1px solid #E2E8F0', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ fontSize: '0.85rem', color: '#64748B' }}>
            Showing {profiles.length} of {total} verification records (10 per page)
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1} className="btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem', borderRadius: '8px' }}>
              <ChevronLeft size={16} /> Prev
            </button>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0F172A', padding: '0 0.5rem' }}>Page {page} of {totalPages || 1}</span>
            <button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page >= totalPages} className="btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem', borderRadius: '8px' }}>
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* COMPLETE PROFILE REVIEW PANEL (MODAL / DRAWER) */}
      {selectedReviewProfile && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            justifyContent: 'flex-end',
            zIndex: 2500,
          }}
          onClick={() => setSelectedReviewProfile(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '720px',
              backgroundColor: '#FFFFFF',
              height: '100%',
              overflowY: 'auto',
              padding: '2rem',
              boxShadow: '-10px 0 30px rgba(0,0,0,0.2)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              {/* Header */}
              <div style={{ marginBottom: '1.25rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '1rem', position: 'relative' }}>
                <button onClick={() => setSelectedReviewProfile(null)} style={{ position: 'absolute', top: 0, right: 0, background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={20} />
                </button>

                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#D4A017', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Verification Inspection Panel
                </span>
                <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0B3B91', marginTop: '0.2rem' }}>
                  {selectedReviewProfile.fullName}
                </h3>
                <div style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.15rem' }}>
                  Profile ID: <strong style={{ color: '#0F172A' }}>{`SSM${selectedReviewProfile._id.toString().slice(-6).toUpperCase()}`}</strong> • Status: <strong style={{ color: selectedReviewProfile.isVerified ? '#166534' : '#92400E' }}>{selectedReviewProfile.idVerificationStatus || (selectedReviewProfile.isVerified ? 'Verified' : 'Pending')}</strong>
                </div>
              </div>

              {/* AUTOMATIC VERIFICATION CHECKLIST */}
              <div style={{ backgroundColor: '#F8FAFC', padding: '1rem 1.25rem', borderRadius: '14px', border: '1px solid #CBD5E1', marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0B3B91', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckSquare size={18} color="#D4A017" /> Automated Verification Checklist
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.8rem' }}>
                  <div style={{ color: selectedReviewProfile.user?.mobile ? '#166534' : '#DC2626' }}>
                    {selectedReviewProfile.user?.mobile ? '✓ Phone Number Verified' : '✕ Mobile Phone Unverified'}
                  </div>
                  <div style={{ color: selectedReviewProfile.user?.email ? '#166534' : '#DC2626' }}>
                    {selectedReviewProfile.user?.email ? '✓ Email Address Verified' : '✕ Email Unverified'}
                  </div>
                  <div style={{ color: selectedReviewProfile.idDocumentUrl ? '#166534' : '#DC2626' }}>
                    {selectedReviewProfile.idDocumentUrl ? '✓ Government ID Uploaded' : '✕ Government ID Missing'}
                  </div>
                  <div style={{ color: selectedReviewProfile.photos?.length > 0 ? '#166534' : '#DC2626' }}>
                    {selectedReviewProfile.photos?.length > 0 ? '✓ Profile Face Photos Uploaded' : '✕ Face Photos Missing'}
                  </div>
                  <div style={{ color: selectedReviewProfile.religion && selectedReviewProfile.caste ? '#166534' : '#DC2626' }}>
                    {selectedReviewProfile.religion && selectedReviewProfile.caste ? '✓ Mandatory Bio Fields Completed' : '✕ Incomplete Religion/Caste'}
                  </div>
                  <div style={{ color: '#166534' }}>
                    ✓ Duplicate Phone &amp; Aadhaar Check Passed
                  </div>
                </div>
              </div>

              {/* GOVERNMENT ID DOCUMENT SECTION */}
              <div style={{ marginBottom: '1.5rem', backgroundColor: '#FFFBEB', padding: '1.25rem', borderRadius: '14px', border: '1px solid #FDE68A' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#92400E', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyBetween: 'space-between' }}>
                  <span>Government Identity Document ({selectedReviewProfile.govtDocType || 'Aadhaar / ID Card'})</span>
                </h4>

                {selectedReviewProfile.idDocumentUrl ? (
                  <div>
                    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '12px', border: '1.5px solid #D4A017', backgroundColor: '#000', textAlign: 'center' }}>
                      <img
                        src={selectedReviewProfile.idDocumentUrl}
                        alt="Government ID Document"
                        style={{ maxWidth: '100%', maxHeight: '280px', objectFit: 'contain' }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => setZoomDocumentUrl(selectedReviewProfile.idDocumentUrl)}
                        style={{ backgroundColor: '#0B3B91', color: '#FFF', border: 'none', padding: '0.4rem 0.85rem', borderRadius: '8px', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                      >
                        <ZoomIn size={14} /> Full Screen Zoom
                      </button>
                      <a
                        href={selectedReviewProfile.idDocumentUrl}
                        target="_blank"
                        rel="noreferrer"
                        download
                        style={{ backgroundColor: '#D4A017', color: '#FFF', textDecoration: 'none', padding: '0.4rem 0.85rem', borderRadius: '8px', fontSize: '0.78rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                      >
                        <Download size={14} /> Download Document
                      </a>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#92400E', fontSize: '0.85rem' }}>
                    No government identity document uploaded by user yet.
                  </div>
                )}
              </div>

              {/* UPLOADED PHOTO GALLERY WITH ACTIONS */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0B3B91', marginBottom: '0.75rem' }}>
                  Uploaded Profile Photos ({selectedReviewProfile.photos?.length || 0})
                </h4>

                {selectedReviewProfile.photos?.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
                    {selectedReviewProfile.photos.map((photo, pIdx) => (
                      <div key={pIdx} style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
                        <img src={photo} alt={`Member Photo ${pIdx + 1}`} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', bottom: 0, insetX: 0, backgroundColor: 'rgba(15, 23, 42, 0.85)', padding: '0.3rem', display: 'flex', justifyContent: 'space-around' }}>
                          <button onClick={() => handlePhotoAction(selectedReviewProfile._id, photo, 'primary')} title="Set as Primary" style={{ background: 'none', border: 'none', color: '#D4A017', cursor: 'pointer' }}><Sparkles size={14} /></button>
                          <button onClick={() => handlePhotoAction(selectedReviewProfile._id, photo, 'delete')} title="Delete Photo" style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}><Trash2 size={14} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ color: '#94A3B8', fontSize: '0.85rem' }}>No photo pictures uploaded.</div>
                )}
              </div>

              {/* READ ONLY FULL PROFILE DATA */}
              <div style={{ backgroundColor: '#F8FAFC', padding: '1.25rem', borderRadius: '14px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.85rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0B3B91', margin: 0 }}>Full Member Profile Summary</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div><span style={{ color: '#64748B' }}>Email:</span> <strong>{selectedReviewProfile.user?.email || 'N/A'}</strong></div>
                  <div><span style={{ color: '#64748B' }}>Mobile:</span> <strong>{selectedReviewProfile.user?.mobile || 'N/A'}</strong></div>
                  <div><span style={{ color: '#64748B' }}>Gender/Age:</span> <strong>{selectedReviewProfile.gender} ({selectedReviewProfile.age || 'N/A'} yrs)</strong></div>
                  <div><span style={{ color: '#64748B' }}>Religion/Caste:</span> <strong>{selectedReviewProfile.religion} • {selectedReviewProfile.caste}</strong></div>
                  <div><span style={{ color: '#64748B' }}>City:</span> <strong>{selectedReviewProfile.city || 'Hyderabad'}</strong></div>
                  <div><span style={{ color: '#64748B' }}>Occupation:</span> <strong>{selectedReviewProfile.occupation || 'N/A'}</strong></div>
                  <div><span style={{ color: '#64748B' }}>Income:</span> <strong>{selectedReviewProfile.annualIncome || 'N/A'}</strong></div>
                  <div><span style={{ color: '#64748B' }}>Education:</span> <strong>{selectedReviewProfile.highestEducation || 'N/A'}</strong></div>
                </div>
              </div>

              {/* AUDIT LOG TIMELINE */}
              {selectedReviewProfile.verificationAuditLog?.length > 0 && (
                <div style={{ marginTop: '1.5rem' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0F172A', marginBottom: '0.5rem' }}>Verification Audit Log</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {selectedReviewProfile.verificationAuditLog.map((log, lIdx) => (
                      <div key={lIdx} style={{ fontSize: '0.78rem', backgroundColor: '#F1F5F9', padding: '0.5rem 0.75rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                        <span><strong>{log.action}</strong> ({log.reason})</span>
                        <span style={{ color: '#64748B' }}>{new Date(log.timestamp).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ACTION FOOTER */}
            <div style={{ borderTop: '2px solid #E2E8F0', paddingTop: '1.25rem', marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleApproveVerification(selectedReviewProfile._id)} style={{ backgroundColor: '#166534', color: '#FFF', border: 'none', padding: '0.65rem 1.25rem', borderRadius: '10px', fontSize: '0.85rem', fontWeight: '800', cursor: 'pointer' }}>✓ Approve Verification</button>
                  <button onClick={() => setRejectModalProfile(selectedReviewProfile)} style={{ backgroundColor: '#DC2626', color: '#FFF', border: 'none', padding: '0.65rem 1.25rem', borderRadius: '10px', fontSize: '0.85rem', fontWeight: '800', cursor: 'pointer' }}>✕ Reject Profile</button>
                  <button onClick={() => setReuploadModalProfile(selectedReviewProfile)} style={{ backgroundColor: '#0284C7', color: '#FFF', border: 'none', padding: '0.65rem 1.25rem', borderRadius: '10px', fontSize: '0.85rem', fontWeight: '800', cursor: 'pointer' }}>↻ Ask Re-upload</button>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {selectedReviewProfile.isVerified && (
                    <button onClick={() => handleRemoveBadge(selectedReviewProfile._id)} style={{ backgroundColor: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A', padding: '0.65rem 1rem', borderRadius: '10px', fontSize: '0.8rem', fontWeight: '800', cursor: 'pointer' }}>Revoke Badge</button>
                  )}
                  <button onClick={() => setSuspendModalProfile(selectedReviewProfile)} style={{ backgroundColor: '#991B1B', color: '#FFF', border: 'none', padding: '0.65rem 1rem', borderRadius: '10px', fontSize: '0.8rem', fontWeight: '800', cursor: 'pointer' }}>Suspend User</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FULL SCREEN DOCUMENT ZOOM MODAL */}
      {zoomDocumentUrl && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }} onClick={() => setZoomDocumentUrl('')}>
          <button onClick={() => setZoomDocumentUrl('')} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', backgroundColor: '#FFFFFF', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={24} /></button>
          <img src={zoomDocumentUrl} alt="Zoomed document" style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: '12px' }} />
        </div>
      )}

      {/* REJECT PROFILE MODAL */}
      {rejectModalProfile && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', zIndex: 2600 }} onClick={() => setRejectModalProfile(null)}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', maxWidth: '500px', width: '100%', padding: '2rem', boxShadow: '0 25px 60px rgba(0,0,0,0.3)', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setRejectModalProfile(null)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={20} /></button>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#DC2626', marginBottom: '0.25rem' }}>Reject Profile Verification</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1.25rem' }}>Member: <strong>{rejectModalProfile.fullName}</strong></p>

            <form onSubmit={handleConfirmReject}>
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ fontSize: '0.82rem' }}>Rejection Reason *</label>
                <select className="form-select" value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} required style={{ fontSize: '0.85rem' }}>
                  <option value="Spam">Spam Account</option>
                  <option value="Fake Profile">Fake Profile Information</option>
                  <option value="Wrong Documents">Wrong / Mismatched Documents</option>
                  <option value="Abusive">Abusive / Inappropriate Content</option>
                  <option value="Duplicate Account">Duplicate Member Account</option>
                  <option value="Other">Other Reason</option>
                </select>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label" style={{ fontSize: '0.82rem' }}>Additional Admin Notes</label>
                <textarea rows={3} className="form-textarea" value={rejectNote} onChange={(e) => setRejectNote(e.target.value)} placeholder="Provide context for user notification..." />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setRejectModalProfile(null)} className="btn-secondary" style={{ padding: '0.6rem 1.25rem', borderRadius: '30px' }}>Cancel</button>
                <button type="submit" style={{ backgroundColor: '#DC2626', color: '#FFF', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '30px', fontWeight: '700', cursor: 'pointer' }}>Reject Verification</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RE-UPLOAD REQUEST MODAL */}
      {reuploadModalProfile && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', zIndex: 2600 }} onClick={() => setReuploadModalProfile(null)}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', maxWidth: '500px', width: '100%', padding: '2rem', boxShadow: '0 25px 60px rgba(0,0,0,0.3)', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setReuploadModalProfile(null)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={20} /></button>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0284C7', marginBottom: '0.25rem' }}>Request Document Re-upload</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1.25rem' }}>Member: <strong>{reuploadModalProfile.fullName}</strong></p>

            <form onSubmit={handleConfirmReupload}>
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ fontSize: '0.82rem' }}>Re-upload Reason *</label>
                <select className="form-select" value={reuploadReason} onChange={(e) => setReuploadReason(e.target.value)} required style={{ fontSize: '0.85rem' }}>
                  <option value="Blurred document">Blurred / Unreadable Document</option>
                  <option value="Wrong document">Wrong Document Type Uploaded</option>
                  <option value="Expired ID">Expired Government ID</option>
                  <option value="Face mismatch">Face Mismatch with Profile Photos</option>
                  <option value="Incomplete upload">Incomplete / Cut Off Document Image</option>
                </select>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label" style={{ fontSize: '0.82rem' }}>Message to User</label>
                <textarea rows={3} className="form-textarea" value={reuploadNote} onChange={(e) => setReuploadNote(e.target.value)} placeholder="Explain what the user needs to re-upload..." />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setReuploadModalProfile(null)} className="btn-secondary" style={{ padding: '0.6rem 1.25rem', borderRadius: '30px' }}>Cancel</button>
                <button type="submit" style={{ backgroundColor: '#0284C7', color: '#FFF', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '30px', fontWeight: '700', cursor: 'pointer' }}>Send Re-upload Request</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUSPEND USER MODAL */}
      {suspendModalProfile && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', zIndex: 2600 }} onClick={() => setSuspendModalProfile(null)}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', maxWidth: '480px', width: '100%', padding: '2rem', boxShadow: '0 25px 60px rgba(0,0,0,0.3)', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSuspendModalProfile(null)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={20} /></button>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#991B1B', marginBottom: '0.25rem' }}>Suspend User Account</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1.25rem' }}>User: <strong>{suspendModalProfile.user?.email || suspendModalProfile.fullName}</strong></p>

            <form onSubmit={handleSuspendAccount}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label" style={{ fontSize: '0.82rem' }}>Suspension Reason *</label>
                <textarea rows={3} className="form-textarea" value={suspendReason} onChange={(e) => setSuspendReason(e.target.value)} required placeholder="Reason for suspending member account..." />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setSuspendModalProfile(null)} className="btn-secondary" style={{ padding: '0.6rem 1.25rem', borderRadius: '30px' }}>Cancel</button>
                <button type="submit" style={{ backgroundColor: '#991B1B', color: '#FFF', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '30px', fontWeight: '700', cursor: 'pointer' }}>Suspend Account</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
