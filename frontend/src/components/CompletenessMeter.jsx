import React from 'react';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export default function CompletenessMeter({ profile, onSelectMissingField }) {
  if (!profile) return null;

  // Compute profile completeness score from actual saved fields
  const fields = [
    { name: 'Full Name', done: !!(profile.fullName && profile.fullName.trim()), weight: 10 },
    { name: 'Date of Birth & Age', done: !!profile.dateOfBirth, weight: 10 },
    { name: 'City & Location', done: !!(profile.city && profile.city.trim()), weight: 10 },
    { name: 'Religion & Caste', done: !!(profile.religion && profile.religion.trim() && profile.caste && profile.caste.trim()), weight: 10 },
    { name: 'Highest Education', done: !!(profile.highestEducation && profile.highestEducation.trim()), weight: 10 },
    { name: 'Occupation & Income', done: !!(profile.occupation && profile.occupation.trim()), weight: 10 },
    { name: 'About Myself Bio', done: !!(profile.aboutMe && profile.aboutMe.trim().length > 10), weight: 10 },
    { name: 'Profile Photo', done: !!(profile.photos && profile.photos.length > 0), weight: 15 },
    { name: 'Family Background', done: !!((profile.fatherOccupation && profile.fatherOccupation.trim()) || (profile.motherOccupation && profile.motherOccupation.trim())), weight: 10 },
    { name: 'Horoscope Details', done: !!((profile.rashi && profile.rashi.trim()) || (profile.nakshatram && profile.nakshatram.trim()) || (profile.gothram && profile.gothram.trim())), weight: 5 },
  ];

  const calculatedScore = fields.reduce((acc, f) => acc + (f.done ? f.weight : 0), 0);
  const score = typeof profile.completeness?.score === 'number' ? profile.completeness.score : calculatedScore;
  const missing = fields.filter((f) => !f.done);

  const getMeterColor = (s) => {
    if (s < 50) return '#c5221f';
    if (s < 80) return '#b8860b';
    return '#137333';
  };

  const meterColor = getMeterColor(score);

  return (
    <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.75rem', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div style={{ fontWeight: '700', color: '#800020', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={18} color="#d4af37" /> Profile Completeness Score
        </div>
        <span style={{ fontSize: '1.5rem', fontWeight: '800', color: meterColor }}>
          {score}%
        </span>
      </div>

      {/* Progress Bar */}
      <div style={{ height: '10px', backgroundColor: '#e5e7eb', borderRadius: '5px', overflow: 'hidden', marginBottom: '1rem' }}>
        <div
          style={{
            height: '100%',
            width: `${score}%`,
            backgroundColor: meterColor,
            transition: 'width 0.5s ease',
          }}
        />
      </div>

      {score === 100 ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#137333', fontSize: '0.9rem', fontWeight: '600' }}>
          <CheckCircle2 size={18} /> Congratulations! Your profile is 100% complete and highly visible to potential matches.
        </div>
      ) : (
        <div>
          <div style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: '600', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <AlertCircle size={15} color="#b8860b" /> Complete missing sections to boost your profile match rank:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {missing.map((f, idx) => (
              <button
                key={idx}
                onClick={() => onSelectMissingField && onSelectMissingField(f.name)}
                style={{
                  background: '#fff0f3',
                  color: '#800020',
                  border: '1px solid #f8c8d2',
                  borderRadius: '20px',
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                + Add {f.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
