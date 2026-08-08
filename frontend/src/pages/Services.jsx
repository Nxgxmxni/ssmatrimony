import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  ShieldCheck,
  UserCheck,
  Users,
  Calendar,
  Headphones,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Info,
  X,
  Crown,
} from 'lucide-react';

export default function Services() {
  const [selectedServiceModal, setSelectedServiceModal] = useState(null);

  const servicesData = [
    {
      id: 1,
      title: 'Bride & Groom Matchmaking',
      shortDesc: 'Helping families discover compatible life partners through trusted matchmaking.',
      fullDesc: 'Our core matchmaking service utilizes deep cultural parameter matching—taking into account Gothram, Sub-caste, Horoscopic compatibility (Jathakam), educational credentials, and lifestyle preferences to recommend true lifelong partners.',
      highlights: [
        'Personalized recommendations',
        'Compatibility focused',
        'Trusted guidance',
      ],
      icon: Heart,
    },
    {
      id: 2,
      title: 'Verified Profiles',
      shortDesc: 'Every profile is reviewed for authenticity and safety.',
      fullDesc: 'Safety and authenticity are paramount on SS Matrimony. Every profile undergoes rigorous manual verification, validating government photo IDs, contact numbers, and background details before awarding the green Verified Trust Badge.',
      highlights: [
        'Identity verification',
        'Secure information',
        'Trusted members',
      ],
      icon: ShieldCheck,
    },
    {
      id: 3,
      title: 'Personal Match Assistance',
      shortDesc: 'Dedicated relationship managers to guide your search.',
      fullDesc: 'For families seeking hands-on guidance, our Assisted Matchmaking Service assigns a dedicated Relationship Manager who actively shortlists profiles, schedules mutual calls, and coordinates family interactions.',
      highlights: [
        'Dedicated relationship manager',
        'Handpicked shortlists',
        'Direct family coordination',
      ],
      icon: UserCheck,
    },
    {
      id: 4,
      title: 'Family Consultation',
      shortDesc: 'Supporting families through every stage of the matrimonial journey.',
      fullDesc: 'Matchmaking is a family affair. We offer respectful family consultation sessions to resolve queries regarding horoscopic compatibility, cultural expectations, and wedding arrangements with utmost dignity.',
      highlights: [
        'Family-to-family introductions',
        'Horoscopic alignment guidance',
        'Respectful dialogue',
      ],
      icon: Users,
    },
    {
      id: 5,
      title: 'Wedding Guidance',
      shortDesc: 'Helping couples transition smoothly from engagement to marriage.',
      fullDesc: 'Once a match is finalized, we assist Telugu families in organizing their dream wedding by connecting them with vetted Kalyana Mandapams, authentic traditional photographers, Purohithulu, and catering specialists.',
      highlights: [
        'Venue & vendor referrals',
        'Traditional purohithulu connect',
        'Seamless event planning',
      ],
      icon: Calendar,
    },
    {
      id: 6,
      title: 'Customer Support',
      shortDesc: 'Always available to answer your questions and assist.',
      fullDesc: 'Our dedicated customer success team is available 24/7 to resolve technical queries, guide you through privacy settings, assist with photo uploads, and support you throughout your matrimonial journey.',
      highlights: [
        '24/7 Priority helpline',
        'Privacy setting support',
        'Responsive multi-lingual team',
      ],
      icon: Headphones,
    },
  ];

  const comparisonItems = [
    { feature: 'Personalized Matchmaking', generic: 'Random Automated Algorithms', ss: 'Cultural & Jathakam Tailored Matching' },
    { feature: 'Verified Profiles', generic: 'Unverified Accounts & Spam', ss: '100% Manual Photo ID Verification' },
    { feature: 'Telugu-Focused Community', generic: 'Diluted Pan-India Profiles', ss: 'Dedicated Telugu Community Focus' },
    { feature: 'Family Support', generic: 'Individual Self-Service Only', ss: 'Family-Centric Collaborative Control' },
    { feature: 'Privacy & Security', generic: 'Publicly Exposed Phone Numbers', ss: 'Granular Privacy & Photo Locks' },
    { feature: 'Dedicated Assistance', generic: 'No Relationship Managers', ss: 'Dedicated Personal Match Advisors' },
  ];

  return (
    <div style={{ backgroundColor: '#FAF9F6', color: '#1E293B', minHeight: '100vh', paddingBottom: '4rem' }}>
      
      {/* 
        ====================================================
        SECTION 1 – LUXURY PRESENTATION BANNER
        ====================================================
      */}
      <section
        style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #0B3B91 0%, #061A40 60%, #0B2A6B 100%)',
          color: '#FFFFFF',
          padding: '5rem 0',
          overflow: 'hidden',
          borderBottom: '3px solid #D4AF37',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212,175,55,0.18) 0%, rgba(11,59,145,0) 70%)',
            pointerEvents: 'none',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '820px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'rgba(212, 175, 55, 0.15)',
              color: '#D4AF37',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              padding: '0.45rem 1.2rem',
              borderRadius: '50px',
              fontSize: '0.85rem',
              fontWeight: '700',
              letterSpacing: '1px',
              marginBottom: '1.25rem',
            }}
          >
            <Crown size={15} color="#D4AF37" /> LUXURY MATCHMAKING SERVICES
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 3.6rem)',
              color: '#FFFFFF',
              fontWeight: '800',
              fontFamily: 'Outfit, sans-serif',
              lineHeight: '1.2',
              marginBottom: '1rem',
            }}
          >
            Our <span style={{ color: '#D4AF37', fontFamily: 'serif', fontStyle: 'italic' }}>Services</span>
          </h1>

          <p
            style={{
              fontSize: '1.18rem',
              color: '#EAF4FF',
              lineHeight: '1.75',
              fontWeight: '400',
              margin: '0 auto',
              maxWidth: '680px',
            }}
          >
            From finding the right match to beginning a lifetime together, we offer comprehensive services tailored for Telugu families.
          </p>
        </div>
      </section>

      {/* 
        ====================================================
        SECTION 2 – OUR SERVICES (IMAGE-FREE LUXURY CONTENT CARDS GRID)
        ====================================================
      */}
      <section style={{ padding: '5rem 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div
              style={{
                fontSize: '0.85rem',
                fontWeight: '800',
                color: '#D4AF37',
                letterSpacing: '1.5px',
                marginBottom: '0.4rem',
              }}
            >
              TAILORED SOLUTIONS
            </div>
            <h2
              style={{
                fontSize: 'clamp(2.1rem, 3.8vw, 2.7rem)',
                color: '#0F172A',
                fontWeight: '800',
                fontFamily: 'Outfit, sans-serif',
              }}
            >
              Excellence in <span style={{ color: '#0B3B91' }}>Matrimonial Services</span>
            </h2>
          </div>

          {/* 
            Desktop: 3 cards row 1, 3 cards row 2 (3 columns)
            Tablet: 2 cards per row
            Mobile: 1 card per row
          */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2.5rem',
              alignItems: 'stretch',
            }}
          >
            {servicesData.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onKnowMore={setSelectedServiceModal}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 
        ====================================================
        SECTION 3 – THE SS MATRIMONY DIFFERENCE (UNTOUCHED COMPARISON)
        ====================================================
      */}
      <section style={{ padding: '5rem 0', backgroundColor: '#F8FAFC' }}>
        <div className="container" style={{ maxWidth: '960px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div
              style={{
                fontSize: '0.85rem',
                fontWeight: '800',
                color: '#D4AF37',
                letterSpacing: '1.5px',
                marginBottom: '0.4rem',
              }}
            >
              THE CLEAR DISTINCTION
            </div>
            <h2
              style={{
                fontSize: 'clamp(2.1rem, 3.8vw, 2.7rem)',
                color: '#0F172A',
                fontWeight: '800',
                fontFamily: 'Outfit, sans-serif',
              }}
            >
              The SS Matrimony <span style={{ color: '#0B3B91' }}>Difference</span>
            </h2>
            <p style={{ color: '#64748B', fontSize: '1.02rem', marginTop: '0.5rem' }}>
              A higher standard of trust, privacy, and dedicated family service.
            </p>
          </div>

          {/* Comparison Side-by-Side Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2.25rem',
            }}
          >
            {/* Generic Platforms Card */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '30px',
                padding: '2.5rem 2rem',
                border: '1px solid #E2E8F0',
                boxShadow: '0 10px 25px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ textAlign: 'center', paddingBottom: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #E2E8F0' }}>
                <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#64748B', fontFamily: 'Outfit, sans-serif' }}>
                  Generic Matrimony Platforms
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '0.25rem' }}>Mass database approach</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {comparisonItems.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <XCircle size={18} color="#EF4444" style={{ shrink: 0, marginTop: '3px' }} />
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>{item.feature}</div>
                      <div style={{ fontSize: '0.875rem', color: '#94A3B8' }}>{item.generic}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SS Matrimony Luxury Highlight Card */}
            <div
              style={{
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                borderRadius: '30px',
                padding: '2.5rem 2rem',
                border: '2px solid #D4AF37',
                boxShadow: '0 20px 50px rgba(11, 59, 145, 0.22)',
                position: 'relative',
              }}
            >
              {/* Highlight Ribbon */}
              <div
                style={{
                  position: 'absolute',
                  top: '-14px',
                  right: '28px',
                  backgroundColor: '#D4AF37',
                  color: '#0F172A',
                  fontWeight: '800',
                  fontSize: '0.75rem',
                  padding: '0.35rem 1rem',
                  borderRadius: '50px',
                  letterSpacing: '0.5px',
                  boxShadow: '0 4px 15px rgba(212, 175, 55, 0.4)',
                }}
              >
                ⭐ LUXURY STANDARD
              </div>

              <div style={{ textAlign: 'center', paddingBottom: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(212, 175, 55, 0.3)' }}>
                <h3 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#FFFFFF', fontFamily: 'Outfit, sans-serif' }}>
                  SS Matrimony <span style={{ color: '#D4AF37' }}>Services</span>
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#CBD5E1', marginTop: '0.25rem' }}>Culturally tailored & family-verified</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {comparisonItems.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <CheckCircle2 size={18} color="#D4AF37" style={{ shrink: 0, marginTop: '3px' }} />
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#D4AF37' }}>{item.feature}</div>
                      <div style={{ fontSize: '0.875rem', color: '#F1F5F9', fontWeight: '600' }}>{item.ss}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 
        ====================================================
        SECTION 4 – ELEGANT CTA BANNER
        ====================================================
      */}
      <section style={{ padding: '4rem 0 1rem' }}>
        <div className="container">
          <div
            style={{
              position: 'relative',
              background: 'linear-gradient(135deg, #0B3B91 0%, #051329 60%, #0B2A6B 100%)',
              color: '#FFFFFF',
              borderRadius: '30px',
              padding: '4rem 2.5rem',
              textAlign: 'center',
              boxShadow: '0 25px 60px rgba(11, 59, 145, 0.2)',
              border: '2px solid rgba(212, 175, 55, 0.5)',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'relative', zIndex: 2, maxWidth: '680px', margin: '0 auto' }}>
              <div
                style={{
                  fontSize: '0.85rem',
                  fontWeight: '800',
                  color: '#D4AF37',
                  letterSpacing: '1.5px',
                  marginBottom: '0.85rem',
                }}
              >
                YOUR MATRIMONIAL JOURNEY STARTS HERE
              </div>

              <h2
                style={{
                  fontSize: 'clamp(2.2rem, 4vw, 3rem)',
                  color: '#FFFFFF',
                  fontWeight: '800',
                  fontFamily: 'Outfit, sans-serif',
                  marginBottom: '1rem',
                  lineHeight: '1.25',
                }}
              >
                Let Us Help You Find Your <span style={{ color: '#D4AF37', fontFamily: 'serif', fontStyle: 'italic' }}>Perfect Life Partner</span>
              </h2>

              <p
                style={{
                  color: '#EAF4FF',
                  fontSize: '1.05rem',
                  lineHeight: '1.7',
                  marginBottom: '2.25rem',
                }}
              >
                Register today for personalized matchmaking, verified profiles, and dedicated support.
              </p>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '1.25rem',
                  flexWrap: 'wrap',
                }}
              >
                <Link
                  to="/register"
                  className="btn-gold"
                  style={{
                    padding: '0.95rem 2.6rem',
                    fontSize: '1rem',
                    borderRadius: '50px',
                    boxShadow: '0 8px 25px rgba(212, 175, 55, 0.35)',
                  }}
                >
                  Register Now <ArrowRight size={18} />
                </Link>

                <Link
                  to="/contact"
                  style={{
                    padding: '0.95rem 2.4rem',
                    fontSize: '1rem',
                    fontWeight: '700',
                    borderRadius: '50px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: '#FFFFFF',
                    border: '1.5px solid rgba(212, 175, 55, 0.6)',
                    textDecoration: 'none',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Service Detail Modal */}
      {selectedServiceModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(5, 15, 40, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
          onClick={() => setSelectedServiceModal(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '28px',
              maxWidth: '560px',
              width: '100%',
              padding: '2.25rem',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
              border: '1.5px solid #D4AF37',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedServiceModal(null)}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                background: '#F1F5F9',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={18} color="#475569" />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#EFF6FF', color: '#0B3B91', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Info size={22} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0F172A', fontFamily: 'Outfit, sans-serif' }}>
                {selectedServiceModal.title}
              </h3>
            </div>

            <p style={{ fontSize: '0.98rem', color: '#334155', lineHeight: '1.7', marginBottom: '1.5rem' }}>
              {selectedServiceModal.fullDesc}
            </p>

            <div style={{ backgroundColor: '#FAF9F6', padding: '1.25rem', borderRadius: '16px', marginBottom: '1.75rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#D4AF37', marginBottom: '0.6rem' }}>KEY HIGHLIGHTS</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {selectedServiceModal.highlights.map((h, idx) => (
                  <div key={idx} style={{ fontSize: '0.9rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CheckCircle2 size={16} color="#0B3B91" /> {h}
                  </div>
                ))}
              </div>
            </div>

            <Link
              to="/register"
              onClick={() => setSelectedServiceModal(null)}
              className="btn-gold"
              style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', borderRadius: '50px' }}
            >
              Avail This Service Now <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

/* 
  ====================================================
  IMAGE-FREE LUXURY SERVICE CARD COMPONENT
  ====================================================
*/
function ServiceCard({ service, onKnowMore }) {
  const IconComp = service.icon;

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        border: '1.5px solid rgba(212, 175, 55, 0.45)',
        boxShadow: '0 15px 35px rgba(11, 59, 145, 0.07)',
        padding: '2.25rem 1.75rem 2rem',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.boxShadow = '0 20px 45px rgba(212, 175, 55, 0.22)';
        e.currentTarget.style.borderColor = '#D4AF37';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 15px 35px rgba(11, 59, 145, 0.07)';
        e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.45)';
      }}
    >
      {/* Blue Top Accent Line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #0B3B91 0%, #0284c7 100%)',
        }}
      />

      {/* Circular Gold Icon Badge */}
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#FEF3C7',
          color: '#0B3B91',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.25rem',
          border: '1.5px solid #D4AF37',
          boxShadow: '0 6px 16px rgba(212, 175, 55, 0.2)',
          shrink: 0,
        }}
      >
        <IconComp size={26} color="#0B3B91" />
      </div>

      {/* Service Title */}
      <h3
        style={{
          fontSize: '1.35rem',
          fontWeight: '800',
          color: '#0F172A',
          fontFamily: 'Outfit, sans-serif',
          marginBottom: '0.65rem',
          lineHeight: '1.3',
        }}
      >
        {service.title}
      </h3>

      {/* Short Description (Max 2 Lines) */}
      <p
        style={{
          fontSize: '0.92rem',
          color: '#475569',
          lineHeight: '1.6',
          marginBottom: '1.25rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          height: '2.9rem',
        }}
      >
        {service.shortDesc}
      </p>

      {/* 3 Short Bullet Points */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', marginBottom: '1.75rem', flexGrow: 1 }}>
        {service.highlights.map((h, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
            <CheckCircle2 size={16} color="#D4AF37" style={{ shrink: 0 }} />
            <span style={{ fontSize: '0.88rem', color: '#1E293B', fontWeight: '600' }}>{h}</span>
          </div>
        ))}
      </div>

      {/* Small "Know More" Button */}
      <button
        type="button"
        onClick={() => onKnowMore(service)}
        className="btn-gold"
        style={{
          padding: '0.65rem 1.35rem',
          fontSize: '0.85rem',
          borderRadius: '50px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          marginTop: 'auto',
        }}
      >
        Know More <ChevronRight size={15} />
      </button>
    </div>
  );
}
