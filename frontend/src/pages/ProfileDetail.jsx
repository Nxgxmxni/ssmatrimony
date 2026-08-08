import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Heart,
  Star,
  ShieldCheck,
  Sparkles,
  MapPin,
  Briefcase,
  GraduationCap,
  Users,
  MessageCircle,
  ArrowLeft,
  Moon,
  Coffee,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { profileAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import InterestModal from '../components/InterestModal';

export default function ProfileDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [isShortlisted, setIsShortlisted] = useState(false);
  const [showInterestModal, setShowInterestModal] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await profileAPI.getProfileById(id);
        setProfile(res.data);
        setIsShortlisted(res.data.isShortlisted || false);
      } catch (err) {
        console.error('Fetch profile detail error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const handleToggleShortlist = async () => {
    if (!isAuthenticated) {
      alert('Please login to shortlist profiles.');
      return;
    }
    try {
      const res = await profileAPI.toggleShortlist(id);
      setIsShortlisted(res.data.isShortlisted);
    } catch (err) {
      console.error('Shortlist error:', err);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '5rem', color: '#6b7280' }}>Loading profile details...</div>;
  }

  if (!profile) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2>Profile Not Found</h2>
        <Link to="/profiles" className="btn-primary" style={{ marginTop: '1rem' }}>
          Back to Profiles
        </Link>
      </div>
    );
  }

  const defaultPhoto = profile.gender === 'bride'
    ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80'
    : 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80';

  const photos = profile.photos?.length > 0 ? profile.photos : [defaultPhoto];

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        style={{ background: 'none', color: '#800020', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.5rem' }}
      >
        <ArrowLeft size={18} /> Back to Search Results
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
        {/* Left Column: Photo Gallery & Compatibility Widget */}
        <div>
          <div className="glass-card" style={{ padding: '1.25rem', overflow: 'hidden' }}>
            <div style={{ position: 'relative', height: '380px', borderRadius: '12px', overflow: 'hidden', marginBottom: '1rem' }}>
              <img
                src={photos[selectedPhotoIndex]}
                alt={profile.fullName}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {profile.isVerified && (
                <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                  <span className="badge-verified" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                    <ShieldCheck size={16} /> ID Verified Member
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery Switcher */}
            {photos.length > 1 && (
              <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
                {photos.map((p, idx) => (
                  <img
                    key={idx}
                    src={p}
                    alt=""
                    onClick={() => setSelectedPhotoIndex(idx)}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '8px',
                      objectFit: 'cover',
                      cursor: 'pointer',
                      border: idx === selectedPhotoIndex ? '3px solid #800020' : '2px solid transparent',
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Match Score Card */}
          <div className="glass-card" style={{ padding: '1.5rem', marginTop: '1.5rem', background: 'linear-gradient(135deg, #fff9e6 0%, #ffffff 100%)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ fontWeight: '700', color: '#800020', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sparkles size={18} color="#d4af37" /> Match Compatibility
              </div>
              <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#d4af37' }}>
                {profile.matchPercentage}%
              </span>
            </div>
            <div style={{ height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${profile.matchPercentage}%`,
                  background: 'linear-gradient(90deg, #d4af37 0%, #800020 100%)',
                }}
              />
            </div>
            <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.5rem' }}>
              Score calculated based on age preference, religion, location, and education alignment.
            </p>
          </div>
        </div>

        {/* Right Column: Detailed Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Header Card */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ fontSize: '2rem', color: '#800020', marginBottom: '0.2rem' }}>
                  {profile.fullName}
                </h1>
                <div style={{ fontSize: '1.05rem', color: '#4b5563', fontWeight: '600' }}>
                  {profile.age} yrs • {profile.heightCm} cm ({profile.weightKg || 60} kg) • {profile.city}, {profile.state}
                </div>
                {profile.user && (
                  <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.4rem' }}>
                    Contact: {profile.user.phone || 'Hidden'} • Email: {profile.user.email || 'Hidden'}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <button onClick={handleToggleShortlist} className="btn-secondary" style={{ padding: '0.6rem 1rem' }}>
                  <Star size={18} fill={isShortlisted ? '#d4af37' : 'none'} color={isShortlisted ? '#d4af37' : '#6b7280'} />
                  {isShortlisted ? 'Shortlisted' : 'Shortlist'}
                </button>
                <button onClick={() => setShowInterestModal(true)} className="btn-primary" style={{ padding: '0.6rem 1.25rem' }}>
                  <Heart size={18} fill="white" /> Express Interest
                </button>
              </div>
            </div>

            {profile.aboutMe && (
              <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #e5e7eb' }}>
                <h4 style={{ color: '#800020', marginBottom: '0.4rem' }}>About Myself</h4>
                <p style={{ color: '#4b5563', lineHeight: '1.7' }}>{profile.aboutMe}</p>
              </div>
            )}
          </div>

          {/* Personal & Cultural Background */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#800020', marginBottom: '1rem', borderBottom: '2px solid #fff0f3', paddingBottom: '0.4rem' }}>
              Personal & Cultural Details
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div><strong style={{ color: '#6b7280', fontSize: '0.85rem' }}>Religion:</strong> <div style={{ fontWeight: '600' }}>{profile.religion}</div></div>
              <div><strong style={{ color: '#6b7280', fontSize: '0.85rem' }}>Caste / Subcaste:</strong> <div style={{ fontWeight: '600' }}>{profile.caste} {profile.subCaste ? `(${profile.subCaste})` : ''}</div></div>
              <div><strong style={{ color: '#6b7280', fontSize: '0.85rem' }}>Mother Tongue:</strong> <div style={{ fontWeight: '600' }}>{profile.motherTongue}</div></div>
              <div><strong style={{ color: '#6b7280', fontSize: '0.85rem' }}>Marital Status:</strong> <div style={{ fontWeight: '600' }}>{profile.maritalStatus}</div></div>
              <div><strong style={{ color: '#6b7280', fontSize: '0.85rem' }}>Blood Group:</strong> <div style={{ fontWeight: '600' }}>{profile.bloodGroup || 'O+'}</div></div>
              <div><strong style={{ color: '#6b7280', fontSize: '0.85rem' }}>Disability:</strong> <div style={{ fontWeight: '600' }}>{profile.disability || 'None'}</div></div>
            </div>
          </div>

          {/* Horoscope & Astro Details */}
          {(profile.rashi || profile.nakshatram || profile.gothram) && (
            <div className="glass-card" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#800020', marginBottom: '1rem', borderBottom: '2px solid #fff0f3', paddingBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Moon size={18} color="#d4af37" /> Horoscope & Astro Details
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div><strong style={{ color: '#6b7280', fontSize: '0.85rem' }}>Rashi (Moon Sign):</strong> <div style={{ fontWeight: '600' }}>{profile.rashi || 'Not Specified'}</div></div>
                <div><strong style={{ color: '#6b7280', fontSize: '0.85rem' }}>Nakshatram (Star):</strong> <div style={{ fontWeight: '600' }}>{profile.nakshatram || 'Not Specified'}</div></div>
                <div><strong style={{ color: '#6b7280', fontSize: '0.85rem' }}>Gothram:</strong> <div style={{ fontWeight: '600' }}>{profile.gothram || 'Not Specified'}</div></div>
                <div><strong style={{ color: '#6b7280', fontSize: '0.85rem' }}>Manglik Status:</strong> <div style={{ fontWeight: '600', color: profile.manglikStatus === 'Yes' ? '#c5221f' : '#137333' }}>{profile.manglikStatus || 'No'}</div></div>
              </div>
            </div>
          )}

          {/* Education & Career */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#800020', marginBottom: '1rem', borderBottom: '2px solid #fff0f3', paddingBottom: '0.4rem' }}>
              Education & Profession
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div><strong style={{ color: '#6b7280', fontSize: '0.85rem' }}>Highest Qualification:</strong> <div style={{ fontWeight: '600' }}>{profile.highestEducation}</div></div>
              <div><strong style={{ color: '#6b7280', fontSize: '0.85rem' }}>College / University:</strong> <div style={{ fontWeight: '600' }}>{profile.college || 'University'}</div></div>
              <div><strong style={{ color: '#6b7280', fontSize: '0.85rem' }}>Occupation:</strong> <div style={{ fontWeight: '600' }}>{profile.occupation}</div></div>
              <div><strong style={{ color: '#6b7280', fontSize: '0.85rem' }}>Designation / Role:</strong> <div style={{ fontWeight: '600' }}>{profile.designation || profile.occupation}</div></div>
              <div><strong style={{ color: '#6b7280', fontSize: '0.85rem' }}>Company / Organization:</strong> <div style={{ fontWeight: '600' }}>{profile.company || 'Private Firm'}</div></div>
              <div><strong style={{ color: '#6b7280', fontSize: '0.85rem' }}>Annual Income:</strong> <div style={{ fontWeight: '600', color: '#137333' }}>{profile.annualIncome}</div></div>
            </div>
          </div>

          {/* Family & Lifestyle Background */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#800020', marginBottom: '1rem', borderBottom: '2px solid #fff0f3', paddingBottom: '0.4rem' }}>
              Family & Lifestyle Background
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div><strong style={{ color: '#6b7280', fontSize: '0.85rem' }}>Father's Occupation:</strong> <div style={{ fontWeight: '600' }}>{profile.fatherOccupation || 'Business'}</div></div>
              <div><strong style={{ color: '#6b7280', fontSize: '0.85rem' }}>Mother's Occupation:</strong> <div style={{ fontWeight: '600' }}>{profile.motherOccupation || 'Homemaker'}</div></div>
              <div><strong style={{ color: '#6b7280', fontSize: '0.85rem' }}>Siblings:</strong> <div style={{ fontWeight: '600' }}>{profile.brothersCount || 0} Brothers, {profile.sistersCount || 0} Sisters</div></div>
              <div><strong style={{ color: '#6b7280', fontSize: '0.85rem' }}>Family Type & Values:</strong> <div style={{ fontWeight: '600' }}>{profile.familyType || 'Nuclear'} ({profile.familyValues || 'Moderate'})</div></div>
              <div><strong style={{ color: '#6b7280', fontSize: '0.85rem' }}>Diet / Food:</strong> <div style={{ fontWeight: '600' }}>{profile.foodPreference || 'Vegetarian'}</div></div>
              <div><strong style={{ color: '#6b7280', fontSize: '0.85rem' }}>Smoking / Drinking:</strong> <div style={{ fontWeight: '600' }}>{profile.smoking || 'No'} / {profile.drinking || 'No'}</div></div>
            </div>

            {profile.hobbies?.length > 0 && (
              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                <strong style={{ color: '#6b7280', fontSize: '0.85rem' }}>Hobbies & Interests:</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.4rem' }}>
                  {profile.hobbies.map((h, i) => (
                    <span key={i} className="badge-gold" style={{ fontSize: '0.8rem' }}>{h}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Partner Expectations */}
          {profile.partnerExpectations && (
            <div className="glass-card" style={{ padding: '1.75rem', backgroundColor: '#faf6f0', border: '1px solid #d4af37' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#800020', marginBottom: '1rem' }}>
                Partner Expectations
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                <div><strong style={{ color: '#6b7280', fontSize: '0.85rem' }}>Preferred Age:</strong> <div style={{ fontWeight: '600' }}>{profile.partnerExpectations.minAge} to {profile.partnerExpectations.maxAge} Yrs</div></div>
                <div><strong style={{ color: '#6b7280', fontSize: '0.85rem' }}>Religion:</strong> <div style={{ fontWeight: '600' }}>{profile.partnerExpectations.religion}</div></div>
                <div><strong style={{ color: '#6b7280', fontSize: '0.85rem' }}>Preferred Caste:</strong> <div style={{ fontWeight: '600' }}>{profile.partnerExpectations.preferredCaste || 'Any'}</div></div>
                <div><strong style={{ color: '#6b7280', fontSize: '0.85rem' }}>Marital Status:</strong> <div style={{ fontWeight: '600' }}>{profile.partnerExpectations.maritalStatus}</div></div>
                <div><strong style={{ color: '#6b7280', fontSize: '0.85rem' }}>Education:</strong> <div style={{ fontWeight: '600' }}>{profile.partnerExpectations.education}</div></div>
                <div><strong style={{ color: '#6b7280', fontSize: '0.85rem' }}>Preferred Location:</strong> <div style={{ fontWeight: '600' }}>{profile.partnerExpectations.location || 'Any'}</div></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Interest Modal */}
      {showInterestModal && (
        <InterestModal
          targetProfile={profile}
          onClose={() => setShowInterestModal(false)}
          onSuccess={() => alert('Interest sent successfully!')}
        />
      )}
    </div>
  );
}
