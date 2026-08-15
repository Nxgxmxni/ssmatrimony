import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import {
  Users,
  Heart,
  ShieldCheck,
  Clock,
  UserX,
  UserCheck,
  Calendar,
  Search,
  Filter,
  Download,
  RotateCcw,
  CheckCircle,
  Trash2,
  Eye,
  Edit,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  AlertTriangle,
  Lock,
  Tag,
  FileText,
  Activity,
  History,
  Send,
  MessageSquare,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [topStats, setTopStats] = useState(null);

  // Tab: 'active' | 'deleted'
  const [activeTab, setActiveTab] = useState('active');

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [verificationFilter, setVerificationFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [completionFilter, setCompletionFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

  // Multi-selection state
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  // Toast message state
  const [actionMsg, setActionMsg] = useState({ type: '', text: '' });

  // Modal / Drawer States
  const [selectedUserDrawer, setSelectedUserDrawer] = useState(null);
  const [drawerActiveTab, setDrawerActiveTab] = useState('details'); // details, career, verification, activity, interests, notes
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [drawerDetails, setDrawerDetails] = useState(null);

  const [editModalUser, setEditModalUser] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const [blockModalUser, setBlockModalUser] = useState(null);
  const [blockReason, setBlockReason] = useState('');
  const [blockType, setBlockType] = useState('Permanent');

  const [resetPassModalUser, setResetPassModalUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  const [newAdminNote, setNewAdminNote] = useState('');

  const fetchUsers = async (pageNum = page, pageSize = limit) => {
    try {
      setLoading(true);
      const params = {
        page: pageNum,
        limit: pageSize,
        search,
        gender: genderFilter,
        verificationStatus: verificationFilter,
        accountStatus: statusFilter,
        completionRange: completionFilter,
        sort: sortOrder,
        tab: activeTab,
      };

      const res = await adminAPI.getUsers(params);
      setUsers(res.data?.users || []);
      setTotal(res.data?.total || 0);
      setPage(res.data?.page || 1);
      setTotalPages(res.data?.totalPages || 1);
      if (res.data?.stats) {
        setTopStats(res.data.stats);
      }
    } catch (err) {
      console.error('Error fetching users list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1, limit);
  }, [search, genderFilter, verificationFilter, statusFilter, completionFilter, sortOrder, activeTab, limit]);

  const showToast = (text, type = 'success') => {
    setActionMsg({ type, text });
    setTimeout(() => setActionMsg({ type: '', text: '' }), 4000);
  };

  // Open Detailed Profile Drawer & Load Sub-Resources
  const handleOpenDrawer = async (userRecord) => {
    setSelectedUserDrawer(userRecord);
    setDrawerActiveTab('details');
    setDrawerLoading(true);
    try {
      const res = await adminAPI.getUserDetails(userRecord._id);
      setDrawerDetails(res.data);
    } catch (err) {
      console.error('Error loading full drawer details:', err);
    } finally {
      setDrawerLoading(false);
    }
  };

  // Checkbox Selection
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUserIds(users.map((u) => u._id));
    } else {
      setSelectedUserIds([]);
    }
  };

  const handleToggleSelect = (userId) => {
    if (selectedUserIds.includes(userId)) {
      setSelectedUserIds(selectedUserIds.filter((id) => id !== userId));
    } else {
      setSelectedUserIds([...selectedUserIds, userId]);
    }
  };

  // Admin User Actions
  const handleVerifyProfile = async (profileId) => {
    try {
      await adminAPI.toggleVerify(profileId, { action: 'approve' });
      showToast('Profile verification status updated to Verified');
      fetchUsers(page, limit);
      if (selectedUserDrawer) setSelectedUserDrawer(null);
    } catch (err) {
      showToast('Failed to verify profile', 'error');
    }
  };

  const handleOpenEditModal = (userItem) => {
    setEditModalUser(userItem);
    setEditFormData({
      fullName: userItem.fullName || '',
      email: itemValue(userItem, 'email'),
      mobile: itemValue(userItem, 'mobile'),
      gender: userItem.gender || '',
      dateOfBirth: userItem.profile?.dateOfBirth ? new Date(userItem.profile.dateOfBirth).toISOString().slice(0, 10) : '',
      heightCm: userItem.profile?.heightCm || '',
      religion: userItem.religion || '',
      caste: userItem.caste || '',
      highestEducation: userItem.highestEducation || '',
      occupation: userItem.occupation || '',
      company: userItem.profile?.company || '',
      annualIncome: userItem.annualIncome || '',
      city: userItem.city || '',
      state: userItem.profile?.state || '',
      aboutMe: userItem.profile?.aboutMe || '',
    });
  };

  const handleSaveEditUser = async (e) => {
    e.preventDefault();
    if (!editModalUser) return;
    try {
      await adminAPI.editUser(editModalUser._id, editFormData);
      showToast('Member profile updated successfully in MongoDB');
      setEditModalUser(null);
      fetchUsers(page, limit);
      if (selectedUserDrawer) setSelectedUserDrawer(null);
    } catch (err) {
      showToast('Failed to edit member profile', 'error');
    }
  };

  const handleOpenBlockModal = (userItem) => {
    setBlockModalUser(userItem);
    setBlockReason('Violation of matrimony platform safety policy');
    setBlockType('Permanent');
  };

  const handleConfirmBlock = async (e) => {
    e.preventDefault();
    if (!blockModalUser) return;
    try {
      await adminAPI.blockUser(blockModalUser._id, { reason: blockReason, blockType });
      showToast(`Account ${blockModalUser.email} has been blocked (${blockType})`);
      setBlockModalUser(null);
      fetchUsers(page, limit);
      if (selectedUserDrawer) setSelectedUserDrawer(null);
    } catch (err) {
      showToast('Failed to block account', 'error');
    }
  };

  const handleUnblockUser = async (userId) => {
    try {
      await adminAPI.unblockUser(userId);
      showToast('User account unblocked and restored to Active');
      fetchUsers(page, limit);
      if (selectedUserDrawer) setSelectedUserDrawer(null);
    } catch (err) {
      showToast('Failed to unblock account', 'error');
    }
  };

  const handleSoftDelete = async (userId, email) => {
    if (!window.confirm(`Move user ${email} to Deleted Users tab?`)) return;
    try {
      await adminAPI.softDeleteUser(userId);
      showToast(`User ${email} moved to Deleted Users queue`);
      fetchUsers(page, limit);
      if (selectedUserDrawer) setSelectedUserDrawer(null);
    } catch (err) {
      showToast('Failed to soft delete user', 'error');
    }
  };

  const handleRestoreUser = async (userId) => {
    try {
      await adminAPI.restoreUser(userId);
      showToast('User account restored to Active Members');
      fetchUsers(page, limit);
    } catch (err) {
      showToast('Failed to restore user', 'error');
    }
  };

  const handlePermanentDelete = async (userId, email) => {
    if (!window.confirm(`PERMANENTLY DELETE user ${email} from MongoDB? This action CANNOT be undone!`)) return;
    try {
      await adminAPI.permanentDeleteUser(userId);
      showToast(`User ${email} permanently deleted from database`);
      fetchUsers(page, limit);
      if (selectedUserDrawer) setSelectedUserDrawer(null);
    } catch (err) {
      showToast('Failed to delete user permanently', 'error');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetPassModalUser || !newPassword) return;
    try {
      await adminAPI.resetUserPassword(resetPassModalUser._id, { newPassword });
      showToast(`Password reset successfully for ${resetPassModalUser.email}`);
      setResetPassModalUser(null);
      setNewPassword('');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to reset password', 'error');
    }
  };

  const handleAddAdminNote = async (e) => {
    e.preventDefault();
    if (!selectedUserDrawer || !newAdminNote.trim()) return;
    try {
      const res = await adminAPI.addAdminNote(selectedUserDrawer._id, { note: newAdminNote });
      showToast('Admin note saved');
      setNewAdminNote('');
      setDrawerDetails((prev) => prev ? { ...prev, user: { ...prev.user, adminNotes: res.data.adminNotes } } : null);
    } catch (err) {
      showToast('Failed to add admin note', 'error');
    }
  };

  const handleToggleTag = async (tagToToggle) => {
    if (!drawerDetails?.user) return;
    const currentTags = drawerDetails.user.internalTags || [];
    const newTags = currentTags.includes(tagToToggle)
      ? currentTags.filter((t) => t !== tagToToggle)
      : [...currentTags, tagToToggle];

    try {
      const res = await adminAPI.updateInternalTags(drawerDetails.user._id, { tags: newTags });
      setDrawerDetails((prev) => prev ? { ...prev, user: { ...prev.user, internalTags: res.data.internalTags } } : null);
      showToast(`Tag ${tagToToggle} updated`);
    } catch (err) {
      showToast('Failed to update internal tags', 'error');
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedUserIds.length === 0) return;
    try {
      const res = await adminAPI.bulkUserAction(action, selectedUserIds);
      showToast(res.data?.message || 'Bulk operation completed');
      setSelectedUserIds([]);
      fetchUsers(page, limit);
    } catch (err) {
      showToast('Failed bulk operation', 'error');
    }
  };

  const handleExportCSV = () => {
    const dataToExport = selectedUserIds.length > 0
      ? users.filter((u) => selectedUserIds.includes(u._id))
      : users;

    const headers = 'Profile ID,Name,Email,Mobile,Gender,Age,City,Religion,Caste,Occupation,Completion %,Status,Verified,Reg Date\n';
    const rows = dataToExport.map((u) =>
      `"${u.profileId}","${u.fullName}","${itemValue(u, 'email')}","${itemValue(u, 'mobile')}","${u.gender}","${u.age}","${u.city}","${u.religion}","${u.caste}","${u.occupation}","${u.completionScore}%","${u.accountStatus}","${u.isVerified ? 'Yes' : 'No'}","${new Date(u.createdAt).toLocaleDateString()}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ss_matrimony_members_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const itemValue = (item, key) => item[key] || item.user?.[key] || 'N/A';

  const statCardsList = [
    { title: 'Total Members', value: topStats?.totalMembers || 0, icon: Users, color: '#0B3B91', bgColor: '#EFF6FF' },
    { title: 'Brides', value: topStats?.brides || 0, icon: Heart, color: '#EC4899', bgColor: '#FDF2F8' },
    { title: 'Grooms', value: topStats?.grooms || 0, icon: Users, color: '#3B82F6', bgColor: '#EFF6FF' },
    { title: 'Verified Members', value: topStats?.verifiedMembers || 0, icon: ShieldCheck, color: '#166534', bgColor: '#DCFCE7' },
    { title: 'Pending Verification', value: topStats?.pendingVerification || 0, icon: Clock, color: '#D97706', bgColor: '#FEF3C7' },
    { title: 'Blocked Users', value: topStats?.blockedUsers || 0, icon: UserX, color: '#DC2626', bgColor: '#FEE2E2' },
    { title: 'Online Today', value: topStats?.onlineToday || 1, icon: UserCheck, color: '#0284C7', bgColor: '#E0F2FE' },
    { title: 'New Today', value: topStats?.newToday || 0, icon: Calendar, color: '#059669', bgColor: '#D1FAE5' },
  ];

  const availableTags = ['VIP', 'Premium', 'Fraud', 'High Priority', 'Inactive', 'NRI'];

  return (
    <div>
      {/* Toast Notification Banner */}
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

      {/* Page Title & Actions */}
      <div style={{ marginBottom: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px' }}>
            User Management CRM
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.925rem', marginTop: '0.2rem' }}>
            Full member administration, profile verification, account security controls, and audit trails
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={handleExportCSV}
            className="btn-secondary"
            style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Download size={16} /> Export CSV
          </button>

          <button
            onClick={() => fetchUsers(page, limit)}
            className="btn-primary"
            style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <RotateCcw size={16} /> Refresh
          </button>
        </div>
      </div>

      {/* 8 Real-time Dynamic Statistics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
        {statCardsList.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '1.1rem 1rem',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: card.bgColor,
                  color: card.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon size={18} />
              </div>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0F172A', lineHeight: '1' }}>
                  {card.value}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '700', marginTop: '0.2rem' }}>
                  {card.title}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tab Switcher & Search / Filter Controls */}
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
        {/* Active vs Deleted Users Tab Header */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.85rem' }}>
          <button
            onClick={() => { setActiveTab('active'); setPage(1); }}
            style={{
              padding: '0.55rem 1.25rem',
              borderRadius: '20px',
              fontWeight: '800',
              fontSize: '0.85rem',
              backgroundColor: activeTab === 'active' ? '#0B3B91' : '#F1F5F9',
              color: activeTab === 'active' ? '#FFFFFF' : '#475569',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Active &amp; Pending Members ({topStats?.totalMembers || 0})
          </button>
          <button
            onClick={() => { setActiveTab('deleted'); setPage(1); }}
            style={{
              padding: '0.55rem 1.25rem',
              borderRadius: '20px',
              fontWeight: '800',
              fontSize: '0.85rem',
              backgroundColor: activeTab === 'deleted' ? '#DC2626' : '#F1F5F9',
              color: activeTab === 'deleted' ? '#FFFFFF' : '#475569',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Deleted Users Queue
          </button>
        </div>

        {/* Search & Filter Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem' }}>
          {/* Multi-field Search */}
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#64748B', marginBottom: '0.35rem' }}>
              Search (8 Fields)
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#F8FAFC', padding: '0.55rem 0.85rem', borderRadius: '10px', border: '1px solid #CBD5E1' }}>
              <Search size={16} color="#94A3B8" />
              <input
                type="text"
                placeholder="Name, ID, Email, Phone, City, Occupation, Religion, Caste..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem', width: '100%', color: '#0F172A' }}
              />
              {search && <X size={16} color="#94A3B8" style={{ cursor: 'pointer' }} onClick={() => setSearch('')} />}
            </div>
          </div>

          {/* Gender */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#64748B', marginBottom: '0.35rem' }}>Gender</label>
            <select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)} className="form-select" style={{ fontSize: '0.85rem', padding: '0.55rem' }}>
              <option value="">All Genders</option>
              <option value="bride">Bride Profiles</option>
              <option value="groom">Groom Profiles</option>
            </select>
          </div>

          {/* Account Status */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#64748B', marginBottom: '0.35rem' }}>Status</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="form-select" style={{ fontSize: '0.85rem', padding: '0.55rem' }}>
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>

          {/* Verification Status */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#64748B', marginBottom: '0.35rem' }}>Verification</label>
            <select value={verificationFilter} onChange={(e) => setVerificationFilter(e.target.value)} className="form-select" style={{ fontSize: '0.85rem', padding: '0.55rem' }}>
              <option value="">All Verifications</option>
              <option value="verified">Verified Badges</option>
              <option value="pending">Pending Queue</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Profile Completion % Range */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#64748B', marginBottom: '0.35rem' }}>Profile Completion</label>
            <select value={completionFilter} onChange={(e) => setCompletionFilter(e.target.value)} className="form-select" style={{ fontSize: '0.85rem', padding: '0.55rem' }}>
              <option value="">All Ranges</option>
              <option value="0-25">0% – 25%</option>
              <option value="25-50">25% – 50%</option>
              <option value="50-75">50% – 75%</option>
              <option value="75-100">75% – 100%</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#64748B', marginBottom: '0.35rem' }}>Sort Order</label>
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="form-select" style={{ fontSize: '0.85rem', padding: '0.55rem' }}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="active">Recently Active</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedUserIds.length > 0 && (
        <div
          style={{
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            borderRadius: '12px',
            padding: '0.85rem 1.25rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ fontSize: '0.875rem', fontWeight: '700' }}>
            {selectedUserIds.length} user account(s) selected
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => handleBulkAction('verify')} style={{ backgroundColor: '#166534', color: '#FFF', border: 'none', padding: '0.4rem 0.85rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}>Verify Selected</button>
            <button onClick={() => handleBulkAction('block')} style={{ backgroundColor: '#D97706', color: '#FFF', border: 'none', padding: '0.4rem 0.85rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}>Block Selected</button>
            <button onClick={() => handleBulkAction('delete')} style={{ backgroundColor: '#DC2626', color: '#FFF', border: 'none', padding: '0.4rem 0.85rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}>Soft Delete Selected</button>
            <button onClick={handleExportCSV} style={{ backgroundColor: '#0284C7', color: '#FFF', border: 'none', padding: '0.4rem 0.85rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}>Export Selected CSV</button>
          </div>
        </div>
      )}

      {/* Members Data Table */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#0B3B91', fontWeight: '700' }}>
            Querying MongoDB member database...
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#0B3B91', color: '#FFFFFF' }}>
                  <th style={{ padding: '0.9rem 1rem', width: '40px' }}>
                    <input type="checkbox" onChange={handleSelectAll} checked={users.length > 0 && selectedUserIds.length === users.length} style={{ accentColor: '#D4A017', cursor: 'pointer' }} />
                  </th>
                  <th style={{ padding: '0.9rem 1rem' }}>User Profile</th>
                  <th style={{ padding: '0.9rem 1rem' }}>Profile ID</th>
                  <th style={{ padding: '0.9rem 1rem' }}>Gender / Age</th>
                  <th style={{ padding: '0.9rem 1rem' }}>City / Location</th>
                  <th style={{ padding: '0.9rem 1rem' }}>Religion / Caste</th>
                  <th style={{ padding: '0.9rem 1rem' }}>Occupation</th>
                  <th style={{ padding: '0.9rem 1rem' }}>Completion %</th>
                  <th style={{ padding: '0.9rem 1rem' }}>Verification</th>
                  <th style={{ padding: '0.9rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.9rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={11} style={{ textAlign: 'center', padding: '3.5rem', color: '#64748B' }}>
                      No member profiles found matching current search and filter criteria.
                    </td>
                  </tr>
                ) : (
                  users.map((item) => (
                    <tr key={item._id} style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: item.isDeleted ? '#FEF2F2' : '#FFFFFF' }}>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <input type="checkbox" checked={selectedUserIds.includes(item._id)} onChange={() => handleToggleSelect(item._id)} style={{ accentColor: '#0B3B91', cursor: 'pointer' }} />
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div onClick={() => handleOpenDrawer(item)} style={{ fontWeight: '800', color: '#0B3B91', cursor: 'pointer' }}>
                          {item.fullName}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#64748B' }}>{itemValue(item, 'email')}</div>
                        {item.internalTags?.length > 0 && (
                          <div style={{ display: 'flex', gap: '0.2rem', marginTop: '0.2rem' }}>
                            {item.internalTags.map((t, idx) => (
                              <span key={idx} style={{ fontSize: '0.65rem', fontWeight: '800', backgroundColor: '#FEF3C7', color: '#92400E', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>

                      <td style={{ padding: '0.85rem 1rem', fontWeight: '700', color: '#334155' }}>
                        {item.profileId}
                      </td>

                      <td style={{ padding: '0.85rem 1rem', textTransform: 'capitalize', color: '#475569' }}>
                        {item.gender || 'N/A'} {item.age !== 'N/A' ? `(${item.age}y)` : ''}
                      </td>

                      <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>{item.city}</td>

                      <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: '#475569' }}>
                        {item.religion} • {item.caste}
                      </td>

                      <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: '#475569' }}>
                        {item.occupation}
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <div style={{ flexGrow: 1, height: '6px', backgroundColor: '#E2E8F0', borderRadius: '3px', overflow: 'hidden', width: '50px' }}>
                            <div style={{ width: `${item.completionScore}%`, height: '100%', backgroundColor: item.completionScore > 75 ? '#166534' : item.completionScore > 40 ? '#D97706' : '#DC2626' }} />
                          </div>
                          <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#475569' }}>{item.completionScore}%</span>
                        </div>
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        {item.isVerified ? (
                          <span style={{ color: '#166534', backgroundColor: '#DCFCE7', padding: '0.25rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '800' }}>Verified</span>
                        ) : item.idVerificationStatus === 'Rejected' ? (
                          <span style={{ color: '#991B1B', backgroundColor: '#FEE2E2', padding: '0.25rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '800' }}>Rejected</span>
                        ) : (
                          <span style={{ color: '#64748B', backgroundColor: '#F1F5F9', padding: '0.25rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '700' }}>Unverified</span>
                        )}
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        {item.accountStatus === 'blocked' ? (
                          <span style={{ color: '#991B1B', backgroundColor: '#FEE2E2', padding: '0.25rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '800' }}>Blocked</span>
                        ) : item.accountStatus === 'deleted' ? (
                          <span style={{ color: '#78350F', backgroundColor: '#FEF3C7', padding: '0.25rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '800' }}>Deleted</span>
                        ) : (
                          <span style={{ color: '#166534', backgroundColor: '#F0FDF4', padding: '0.25rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '800' }}>Active</span>
                        )}
                      </td>

                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.3rem' }}>
                          <button onClick={() => handleOpenDrawer(item)} style={{ backgroundColor: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE', padding: '0.3rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}>View</button>
                          <button onClick={() => handleOpenEditModal(item)} style={{ backgroundColor: '#F8FAFC', color: '#334155', border: '1px solid #CBD5E1', padding: '0.3rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}>Edit</button>
                          
                          {activeTab === 'deleted' ? (
                            <button onClick={() => handleRestoreUser(item._id)} style={{ backgroundColor: '#DCFCE7', color: '#166534', border: '1px solid #86EFAC', padding: '0.3rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}>Restore</button>
                          ) : (
                            <button onClick={() => handleSoftDelete(item._id, itemValue(item, 'email'))} style={{ backgroundColor: '#FEF2F2', color: '#991B1B', border: '1px solid #FCA5A5', padding: '0.3rem 0.5rem', borderRadius: '6px', cursor: 'pointer' }}><Trash2 size={13} /></button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', borderTop: '1px solid #E2E8F0', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: '#64748B' }}>
            <span>Records per page:</span>
            <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }} className="form-select" style={{ padding: '0.3rem 0.6rem', fontSize: '0.85rem', width: 'auto' }}>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>Showing {users.length} of {total} records</span>
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

      {/* FULL MEMBER PROFILE DRAWER (6 TABBED PANELS) */}
      {selectedUserDrawer && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            justifyContent: 'flex-end',
            zIndex: 2500,
          }}
          onClick={() => setSelectedUserDrawer(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '680px',
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
              {/* Drawer Header */}
              <div style={{ marginBottom: '1.25rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '1rem', position: 'relative' }}>
                <button onClick={() => setSelectedUserDrawer(null)} style={{ position: 'absolute', top: 0, right: 0, background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={20} />
                </button>

                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#D4A017', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Member Management Console
                </span>
                <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0B3B91', marginTop: '0.2rem' }}>
                  {selectedUserDrawer.fullName}
                </h3>
                <div style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.15rem' }}>
                  Profile ID: <strong style={{ color: '#0F172A' }}>{selectedUserDrawer.profileId}</strong> • Registered: {new Date(selectedUserDrawer.createdAt).toLocaleDateString()}
                </div>
              </div>

              {/* Drawer 6 Navigation Tabs */}
              <div style={{ display: 'flex', gap: '0.4rem', borderBottom: '2px solid #E2E8F0', marginBottom: '1.5rem', overflowX: 'auto' }}>
                {[
                  { id: 'details', label: 'Basic Details' },
                  { id: 'career', label: 'Family & Career' },
                  { id: 'verification', label: 'ID Verification' },
                  { id: 'activity', label: 'Login & Activity' },
                  { id: 'interests', label: 'Interests & Requests' },
                  { id: 'notes', label: 'Notes & Tags' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setDrawerActiveTab(t.id)}
                    style={{
                      padding: '0.6rem 0.9rem',
                      fontWeight: '700',
                      fontSize: '0.82rem',
                      border: 'none',
                      borderBottom: drawerActiveTab === t.id ? '3px solid #0B3B91' : '3px solid transparent',
                      color: drawerActiveTab === t.id ? '#0B3B91' : '#64748B',
                      background: 'none',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {drawerLoading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#0B3B91', fontWeight: '700' }}>
                  Fetching live member details from MongoDB...
                </div>
              ) : (
                <>
                  {/* TAB 1: BASIC DETAILS */}
                  {drawerActiveTab === 'details' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {/* Photos Carousel */}
                      {selectedUserDrawer.photos?.length > 0 && (
                        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
                          {selectedUserDrawer.photos.map((ph, idx) => (
                            <img key={idx} src={ph} alt="Member photo" style={{ width: '100px', height: '110px', borderRadius: '12px', objectFit: 'cover', border: '1.5px solid #D4A017' }} />
                          ))}
                        </div>
                      )}

                      <div style={{ backgroundColor: '#F8FAFC', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#64748B' }}>Email Address</span>
                          <strong>{itemValue(selectedUserDrawer, 'email')}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#64748B' }}>Mobile Phone</span>
                          <strong>{itemValue(selectedUserDrawer, 'mobile')}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#64748B' }}>Gender &amp; Age</span>
                          <strong style={{ textTransform: 'capitalize' }}>{selectedUserDrawer.gender || 'N/A'} ({selectedUserDrawer.age || 'N/A'} yrs)</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#64748B' }}>Religion &amp; Caste</span>
                          <strong>{selectedUserDrawer.religion} • {selectedUserDrawer.caste}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#64748B' }}>City &amp; State</span>
                          <strong>{selectedUserDrawer.city}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#64748B' }}>Completeness Score</span>
                          <strong style={{ color: '#0B3B91' }}>{selectedUserDrawer.completionScore}%</strong>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: FAMILY & CAREER */}
                  {drawerActiveTab === 'career' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.88rem' }}>
                      <div style={{ backgroundColor: '#F8FAFC', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0B3B91', margin: 0 }}>Education &amp; Occupation</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#64748B' }}>Highest Qualification</span>
                          <strong>{selectedUserDrawer.highestEducation || 'N/A'}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#64748B' }}>Occupation / Role</span>
                          <strong>{selectedUserDrawer.occupation || 'N/A'}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#64748B' }}>Company Name</span>
                          <strong>{drawerDetails?.profile?.company || 'N/A'}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#64748B' }}>Annual Income</span>
                          <strong>{selectedUserDrawer.annualIncome || 'N/A'}</strong>
                        </div>
                      </div>

                      <div style={{ backgroundColor: '#F8FAFC', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0B3B91', margin: 0 }}>Family Background</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#64748B' }}>Father's Occupation</span>
                          <strong>{drawerDetails?.profile?.fatherOccupation || 'N/A'}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#64748B' }}>Mother's Occupation</span>
                          <strong>{drawerDetails?.profile?.motherOccupation || 'N/A'}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#64748B' }}>Family Type &amp; Status</span>
                          <strong>{drawerDetails?.profile?.familyType || 'Nuclear'} • {drawerDetails?.profile?.familyStatus || 'Middle Class'}</strong>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: ID VERIFICATION */}
                  {drawerActiveTab === 'verification' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      <div style={{ padding: '1rem', borderRadius: '12px', backgroundColor: selectedUserDrawer.isVerified ? '#DCFCE7' : '#FEF3C7', border: '1px solid #FDE68A', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong style={{ fontSize: '0.95rem', color: selectedUserDrawer.isVerified ? '#166534' : '#92400E' }}>
                            {selectedUserDrawer.isVerified ? '✓ Government ID Verified' : `Status: ${selectedUserDrawer.idVerificationStatus || 'Unverified'}`}
                          </strong>
                          <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.2rem' }}>
                            Official government document review workflow
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <button onClick={() => handleVerifyProfile(selectedUserDrawer.profile?._id || selectedUserDrawer._id)} style={{ backgroundColor: '#166534', color: '#FFF', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '800', cursor: 'pointer' }}>Approve Badge</button>
                        </div>
                      </div>

                      {drawerDetails?.profile?.idDocumentUrl ? (
                        <div>
                          <label style={{ fontWeight: '700', fontSize: '0.85rem', color: '#0F172A' }}>Uploaded ID Document Preview</label>
                          <img src={drawerDetails.profile.idDocumentUrl} alt="Government ID" style={{ width: '100%', maxHeight: '250px', objectFit: 'contain', borderRadius: '12px', border: '1px solid #CBD5E1', marginTop: '0.5rem' }} />
                        </div>
                      ) : (
                        <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#F8FAFC', borderRadius: '12px', color: '#94A3B8', fontSize: '0.875rem' }}>
                          No government ID document uploaded yet by user.
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 4: ACTIVITY & LOGIN HISTORY */}
                  {drawerActiveTab === 'activity' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0B3B91', margin: 0 }}>Login Session History</h4>
                      {drawerDetails?.user?.loginHistory?.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {drawerDetails.user.loginHistory.map((lh, i) => (
                            <div key={i} style={{ padding: '0.65rem', borderRadius: '8px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between' }}>
                              <span>IP: {lh.ipAddress} ({lh.userAgent})</span>
                              <strong>{new Date(lh.loginTime).toLocaleString()}</strong>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ fontSize: '0.85rem', color: '#64748B' }}>Last Login Timestamp: {selectedUserDrawer.lastLogin ? new Date(selectedUserDrawer.lastLogin).toLocaleString() : 'Registered Recently'}</div>
                      )}
                    </div>
                  )}

                  {/* TAB 5: INTERESTS & REQUESTS */}
                  {drawerActiveTab === 'interests' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.85rem' }}>
                      <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0B3B91', marginBottom: '0.5rem' }}>Received Expressed Interests</h4>
                        {drawerDetails?.receivedInterests?.length > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {drawerDetails.receivedInterests.map((int, i) => (
                              <div key={i} style={{ padding: '0.65rem', borderRadius: '8px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between' }}>
                                <span>From: <strong>{int.senderProfile?.fullName || 'Member Profile'}</strong></span>
                                <span style={{ fontWeight: '800', color: int.status === 'accepted' ? '#166534' : '#D97706' }}>{int.status}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div style={{ color: '#94A3B8' }}>No interest requests received yet.</div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* TAB 6: ADMIN NOTES & INTERNAL TAGS */}
                  {drawerActiveTab === 'notes' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      {/* Internal Tags Selector */}
                      <div>
                        <label style={{ fontWeight: '800', fontSize: '0.85rem', color: '#0F172A' }}>Internal Admin Tags (Hidden from Users)</label>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                          {availableTags.map((tag) => {
                            const isTagged = drawerDetails?.user?.internalTags?.includes(tag);
                            return (
                              <button
                                key={tag}
                                onClick={() => handleToggleTag(tag)}
                                style={{
                                  padding: '0.35rem 0.85rem',
                                  borderRadius: '20px',
                                  fontSize: '0.78rem',
                                  fontWeight: '800',
                                  cursor: 'pointer',
                                  backgroundColor: isTagged ? '#0B3B91' : '#F1F5F9',
                                  color: isTagged ? '#FFFFFF' : '#475569',
                                  border: isTagged ? '1.5px solid #D4A017' : '1px solid #CBD5E1',
                                }}
                              >
                                {isTagged ? `✓ ${tag}` : `+ ${tag}`}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Private Admin Notes */}
                      <div>
                        <label style={{ fontWeight: '800', fontSize: '0.85rem', color: '#0F172A' }}>Private Admin Notes</label>
                        <form onSubmit={handleAddAdminNote} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                          <input
                            type="text"
                            placeholder="Add private note visible only to admins..."
                            value={newAdminNote}
                            onChange={(e) => setNewAdminNote(e.target.value)}
                            className="form-input"
                            style={{ fontSize: '0.85rem', flexGrow: 1 }}
                          />
                          <button type="submit" className="btn-gold" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', borderRadius: '8px' }}>Save Note</button>
                        </form>

                        {drawerDetails?.user?.adminNotes?.length > 0 && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                            {drawerDetails.user.adminNotes.map((n, i) => (
                              <div key={i} style={{ padding: '0.65rem', borderRadius: '8px', backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', fontSize: '0.82rem' }}>
                                <div style={{ fontWeight: '700', color: '#92400E' }}>"{n.note}"</div>
                                <div style={{ fontSize: '0.72rem', color: '#78350F', marginTop: '0.2rem' }}>By {n.adminEmail} • {new Date(n.createdAt).toLocaleDateString()}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Admin Controls Footer in Drawer */}
            <div style={{ borderTop: '2px solid #E2E8F0', paddingTop: '1.25rem', marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button onClick={() => handleOpenEditModal(selectedUserDrawer)} style={{ backgroundColor: '#0B3B91', color: '#FFF', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}>Edit User Profile</button>
                <button onClick={() => setResetPassModalUser(selectedUserDrawer)} style={{ backgroundColor: '#D4A017', color: '#FFF', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}>Reset Password</button>
                
                {selectedUserDrawer.accountStatus === 'blocked' ? (
                  <button onClick={() => handleUnblockUser(selectedUserDrawer._id)} style={{ backgroundColor: '#DCFCE7', color: '#166534', border: '1px solid #86EFAC', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}>Unblock User</button>
                ) : (
                  <button onClick={() => handleOpenBlockModal(selectedUserDrawer)} style={{ backgroundColor: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A5', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}>Block User</button>
                )}

                <button onClick={() => handlePermanentDelete(selectedUserDrawer._id, itemValue(selectedUserDrawer, 'email'))} style={{ backgroundColor: '#991B1B', color: '#FFF', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}>Permanent Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {editModalUser && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', zIndex: 2600 }} onClick={() => setEditModalUser(null)}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', maxWidth: '650px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', boxShadow: '0 25px 60px rgba(0,0,0,0.3)', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setEditModalUser(null)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={20} /></button>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0B3B91', marginBottom: '1.25rem' }}>Edit Member Profile</h3>

            <form onSubmit={handleSaveEditUser} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Full Name *</label>
                <input type="text" className="form-input" value={editFormData.fullName} onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })} required />
              </div>
              <div>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Email Address *</label>
                <input type="email" className="form-input" value={editFormData.email} onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })} required />
              </div>
              <div>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Mobile Phone *</label>
                <input type="text" className="form-input" value={editFormData.mobile} onChange={(e) => setEditFormData({ ...editFormData, mobile: e.target.value })} required />
              </div>
              <div>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Gender</label>
                <select className="form-select" value={editFormData.gender} onChange={(e) => setEditFormData({ ...editFormData, gender: e.target.value })}>
                  <option value="bride">Bride</option>
                  <option value="groom">Groom</option>
                </select>
              </div>
              <div>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Religion</label>
                <input type="text" className="form-input" value={editFormData.religion} onChange={(e) => setEditFormData({ ...editFormData, religion: e.target.value })} />
              </div>
              <div>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Caste</label>
                <input type="text" className="form-input" value={editFormData.caste} onChange={(e) => setEditFormData({ ...editFormData, caste: e.target.value })} />
              </div>
              <div>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>City</label>
                <input type="text" className="form-input" value={editFormData.city} onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })} />
              </div>
              <div>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Occupation</label>
                <input type="text" className="form-input" value={editFormData.occupation} onChange={(e) => setEditFormData({ ...editFormData, occupation: e.target.value })} />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>About Member</label>
                <textarea rows={3} className="form-textarea" value={editFormData.aboutMe} onChange={(e) => setEditFormData({ ...editFormData, aboutMe: e.target.value })} />
              </div>

              <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setEditModalUser(null)} className="btn-secondary" style={{ padding: '0.6rem 1.25rem', borderRadius: '30px' }}>Cancel</button>
                <button type="submit" className="btn-gold" style={{ padding: '0.6rem 1.5rem', borderRadius: '30px' }}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BLOCK USER MODAL */}
      {blockModalUser && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', zIndex: 2600 }} onClick={() => setBlockModalUser(null)}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', maxWidth: '500px', width: '100%', padding: '2rem', boxShadow: '0 25px 60px rgba(0,0,0,0.3)', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setBlockModalUser(null)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={20} /></button>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#DC2626', marginBottom: '0.25rem' }}>Block Member Account</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1.25rem' }}>Account: <strong>{blockModalUser.email}</strong></p>

            <form onSubmit={handleConfirmBlock}>
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ fontSize: '0.82rem' }}>Block Duration</label>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.35rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                    <input type="radio" name="blockType" value="Permanent" checked={blockType === 'Permanent'} onChange={() => setBlockType('Permanent')} /> Permanent Block
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                    <input type="radio" name="blockType" value="Temporary" checked={blockType === 'Temporary'} onChange={() => setBlockType('Temporary')} /> Temporary Block
                  </label>
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label" style={{ fontSize: '0.82rem' }}>Reason for Blocking *</label>
                <textarea rows={3} className="form-textarea" value={blockReason} onChange={(e) => setBlockReason(e.target.value)} required placeholder="Provide reason for restricting access..." />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setBlockModalUser(null)} className="btn-secondary" style={{ padding: '0.6rem 1.25rem', borderRadius: '30px' }}>Cancel</button>
                <button type="submit" style={{ backgroundColor: '#DC2626', color: '#FFF', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '30px', fontWeight: '700', cursor: 'pointer' }}>Block Account</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESET PASSWORD MODAL */}
      {resetPassModalUser && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', zIndex: 2600 }} onClick={() => setResetPassModalUser(null)}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', maxWidth: '450px', width: '100%', padding: '2rem', boxShadow: '0 25px 60px rgba(0,0,0,0.3)', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setResetPassModalUser(null)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={20} /></button>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0B3B91', marginBottom: '0.25rem' }}>Reset Password</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1.25rem' }}>For account: <strong>{resetPassModalUser.email}</strong></p>

            <form onSubmit={handleResetPassword}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label" style={{ fontSize: '0.82rem' }}>New Admin-Assigned Password *</label>
                <input type="text" className="form-input" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={8} placeholder="e.g. ResetPass@2026" />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setResetPassModalUser(null)} className="btn-secondary" style={{ padding: '0.6rem 1.25rem', borderRadius: '30px' }}>Cancel</button>
                <button type="submit" className="btn-gold" style={{ padding: '0.6rem 1.5rem', borderRadius: '30px' }}>Update Password</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
