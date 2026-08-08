import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, MapPin, Briefcase, GraduationCap, ShieldCheck, Sparkles, EyeOff, User } from 'lucide-react';
import { profileAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ProfileCard({ profile, onOpenInterestModal, onIgnore }) {
  const { isAuthenticated } = useAuth();
  const [isShortlisted, setIsShortlisted] = useState(profile.isShortlisted || false);
  const [shortlistLoading, setShortlistLoading] = useState(false);
  const [ignored, setIgnored] = useState(false);

  if (ignored) return null;

  const isActuallyVerified = profile.isVerified || profile.idVerificationStatus === 'Verified';

  // Profile ID formatting
  const profileIdDisplay = profile._id ? `SS-${profile._id.slice(-6).toUpperCase()}` : 'SS-MEMBER';

  // Fallback avatars
  const defaultPhoto = (profile.gender === 'female' || profile.gender === 'bride')
    ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80'
    : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80';

  const photoUrl = profile.photos?.[0] || defaultPhoto;

  const handleToggleShortlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      alert('Please sign in to shortlist profiles');
      return;
    }

    try {
      setShortlistLoading(true);
      const res = await profileAPI.toggleShortlist(profile._id);
      setIsShortlisted(res.data.isShortlisted);
    } catch (err) {
      console.error('Shortlist error:', err);
    } finally {
      setShortlistLoading(false);
    }
  };

  const handleIgnore = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIgnored(true);
    if (onIgnore) onIgnore(profile._id);
  };

  return (
    <div
      className="glass-card animate-fade-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        borderRadius: '20px',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 16px 35px rgba(18, 59, 143, 0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
    >
      {/* Match Percentage Badge */}
      {profile.matchPercentage && (
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            zIndex: 10,
            background: 'linear-gradient(135deg, #123B8F 0%, #0077FF 100%)',
            color: '#FFFFFF',
            fontWeight: '700',
            fontSize: '0.75rem',
            padding: '0.3rem 0.65rem',
            borderRadius: '20px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}
        >
          <Sparkles size={13} color="#FFFFFF" /> {profile.matchPercentage}% Match
        </div>
      )}

      {/* Top Action Buttons (Shortlist & Ignore) */}
      <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 10, display: 'flex', gap: '0.4rem' }}>
        <button
          onClick={handleIgnore}
          title="Ignore Profile"
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            cursor: 'pointer',
          }}
        >
          <EyeOff size={16} color="#64748B" />
        </button>

        <button
          onClick={handleToggleShortlist}
          disabled={shortlistLoading}
          title={isShortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            border: 'none',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            cursor: 'pointer',
          }}
        >
          <Star size={17} fill={isShortlisted ? '#D4AF37' : 'none'} color={isShortlisted ? '#D4AF37' : '#64748B'} />
        </button>
      </div>

      {/* Profile Image Banner */}
      <Link to={`/profiles/${profile._id}`} style={{ position: 'relative', display: 'block', overflow: 'hidden', height: '260px' }}>
        <img
          src={photoUrl}
          alt={profile.fullName}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
        />
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60px',
          background: 'linear-gradient(to top, rgba(5, 15, 40, 0.65), rgba(5, 15, 40, 0.15), transparent)'
        }} />
      </Link>

      {/* Profile Body Details */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '0.55rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.4rem' }}>
          <div>
            <Link to={`/profiles/${profile._id}`} style={{ textDecoration: 'none' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#123B8F', margin: 0 }}>
                {profile.fullName}
              </h3>
            </Link>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#D4AF37', letterSpacing: '0.5px' }}>
              {profileIdDisplay}
            </span>
          </div>

          {isActuallyVerified && (
            <span className="badge-verified" title="Verified Profile" style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}>
              <ShieldCheck size={13} /> Verified
            </span>
          )}
        </div>

        <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#334155' }}>
          {[profile.age ? `${profile.age} yrs` : '', profile.heightCm ? `${profile.heightCm} cm` : '', [profile.religion, profile.caste].filter(Boolean).join(' • ')].filter(Boolean).join(' | ')}
        </div>

        <div style={{ fontSize: '0.85rem', color: '#64748B', display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: '0.2rem' }}>
          {profile.highestEducation && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <GraduationCap size={15} color="#123B8F" />
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {profile.highestEducation}
              </span>
            </div>
          )}

          {profile.occupation && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Briefcase size={15} color="#123B8F" />
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {profile.occupation}
              </span>
            </div>
          )}

          {(profile.city || profile.state) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MapPin size={15} color="#123B8F" />
              <span>{[profile.city, profile.state].filter(Boolean).join(', ')}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ marginTop: 'auto', paddingTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
          <Link
            to={`/profiles/${profile._id}`}
            className="btn-secondary"
            style={{ justifyContent: 'center', padding: '0.55rem 0.5rem', fontSize: '0.85rem', borderRadius: '30px' }}
          >
            View Profile
          </Link>

          <button
            onClick={() => onOpenInterestModal && onOpenInterestModal(profile)}
            className="btn-primary"
            style={{ justifyContent: 'center', padding: '0.55rem 0.5rem', fontSize: '0.85rem', borderRadius: '30px' }}
          >
            <Heart size={14} fill="white" /> Express Interest
          </button>
        </div>
      </div>
    </div>
  );
}

