import React, { useState, useEffect } from 'react';
import { profileAPI } from '../services/api';
import PhotoUploader from './PhotoUploader';
import IdVerification from './IdVerification';
import { 
  User, 
  Sparkles, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Save, 
  GraduationCap, 
  Users, 
  Moon, 
  Heart, 
  Image as ImageIcon, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export default function ProfileWizard({ existingProfile, onComplete, isEditMode = false }) {
  const [currentStep, setCurrentStep] = useState(existingProfile?.wizardStep || 1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    fullName: existingProfile?.fullName || '',
    profileManagedBy: existingProfile?.profileManagedBy || 'Self',
    gender: existingProfile?.gender || '',
    dateOfBirth: existingProfile?.dateOfBirth ? new Date(existingProfile.dateOfBirth).toISOString().split('T')[0] : '',
    maritalStatus: existingProfile?.maritalStatus || '',

    // Step 2: Personal Details
    heightCm: existingProfile?.heightCm || '',
    weightKg: existingProfile?.weightKg || '',
    bloodGroup: existingProfile?.bloodGroup || '',
    motherTongue: existingProfile?.motherTongue || '',
    disability: existingProfile?.disability || '',
    city: existingProfile?.city || '',
    state: existingProfile?.state || '',
    country: existingProfile?.country || 'India',

    // Step 3: Religion & Community
    religion: existingProfile?.religion || '',
    caste: existingProfile?.caste || '',
    subCaste: existingProfile?.subCaste || '',
    gothram: existingProfile?.gothram || '',
    rashi: existingProfile?.rashi || '',
    nakshatram: existingProfile?.nakshatram || '',
    manglikStatus: existingProfile?.manglikStatus || '',

    // Step 4: Education & Career
    highestEducation: existingProfile?.highestEducation || '',
    college: existingProfile?.college || '',
    occupation: existingProfile?.occupation || '',
    designation: existingProfile?.designation || '',
    company: existingProfile?.company || '',
    annualIncome: existingProfile?.annualIncome || '',

    // Step 5: Family Details
    fatherName: existingProfile?.fatherName || '',
    fatherOccupation: existingProfile?.fatherOccupation || '',
    motherName: existingProfile?.motherName || '',
    motherOccupation: existingProfile?.motherOccupation || '',
    brothersCount: existingProfile?.brothersCount ?? 0,
    sistersCount: existingProfile?.sistersCount ?? 0,
    familyType: existingProfile?.familyType || '',
    familyStatus: existingProfile?.familyStatus || '',
    familyValues: existingProfile?.familyValues || '',

    // Step 6: About Me & Lifestyle
    aboutMe: existingProfile?.aboutMe || '',
    hobbies: Array.isArray(existingProfile?.hobbies) ? existingProfile.hobbies.join(', ') : (existingProfile?.hobbies || ''),
    foodPreference: existingProfile?.foodPreference || '',
    smoking: existingProfile?.smoking || '',
    drinking: existingProfile?.drinking || '',

    // Step 7: Partner Preferences
    partnerMinAge: existingProfile?.partnerExpectations?.minAge || '',
    partnerMaxAge: existingProfile?.partnerExpectations?.maxAge || '',
    partnerReligion: existingProfile?.partnerExpectations?.religion || '',
    partnerCaste: existingProfile?.partnerExpectations?.preferredCaste || '',
    partnerEducation: existingProfile?.partnerExpectations?.education || '',
    partnerOccupation: existingProfile?.partnerExpectations?.preferredOccupation || '',
    partnerLocation: existingProfile?.partnerExpectations?.location || '',

    // Step 8: Gallery & Photos
    photos: existingProfile?.photos || [],
  });

  const [saving, setSaving] = useState(false);
  const [draftMsg, setDraftMsg] = useState('');

  // Synchronize form state whenever existingProfile changes
  useEffect(() => {
    if (existingProfile) {
      setFormData({
        fullName: existingProfile.fullName || '',
        profileManagedBy: existingProfile.profileManagedBy || 'Self',
        gender: existingProfile.gender || '',
        dateOfBirth: existingProfile.dateOfBirth ? new Date(existingProfile.dateOfBirth).toISOString().split('T')[0] : '',
        maritalStatus: existingProfile.maritalStatus || '',

        heightCm: existingProfile.heightCm || '',
        weightKg: existingProfile.weightKg || '',
        bloodGroup: existingProfile.bloodGroup || '',
        motherTongue: existingProfile.motherTongue || '',
        disability: existingProfile.disability || '',
        city: existingProfile.city || '',
        state: existingProfile.state || '',
        country: existingProfile.country || 'India',

        religion: existingProfile.religion || '',
        caste: existingProfile.caste || '',
        subCaste: existingProfile.subCaste || '',
        gothram: existingProfile.gothram || '',
        rashi: existingProfile.rashi || '',
        nakshatram: existingProfile.nakshatram || '',
        manglikStatus: existingProfile.manglikStatus || '',

        highestEducation: existingProfile.highestEducation || '',
        college: existingProfile.college || '',
        occupation: existingProfile.occupation || '',
        designation: existingProfile.designation || '',
        company: existingProfile.company || '',
        annualIncome: existingProfile.annualIncome || '',

        fatherName: existingProfile.fatherName || '',
        fatherOccupation: existingProfile.fatherOccupation || '',
        motherName: existingProfile.motherName || '',
        motherOccupation: existingProfile.motherOccupation || '',
        brothersCount: existingProfile.brothersCount ?? 0,
        sistersCount: existingProfile.sistersCount ?? 0,
        familyType: existingProfile.familyType || '',
        familyStatus: existingProfile.familyStatus || '',
        familyValues: existingProfile.familyValues || '',

        aboutMe: existingProfile.aboutMe || '',
        hobbies: Array.isArray(existingProfile.hobbies) ? existingProfile.hobbies.join(', ') : (existingProfile.hobbies || ''),
        foodPreference: existingProfile.foodPreference || '',
        smoking: existingProfile.smoking || '',
        drinking: existingProfile.drinking || '',

        partnerMinAge: existingProfile.partnerExpectations?.minAge || '',
        partnerMaxAge: existingProfile.partnerExpectations?.maxAge || '',
        partnerReligion: existingProfile.partnerExpectations?.religion || '',
        partnerCaste: existingProfile.partnerExpectations?.preferredCaste || '',
        partnerEducation: existingProfile.partnerExpectations?.education || '',
        partnerOccupation: existingProfile.partnerExpectations?.preferredOccupation || '',
        partnerLocation: existingProfile.partnerExpectations?.location || '',

        photos: existingProfile.photos || [],
      });

      if (existingProfile.wizardStep && existingProfile.wizardStep <= 10) {
        setCurrentStep(existingProfile.wizardStep);
      }
    }
  }, [existingProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
  };

  const handleSaveDraft = async () => {
    try {
      setSaving(true);
      setDraftMsg('');
      await profileAPI.saveDraft(currentStep, formData);
      setDraftMsg('Progress auto-saved! You can resume anytime.');
    } catch (err) {
      console.error('Draft save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleNextStep = async (e) => {
    if (e) e.preventDefault();
    handleSaveDraft();
    if (currentStep < 10) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFinalSubmit = async (e) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        ...formData,
        wizardStep: 10,
        isWizardCompleted: true,
        hobbies: typeof formData.hobbies === 'string' ? formData.hobbies.split(',').map((s) => s.trim()).filter(Boolean) : formData.hobbies,
        partnerExpectations: {
          minAge: formData.partnerMinAge ? Number(formData.partnerMinAge) : null,
          maxAge: formData.partnerMaxAge ? Number(formData.partnerMaxAge) : null,
          religion: formData.partnerReligion,
          preferredCaste: formData.partnerCaste,
          education: formData.partnerEducation,
          preferredOccupation: formData.partnerOccupation,
          location: formData.partnerLocation,
        },
      };

      const res = await profileAPI.updateMyProfile(payload);
      if (onComplete) onComplete(res.data);
    } catch (err) {
      console.error('Profile submission error:', err);
      alert('Error saving profile. Please check all fields and try again.');
    } finally {
      setSaving(false);
    }
  };

  const wizardSteps = [
    { num: 1, title: 'Basic Information', icon: User },
    { num: 2, title: 'Personal Details', icon: FileText },
    { num: 3, title: 'Religion & Community', icon: Moon },
    { num: 4, title: 'Education & Career', icon: GraduationCap },
    { num: 5, title: 'Family Details', icon: Users },
    { num: 6, title: 'About Me & Lifestyle', icon: Sparkles },
    { num: 7, title: 'Partner Preferences', icon: Heart },
    { num: 8, title: 'Photo Upload', icon: ImageIcon },
    { num: 9, title: 'ID Verification', icon: ShieldCheck },
    { num: 10, title: 'Preview & Submit', icon: CheckCircle2 },
  ];

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      {/* Wizard Header Bar */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.75rem', borderRadius: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#0B3B91', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>
              PROFILE SETUP — STEP {currentStep} OF 10
            </span>
            <h2 style={{ fontSize: '1.45rem', color: '#0F172A', fontWeight: '800', marginTop: '0.2rem' }}>
              {wizardSteps[currentStep - 1].title}
            </h2>
          </div>

          <button onClick={handleSaveDraft} disabled={saving} className="btn-secondary" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', borderRadius: '30px' }}>
            <Save size={15} /> {saving ? 'Saving...' : 'Save Progress'}
          </button>
        </div>

        {/* Step Progress Pills Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.4rem' }}>
          {wizardSteps.map((step) => {
            const Icon = step.icon;
            const isCompleted = step.num < currentStep;
            const isCurrent = step.num === currentStep;

            return (
              <div
                key={step.num}
                onClick={() => setCurrentStep(step.num)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.55rem 0.5rem',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  backgroundColor: isCurrent ? '#0B3B91' : isCompleted ? '#EFF6FF' : '#F8FAFC',
                  color: isCurrent ? '#FFFFFF' : isCompleted ? '#0B3B91' : '#64748B',
                  border: isCurrent ? '1.5px solid #0B3B91' : isCompleted ? '1px solid #BFDBFE' : '1px solid #E2E8F0',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  transition: 'all 0.2s ease',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon size={14} style={{ flexShrink: 0 }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {step.num}. {step.title.split(' ')[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {draftMsg && (
        <div style={{ backgroundColor: '#F0FDF4', color: '#166534', border: '1px solid #BBF7D0', padding: '0.75rem 1rem', borderRadius: '12px', fontSize: '0.875rem', marginBottom: '1.5rem', fontWeight: '600' }}>
          {draftMsg}
        </div>
      )}

      {/* Main Step Form Container */}
      <form onSubmit={currentStep === 10 ? handleFinalSubmit : handleNextStep} className="glass-card" style={{ padding: '2.25rem', borderRadius: '24px' }}>
        
        {/* STEP 1: BASIC INFORMATION */}
        {currentStep === 1 && (
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0F172A', marginBottom: '1.25rem' }}>Step 1: Basic Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
              <div>
                <label className="form-label">Full Name *</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="form-input" placeholder="e.g. Sravani Rao" required />
              </div>

              <div>
                <label className="form-label">Profile Created For</label>
                <select name="profileManagedBy" value={formData.profileManagedBy} onChange={handleChange} className="form-select">
                  <option value="Self">Self</option>
                  <option value="Bride">Bride</option>
                  <option value="Groom">Groom</option>
                  <option value="Parent">Parent / Guardian</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Friend">Friend / Relative</option>
                </select>
              </div>

              <div>
                <label className="form-label">Gender *</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="form-select" required>
                  <option value="">Select Gender</option>
                  <option value="bride">Bride (Female)</option>
                  <option value="groom">Groom (Male)</option>
                </select>
              </div>

              <div>
                <label className="form-label">Date of Birth</label>
                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="form-input" />
              </div>

              <div>
                <label className="form-label">Marital Status</label>
                <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="form-select">
                  <option value="">Select Marital Status</option>
                  <option value="Never Married">Never Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                  <option value="Awaiting Divorce">Awaiting Divorce</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: PERSONAL DETAILS */}
        {currentStep === 2 && (
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0F172A', marginBottom: '1.25rem' }}>Step 2: Personal Details & Location</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              <div>
                <label className="form-label">Height (cm)</label>
                <input type="number" name="heightCm" value={formData.heightCm} onChange={handleChange} className="form-input" placeholder="e.g. 165" />
              </div>

              <div>
                <label className="form-label">Weight (kg)</label>
                <input type="number" name="weightKg" value={formData.weightKg} onChange={handleChange} className="form-input" placeholder="e.g. 60" />
              </div>

              <div>
                <label className="form-label">Blood Group</label>
                <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="form-select">
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              <div>
                <label className="form-label">Mother Tongue</label>
                <select name="motherTongue" value={formData.motherTongue} onChange={handleChange} className="form-select">
                  <option value="">Select Mother Tongue</option>
                  <option value="Telugu">Telugu</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Tamil">Tamil</option>
                  <option value="Kannada">Kannada</option>
                  <option value="Malayalam">Malayalam</option>
                  <option value="Marathi">Marathi</option>
                  <option value="Gujarati">Gujarati</option>
                  <option value="Bengali">Bengali</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="form-label">Physical Disability</label>
                <select name="disability" value={formData.disability} onChange={handleChange} className="form-select">
                  <option value="None">None</option>
                  <option value="Physical Disability">Physical Disability</option>
                </select>
              </div>

              <div>
                <label className="form-label">City</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} className="form-input" placeholder="e.g. Hyderabad, Vijayawada" />
              </div>

              <div>
                <label className="form-label">State</label>
                <input type="text" name="state" value={formData.state} onChange={handleChange} className="form-input" placeholder="e.g. Telangana, Andhra Pradesh" />
              </div>

              <div>
                <label className="form-label">Country</label>
                <input type="text" name="country" value={formData.country} onChange={handleChange} className="form-input" placeholder="e.g. India" />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: RELIGION & COMMUNITY */}
        {currentStep === 3 && (
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0F172A', marginBottom: '1.25rem' }}>Step 3: Religion & Community</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              <div>
                <label className="form-label">Religion</label>
                <select name="religion" value={formData.religion} onChange={handleChange} className="form-select">
                  <option value="">Select Religion</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Muslim">Muslim</option>
                  <option value="Christian">Christian</option>
                  <option value="Sikh">Sikh</option>
                  <option value="Jain">Jain</option>
                  <option value="Buddhist">Buddhist</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="form-label">Caste</label>
                <input type="text" name="caste" value={formData.caste} onChange={handleChange} className="form-input" placeholder="e.g. Kamma, Reddy, Brahmin, Kapu" />
              </div>

              <div>
                <label className="form-label">Sub Caste</label>
                <input type="text" name="subCaste" value={formData.subCaste} onChange={handleChange} className="form-input" placeholder="Sub caste if applicable" />
              </div>

              <div>
                <label className="form-label">Gothram</label>
                <input type="text" name="gothram" value={formData.gothram} onChange={handleChange} className="form-input" placeholder="Gothram" />
              </div>

              <div>
                <label className="form-label">Rashi / Zodiac</label>
                <input type="text" name="rashi" value={formData.rashi} onChange={handleChange} className="form-input" placeholder="e.g. Mesha, Vrishabha" />
              </div>

              <div>
                <label className="form-label">Nakshatram</label>
                <input type="text" name="nakshatram" value={formData.nakshatram} onChange={handleChange} className="form-input" placeholder="e.g. Rohini, Ashwini" />
              </div>

              <div>
                <label className="form-label">Manglik Status</label>
                <select name="manglikStatus" value={formData.manglikStatus} onChange={handleChange} className="form-select">
                  <option value="">Select Status</option>
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                  <option value="Anshik Manglik">Anshik Manglik</option>
                  <option value="Don't Know">Don't Know</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: EDUCATION & CAREER */}
        {currentStep === 4 && (
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0F172A', marginBottom: '1.25rem' }}>Step 4: Education & Career</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              <div>
                <label className="form-label">Highest Education</label>
                <input type="text" name="highestEducation" value={formData.highestEducation} onChange={handleChange} className="form-input" placeholder="e.g. B.Tech, M.Tech, MBA, MBBS" />
              </div>

              <div>
                <label className="form-label">College / University</label>
                <input type="text" name="college" value={formData.college} onChange={handleChange} className="form-input" placeholder="e.g. Osmania University, BITS Pilani" />
              </div>

              <div>
                <label className="form-label">Occupation</label>
                <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} className="form-input" placeholder="e.g. Software Engineer, Doctor, Business Owner" />
              </div>

              <div>
                <label className="form-label">Designation</label>
                <input type="text" name="designation" value={formData.designation} onChange={handleChange} className="form-input" placeholder="e.g. Senior Tech Lead" />
              </div>

              <div>
                <label className="form-label">Company Name</label>
                <input type="text" name="company" value={formData.company} onChange={handleChange} className="form-input" placeholder="e.g. TCS, Infosys, Deloitte" />
              </div>

              <div>
                <label className="form-label">Annual Income</label>
                <select name="annualIncome" value={formData.annualIncome} onChange={handleChange} className="form-select">
                  <option value="">Select Income Bracket</option>
                  <option value="3-5 LPA">3-5 LPA</option>
                  <option value="5-10 LPA">5-10 LPA</option>
                  <option value="10-15 LPA">10-15 LPA</option>
                  <option value="15-25 LPA">15-25 LPA</option>
                  <option value="25-40 LPA">25-40 LPA</option>
                  <option value="40+ LPA">40+ LPA</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: FAMILY DETAILS */}
        {currentStep === 5 && (
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0F172A', marginBottom: '1.25rem' }}>Step 5: Family Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              <div>
                <label className="form-label">Father's Name</label>
                <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} className="form-input" placeholder="Father's Name" />
              </div>

              <div>
                <label className="form-label">Father's Occupation</label>
                <input type="text" name="fatherOccupation" value={formData.fatherOccupation} onChange={handleChange} className="form-input" placeholder="e.g. Businessman, Retired Govt Officer" />
              </div>

              <div>
                <label className="form-label">Mother's Name</label>
                <input type="text" name="motherName" value={formData.motherName} onChange={handleChange} className="form-input" placeholder="Mother's Name" />
              </div>

              <div>
                <label className="form-label">Mother's Occupation</label>
                <input type="text" name="motherOccupation" value={formData.motherOccupation} onChange={handleChange} className="form-input" placeholder="e.g. Homemaker, Teacher" />
              </div>

              <div>
                <label className="form-label">Brothers Count</label>
                <input type="number" name="brothersCount" value={formData.brothersCount} onChange={handleChange} className="form-input" min="0" />
              </div>

              <div>
                <label className="form-label">Sisters Count</label>
                <input type="number" name="sistersCount" value={formData.sistersCount} onChange={handleChange} className="form-input" min="0" />
              </div>

              <div>
                <label className="form-label">Family Type</label>
                <select name="familyType" value={formData.familyType} onChange={handleChange} className="form-select">
                  <option value="">Select Family Type</option>
                  <option value="Nuclear">Nuclear</option>
                  <option value="Joint">Joint</option>
                </select>
              </div>

              <div>
                <label className="form-label">Family Status</label>
                <select name="familyStatus" value={formData.familyStatus} onChange={handleChange} className="form-select">
                  <option value="">Select Family Status</option>
                  <option value="Middle Class">Middle Class</option>
                  <option value="Upper Middle Class">Upper Middle Class</option>
                  <option value="Rich / High Class">Rich / High Class</option>
                </select>
              </div>

              <div>
                <label className="form-label">Family Values</label>
                <select name="familyValues" value={formData.familyValues} onChange={handleChange} className="form-select">
                  <option value="">Select Family Values</option>
                  <option value="Traditional">Traditional</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Liberal">Liberal</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: ABOUT ME & LIFESTYLE */}
        {currentStep === 6 && (
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0F172A', marginBottom: '1.25rem' }}>Step 6: About Me & Lifestyle</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
              <div>
                <label className="form-label">Personal Bio / About Yourself</label>
                <textarea name="aboutMe" rows={4} value={formData.aboutMe} onChange={handleChange} className="form-textarea" placeholder="Write a few lines about your values, personality, upbringing, and expectations..." />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                <div>
                  <label className="form-label">Hobbies & Interests (comma separated)</label>
                  <input type="text" name="hobbies" value={formData.hobbies} onChange={handleChange} className="form-input" placeholder="e.g. Reading, Traveling, Music, Cooking" />
                </div>

                <div>
                  <label className="form-label">Food Preference</label>
                  <select name="foodPreference" value={formData.foodPreference} onChange={handleChange} className="form-select">
                    <option value="">Select Preference</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                    <option value="Eggetarian">Eggetarian</option>
                    <option value="Vegan">Vegan</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Smoking Habits</label>
                  <select name="smoking" value={formData.smoking} onChange={handleChange} className="form-select">
                    <option value="">Select Habit</option>
                    <option value="No">No</option>
                    <option value="Occasional">Occasional</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Drinking Habits</label>
                  <select name="drinking" value={formData.drinking} onChange={handleChange} className="form-select">
                    <option value="">Select Habit</option>
                    <option value="No">No</option>
                    <option value="Occasional">Occasional</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: PARTNER PREFERENCES */}
        {currentStep === 7 && (
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0F172A', marginBottom: '1.25rem' }}>Step 7: Partner Preferences</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              <div>
                <label className="form-label">Preferred Min Age</label>
                <input type="number" name="partnerMinAge" value={formData.partnerMinAge} onChange={handleChange} className="form-input" placeholder="e.g. 21" />
              </div>

              <div>
                <label className="form-label">Preferred Max Age</label>
                <input type="number" name="partnerMaxAge" value={formData.partnerMaxAge} onChange={handleChange} className="form-input" placeholder="e.g. 30" />
              </div>

              <div>
                <label className="form-label">Preferred Religion</label>
                <input type="text" name="partnerReligion" value={formData.partnerReligion} onChange={handleChange} className="form-input" placeholder="e.g. Hindu, Any" />
              </div>

              <div>
                <label className="form-label">Preferred Caste</label>
                <input type="text" name="partnerCaste" value={formData.partnerCaste} onChange={handleChange} className="form-input" placeholder="e.g. Kamma, Reddy, Any" />
              </div>

              <div>
                <label className="form-label">Preferred Education</label>
                <input type="text" name="partnerEducation" value={formData.partnerEducation} onChange={handleChange} className="form-input" placeholder="e.g. Graduate, Master Degree" />
              </div>

              <div>
                <label className="form-label">Preferred Occupation</label>
                <input type="text" name="partnerOccupation" value={formData.partnerOccupation} onChange={handleChange} className="form-input" placeholder="e.g. IT Professional, Any" />
              </div>

              <div>
                <label className="form-label">Preferred Location</label>
                <input type="text" name="partnerLocation" value={formData.partnerLocation} onChange={handleChange} className="form-input" placeholder="e.g. Hyderabad, Telangana, Any" />
              </div>
            </div>
          </div>
        )}

        {/* STEP 8: PHOTO UPLOAD */}
        {currentStep === 8 && (
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0F172A', marginBottom: '0.5rem' }}>Step 8: Upload Profile Photos</h3>
            <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Profiles with photos receive up to 5x more match responses. You can upload photo URLs or images now or add them later.
            </p>
            <PhotoUploader photos={formData.photos} onPhotosUpdated={(updatedPhotos) => setFormData((prev) => ({ ...prev, photos: updatedPhotos }))} />
          </div>
        )}

        {/* STEP 9: GOVERNMENT ID VERIFICATION */}
        {currentStep === 9 && (
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0F172A', marginBottom: '0.5rem' }}>Step 9: Government ID Verification</h3>
            <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Optional: Submit your Aadhaar, Passport, or Driving License for admin verification to receive a Verified Trust Badge.
            </p>
            <IdVerification profile={existingProfile} onVerificationSubmitted={() => {}} />
          </div>
        )}

        {/* STEP 10: PREVIEW & SUBMIT */}
        {currentStep === 10 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <CheckCircle2 size={48} color="#0B3B91" style={{ marginBottom: '0.5rem' }} />
              <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0F172A' }}>Step 10: Preview & Submit Your Profile</h3>
              <p style={{ color: '#64748B', fontSize: '0.95rem', marginTop: '0.25rem' }}>
                Please review your profile details below before finalizing your submission.
              </p>
            </div>

            {/* Summary Review Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
              <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                <h4 style={{ color: '#0B3B91', fontWeight: '700', fontSize: '0.95rem', marginBottom: '0.5rem' }}>Basic & Personal</h4>
                <div style={{ fontSize: '0.85rem', color: '#334155', lineHeight: '1.6' }}>
                  <div><strong>Name:</strong> {formData.fullName || 'Not provided'}</div>
                  <div><strong>Gender:</strong> {formData.gender}</div>
                  <div><strong>DOB:</strong> {formData.dateOfBirth || 'Not provided'}</div>
                  <div><strong>Marital Status:</strong> {formData.maritalStatus || 'Not provided'}</div>
                  <div><strong>Height / Weight:</strong> {formData.heightCm ? `${formData.heightCm} cm` : 'N/A'} {formData.weightKg ? `/ ${formData.weightKg} kg` : ''}</div>
                  <div><strong>Location:</strong> {[formData.city, formData.state].filter(Boolean).join(', ') || 'Not provided'}</div>
                </div>
              </div>

              <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                <h4 style={{ color: '#0B3B91', fontWeight: '700', fontSize: '0.95rem', marginBottom: '0.5rem' }}>Community & Career</h4>
                <div style={{ fontSize: '0.85rem', color: '#334155', lineHeight: '1.6' }}>
                  <div><strong>Religion / Caste:</strong> {[formData.religion, formData.caste].filter(Boolean).join(' - ') || 'Not provided'}</div>
                  <div><strong>Gothram:</strong> {formData.gothram || 'Not provided'}</div>
                  <div><strong>Education:</strong> {formData.highestEducation || 'Not provided'}</div>
                  <div><strong>Occupation:</strong> {formData.occupation || 'Not provided'}</div>
                  <div><strong>Company:</strong> {formData.company || 'Not provided'}</div>
                  <div><strong>Income:</strong> {formData.annualIncome || 'Not provided'}</div>
                </div>
              </div>

              <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                <h4 style={{ color: '#0B3B91', fontWeight: '700', fontSize: '0.95rem', marginBottom: '0.5rem' }}>Photos & Preferences</h4>
                <div style={{ fontSize: '0.85rem', color: '#334155', lineHeight: '1.6' }}>
                  <div><strong>Uploaded Photos:</strong> {formData.photos.length} uploaded</div>
                  <div><strong>Partner Age:</strong> {formData.partnerMinAge && formData.partnerMaxAge ? `${formData.partnerMinAge} - ${formData.partnerMaxAge} yrs` : 'Any'}</div>
                  <div><strong>Partner Religion:</strong> {formData.partnerReligion || 'Any'}</div>
                  <div><strong>Partner Location:</strong> {formData.partnerLocation || 'Any'}</div>
                </div>
              </div>
            </div>

            {/* Final Submit Action Button */}
            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={saving}
              className="btn-gold"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '1rem',
                fontSize: '1.1rem',
                fontWeight: '800',
                borderRadius: '50px',
                boxShadow: '0 10px 25px rgba(212, 175, 55, 0.4)',
              }}
            >
              {saving
                ? isEditMode
                  ? 'Saving Changes...'
                  : 'Completing Profile Submission...'
                : isEditMode
                ? <><CheckCircle2 size={20} /> Update Profile & Return to Dashboard</>
                : <><CheckCircle2 size={20} /> Submit Profile & Go to Dashboard</>}
            </button>
          </div>
        )}

        {/* Wizard Navigation Buttons */}
        {currentStep < 10 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid #E2E8F0' }}>
            <button
              type="button"
              onClick={handlePrevStep}
              disabled={currentStep === 1}
              className="btn-secondary"
              style={{ padding: '0.7rem 1.25rem', opacity: currentStep === 1 ? 0.5 : 1, cursor: currentStep === 1 ? 'not-allowed' : 'pointer' }}
            >
              <ArrowLeft size={16} /> Back
            </button>

            <button type="submit" className="btn-primary" style={{ padding: '0.7rem 1.5rem', borderRadius: '30px' }}>
              Continue to Step {currentStep + 1} <ArrowRight size={16} />
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
