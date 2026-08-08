import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Sparkles,
  Lock,
  Headphones,
  CheckCircle2,
  HeartHandshake,
  Users,
  Shield,
  Clock,
  ArrowRight,
  Quote,
} from 'lucide-react';

export default function About() {
  return (
    <div style={{ backgroundColor: '#FAF9F6', color: '#1E293B', minHeight: '100vh', paddingBottom: '3rem' }}>
      
      {/* 
        ====================================================
        1. PREMIUM BANNER
        ====================================================
      */}
      <section
        style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #0B3B91 0%, #061A40 60%, #0B2A6B 100%)',
          color: '#FFFFFF',
          padding: '4.5rem 0',
          overflow: 'hidden',
          borderBottom: '3px solid #D4AF37',
        }}
      >
        {/* Soft Golden Glow Overlay */}
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

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2.5rem',
              alignItems: 'center',
            }}
          >
            {/* Banner Text Left */}
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backgroundColor: 'rgba(212, 175, 55, 0.15)',
                  color: '#D4AF37',
                  border: '1px solid rgba(212, 175, 55, 0.4)',
                  padding: '0.4rem 1rem',
                  borderRadius: '50px',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  letterSpacing: '1px',
                  marginBottom: '1.25rem',
                }}
              >
                <Sparkles size={14} color="#D4AF37" /> ABOUT SS MATRIMONY
              </div>
              
              <h1
                style={{
                  fontSize: 'clamp(2.4rem, 4.5vw, 3.4rem)',
                  color: '#FFFFFF',
                  fontWeight: '800',
                  fontFamily: 'Outfit, sans-serif',
                  lineHeight: '1.25',
                  marginBottom: '1rem',
                }}
              >
                Connecting Hearts, <br />
                <span style={{ color: '#D4AF37', fontFamily: 'serif', fontStyle: 'italic' }}>
                  Preserving Traditions
                </span>
              </h1>

              <p
                style={{
                  fontSize: '1.15rem',
                  color: '#EAF4FF',
                  maxWidth: '540px',
                  lineHeight: '1.75',
                  fontWeight: '400',
                }}
              >
                Connecting hearts, preserving traditions, and building lifelong relationships for Telugu families across the globe.
              </p>
            </div>

            {/* Banner Image Right */}
            <div style={{ textAlign: 'center', position: 'relative' }}>
              <div
                style={{
                  position: 'relative',
                  display: 'inline-block',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35)',
                  border: '2px solid rgba(212, 175, 55, 0.6)',
                  maxHeight: '340px',
                }}
              >
                <img
                  src="/images/about-hero-couple.jpg"
                  alt="About SS Matrimony Telugu Couple"
                  style={{
                    width: '100%',
                    maxWidth: '460px',
                    height: '340px',
                    objectFit: 'cover',
                    display: 'block',
                    filter: 'brightness(1.1) contrast(1.03) saturate(1.05)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0, 0, 0, 0.10), rgba(0, 0, 0, 0.04), transparent)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 
        ====================================================
        2. OUR STORY (MODERN SPLIT LAYOUT)
        ====================================================
      */}
      <section style={{ padding: '4.5rem 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3.5rem',
              alignItems: 'center',
            }}
          >
            {/* Story Image Left */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 45px rgba(11, 59, 145, 0.12)',
                  border: '1.5px solid rgba(212, 175, 55, 0.45)',
                  backgroundColor: '#FFFFFF',
                  position: 'relative',
                }}
              >
                <img
                  src="/images/about-story-couple.jpg"
                  alt="SS Matrimony Telugu Wedding Story"
                  style={{
                    width: '100%',
                    height: '420px',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </div>

              {/* Gold Ribbon Accent Card */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-20px',
                  right: '-15px',
                  backgroundColor: '#0B3B91',
                  color: '#FFFFFF',
                  padding: '1rem 1.4rem',
                  borderRadius: '16px',
                  boxShadow: '0 12px 30px rgba(11, 59, 145, 0.25)',
                  border: '1px solid #D4AF37',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                }}
              >
                <HeartHandshake size={24} color="#D4AF37" />
                <span style={{ fontSize: '0.88rem', fontWeight: '700', letterSpacing: '0.3px' }}>
                  Built for Telugu Families
                </span>
              </div>
            </div>

            {/* Story Text Right */}
            <div>
              <div
                style={{
                  fontSize: '0.85rem',
                  fontWeight: '800',
                  color: '#D4AF37',
                  letterSpacing: '1.5px',
                  marginBottom: '0.5rem',
                }}
              >
                OUR HERITAGE & JOURNEY
              </div>
              <h2
                style={{
                  fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
                  color: '#0F172A',
                  fontWeight: '800',
                  fontFamily: 'Outfit, sans-serif',
                  marginBottom: '1.5rem',
                  lineHeight: '1.25',
                }}
              >
                A Matrimonial Platform Built on <span style={{ color: '#0B3B91' }}>Trust & Tradition</span>
              </h2>

              <p
                style={{
                  fontSize: '1.02rem',
                  color: '#475569',
                  lineHeight: '1.85',
                  marginBottom: '1.15rem',
                }}
              >
                SS Matrimony was established with a singular mission: to provide a refined, secure, and culturally grounded matchmaking experience for Telugu families worldwide. We understand that in Telugu culture, marriage is the sacred union of two families, not just two individuals.
              </p>

              <p
                style={{
                  fontSize: '1.02rem',
                  color: '#475569',
                  lineHeight: '1.85',
                  marginBottom: '1.15rem',
                }}
              >
                We combine authentic cultural preferences—including sub-caste, Gothram, mother tongue, education, and family background—with modern verification and smart match filters. Every profile registered on SS Matrimony is thoroughly verified to ensure genuine background integrity.
              </p>

              <p
                style={{
                  fontSize: '1.02rem',
                  color: '#475569',
                  lineHeight: '1.85',
                  marginBottom: '1.75rem',
                }}
              >
                Whether you are searching for your life partner yourself or a parent seeking a prospective bride or groom for your child, SS Matrimony provides complete control, privacy, and dedicated relationship assistance.
              </p>

              {/* Stylish Quote Card */}
              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  borderLeft: '4px solid #D4AF37',
                  padding: '1.25rem 1.5rem',
                  borderRadius: '0 16px 16px 0',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'flex-start',
                }}
              >
                <Quote size={28} color="#D4AF37" style={{ shrink: 0, marginTop: '2px' }} />
                <p
                  style={{
                    fontSize: '0.95rem',
                    color: '#0B2A6B',
                    fontStyle: 'italic',
                    fontWeight: '600',
                    lineHeight: '1.6',
                    margin: 0,
                  }}
                >
                  "Marriage is not just the union of two individuals, but the harmonious blending of two families, culture, and shared aspirations for a lifetime."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 
        ====================================================
        3. OUR PROMISE (ONE ELEGANT HORIZONTAL FEATURE BAR)
        ====================================================
      */}
      <section style={{ padding: '3.5rem 0', backgroundColor: '#F1F5F9' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div
              style={{
                fontSize: '0.85rem',
                fontWeight: '800',
                color: '#D4AF37',
                letterSpacing: '1.5px',
                marginBottom: '0.4rem',
              }}
            >
              OUR CORE COMMITMENT
            </div>
            <h2
              style={{
                fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
                color: '#0F172A',
                fontWeight: '800',
                fontFamily: 'Outfit, sans-serif',
              }}
            >
              The SS Matrimony <span style={{ color: '#0B3B91' }}>Promise</span>
            </h2>
          </div>

          {/* Single Horizontal Unified Bar Container */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              border: '1.5px solid rgba(212, 175, 55, 0.45)',
              boxShadow: '0 15px 35px rgba(11, 59, 145, 0.08)',
              padding: '2.25rem 2rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '2rem',
            }}
          >
            {/* Promise 1 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: '#EFF6FF',
                    color: '#0B3B91',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ShieldCheck size={22} color="#0B3B91" />
                </div>
                <h3 style={{ fontSize: '1.08rem', fontWeight: '800', color: '#0F172A', fontFamily: 'Outfit, sans-serif' }}>
                  Trusted Profiles
                </h3>
              </div>
              <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: '1.6', margin: 0 }}>
                100% government photo ID verification and genuine profile screening.
              </p>
            </div>

            {/* Promise 2 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: '#FEF3C7',
                    color: '#D4AF37',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Sparkles size={22} color="#D4AF37" />
                </div>
                <h3 style={{ fontSize: '1.08rem', fontWeight: '800', color: '#0F172A', fontFamily: 'Outfit, sans-serif' }}>
                  Personalized Matchmaking
                </h3>
              </div>
              <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: '1.6', margin: 0 }}>
                Tailored match suggestions honoring Telugu traditions, education, and lifestyle.
              </p>
            </div>

            {/* Promise 3 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: '#EFF6FF',
                    color: '#0B3B91',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Lock size={22} color="#0B3B91" />
                </div>
                <h3 style={{ fontSize: '1.08rem', fontWeight: '800', color: '#0F172A', fontFamily: 'Outfit, sans-serif' }}>
                  Privacy & Security
                </h3>
              </div>
              <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: '1.6', margin: 0 }}>
                Full control over photo visibility, contact details, and profile privacy options.
              </p>
            </div>

            {/* Promise 4 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: '#FEF3C7',
                    color: '#D4AF37',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Headphones size={22} color="#D4AF37" />
                </div>
                <h3 style={{ fontSize: '1.08rem', fontWeight: '800', color: '#0F172A', fontFamily: 'Outfit, sans-serif' }}>
                  Dedicated Support
                </h3>
              </div>
              <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: '1.6', margin: 0 }}>
                Compassionate assistance from relationship advisors to guide your search.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 
        ====================================================
        4. WHY SS MATRIMONY? (MODERN CONCISE LIST LAYOUT)
        ====================================================
      */}
      <section style={{ padding: '4.5rem 0', backgroundColor: '#FFFFFF' }}>
        <div className="container" style={{ maxWidth: '960px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div
              style={{
                fontSize: '0.85rem',
                fontWeight: '800',
                color: '#D4AF37',
                letterSpacing: '1.5px',
                marginBottom: '0.4rem',
              }}
            >
              THE SS MATRIMONY ADVANTAGE
            </div>
            <h2
              style={{
                fontSize: 'clamp(2rem, 3.5vw, 2.6rem)',
                color: '#0F172A',
                fontWeight: '800',
                fontFamily: 'Outfit, sans-serif',
              }}
            >
              Why Choose <span style={{ color: '#0B3B91' }}>SS Matrimony?</span>
            </h2>
            <p style={{ color: '#64748B', fontSize: '1rem', marginTop: '0.5rem' }}>
              Designed specifically to meet the high expectations of Telugu brides, grooms, and parents.
            </p>
          </div>

          {/* 5 Short Points - Clean Vertical Alternating List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {[
              {
                title: 'Telugu-Focused Matchmaking',
                desc: 'Exclusively curated for Telugu communities across Telangana, Andhra Pradesh, and the global NRI diaspora.',
                icon: HeartHandshake,
              },
              {
                title: 'Family-First Approach',
                desc: 'Facilitates seamless collaborative profile management for parents, guardians, and siblings with mutual respect.',
                icon: Users,
              },
              {
                title: 'Verified Profiles',
                desc: 'Multi-step manual verification check ensures authentic credentials and eliminates fake accounts.',
                icon: Shield,
              },
              {
                title: 'Safe & Secure Platform',
                desc: 'Bank-grade data encryption, privacy locks, and strict anti-abuse monitoring for complete security.',
                icon: CheckCircle2,
              },
              {
                title: 'Dedicated Assistance',
                desc: 'Personalized relationship advisors offering one-on-one guidance to help navigate partner search smoothly.',
                icon: Clock,
              },
            ].map((item, index) => {
              const IconComp = item.icon;
              return (
                <div
                  key={index}
                  style={{
                    backgroundColor: index % 2 === 0 ? '#FAF9F6' : '#FFFFFF',
                    borderRadius: '16px',
                    padding: '1.25rem 1.75rem',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    transition: 'transform 0.3s ease, border-color 0.3s ease',
                  }}
                >
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      backgroundColor: index % 2 === 0 ? '#0B3B91' : '#FEF3C7',
                      color: index % 2 === 0 ? '#FFFFFF' : '#B45309',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      shrink: 0,
                    }}
                  >
                    <IconComp size={22} />
                  </div>

                  <div style={{ flexGrow: 1 }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0F172A', fontFamily: 'Outfit, sans-serif', marginBottom: '0.2rem' }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: '0.92rem', color: '#475569', margin: 0, lineHeight: '1.6' }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 
        ====================================================
        5. ELEGANT CALL-TO-ACTION
        ====================================================
      */}
      <section style={{ padding: '3.5rem 0' }}>
        <div className="container">
          <div
            style={{
              position: 'relative',
              background: 'linear-gradient(135deg, #0B3B91 0%, #051329 60%, #0B2A6B 100%)',
              color: '#FFFFFF',
              borderRadius: '28px',
              padding: '3.75rem 2.5rem',
              textAlign: 'center',
              boxShadow: '0 25px 60px rgba(11, 59, 145, 0.2)',
              border: '2px solid rgba(212, 175, 55, 0.5)',
              overflow: 'hidden',
            }}
          >
            {/* Background Decorative Gold Watermark */}
            <div
              style={{
                position: 'absolute',
                top: '-30%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '600px',
                height: '600px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />

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
                BEGIN YOUR JOURNEY TODAY
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
                Your Perfect Match <span style={{ color: '#D4AF37', fontFamily: 'serif', fontStyle: 'italic' }}>Begins Here.</span>
              </h2>

              <p
                style={{
                  color: '#EAF4FF',
                  fontSize: '1.05rem',
                  lineHeight: '1.7',
                  marginBottom: '2.25rem',
                }}
              >
                Join thousands of happy Telugu families who found their lifelong partner on SS Matrimony. Create your free profile in just 2 minutes.
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
    </div>
  );
}
