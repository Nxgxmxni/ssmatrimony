import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import {
  Users,
  Heart,
  ShieldCheck,
  Sparkles,
  Mail,
  Clock,
  UserCheck,
  UserX,
  Calendar,
  Eye,
  CheckCircle,
  XCircle,
  RotateCcw,
  Edit,
  Trash2,
  Send,
  X,
  Check,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  AlertOctagon,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState({ type: '', text: '' });

  // Selected Profile Drawer State
  const [selectedUserDrawer, setSelectedUserDrawer] = useState(null);

  // Contact Reply Modal State
  const [replyModalMessage, setReplyModalMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getStats();
      setStats(res.data || null);
    } catch (err) {
      console.error('Error fetching admin dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const showToast = (text, type = 'success') => {
    setActionMsg({ type, text });
    setTimeout(() => setActionMsg({ type: '', text: '' }), 4000);
  };

  // Profile Actions
  const handleVerifyProfile = async (profileId) => {
    try {
      await adminAPI.toggleVerify(profileId, { action: 'approve' });
      showToast('Profile verification status updated to Verified');
      fetchDashboardStats();
      if (selectedUserDrawer) setSelectedUserDrawer(null);
    } catch (err) {
      showToast('Failed to verify profile', 'error');
    }
  };

  const handleUpdateStatus = async (userId, status) => {
    try {
      await adminAPI.updateUserStatus(userId, status);
      showToast(`User account status updated to ${status}`);
      fetchDashboardStats();
      if (selectedUserDrawer) setSelectedUserDrawer(null);
    } catch (err) {
      showToast('Failed to update account status', 'error');
    }
  };

  const handleDeleteUser = async (userId, email) => {
    if (!window.confirm(`Are you sure you want to permanently delete account ${email}?`)) return;
    try {
      await adminAPI.deleteUser(userId);
      showToast(`Account ${email} deleted successfully`);
      fetchDashboardStats();
      if (selectedUserDrawer) setSelectedUserDrawer(null);
    } catch (err) {
      showToast('Failed to delete account', 'error');
    }
  };

  // Verification Actions
  const handleProcessVerification = async (profileId, action) => {
    try {
      await adminAPI.toggleVerify(profileId, { action });
      showToast(`Verification process set to ${action}`);
      fetchDashboardStats();
    } catch (err) {
      showToast('Failed to update verification', 'error');
    }
  };

  // Contact Actions
  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyModalMessage || !replyText.trim()) return;

    try {
      setSendingReply(true);
      await adminAPI.replyContact(replyModalMessage._id, replyText);
      showToast(`Reply sent successfully to ${replyModalMessage.email}`);
      setReplyModalMessage(null);
      setReplyText('');
      fetchDashboardStats();
    } catch (err) {
      showToast('Failed to send reply email', 'error');
    } finally {
      setSendingReply(false);
    }
  };

  const handleUpdateContactStatus = async (msgId, status) => {
    try {
      await adminAPI.updateContactStatus(msgId, status);
      showToast(`Message marked as ${status}`);
      fetchDashboardStats();
    } catch (err) {
      showToast('Failed to update message status', 'error');
    }
  };

  const handleDeleteContact = async (msgId) => {
    try {
      await adminAPI.deleteContact(msgId);
      showToast('Contact message deleted');
      fetchDashboardStats();
    } catch (err) {
      showToast('Failed to delete message', 'error');
    }
  };

  // 10 Dynamic Cards Data
  const statCardsData = [
    { title: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: '#0B3B91', bgColor: '#EFF6FF', subtext: 'Registered accounts' },
    { title: 'Brides', value: stats?.totalBrides || 0, icon: Heart, color: '#EC4899', bgColor: '#FDF2F8', subtext: 'Bride profiles' },
    { title: 'Grooms', value: stats?.totalGrooms || 0, icon: Users, color: '#3B82F6', bgColor: '#EFF6FF', subtext: 'Groom profiles' },
    { title: 'Verified Users', value: stats?.verifiedProfiles || 0, icon: ShieldCheck, color: '#166534', bgColor: '#DCFCE7', subtext: 'ID Verified' },
    { title: 'Pending Verification', value: stats?.pendingVerifications || 0, icon: Clock, color: '#D97706', bgColor: '#FEF3C7', subtext: 'Awaiting review' },
    { title: 'Blocked Users', value: stats?.blockedUsers || 0, icon: UserX, color: '#DC2626', bgColor: '#FEE2E2', subtext: 'Account restricted' },
    { title: 'Success Stories', value: stats?.publishedSuccessStories || 0, icon: Sparkles, color: '#D4A017', bgColor: '#FFF9E6', subtext: 'Published weddings' },
    { title: 'Unread Messages', value: stats?.unreadMessages || 0, icon: Mail, color: '#8B5CF6', bgColor: '#F3E8FF', subtext: 'Support enquiries' },
    { title: 'Today Registrations', value: stats?.todayRegistrations || 0, icon: UserCheck, color: '#0284C7', bgColor: '#E0F2FE', subtext: 'Joined today' },
    { title: 'Monthly Registrations', value: stats?.monthlyRegistrations || 0, icon: Calendar, color: '#059669', bgColor: '#D1FAE5', subtext: 'Joined this month' },
  ];

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

      {/* Page Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px' }}>
              System Administration Dashboard
            </h1>
            <p style={{ color: '#64748B', fontSize: '0.925rem', marginTop: '0.2rem' }}>
              Real-time platform analytics, user accounts, verifications, and support communications
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#FFFFFF', padding: '0.5rem 1rem', borderRadius: '30px', border: '1px solid #E2E8F0', fontSize: '0.85rem', fontWeight: '700', color: '#166534' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22C55E' }} />
            MongoDB Operational
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem 0', color: '#0B3B91', fontWeight: '700' }}>
          Calculating dynamic statistics from MongoDB...
        </div>
      ) : (
        <>
          {/* 10 Dynamic Statistics Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.15rem', marginBottom: '2.5rem' }}>
            {statCardsData.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '1.25rem 1.1rem',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: '700' }}>{card.title}</span>
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
                      }}
                    >
                      <Icon size={20} />
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0F172A', lineHeight: '1' }}>
                      {card.value}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.35rem', fontWeight: '600' }}>
                      {card.subtext}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 4 Functional Overview Sections */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '1.75rem' }}>
            
            {/* SECTION 1: RECENT REGISTRATIONS */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '1.5rem',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.03)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.85rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Users size={18} color="#0B3B91" /> Recent Registrations
                </h3>
                <Link to="/admin/users" style={{ fontSize: '0.78rem', fontWeight: '700', color: '#0B3B91', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  View All ({stats?.totalUsers}) <ChevronRight size={14} />
                </Link>
              </div>

              {stats?.recentRegistrations?.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ color: '#64748B', borderBottom: '1px solid #E2E8F0' }}>
                        <th style={{ padding: '0.5rem 0.5rem' }}>User</th>
                        <th style={{ padding: '0.5rem 0.5rem' }}>Gender</th>
                        <th style={{ padding: '0.5rem 0.5rem' }}>Status</th>
                        <th style={{ padding: '0.5rem 0.5rem', textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentRegistrations.map((u) => (
                        <tr key={u._id} style={{ borderBottom: '1px solid #F8FAFC' }}>
                          <td style={{ padding: '0.65rem 0.5rem' }}>
                            <div
                              onClick={() => setSelectedUserDrawer(u)}
                              style={{ fontWeight: '700', color: '#0B3B91', cursor: 'pointer' }}
                            >
                              {u.fullName}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{u.email}</div>
                          </td>
                          <td style={{ padding: '0.65rem 0.5rem', textTransform: 'capitalize', color: '#475569' }}>{u.gender || 'N/A'}</td>
                          <td style={{ padding: '0.65rem 0.5rem' }}>
                            {u.accountStatus === 'blocked' ? (
                              <span style={{ color: '#DC2626', fontWeight: '700', fontSize: '0.75rem' }}>Blocked</span>
                            ) : u.accountStatus === 'suspended' ? (
                              <span style={{ color: '#D97706', fontWeight: '700', fontSize: '0.75rem' }}>Suspended</span>
                            ) : u.isVerified ? (
                              <span style={{ color: '#166534', fontWeight: '700', fontSize: '0.75rem' }}>Verified</span>
                            ) : (
                              <span style={{ color: '#94A3B8', fontSize: '0.75rem' }}>Active</span>
                            )}
                          </td>
                          <td style={{ padding: '0.65rem 0.5rem', textAlign: 'right' }}>
                            <button
                              onClick={() => setSelectedUserDrawer(u)}
                              style={{
                                backgroundColor: '#EFF6FF',
                                color: '#1D4ED8',
                                border: '1px solid #BFDBFE',
                                padding: '0.3rem 0.6rem',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                              }}
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.9rem' }}>
                  No recent registrations available.
                </div>
              )}
            </div>

            {/* SECTION 2: PENDING VERIFICATIONS */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '1.5rem',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.03)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.85rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ShieldCheck size={18} color="#D97706" /> Pending Verifications
                </h3>
                <Link to="/admin/verifications" style={{ fontSize: '0.78rem', fontWeight: '700', color: '#D97706', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  Queue ({stats?.pendingVerifications}) <ChevronRight size={14} />
                </Link>
              </div>

              {stats?.pendingVerificationList?.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {stats.pendingVerificationList.map((p) => (
                    <div key={p._id} style={{ padding: '0.85rem 1rem', borderRadius: '12px', backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#92400E' }}>{p.fullName}</div>
                        <div style={{ fontSize: '0.78rem', color: '#B45309' }}>
                          {p.user?.email || 'N/A'} • {p.city || 'Hyderabad'}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button
                          onClick={() => handleProcessVerification(p._id, 'approve')}
                          style={{ backgroundColor: '#DCFCE7', color: '#166534', border: '1px solid #86EFAC', padding: '0.3rem 0.65rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer' }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleProcessVerification(p._id, 'reupload')}
                          style={{ backgroundColor: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE', padding: '0.3rem 0.65rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer' }}
                        >
                          Ask Re-upload
                        </button>
                        <button
                          onClick={() => handleProcessVerification(p._id, 'reject')}
                          style={{ backgroundColor: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A5', padding: '0.3rem 0.65rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer' }}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#166534', fontWeight: '700', fontSize: '0.9rem' }}>
                  ✓ All verification requests up to date!
                </div>
              )}
            </div>

            {/* SECTION 3: LATEST SUCCESS STORIES */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '1.5rem',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.03)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.85rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Sparkles size={18} color="#D4A017" /> Latest Success Stories
                </h3>
                <Link to="/admin/success-stories" style={{ fontSize: '0.78rem', fontWeight: '700', color: '#D4A017', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  View All CMS <ChevronRight size={14} />
                </Link>
              </div>

              {stats?.latestSuccessStories?.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {stats.latestSuccessStories.map((story) => (
                    <div key={story._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', borderRadius: '10px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={story.featuredImage || story.images?.[0] || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=150&q=80'}
                          alt={story.coupleNames}
                          style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#0F172A' }}>{story.coupleNames}</div>
                          <div style={{ fontSize: '0.78rem', color: '#64748B' }}>{story.location} • {story.weddingDate}</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.3rem' }}>
                        <Link
                          to="/success-stories/all"
                          style={{ backgroundColor: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE', padding: '0.3rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', textDecoration: 'none', fontWeight: '700' }}
                        >
                          View
                        </Link>
                        <Link
                          to="/admin/success-stories"
                          style={{ backgroundColor: '#F8FAFC', color: '#334155', border: '1px solid #CBD5E1', padding: '0.3rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', textDecoration: 'none', fontWeight: '700' }}
                        >
                          Manage
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.9rem' }}>
                  No published success stories available yet.
                </div>
              )}
            </div>

            {/* SECTION 4: RECENT CONTACT MESSAGES */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '1.5rem',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.03)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.85rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Mail size={18} color="#8B5CF6" /> Recent Contact Messages
                </h3>
                <Link to="/admin/contact" style={{ fontSize: '0.78rem', fontWeight: '700', color: '#8B5CF6', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  Inbox ({stats?.unreadMessages}) <ChevronRight size={14} />
                </Link>
              </div>

              {stats?.recentContactMessages?.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {stats.recentContactMessages.map((msg) => (
                    <div key={msg._id} style={{ padding: '0.85rem 1rem', borderRadius: '12px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: '800', color: '#0F172A' }}>{msg.name}</div>
                        <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: '600' }}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0B3B91', marginBottom: '0.2rem' }}>
                        {msg.subject}
                      </div>

                      <div style={{ fontSize: '0.78rem', color: '#475569', lineHeight: '1.4', marginBottom: '0.65rem' }}>
                        "{msg.message.length > 80 ? msg.message.slice(0, 80) + '...' : msg.message}"
                      </div>

                      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => setReplyModalMessage(msg)}
                          style={{ backgroundColor: '#0B3B91', color: '#FFFFFF', border: 'none', padding: '0.3rem 0.65rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                        >
                          <Send size={12} /> Reply
                        </button>
                        <button
                          onClick={() => handleUpdateContactStatus(msg._id, 'Resolved')}
                          style={{ backgroundColor: '#DCFCE7', color: '#166534', border: '1px solid #86EFAC', padding: '0.3rem 0.65rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}
                        >
                          Mark Resolved
                        </button>
                        <button
                          onClick={() => handleDeleteContact(msg._id)}
                          style={{ backgroundColor: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A5', padding: '0.3rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' }}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.9rem' }}>
                  No recent contact messages received.
                </div>
              )}
            </div>

          </div>
        </>
      )}

      {/* USER PROFILE DRAWER / MODAL */}
      {selectedUserDrawer && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
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
              maxWidth: '520px',
              backgroundColor: '#FFFFFF',
              height: '100%',
              overflowY: 'auto',
              padding: '2rem',
              boxShadow: '-10px 0 30px rgba(0,0,0,0.2)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedUserDrawer(null)}
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
              }}
            >
              <X size={20} />
            </button>

            <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#D4A017', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Profile Overview Drawer
              </span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0B3B91', marginTop: '0.2rem' }}>
                {selectedUserDrawer.fullName}
              </h3>
              <div style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.15rem' }}>
                Profile ID: <strong style={{ color: '#0F172A' }}>{selectedUserDrawer.profileId}</strong>
              </div>
            </div>

            {/* Profile Photos */}
            {selectedUserDrawer.photos?.length > 0 ? (
              <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', marginBottom: '1.5rem' }}>
                {selectedUserDrawer.photos.map((photo, i) => (
                  <img
                    key={i}
                    src={photo}
                    alt="Member photo"
                    style={{ width: '90px', height: '100px', borderRadius: '12px', objectFit: 'cover', border: '1.5px solid #D4A017' }}
                  />
                ))}
              </div>
            ) : (
              <div style={{ padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: '12px', textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                No photo uploaded yet
              </div>
            )}

            {/* Account Metadata List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.5rem' }}>
                <span style={{ color: '#64748B' }}>Email Address</span>
                <strong style={{ color: '#0F172A' }}>{selectedUserDrawer.email}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.5rem' }}>
                <span style={{ color: '#64748B' }}>Mobile Phone</span>
                <strong style={{ color: '#0F172A' }}>{selectedUserDrawer.mobile}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.5rem' }}>
                <span style={{ color: '#64748B' }}>Gender &amp; Role</span>
                <strong style={{ color: '#0F172A', textTransform: 'capitalize' }}>{selectedUserDrawer.gender} ({selectedUserDrawer.role})</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.5rem' }}>
                <span style={{ color: '#64748B' }}>Registration Date</span>
                <strong style={{ color: '#0F172A' }}>{new Date(selectedUserDrawer.createdAt).toLocaleDateString()}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.5rem' }}>
                <span style={{ color: '#64748B' }}>Verification Badge</span>
                <strong style={{ color: selectedUserDrawer.isVerified ? '#166534' : '#D97706' }}>
                  {selectedUserDrawer.isVerified ? '✓ Verified Member' : 'Unverified'}
                </strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.5rem' }}>
                <span style={{ color: '#64748B' }}>Account Status</span>
                <strong style={{ color: selectedUserDrawer.accountStatus === 'blocked' ? '#DC2626' : selectedUserDrawer.accountStatus === 'suspended' ? '#D97706' : '#166534', textTransform: 'capitalize' }}>
                  {selectedUserDrawer.accountStatus || 'active'}
                </strong>
              </div>
            </div>

            {/* Admin Actions */}
            <div style={{ borderTop: '2px solid #E2E8F0', paddingTop: '1.25rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0F172A', marginBottom: '0.85rem' }}>Admin Control Actions</h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <button
                  onClick={() => handleVerifyProfile(selectedUserDrawer._id)}
                  style={{ backgroundColor: '#DCFCE7', color: '#166534', border: '1px solid #86EFAC', padding: '0.65rem', borderRadius: '10px', fontWeight: '700', fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                >
                  <ShieldCheck size={16} /> Verify Member Profile
                </button>

                {selectedUserDrawer.accountStatus !== 'suspended' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedUserDrawer._id, 'suspended')}
                    style={{ backgroundColor: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A', padding: '0.65rem', borderRadius: '10px', fontWeight: '700', fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                  >
                    <Clock size={16} /> Suspend Account
                  </button>
                )}

                {selectedUserDrawer.accountStatus !== 'blocked' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedUserDrawer._id, 'blocked')}
                    style={{ backgroundColor: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A5', padding: '0.65rem', borderRadius: '10px', fontWeight: '700', fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                  >
                    <UserX size={16} /> Block User
                  </button>
                )}

                {selectedUserDrawer.accountStatus !== 'active' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedUserDrawer._id, 'active')}
                    style={{ backgroundColor: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE', padding: '0.65rem', borderRadius: '10px', fontWeight: '700', fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                  >
                    <CheckCircle size={16} /> Activate Account
                  </button>
                )}

                <button
                  onClick={() => handleDeleteUser(selectedUserDrawer._id, selectedUserDrawer.email)}
                  style={{ backgroundColor: '#991B1B', color: '#FFFFFF', border: 'none', padding: '0.65rem', borderRadius: '10px', fontWeight: '700', fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                >
                  <Trash2 size={16} /> Delete Account Permanently
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONTACT REPLY MODAL */}
      {replyModalMessage && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            zIndex: 2500,
          }}
          onClick={() => setReplyModalMessage(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              maxWidth: '600px',
              width: '100%',
              padding: '2.25rem',
              position: 'relative',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setReplyModalMessage(null)}
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
              }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0B3B91', marginBottom: '0.25rem' }}>
              Reply to Support Enquiry
            </h3>
            <div style={{ fontSize: '0.875rem', color: '#64748B', marginBottom: '1.25rem' }}>
              To: <strong style={{ color: '#0F172A' }}>{replyModalMessage.name} ({replyModalMessage.email})</strong>
            </div>

            <div style={{ backgroundColor: '#F8FAFC', borderLeft: '4px solid #0B3B91', padding: '1rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.85rem', color: '#334155' }}>
              <strong>Subject:</strong> {replyModalMessage.subject}
              <p style={{ marginTop: '0.4rem', color: '#475569', fontStyle: 'italic' }}>"{replyModalMessage.message}"</p>
            </div>

            <form onSubmit={handleSendReply}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label" style={{ fontWeight: '700', fontSize: '0.85rem' }}>Your Admin Response Email</label>
                <textarea
                  rows={5}
                  className="form-textarea"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write your official response email..."
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.85rem' }}>
                <button
                  type="button"
                  onClick={() => setReplyModalMessage(null)}
                  className="btn-secondary"
                  style={{ padding: '0.65rem 1.4rem', borderRadius: '30px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingReply}
                  className="btn-gold"
                  style={{ padding: '0.65rem 1.6rem', borderRadius: '30px' }}
                >
                  {sendingReply ? 'Sending Email...' : 'Send Response'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
