import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProfileWizard from '../components/ProfileWizard';
import Logo from '../components/Logo';
import { ArrowLeft } from 'lucide-react';

export default function Onboarding({ isEditMode: isEditProp = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, fetchCurrentUser } = useAuth();

  const queryParams = new URLSearchParams(location.search);
  const isEditMode = isEditProp || queryParams.get('mode') === 'edit' || queryParams.get('edit') === 'true';

  useEffect(() => {
    // If user has already submitted profile wizard and is not in edit mode, redirect straight to dashboard
    if (profile?.isWizardCompleted && !isEditMode) {
      navigate('/dashboard', { replace: true });
    }
  }, [profile, isEditMode, navigate]);

  const handleComplete = async (updatedProfile) => {
    await fetchCurrentUser();
    navigate('/dashboard', { replace: true });
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #FAF9F6 0%, #EBF4FF 50%, #FFFFFF 100%)',
        minHeight: '100vh',
        padding: '2.5rem 1.5rem 5rem',
      }}
    >
      <div style={{ maxWidth: '960px', margin: '0 auto', textAlign: 'center', marginBottom: '2.5rem' }}>
        {isEditMode && (
          <div style={{ textAlign: 'left', marginBottom: '1rem' }}>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-secondary"
              style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', borderRadius: '30px' }}
            >
              <ArrowLeft size={16} /> Return to Dashboard
            </button>
          </div>
        )}

        <div style={{ display: 'inline-block', marginBottom: '0.85rem' }}>
          <Logo height={42} variant="light" />
        </div>
        <h1
          style={{
            fontSize: '2.1rem',
            fontWeight: '800',
            color: '#0F172A',
            fontFamily: 'Outfit, sans-serif',
            marginBottom: '0.5rem',
          }}
        >
          {isEditMode ? (
            <>Edit Your <span style={{ color: '#0B3B91', fontFamily: 'serif', fontStyle: 'italic' }}>Matrimony Profile</span></>
          ) : (
            <>Create Your <span style={{ color: '#0B3B91', fontFamily: 'serif', fontStyle: 'italic' }}>Matrimony Profile</span></>
          )}
        </h1>
        <p style={{ color: '#64748B', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
          {isEditMode
            ? `Welcome, ${user?.fullName || 'Member'}! Update your profile details to keep your matches accurate.`
            : `Welcome, ${user?.fullName || 'Member'}! Complete your 10-step profile setup to connect with thousands of verified profiles.`}
        </p>
      </div>

      <ProfileWizard existingProfile={profile} onComplete={handleComplete} isEditMode={isEditMode} />
    </div>
  );
}
