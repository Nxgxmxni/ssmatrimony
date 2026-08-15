import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { profileAPI, interestAPI, notificationAPI } from '../services/api';
import ProfileCard from '../components/ProfileCard';
import InterestModal from '../components/InterestModal';
import Toast from '../components/Toast';
import {
  User,
  Heart,
  Star,
  Check,
  X,
  Edit3,
  ShieldCheck,
  Image,
  Lock,
  Sparkles,
  Search,
  MapPin,
  Filter,
  Bell,
  UserCheck,
  Award,
  ArrowRight,
  Phone,
  Clock,
  CheckCircle2,
  PhoneCall,
  UserPlus,
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, fetchCurrentUser } = useAuth();

  // Main Tabs: 'matches' | 'interests' | 'shortlist' | 'notifications'
  const [activeTab, setActiveTab] = useState('matches');

  // Interest Sub-Tab: 'received' | 'sent' | 'mutual'
  const [interestSubTab, setInterestSubTab] = useState('received');

  // Continuous Profile Matching States
  const [matchingProfiles, setMatchingProfiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreProfiles, setHasMoreProfiles] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Data States
  const [interests, setInterests] = useState({ received: [], sent: [] });
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  // Selected Profile for Interest Modal
  const [interestTargetProfile, setInterestTargetProfile] = useState(null);

  const isBride = (profile?.gender || '').toLowerCase() === 'bride' || (profile?.gender || '').toLowerCase() === 'female';
  const targetGenderLabel = isBride ? 'Groom' : 'Bride';
  const profileIdDisplay = profile?._id ? `SS-${profile._id.slice(-6).toUpperCase()}` : 'SS-MEMBER';
  const defaultPhoto = isBride
    ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'
    : 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80';

  // Sync active tab with URL query parameter
  useEffect(() => {
    const queryTab = new URLSearchParams(location.search).get('tab');
    if (queryTab && ['matches', 'interests', 'shortlist', 'notifications'].includes(queryTab)) {
      setActiveTab(queryTab);
    }
  }, [location.search]);

  // Fetch All Dashboard Data
  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // 1. Fetch First Page of Matches
      const res = await profileAPI.getProfiles({ page: 1, limit: 12 });
      const fetchedProfiles = res.data.profiles || [];
      setMatchingProfiles(fetchedProfiles);
      setCurrentPage(1);
      setHasMoreProfiles(res.data.page < res.data.totalPages && fetchedProfiles.length >= 12);

      // 2. Fetch Interests
      const interestRes = await interestAPI.getInterests();
      setInterests(interestRes.data || { received: [], sent: [] });

      // 3. Fetch Real User Notifications
      try {
        const notifRes = await notificationAPI.getNotifications();
        setNotifications(notifRes.data.notifications || []);
      } catch (nErr) {
        setNotifications([]);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (loadingMore || !hasMoreProfiles) return;
    try {
      setLoadingMore(true);
      const nextPage = currentPage + 1;
      const res = await profileAPI.getProfiles({ page: nextPage, limit: 12 });
      const newProfiles = res.data.profiles || [];
      setMatchingProfiles((prev) => [...prev, ...newProfiles]);
      setCurrentPage(nextPage);
      if (nextPage >= res.data.totalPages || newProfiles.length < 12) {
        setHasMoreProfiles(false);
      }
    } catch (err) {
      console.error('Load more profiles error:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const handleRespondInterest = async (interestId, status) => {
    try {
      await interestAPI.respondToInterest(interestId, status);
      setToastMsg(`Interest request ${status === 'accepted' ? 'accepted' : 'declined'} successfully!`);
      loadDashboardData();
    } catch (err) {
      console.error('Respond interest error:', err);
    }
  };

  // User Progress Tracker Component
  const renderProgressTracker = (status) => {
    const steps = [
      { key: 'sent', label: 'Interest Sent' },
      { key: 'accepted', label: 'Interest Accepted' },
      { key: 'under_review', label: 'Under Admin Review' },
      { key: 'family_contact', label: 'Family Contact' },
      { key: 'contact_shared', label: 'Contact Shared' },
      { key: 'closed', label: 'Case Closed' },
    ];

    let activeStepIndex = 0;
    if (status === 'accepted') activeStepIndex = 1;
    else if (status === 'under_admin_review') activeStepIndex = 2;
    else if (status === 'contact_shared') activeStepIndex = 4;
    else if (status === 'closed') activeStepIndex = 5;
    else if (status === 'rejected') activeStepIndex = -1;

    if (status === 'rejected') {
      return (
        <div style={{ backgroundColor: '#FEE2E2', color: '#B91C1C', padding: '0.6rem 1rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '700' }}>
          ❌ Interest Request Declined / Closed
        </div>
      );
    }

    return (
      <div style={{ width: '100%', marginTop: '0.85rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
          {steps.map((step, idx) => {
            const isCompleted = idx <= activeStepIndex;
            const isCurrent = idx === activeStepIndex;

            return (
              <div key={step.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, flex: 1 }}>
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: isCompleted ? (isCurrent ? '#F59E0B' : '#166534') : '#E2E8F0',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    boxShadow: isCurrent ? '0 0 0 4px rgba(245, 158, 11, 0.25)' : 'none',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {isCompleted ? '✓' : idx + 1}
                </div>
                <div style={{ fontSize: '0.68rem', fontWeight: isCurrent ? '800' : '600', color: isCompleted ? '#0F172A' : '#94A3B8', marginTop: '0.35rem', textAlign: 'center' }}>
                  {step.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const mutualInterestsList = [
    ...(interests.received || []).filter((i) => ['accepted', 'under_admin_review', 'contact_shared', 'closed'].includes(i.status)),
    ...(interests.sent || []).filter((i) => ['accepted', 'under_admin_review', 'contact_shared', 'closed'].includes(i.status)),
  ];

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', padding: '2rem 1.5rem 5rem' }}>
      <Toast type="success" message={toastMsg} onClose={() => setToastMsg('')} />

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* COMPACT SAAS CRM ACCOUNT SUMMARY BAR */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '18px',
            padding: '1.25rem 1.75rem',
            marginBottom: '1.75rem',
            boxShadow: '0 4px 16px rgba(11, 59, 145, 0.05)',
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.25rem',
          }}
        >
          {/* Left: User Avatar, Name & Member ID */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.1rem' }}>
            <img
              src={profile?.photos?.[0] || defaultPhoto}
              alt={profile?.fullName || 'Member Avatar'}
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2.5px solid #0B3B91',
                boxShadow: '0 4px 10px rgba(11, 59, 145, 0.15)',
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: '800', margin: 0, color: '#0F172A' }}>
                  Welcome back, {profile?.fullName ? profile.fullName.split(' ')[0] : user?.fullName || 'Member'}!
                </h2>
                {(profile?.isVerified || profile?.idVerificationStatus === 'Verified') ? (
                  <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', border: '1px solid #22C55E', fontSize: '0.75rem', fontWeight: '800', padding: '0.15rem 0.55rem', borderRadius: '14px', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <ShieldCheck size={13} /> Verified
                  </span>
                ) : (
                  <span style={{ backgroundColor: '#FEF3C7', color: '#92400E', border: '1px solid #F59E0B', fontSize: '0.75rem', fontWeight: '800', padding: '0.15rem 0.55rem', borderRadius: '14px' }}>
                    🟡 Pending Verification
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.2rem' }}>
                Member ID: <strong style={{ color: '#0B3B91' }}>{profileIdDisplay}</strong> • Seeking <strong style={{ color: '#0B3B91' }}>{targetGenderLabel} Profiles</strong>
              </div>
            </div>
          </div>

          {/* Middle: Compact Profile Completion Progress */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: '#F8FAFC', padding: '0.65rem 1.25rem', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
            <div>
              <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>
                Profile Completion
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0B3B91' }}>
                {profile?.completeness?.score || 40}% Complete
              </div>
            </div>
            <div style={{ width: '80px', backgroundColor: '#E2E8F0', height: '8px', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ width: `${profile?.completeness?.score || 40}%`, height: '100%', backgroundColor: '#D4AF37' }} />
            </div>
          </div>

          {/* Right: Quick Action Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Link to="/edit-profile" className="btn-gold" style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem', borderRadius: '30px', fontWeight: '800' }}>
              <Edit3 size={14} /> Edit Profile
            </Link>
          </div>
        </div>

        {/* PROFILE COMPLETION NOTIFICATION BANNER (Shows ONLY if incomplete) */}
        {(!profile?.isWizardCompleted || (profile?.completeness?.score || 0) < 100) && (
          <div
            style={{
              backgroundColor: '#EFF6FF',
              borderRadius: '16px',
              padding: '1.25rem 1.5rem',
              marginBottom: '1.75rem',
              border: '1.5px solid #3B82F6',
              color: '#1E3A8A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Sparkles size={24} color="#0B3B91" />
              <div>
                <strong style={{ fontSize: '0.95rem', color: '#0B3B91' }}>Complete remaining profile details to get 5x more interest proposals!</strong>
                <div style={{ fontSize: '0.85rem', color: '#3B82F6', marginTop: '0.15rem' }}>Takes less than 2 minutes to complete.</div>
              </div>
            </div>

            <button
              onClick={() => navigate(`/onboarding?step=${profile?.wizardStep || 1}`)}
              className="btn-primary"
              style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem', borderRadius: '30px' }}
            >
              Finish Setup <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* MAIN NAVIGATION TABS (Strictly: Matches, My Interests, Shortlisted, Notifications) */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '1.75rem',
            borderBottom: '2px solid #E2E8F0',
            paddingBottom: '0.5rem',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => {
              setActiveTab('matches');
              navigate('/dashboard?tab=matches');
            }}
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '0.925rem',
              background: activeTab === 'matches' ? '#0B3B91' : 'transparent',
              color: activeTab === 'matches' ? '#FFFFFF' : '#475569',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
            }}
          >
            <Sparkles size={16} /> Matches for You
          </button>

          <button
            onClick={() => {
              setActiveTab('interests');
              navigate('/dashboard?tab=interests');
            }}
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '0.925rem',
              background: activeTab === 'interests' ? '#0B3B91' : 'transparent',
              color: activeTab === 'interests' ? '#FFFFFF' : '#475569',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
            }}
          >
            <Heart size={16} /> My Interests ({interests.received?.length + interests.sent?.length || 0})
          </button>

          <button
            onClick={() => {
              setActiveTab('shortlist');
              navigate('/dashboard?tab=shortlist');
            }}
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '0.925rem',
              background: activeTab === 'shortlist' ? '#0B3B91' : 'transparent',
              color: activeTab === 'shortlist' ? '#FFFFFF' : '#475569',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
            }}
          >
            <Star size={16} /> Shortlisted ({profile?.shortlist?.length || 0})
          </button>

          <button
            onClick={() => {
              setActiveTab('notifications');
              navigate('/dashboard?tab=notifications');
            }}
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '0.925rem',
              background: activeTab === 'notifications' ? '#0B3B91' : 'transparent',
              color: activeTab === 'notifications' ? '#FFFFFF' : '#475569',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
            }}
          >
            <Bell size={16} /> Notifications ({notifications.length})
          </button>
        </div>

        {/* TAB 1: MATCHES */}
        {activeTab === 'matches' && (
          <div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '4rem 0', color: '#0B3B91', fontWeight: '700' }}>
                Fetching verified {targetGenderLabel} matches...
              </div>
            ) : matchingProfiles.length === 0 ? (
              <div className="glass-card" style={{ padding: '3.5rem 2rem', textAlign: 'center', color: '#64748B' }}>
                <h3>No matching {targetGenderLabel} profiles found at this time.</h3>
              </div>
            ) : (
              <div>
                <div className="profile-grid">
                  {matchingProfiles.map((p) => (
                    <ProfileCard
                      key={p._id}
                      profile={p}
                      onOpenInterestModal={(target) => setInterestTargetProfile(target)}
                    />
                  ))}
                </div>

                {hasMoreProfiles && (
                  <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                    <button
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="btn-gold"
                      style={{
                        padding: '0.85rem 2.25rem',
                        fontSize: '0.95rem',
                        borderRadius: '50px',
                        fontWeight: '800',
                      }}
                    >
                      {loadingMore ? 'Loading More Profiles...' : 'Load More Profiles'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY INTERESTS (RECEIVED, SENT & MUTUAL) */}
        {activeTab === 'interests' && (
          <div>
            <div style={{ display: 'flex', gap: '0.65rem', marginBottom: '1.5rem' }}>
              <button
                onClick={() => setInterestSubTab('received')}
                style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: '30px',
                  fontWeight: '700',
                  fontSize: '0.875rem',
                  backgroundColor: interestSubTab === 'received' ? '#0B3B91' : '#FFFFFF',
                  color: interestSubTab === 'received' ? '#FFFFFF' : '#475569',
                  border: '1px solid #CBD5E1',
                  cursor: 'pointer',
                }}
              >
                Received Interests ({interests.received?.length || 0})
              </button>

              <button
                onClick={() => setInterestSubTab('sent')}
                style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: '30px',
                  fontWeight: '700',
                  fontSize: '0.875rem',
                  backgroundColor: interestSubTab === 'sent' ? '#0B3B91' : '#FFFFFF',
                  color: interestSubTab === 'sent' ? '#FFFFFF' : '#475569',
                  border: '1px solid #CBD5E1',
                  cursor: 'pointer',
                }}
              >
                Sent Interests ({interests.sent?.length || 0})
              </button>

              <button
                onClick={() => setInterestSubTab('mutual')}
                style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: '30px',
                  fontWeight: '700',
                  fontSize: '0.875rem',
                  backgroundColor: interestSubTab === 'mutual' ? '#166534' : '#FFFFFF',
                  color: interestSubTab === 'mutual' ? '#FFFFFF' : '#475569',
                  border: '1px solid #CBD5E1',
                  cursor: 'pointer',
                }}
              >
                ❤️ Mutual Interests ({mutualInterestsList.length})
              </button>
            </div>

            {/* RECEIVED */}
            {interestSubTab === 'received' && (
              <div>
                {interests.received?.length === 0 ? (
                  <div className="glass-card" style={{ padding: '3.5rem 2rem', textAlign: 'center', color: '#64748B' }}>
                    <h3>No incoming interest requests yet.</h3>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                    {interests.received.map((item) => {
                      const p = item.senderProfile;
                      if (!p) return null;
                      return (
                        <div key={item._id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderRadius: '20px' }}>
                          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <img
                              src={p.photos?.[0] || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'}
                              alt={p.fullName}
                              style={{ width: '68px', height: '68px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #D4AF37' }}
                            />
                            <div>
                              <Link to={`/profiles/${p._id}`} style={{ fontWeight: '700', color: '#0B3B91', fontSize: '1.1rem', textDecoration: 'none' }}>
                                {p.fullName}
                              </Link>
                              <div style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.15rem' }}>
                                {p.age} Yrs • {p.occupation} • {p.city}
                              </div>
                            </div>
                          </div>

                          {renderProgressTracker(item.status)}

                          {item.status === 'pending' && (
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                              <button onClick={() => handleRespondInterest(item._id, 'declined')} className="btn-secondary" style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem', color: '#991B1B' }}>
                                Decline
                              </button>
                              <button onClick={() => handleRespondInterest(item._id, 'accepted')} className="btn-primary" style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem', backgroundColor: '#166534' }}>
                                Accept Interest
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* SENT */}
            {interestSubTab === 'sent' && (
              <div>
                {interests.sent?.length === 0 ? (
                  <div className="glass-card" style={{ padding: '3.5rem 2rem', textAlign: 'center', color: '#64748B' }}>
                    <h3>No sent interest requests yet.</h3>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                    {interests.sent.map((item) => {
                      const p = item.recipientProfile;
                      if (!p) return null;
                      return (
                        <div key={item._id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderRadius: '20px' }}>
                          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <img
                              src={p.photos?.[0] || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'}
                              alt={p.fullName}
                              style={{ width: '68px', height: '68px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #D4AF37' }}
                            />
                            <div>
                              <Link to={`/profiles/${p._id}`} style={{ fontWeight: '700', color: '#0B3B91', fontSize: '1.1rem', textDecoration: 'none' }}>
                                {p.fullName}
                              </Link>
                              <div style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.15rem' }}>
                                {p.age} Yrs • {p.occupation} • {p.city}
                              </div>
                            </div>
                          </div>

                          {renderProgressTracker(item.status)}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* MUTUAL INTERESTS */}
            {interestSubTab === 'mutual' && (
              <div>
                {mutualInterestsList.length === 0 ? (
                  <div className="glass-card" style={{ padding: '3.5rem 2rem', textAlign: 'center', color: '#64748B' }}>
                    <h3>No mutual interests established yet.</h3>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                    {mutualInterestsList.map((item) => {
                      const isSender = item.sender === profile?.user || item.sender?._id === profile?.user;
                      const targetProfile = isSender ? item.recipientProfile : item.senderProfile;
                      const targetUser = isSender ? item.recipient : item.sender;

                      return (
                        <div
                          key={item._id}
                          className="glass-card"
                          style={{
                            padding: '2rem',
                            borderRadius: '24px',
                            border: '1.5px solid #D4AF37',
                            backgroundColor: '#FFFFFF',
                            boxShadow: '0 10px 30px rgba(11, 59, 145, 0.08)',
                          }}
                        >
                          {/* Official Relationship Team Banner */}
                          <div
                            style={{
                              backgroundColor: '#FFFBEB',
                              border: '1.5px solid #F59E0B',
                              borderRadius: '16px',
                              padding: '1.25rem',
                              marginBottom: '1.5rem',
                              color: '#78350F',
                            }}
                          >
                            <h4 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#92400E', margin: '0 0 0.4rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <Heart size={20} fill="#92400E" color="#92400E" /> ❤️ Mutual Interest!
                            </h4>
                            <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#78350F' }}>
                              Congratulations! Both members have expressed interest.
                            </div>
                            <p style={{ fontSize: '0.875rem', margin: '0.35rem 0 0', lineHeight: '1.5', color: '#92400E' }}>
                              Our SS Matrimony Relationship Team has been notified. We will personally review the match and contact both families shortly.
                            </p>
                            <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', fontWeight: '800', color: '#0B3B91', backgroundColor: '#EFF6FF', padding: '0.4rem 0.85rem', borderRadius: '20px', display: 'inline-block' }}>
                              Current Status: {item.status === 'accepted' ? 'Waiting for Admin Review' : item.status === 'contact_shared' ? '🤝 Contact Details Approved & Shared' : item.status}
                            </div>
                          </div>

                          {/* Member Info */}
                          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
                            <img
                              src={targetProfile?.photos?.[0] || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'}
                              alt={targetProfile?.fullName}
                              style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #0B3B91' }}
                            />
                            <div style={{ flex: 1 }}>
                              <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                                {targetProfile?.fullName}
                              </h3>
                              <div style={{ fontSize: '0.9rem', color: '#64748B', marginTop: '0.2rem' }}>
                                {targetProfile?.age} Yrs • {targetProfile?.occupation} • {targetProfile?.city}, {targetProfile?.state}
                              </div>

                              {item.status === 'contact_shared' || item.status === 'closed' ? (
                                <div style={{ marginTop: '0.75rem', backgroundColor: '#DCFCE7', padding: '0.75rem 1rem', borderRadius: '12px', color: '#14532D', border: '1px solid #22C55E' }}>
                                  <div style={{ fontWeight: '800', fontSize: '0.85rem' }}>📞 Verified Family Contact Info Shared by Admin:</div>
                                  <div style={{ marginTop: '0.25rem', fontSize: '0.9rem' }}>
                                    Phone: <strong>{targetUser?.mobile || targetUser?.phone || 'Contact Admin'}</strong> • Email: <strong>{targetUser?.email || 'N/A'}</strong>
                                  </div>
                                </div>
                              ) : (
                                <div style={{ marginTop: '0.6rem', fontSize: '0.85rem', color: '#64748B', fontStyle: 'italic' }}>
                                  🔒 Phone numbers and email addresses remain hidden until relationship team completes family review and approves contact sharing.
                                </div>
                              )}
                            </div>
                          </div>

                          {renderProgressTracker(item.status)}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SHORTLISTED */}
        {activeTab === 'shortlist' && (
          <div>
            {profile?.shortlist?.length === 0 ? (
              <div className="glass-card" style={{ padding: '3.5rem 2rem', textAlign: 'center', color: '#64748B' }}>
                <h3>No profiles shortlisted yet.</h3>
              </div>
            ) : (
              <div className="profile-grid">
                {profile.shortlist.map((p) => (
                  <ProfileCard
                    key={p._id || p}
                    profile={typeof p === 'object' ? p : { _id: p, fullName: 'Shortlisted Member' }}
                    onOpenInterestModal={(target) => setInterestTargetProfile(target)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: NOTIFICATIONS FEED */}
        {activeTab === 'notifications' && (
          <div className="glass-card" style={{ padding: '2rem', borderRadius: '24px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0F172A', marginBottom: '1.5rem' }}>
              Notifications & Activity Updates
            </h3>
            {notifications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748B' }}>
                No notifications at this time.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {notifications.map((n) => (
                  <div
                    key={n._id || n.id}
                    style={{
                      padding: '1.2rem 1.5rem',
                      background: n.read ? '#FFFFFF' : '#EFF6FF',
                      borderRadius: '16px',
                      border: '1px solid #E2E8F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ background: '#0B3B91', width: '42px', height: '42px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
                        <Bell size={20} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '0.975rem', fontWeight: '700', color: '#0F172A', margin: 0 }}>{n.title}</h4>
                        <p style={{ fontSize: '0.875rem', color: '#64748B', margin: '0.2rem 0 0' }}>{n.message}</p>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: '600' }}>
                      {new Date(n.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Express Interest Modal */}
      {interestTargetProfile && (
        <InterestModal
          targetProfile={interestTargetProfile}
          onClose={() => setInterestTargetProfile(null)}
          onSuccess={() => {
            setToastMsg('Express Interest sent successfully!');
            loadDashboardData();
          }}
        />
      )}
    </div>
  );
}
