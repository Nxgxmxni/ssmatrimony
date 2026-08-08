import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { profileAPI, interestAPI, messageAPI } from '../services/api';
import ProfileCard from '../components/ProfileCard';
import PhotoUploader from '../components/PhotoUploader';
import IdVerification from '../components/IdVerification';
import PrivacySettings from '../components/PrivacySettings';
import InterestModal from '../components/InterestModal';
import Toast from '../components/Toast';
import {
  User,
  Heart,
  Star,
  Check,
  X,
  Edit3,
  MessageCircle,
  ShieldCheck,
  Image,
  Lock,
  Sparkles,
  Search,
  MapPin,
  Filter,
  Bell,
  Sliders,
  UserCheck,
  Award,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, profile, fetchCurrentUser } = useAuth();

  // Guard: If profile wizard is not completed, redirect to onboarding
  useEffect(() => {
    if (profile && (!profile.isWizardCompleted || (profile.wizardStep && profile.wizardStep < 10))) {
      navigate('/onboarding', { replace: true });
    }
  }, [profile, navigate]);

  // Main Tabs: 'matches' | 'interests' | 'shortlist' | 'messages' | 'notifications' | 'settings'
  const [activeTab, setActiveTab] = useState('matches');

  // Match View Sub-Filter: 'all' | 'recent' | 'verified' | 'location'
  const [matchSubTab, setMatchSubTab] = useState('all');

  // Interest Sub-Tab: 'received' | 'sent'
  const [interestSubTab, setInterestSubTab] = useState('received');

  // Data States
  const [recommendedMatches, setRecommendedMatches] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [verifiedMatches, setVerifiedMatches] = useState([]);
  const [locationMatches, setLocationMatches] = useState([]);
  const [interests, setInterests] = useState({ received: [], sent: [] });
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  // Selected Profile for Interest Modal
  const [interestTargetProfile, setInterestTargetProfile] = useState(null);

  // Real-time Search Filter States
  const [searchFilters, setSearchFilters] = useState({
    minAge: '',
    maxAge: '',
    religion: 'All',
    caste: 'All',
    city: '',
    highestEducation: 'All',
    search: '',
  });

  const isBride = (profile?.gender || '').toLowerCase() === 'bride' || (profile?.gender || '').toLowerCase() === 'female';
  const targetGenderLabel = isBride ? 'Groom' : 'Bride';
  const profileIdDisplay = profile?._id ? `SS-${profile._id.slice(-6).toUpperCase()}` : 'SS-MEMBER';

  // Fetch All Dashboard Data
  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // 1. Fetch Recommended Matches (Opposite gender auto-enforced by backend)
      const recRes = await profileAPI.getProfiles({
        ...searchFilters,
        page: 1,
        limit: 16,
      });
      setRecommendedMatches(recRes.data.profiles || []);

      // 2. Fetch Recently Joined Profiles
      const recentsRes = await profileAPI.getProfiles({ sort: 'newest', limit: 8 });
      setRecentMatches(recentsRes.data.profiles || []);

      // 3. Fetch Verified / Premium Profiles
      const verifiedRes = await profileAPI.getProfiles({ verifiedOnly: 'true', limit: 8 });
      setVerifiedMatches(verifiedRes.data.profiles || []);

      // 4. Fetch Location Matches
      const locationRes = await profileAPI.getProfiles({ nearLocation: 'true', limit: 8 });
      setLocationMatches(locationRes.data.profiles || []);

      // 5. Fetch Interests
      const interestRes = await interestAPI.getInterests();
      setInterests(interestRes.data || { received: [], sent: [] });

      // 6. Fetch Conversations
      try {
        const convRes = await messageAPI.getConversationsList();
        setConversations(convRes.data || []);
      } catch (cErr) {
        setConversations([]);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile?.isWizardCompleted) {
      loadDashboardData();
    }
  }, [profile]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplySearch = async (e) => {
    if (e) e.preventDefault();
    try {
      setLoading(true);
      const res = await profileAPI.getProfiles({ ...searchFilters, page: 1, limit: 20 });
      setRecommendedMatches(res.data.profiles || []);
    } catch (err) {
      console.error('Apply search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    const defaultFilters = {
      minAge: '',
      maxAge: '',
      religion: 'All',
      caste: 'All',
      city: '',
      highestEducation: 'All',
      search: '',
    };
    setSearchFilters(defaultFilters);
    profileAPI.getProfiles({ page: 1, limit: 16 }).then((res) => {
      setRecommendedMatches(res.data.profiles || []);
    });
  };

  const handleRespondInterest = async (interestId, status) => {
    try {
      await interestAPI.respondToInterest(interestId, status);
      setToastMsg(`Interest request ${status === 'accepted' ? 'accepted' : 'declined'} successfully!`);
      loadDashboardData();
    } catch (err) {
      console.error('Respond interest error:', err);
    }
  };

  // Mock Notification Items
  const notifications = [
    {
      id: 1,
      title: 'New Compatible Match Registered',
      desc: `A new verified ${targetGenderLabel} profile matching your preferences just joined!`,
      time: '2 hours ago',
      type: 'match',
    },
    {
      id: 2,
      title: 'Trust Verification Approved',
      desc: 'Your profile has achieved verified status.',
      time: '1 day ago',
      type: 'system',
    },
    {
      id: 3,
      title: 'High Compatibility Score',
      desc: 'You have 5 profiles with 90%+ match compatibility score today.',
      time: '2 days ago',
      type: 'sparkles',
    },
  ];

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', padding: '2.5rem 1.5rem 5rem' }}>
      <Toast type="success" message={toastMsg} onClose={() => setToastMsg('')} />

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* SECTION 1: WELCOME MESSAGE & PERSONALIZED HEADER */}
        <div
          className="glass-card"
          style={{
            padding: '2.25rem',
            marginBottom: '2rem',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #0B3B91 0%, #1E40AF 100%)',
            color: '#FFFFFF',
            boxShadow: '0 20px 40px rgba(11, 59, 145, 0.25)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              right: '-40px',
              top: '-40px',
              width: '260px',
              height: '260px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(212, 175, 55, 0.25) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.5rem',
              position: 'relative',
              zIndex: 2,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              {profile?.photos?.[0] ? (
                <img
                  src={profile.photos[0]}
                  alt={profile.fullName || 'Member Avatar'}
                  style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3.5px solid #D4AF37',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    border: '3.5px solid #D4AF37',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                  }}
                >
                  <User size={44} />
                </div>
              )}

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                  <h1 style={{ fontSize: '1.95rem', fontWeight: '800', margin: 0, color: '#FFFFFF' }}>
                    Welcome back, {profile?.fullName || user?.fullName || 'Member'}!
                  </h1>
                  {(profile?.isVerified || profile?.idVerificationStatus === 'Verified') && (
                    <span
                      style={{
                        backgroundColor: '#D4AF37',
                        color: '#0F172A',
                        fontWeight: '800',
                        fontSize: '0.78rem',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '20px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                      }}
                    >
                      <ShieldCheck size={14} /> Verified Member
                    </span>
                  )}
                </div>

                <div style={{ color: '#E2E8F0', fontSize: '0.95rem', marginTop: '0.3rem' }}>
                  Member ID: <strong style={{ color: '#FDE047' }}>{profileIdDisplay}</strong> • Looking for suitable{' '}
                  <strong style={{ color: '#FDE047' }}>{targetGenderLabel} Profiles</strong>
                </div>

                <div style={{ fontSize: '0.85rem', color: '#93C5FD', marginTop: '0.25rem' }}>
                  {[profile?.occupation, [profile?.city, profile?.state].filter(Boolean).join(', ')].filter(Boolean).join(' • ') || 'Verified Matrimony Account'}
                </div>
              </div>
            </div>

            {/* Edit Profile Action */}
            <Link
              to="/edit-profile"
              className="btn-gold"
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '0.95rem',
                fontWeight: '800',
                borderRadius: '50px',
                boxShadow: '0 8px 20px rgba(212, 175, 55, 0.4)',
                textDecoration: 'none',
              }}
            >
              <Edit3 size={16} /> Edit Profile
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '1rem',
              marginTop: '2rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '0.85rem 1.1rem', borderRadius: '16px' }}>
              <div style={{ fontSize: '0.8rem', color: '#93C5FD', textTransform: 'uppercase', fontWeight: '700' }}>Available Matches</div>
              <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#FFFFFF', marginTop: '0.15rem' }}>{recommendedMatches.length}</div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '0.85rem 1.1rem', borderRadius: '16px' }}>
              <div style={{ fontSize: '0.8rem', color: '#93C5FD', textTransform: 'uppercase', fontWeight: '700' }}>Interests Received</div>
              <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#FDE047', marginTop: '0.15rem' }}>{interests.received?.length || 0}</div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '0.85rem 1.1rem', borderRadius: '16px' }}>
              <div style={{ fontSize: '0.8rem', color: '#93C5FD', textTransform: 'uppercase', fontWeight: '700' }}>Interests Sent</div>
              <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#FFFFFF', marginTop: '0.15rem' }}>{interests.sent?.length || 0}</div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '0.85rem 1.1rem', borderRadius: '16px' }}>
              <div style={{ fontSize: '0.8rem', color: '#93C5FD', textTransform: 'uppercase', fontWeight: '700' }}>Shortlisted</div>
              <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#FFFFFF', marginTop: '0.15rem' }}>{profile?.shortlist?.length || 0}</div>
            </div>
          </div>
        </div>

        {/* MAIN NAVIGATION TABS */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '2rem',
            borderBottom: '2px solid #E2E8F0',
            paddingBottom: '0.5rem',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => setActiveTab('matches')}
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
              transition: 'all 0.2s ease',
            }}
          >
            <Sparkles size={16} /> Matches for You ({recommendedMatches.length})
          </button>

          <button
            onClick={() => setActiveTab('interests')}
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
              transition: 'all 0.2s ease',
            }}
          >
            <Heart size={16} /> Expressed Interests ({interests.received?.length + interests.sent?.length || 0})
          </button>

          <button
            onClick={() => setActiveTab('shortlist')}
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
              transition: 'all 0.2s ease',
            }}
          >
            <Star size={16} /> Shortlisted ({profile?.shortlist?.length || 0})
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '0.925rem',
              background: activeTab === 'messages' ? '#0B3B91' : 'transparent',
              color: activeTab === 'messages' ? '#FFFFFF' : '#475569',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'all 0.2s ease',
            }}
          >
            <MessageCircle size={16} /> Messages ({conversations.length})
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
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
              transition: 'all 0.2s ease',
            }}
          >
            <Bell size={16} /> Notifications ({notifications.length})
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '0.925rem',
              background: activeTab === 'settings' ? '#0B3B91' : 'transparent',
              color: activeTab === 'settings' ? '#FFFFFF' : '#475569',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'all 0.2s ease',
            }}
          >
            <Sliders size={16} /> Account & Privacy
          </button>
        </div>

        {/* TAB 1: MATCHES & MATCHMAKING DISCOVERY */}
        {activeTab === 'matches' && (
          <div>
            {/* SECTION 11: SEARCH FILTERS BAR */}
            <div
              className="glass-card"
              style={{
                padding: '1.5rem',
                marginBottom: '2rem',
                borderRadius: '20px',
                backgroundColor: '#FFFFFF',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <Filter size={18} color="#0B3B91" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                  Search & Filter {targetGenderLabel} Profiles
                </h3>
              </div>

              <form onSubmit={handleApplySearch}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Keyword Search</label>
                    <input
                      type="text"
                      name="search"
                      value={searchFilters.search}
                      onChange={handleFilterChange}
                      placeholder="e.g. Engineer, Hyderabad"
                      className="form-input"
                      style={{ padding: '0.55rem 0.85rem', fontSize: '0.875rem' }}
                    />
                  </div>

                  <div>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Religion</label>
                    <select
                      name="religion"
                      value={searchFilters.religion}
                      onChange={handleFilterChange}
                      className="form-select"
                      style={{ padding: '0.55rem 0.85rem', fontSize: '0.875rem' }}
                    >
                      <option value="All">All Religions</option>
                      <option value="Hindu">Hindu</option>
                      <option value="Muslim">Muslim</option>
                      <option value="Christian">Christian</option>
                      <option value="Sikh">Sikh</option>
                      <option value="Jain">Jain</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Caste</label>
                    <input
                      type="text"
                      name="caste"
                      value={searchFilters.caste === 'All' ? '' : searchFilters.caste}
                      onChange={handleFilterChange}
                      placeholder="e.g. Kamma, Reddy, Brahmin"
                      className="form-input"
                      style={{ padding: '0.55rem 0.85rem', fontSize: '0.875rem' }}
                    />
                  </div>

                  <div>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>City / Location</label>
                    <input
                      type="text"
                      name="city"
                      value={searchFilters.city}
                      onChange={handleFilterChange}
                      placeholder="e.g. Hyderabad, Vijayawada"
                      className="form-input"
                      style={{ padding: '0.55rem 0.85rem', fontSize: '0.875rem' }}
                    />
                  </div>

                  <div>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Education</label>
                    <select
                      name="highestEducation"
                      value={searchFilters.highestEducation}
                      onChange={handleFilterChange}
                      className="form-select"
                      style={{ padding: '0.55rem 0.85rem', fontSize: '0.875rem' }}
                    >
                      <option value="All">All Degrees</option>
                      <option value="B.Tech">B.Tech / B.E.</option>
                      <option value="M.Tech">M.Tech / M.E.</option>
                      <option value="MBA">MBA / PGDM</option>
                      <option value="MBBS">MBBS / MD</option>
                      <option value="Master Degree">Master Degree</option>
                      <option value="Bachelor Degree">Bachelor Degree</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
                    <button
                      type="submit"
                      className="btn-primary"
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        padding: '0.6rem 0.85rem',
                        fontSize: '0.875rem',
                        borderRadius: '10px',
                      }}
                    >
                      <Search size={15} /> Apply
                    </button>

                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="btn-secondary"
                      style={{
                        padding: '0.6rem 0.85rem',
                        fontSize: '0.875rem',
                        borderRadius: '10px',
                      }}
                      title="Reset filters"
                    >
                      <RefreshCw size={15} />
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* MATCH SUB-SECTION PILLS */}
            <div style={{ display: 'flex', gap: '0.65rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setMatchSubTab('all')}
                style={{
                  padding: '0.55rem 1.1rem',
                  borderRadius: '30px',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  backgroundColor: matchSubTab === 'all' ? '#0F172A' : '#FFFFFF',
                  color: matchSubTab === 'all' ? '#FFFFFF' : '#475569',
                  border: '1px solid #CBD5E1',
                  cursor: 'pointer',
                }}
              >
                Recommended Matches ({recommendedMatches.length})
              </button>

              <button
                onClick={() => setMatchSubTab('recent')}
                style={{
                  padding: '0.55rem 1.1rem',
                  borderRadius: '30px',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  backgroundColor: matchSubTab === 'recent' ? '#0F172A' : '#FFFFFF',
                  color: matchSubTab === 'recent' ? '#FFFFFF' : '#475569',
                  border: '1px solid #CBD5E1',
                  cursor: 'pointer',
                }}
              >
                ⚡ Recently Joined ({recentMatches.length})
              </button>

              <button
                onClick={() => setMatchSubTab('verified')}
                style={{
                  padding: '0.55rem 1.1rem',
                  borderRadius: '30px',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  backgroundColor: matchSubTab === 'verified' ? '#0F172A' : '#FFFFFF',
                  color: matchSubTab === 'verified' ? '#FFFFFF' : '#475569',
                  border: '1px solid #CBD5E1',
                  cursor: 'pointer',
                }}
              >
                🛡️ Verified / Premium ({verifiedMatches.length})
              </button>

              <button
                onClick={() => setMatchSubTab('location')}
                style={{
                  padding: '0.55rem 1.1rem',
                  borderRadius: '30px',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  backgroundColor: matchSubTab === 'location' ? '#0F172A' : '#FFFFFF',
                  color: matchSubTab === 'location' ? '#FFFFFF' : '#475569',
                  border: '1px solid #CBD5E1',
                  cursor: 'pointer',
                }}
              >
                📍 Matches Near You ({locationMatches.length})
              </button>
            </div>

            {/* PROFILES GRID */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '4rem 0', color: '#0B3B91', fontWeight: '700' }}>
                Fetching verified {targetGenderLabel} matches from MongoDB...
              </div>
            ) : (
              <div>
                {/* 2. RECOMMENDED MATCHES GRID */}
                {matchSubTab === 'all' && (
                  <div>
                    {recommendedMatches.length === 0 ? (
                      <div className="glass-card" style={{ padding: '3.5rem 2rem', textAlign: 'center', color: '#64748B' }}>
                        <h3>No matching {targetGenderLabel} profiles found for your current search criteria.</h3>
                        <p style={{ marginTop: '0.5rem' }}>Try clearing search filters or adjusting age/location options.</p>
                        <button onClick={handleResetFilters} className="btn-gold" style={{ marginTop: '1rem' }}>
                          Clear All Search Filters
                        </button>
                      </div>
                    ) : (
                      <div className="profile-grid">
                        {recommendedMatches.map((p) => (
                          <ProfileCard
                            key={p._id}
                            profile={p}
                            onOpenInterestModal={(target) => setInterestTargetProfile(target)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. RECENTLY JOINED PROFILES GRID */}
                {matchSubTab === 'recent' && (
                  <div>
                    {recentMatches.length === 0 ? (
                      <div className="glass-card" style={{ padding: '3.5rem 2rem', textAlign: 'center', color: '#64748B' }}>
                        <h3>No recently joined profiles available at this moment.</h3>
                      </div>
                    ) : (
                      <div className="profile-grid">
                        {recentMatches.map((p) => (
                          <ProfileCard
                            key={p._id}
                            profile={p}
                            onOpenInterestModal={(target) => setInterestTargetProfile(target)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 4. PREMIUM / VERIFIED PROFILES GRID */}
                {matchSubTab === 'verified' && (
                  <div>
                    {verifiedMatches.length === 0 ? (
                      <div className="glass-card" style={{ padding: '3.5rem 2rem', textAlign: 'center', color: '#64748B' }}>
                        <h3>No verified profiles found in this category yet.</h3>
                      </div>
                    ) : (
                      <div className="profile-grid">
                        {verifiedMatches.map((p) => (
                          <ProfileCard
                            key={p._id}
                            profile={p}
                            onOpenInterestModal={(target) => setInterestTargetProfile(target)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 5. MATCHES NEAR YOUR LOCATION GRID */}
                {matchSubTab === 'location' && (
                  <div>
                    {locationMatches.length === 0 ? (
                      <div className="glass-card" style={{ padding: '3.5rem 2rem', textAlign: 'center', color: '#64748B' }}>
                        <h3>No profiles matching your exact city ({profile?.city || 'location'}) found yet.</h3>
                        <p>Showing nearest regional matches.</p>
                      </div>
                    ) : (
                      <div className="profile-grid">
                        {locationMatches.map((p) => (
                          <ProfileCard
                            key={p._id}
                            profile={p}
                            onOpenInterestModal={(target) => setInterestTargetProfile(target)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: INTERESTS (SENT & RECEIVED) */}
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
                7. Interests Received ({interests.received?.length || 0})
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
                6. Interests Sent ({interests.sent?.length || 0})
              </button>
            </div>

            {interestSubTab === 'received' && (
              <div>
                {interests.received?.length === 0 ? (
                  <div className="glass-card" style={{ padding: '3.5rem 2rem', textAlign: 'center', color: '#64748B' }}>
                    <h3>No incoming interest requests yet.</h3>
                    <p style={{ marginTop: '0.35rem' }}>When other members express interest in your profile, their requests will show here.</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
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
                              <span style={{ fontSize: '0.75rem', color: '#D4AF37', fontWeight: '700' }}>
                                SS-{p._id?.slice(-6).toUpperCase()}
                              </span>
                            </div>
                          </div>

                          {item.message && (
                            <p style={{ fontSize: '0.875rem', backgroundColor: '#F8FAFC', padding: '0.75rem 1rem', borderRadius: '12px', fontStyle: 'italic', border: '1px solid #E2E8F0', color: '#334155' }}>
                              "{item.message}"
                            </p>
                          )}

                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid #F1F5F9' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: item.status === 'accepted' ? '#166534' : item.status === 'declined' ? '#991B1B' : '#D97706' }}>
                              Status: {item.status}
                            </span>

                            {item.status === 'pending' ? (
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => handleRespondInterest(item._id, 'declined')} className="btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', color: '#991B1B', borderColor: '#FCA5A5', borderRadius: '30px' }}>
                                  <X size={14} /> Decline
                                </button>
                                <button onClick={() => handleRespondInterest(item._id, 'accepted')} className="btn-primary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', backgroundColor: '#166534', borderRadius: '30px' }}>
                                  <Check size={14} /> Accept
                                </button>
                              </div>
                            ) : item.status === 'accepted' ? (
                              <Link to="/messages" className="btn-gold" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: '30px', textDecoration: 'none' }}>
                                <MessageCircle size={14} /> Open Chat
                              </Link>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {interestSubTab === 'sent' && (
              <div>
                {interests.sent?.length === 0 ? (
                  <div className="glass-card" style={{ padding: '3.5rem 2rem', textAlign: 'center', color: '#64748B' }}>
                    <h3>No sent interest requests yet.</h3>
                    <p style={{ marginTop: '0.35rem' }}>Click "Express Interest" on any profile card to send a request.</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
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
                              <span style={{ fontSize: '0.75rem', color: '#D4AF37', fontWeight: '700' }}>
                                SS-{p._id?.slice(-6).toUpperCase()}
                              </span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid #F1F5F9' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', color: item.status === 'accepted' ? '#166534' : item.status === 'declined' ? '#991B1B' : '#D97706' }}>
                              Status: {item.status}
                            </span>
                            {item.status === 'accepted' && (
                              <Link to="/messages" className="btn-gold" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: '30px', textDecoration: 'none' }}>
                                <MessageCircle size={14} /> Send Message
                              </Link>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SHORTLISTED PROFILES */}
        {activeTab === 'shortlist' && (
          <div>
            {profile?.shortlist?.length === 0 ? (
              <div className="glass-card" style={{ padding: '3.5rem 2rem', textAlign: 'center', color: '#64748B' }}>
                <h3>No profiles shortlisted yet.</h3>
                <p style={{ marginTop: '0.35rem' }}>Click the Star icon on any profile card to save profiles for later review.</p>
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

        {/* TAB 4: MESSAGES & CHAT PREVIEW */}
        {activeTab === 'messages' && (
          <div className="glass-card" style={{ padding: '2rem', borderRadius: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                  Active Messages & Conversations
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                  Chat directly with members who have accepted interest proposals.
                </p>
              </div>
              <Link to="/messages" className="btn-primary" style={{ textDecoration: 'none', borderRadius: '30px', padding: '0.6rem 1.25rem' }}>
                <MessageCircle size={16} /> Open Full Messenger
              </Link>
            </div>

            {conversations.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748B', background: '#F8FAFC', borderRadius: '16px' }}>
                <MessageCircle size={40} color="#94A3B8" style={{ marginBottom: '0.5rem' }} />
                <h4>No active conversations yet.</h4>
                <p style={{ fontSize: '0.9rem' }}>Accept interest proposals or express interest to initiate messaging.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {conversations.map((conv) => (
                  <div
                    key={conv._id}
                    style={{
                      padding: '1.2rem',
                      background: '#F8FAFC',
                      borderRadius: '16px',
                      border: '1px solid #E2E8F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '1rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img
                        src={conv.otherUser?.profilePicture || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'}
                        alt={conv.otherUser?.fullName}
                        style={{ width: '54px', height: '54px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#0F172A', margin: 0 }}>
                          {conv.otherUser?.fullName || 'Matrimony Member'}
                        </h4>
                        <div style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.2rem' }}>
                          {conv.lastMessage?.content || 'Click to view conversation'}
                        </div>
                      </div>
                    </div>

                    <Link to="/messages" className="btn-gold" style={{ fontSize: '0.85rem', padding: '0.55rem 1rem', borderRadius: '30px', textDecoration: 'none' }}>
                      Chat Now <ArrowRight size={14} />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: NOTIFICATIONS FEED */}
        {activeTab === 'notifications' && (
          <div className="glass-card" style={{ padding: '2rem', borderRadius: '24px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0F172A', marginBottom: '1.5rem' }}>
              Notifications & Activity Updates
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {notifications.map((n) => (
                <div
                  key={n.id}
                  style={{
                    padding: '1.2rem 1.5rem',
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ background: '#EFF6FF', width: '42px', height: '42px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0B3B91' }}>
                      <Bell size={20} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.975rem', fontWeight: '700', color: '#0F172A', margin: 0 }}>{n.title}</h4>
                      <p style={{ fontSize: '0.875rem', color: '#64748B', margin: '0.2rem 0 0' }}>{n.desc}</p>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: '600' }}>{n.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: ACCOUNT & PRIVACY SETTINGS */}
        {activeTab === 'settings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Quick Action to Edit Profile */}
            <div
              className="glass-card"
              style={{
                padding: '1.75rem',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
                border: '1.5px solid #F59E0B',
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#92400E', margin: 0 }}>
                  Manage Your Matrimony Profile
                </h3>
                <p style={{ color: '#78350F', fontSize: '0.9rem', margin: '0.2rem 0 0' }}>
                  Update your contact details, education, career, family background, or partner preferences anytime.
                </p>
              </div>

              <Link
                to="/edit-profile"
                className="btn-gold"
                style={{ padding: '0.75rem 1.5rem', borderRadius: '30px', fontWeight: '800', textDecoration: 'none' }}
              >
                <Edit3 size={16} /> Open Profile Editor
              </Link>
            </div>

            {/* Photo Manager */}
            <div className="glass-card" style={{ padding: '2rem', borderRadius: '24px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0F172A', marginBottom: '1.25rem' }}>
                Photo Manager & Gallery
              </h3>
              <PhotoUploader photos={profile?.photos} onPhotosUpdated={() => fetchCurrentUser()} />
            </div>

            {/* ID Verification */}
            <div className="glass-card" style={{ padding: '2rem', borderRadius: '24px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0F172A', marginBottom: '1.25rem' }}>
                Government ID Verification
              </h3>
              <IdVerification profile={profile} onProfileUpdated={() => fetchCurrentUser()} />
            </div>

            {/* Privacy Settings */}
            <div className="glass-card" style={{ padding: '2rem', borderRadius: '24px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0F172A', marginBottom: '1.25rem' }}>
                Privacy & Contact Visibility Settings
              </h3>
              <PrivacySettings profile={profile} onProfileUpdated={() => fetchCurrentUser()} />
            </div>
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
