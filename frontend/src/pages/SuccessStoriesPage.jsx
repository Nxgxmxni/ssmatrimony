import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShieldCheck, Users, Lock, Headphones, ArrowRight, Heart, X, CheckCircle2 } from 'lucide-react';

export default function SuccessStoriesPage() {
  const [selectedStory, setSelectedStory] = useState(null);

  const featuredStory = {
    coupleNames: 'Kalyan & Sravanthi',
    city: 'Hyderabad, Telangana',
    weddingMonth: 'Wedded in December 2025',
    image: '/images/timeline-step6-telugu-wedding.jpg',
    rating: 5,
    shortStory: 'Our families met through SS Matrimony after finding matching family backgrounds and horoscopes. From our first meeting in Hyderabad to our traditional Talambralu ceremony, everything aligned beautifully. We are forever grateful to the SS Matrimony relationship team for their dedicated guidance!',
    fullStory: 'Our journey began when Kalyan’s parents viewed Sravanthi’s profile on SS Matrimony. Finding matching community values, educational backgrounds, and verified family details, our parents initiated the conversation. The SS Matrimony relationship manager facilitated our initial meeting with complete warmth and professionalism. After horoscope matching confirmed high compatibility, our families met in Hyderabad and decided on the wedding. Our traditional Telugu wedding was held surrounded by loved ones. SS Matrimony made our search seamless, authentic, and truly memorable.'
  };

  const coupleTestimonials = [
    {
      id: 1,
      coupleNames: 'Venkat & Lakshmi',
      location: 'Visakhapatnam, Andhra Pradesh',
      marriageMonth: 'Wedded in November 2025',
      image: '/images/hero-authentic-couple.jpg',
      testimonial: 'The verified profile badge gave our parents complete confidence. We connected easily, and our families bonded instantly during the first visit.',
      fullStory: 'Finding a partner who shares the same cultural upbringing was essential for us. SS Matrimony provided detailed, verified profile information that allowed our families to proceed with complete peace of mind. Today, we are happily wedded and recommend SS Matrimony to every Telugu family.',
      rating: 5
    },
    {
      id: 2,
      coupleNames: 'Srikanth & Anusha',
      location: 'Vijayawada, Andhra Pradesh',
      marriageMonth: 'Wedded in October 2025',
      image: '/images/about-story-couple.jpg',
      testimonial: 'SS Matrimony respects our cultural values. The relationship manager personally assisted us with horoscope matching and family meets.',
      fullStory: 'We were looking for a traditional alliance with family values at the center. The personalized match assistance from SS Matrimony was outstanding. They coordinated horoscope matching and family visits seamlessly.',
      rating: 5
    },
    {
      id: 3,
      coupleNames: 'Rajesh & Deepthi',
      location: 'Warangal, Telangana',
      marriageMonth: 'Wedded in January 2026',
      image: '/images/services-banner-couple.jpg',
      testimonial: 'Privacy was our biggest priority. We could control who views our photos and contact details until both families agreed to connect.',
      fullStory: 'As a working professional, I appreciated the strict privacy settings on SS Matrimony. Only verified members could view our profile. Once our families spoke, we knew we had found the right match.',
      rating: 5
    },
    {
      id: 4,
      coupleNames: 'Prashanth & Harika',
      location: 'Guntur, Andhra Pradesh',
      marriageMonth: 'Wedded in February 2026',
      image: '/images/timeline-step7-happily-married.jpg',
      testimonial: 'Finding a partner with matching family expectations was smooth. Blessed to start our new life together through SS Matrimony.',
      fullStory: 'Our parents created our profiles on SS Matrimony. The match suggestions were extremely accurate to our preferences. We got engaged within two months of connecting and celebrated our dream wedding.',
      rating: 5
    }
  ];

  return (
    <div style={{ backgroundColor: '#F8FAFC', paddingBottom: '5rem' }}>
      {/* SECTION 1: Premium Hero */}
      <section
        style={{
          backgroundColor: '#FFFFFF',
          padding: '4.5rem 0 4rem',
          borderBottom: '1px solid #E2E8F0',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Subtle Blue & Gold Background Decorative Accents */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(10,61,145,0.05) 0%, rgba(255,255,255,0) 70%)',
            pointerEvents: 'none'
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            left: '-100px',
            width: '350px',
            height: '350px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212,160,23,0.06) 0%, rgba(255,255,255,0) 70%)',
            pointerEvents: 'none'
          }}
        />

        <div
          className="container"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3.5rem',
            alignItems: 'center',
            position: 'relative',
            zIndex: 2
          }}
        >
          {/* Left Text */}
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.85rem',
                marginBottom: '1.25rem',
                padding: '0.45rem 1.1rem',
                borderRadius: '50px',
                background: '#FFF9E6',
                color: '#966D03',
                fontWeight: '700',
                border: '1px solid rgba(212, 160, 23, 0.4)',
                boxShadow: '0 2px 10px rgba(212, 160, 23, 0.12)'
              }}
            >
              <Heart size={14} fill="#D4A017" color="#D4A017" /> Success Stories
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.4rem, 5vw, 3.5rem)',
                color: '#0A3D91',
                fontWeight: '800',
                lineHeight: '1.2',
                marginBottom: '1.25rem',
                letterSpacing: '-0.5px'
              }}
            >
              Success Stories
            </h1>

            <p
              style={{
                fontSize: '1.15rem',
                color: '#475569',
                lineHeight: '1.7',
                maxWidth: '580px',
                fontWeight: '400'
              }}
            >
              Every successful marriage begins with trust. Discover inspiring journeys of Telugu couples who found their life partners through SS Matrimony.
            </p>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginTop: '2rem'
              }}
            >
              <div style={{ height: '3px', width: '45px', background: 'linear-gradient(90deg, #0A3D91 0%, #D4A017 100%)', borderRadius: '4px' }} />
              <span style={{ color: '#0A3D91', fontSize: '0.85rem', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>
                Verified Telugu Matrimonial Journeys
              </span>
            </div>
          </div>

          {/* Right Image */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                position: 'relative',
                maxWidth: '460px',
                width: '100%',
                borderRadius: '24px',
                padding: '10px',
                background: 'linear-gradient(135deg, rgba(10,61,145,0.12) 0%, rgba(212,160,23,0.3) 100%)',
                boxShadow: '0 20px 40px rgba(10, 61, 145, 0.12)'
              }}
            >
              <img
                src="/images/timeline-step6-telugu-wedding.jpg"
                alt="Telugu Wedding Couple"
                className="ultra-hd-img"
                style={{
                  width: '100%',
                  height: '360px',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  borderRadius: '18px',
                  display: 'block'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Featured Success Story */}
      <section className="container" style={{ marginTop: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{ color: '#D4A017', fontWeight: '700', fontSize: '0.85rem', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            FEATURED WEDDING STORY
          </span>
          <h2 style={{ fontSize: '2.2rem', color: '#0A3D91', marginTop: '0.3rem', fontWeight: '800' }}>
            A Match Made in Tradition
          </h2>
        </div>

        <div
          className="glass-card-gold"
          style={{
            padding: '2.25rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            alignItems: 'center'
          }}
        >
          {/* Left: Large Telugu Wedding Image */}
          <div style={{ overflow: 'hidden', borderRadius: '18px', boxShadow: '0 12px 30px rgba(0,0,0,0.1)' }}>
            <img
              src={featuredStory.image}
              alt={featuredStory.coupleNames}
              className="ultra-hd-img"
              style={{
                width: '100%',
                height: '360px',
                objectFit: 'cover',
                objectPosition: 'center',
                display: 'block'
              }}
            />
          </div>

          {/* Right: Story Information */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <h3 style={{ fontSize: '1.8rem', color: '#0A3D91', fontWeight: '800' }}>
              {featuredStory.coupleNames}
            </h3>

            <div style={{ fontSize: '0.95rem', color: '#0284c7', fontWeight: '700' }}>
              {featuredStory.city} • <span style={{ color: '#966D03' }}>{featuredStory.weddingMonth}</span>
            </div>

            <p style={{ fontSize: '1.02rem', color: '#334155', lineHeight: '1.7', fontStyle: 'italic', margin: '0.5rem 0' }}>
              "{featuredStory.shortStory}"
            </p>

            {/* Rating Stars */}
            <div style={{ display: 'flex', gap: '0.3rem', color: '#D4A017' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} fill="#D4A017" color="#D4A017" />
              ))}
            </div>

            <div style={{ marginTop: '1rem' }}>
              <button
                onClick={() => setSelectedStory(featuredStory)}
                className="btn-gold"
                style={{ cursor: 'pointer' }}
              >
                View Story <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: More Happy Couples */}
      <section className="container" style={{ marginTop: '4.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{ color: '#0A3D91', fontWeight: '700', fontSize: '0.85rem', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            HAPPY WEDDED COUPLES
          </span>
          <h2 style={{ fontSize: '2.2rem', color: '#0F172A', marginTop: '0.3rem', fontWeight: '800' }}>
            More Heartwarming Journeys
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {coupleTestimonials.map((c) => (
            <div
              key={c.id}
              className="glass-card"
              style={{
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                gap: '1.25rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  {/* Small Circular Image */}
                  <img
                    src={c.image}
                    alt={c.coupleNames}
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      objectPosition: 'center',
                      border: '2.5px solid #D4A017',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                  <div>
                    <h4 style={{ fontSize: '1.15rem', color: '#0A3D91', fontWeight: '700' }}>
                      {c.coupleNames}
                    </h4>
                    <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: '600' }}>
                      {c.location}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#966D03', fontWeight: '700' }}>
                      {c.marriageMonth}
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '0.92rem', color: '#334155', lineHeight: '1.6', fontStyle: 'italic' }}>
                  "{c.testimonial}"
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.2rem', color: '#D4A017' }}>
                  {[...Array(c.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="#D4A017" color="#D4A017" />
                  ))}
                </div>
                <button
                  onClick={() => setSelectedStory(c)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#0A3D91',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  View Story <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View More Success Stories Action */}
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <Link
            to="/success-stories/all"
            className="btn-gold"
            style={{
              padding: '0.85rem 2.25rem',
              borderRadius: '50px',
              fontWeight: '800',
              fontSize: '1rem',
              boxShadow: '0 8px 20px rgba(212, 160, 23, 0.3)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            View More Success Stories <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* SECTION 4: Our Promise */}
      <section className="container" style={{ marginTop: '4.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{ color: '#D4A017', fontWeight: '700', fontSize: '0.85rem', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            TRUSTED MATRIMONY
          </span>
          <h2 style={{ fontSize: '2.2rem', color: '#0A3D91', marginTop: '0.3rem', fontWeight: '800' }}>
            Our Matchmaking Promise
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.75rem' }}>
          {/* Card 1 */}
          <div className="glass-card" style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
            <div style={{ background: '#eff6ff', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <ShieldCheck size={28} color="#0A3D91" />
            </div>
            <h4 style={{ fontSize: '1.1rem', color: '#0A3D91', fontWeight: '700', marginBottom: '0.5rem' }}>
              ✓ Verified Profiles
            </h4>
            <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: '1.6' }}>
              100% government ID &amp; contact verification for authentic profile recommendations.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-card" style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
            <div style={{ background: '#FFF9E6', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <Users size={28} color="#D4A017" />
            </div>
            <h4 style={{ fontSize: '1.1rem', color: '#0A3D91', fontWeight: '700', marginBottom: '0.5rem' }}>
              ✓ Family Guided Matchmaking
            </h4>
            <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: '1.6' }}>
              Honoring Telugu traditions by involving parents and family members in every step.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-card" style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
            <div style={{ background: '#eff6ff', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <Lock size={28} color="#0A3D91" />
            </div>
            <h4 style={{ fontSize: '1.1rem', color: '#0A3D91', fontWeight: '700', marginBottom: '0.5rem' }}>
              ✓ Safe &amp; Private Communication
            </h4>
            <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: '1.6' }}>
              Complete control over your contact numbers, photos, and personal information.
            </p>
          </div>

          {/* Card 4 */}
          <div className="glass-card" style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
            <div style={{ background: '#FFF9E6', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <Headphones size={28} color="#D4A017" />
            </div>
            <h4 style={{ fontSize: '1.1rem', color: '#0A3D91', fontWeight: '700', marginBottom: '0.5rem' }}>
              ✓ Dedicated Relationship Support
            </h4>
            <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: '1.6' }}>
              Personal relationship managers to guide families through horoscope and profile matches.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5: Premium Call To Action */}
      <section className="container" style={{ marginTop: '4.5rem' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #0A3D91 0%, #051329 60%, #072B6B 100%)',
            borderRadius: '24px',
            padding: '3.5rem 2rem',
            textAlign: 'center',
            color: '#FFFFFF',
            boxShadow: '0 20px 40px rgba(10, 61, 145, 0.2)',
            border: '1.5px solid rgba(212, 175, 55, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: '#FFFFFF', fontWeight: '800', marginBottom: '1rem' }}>
            Your Success Story Could Be Next
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#EAF4FF', maxWidth: '650px', margin: '0 auto 2.25rem', lineHeight: '1.6' }}>
            Join thousands of trusted Telugu families who found their ideal life partners through SS Matrimony. Begin your journey today.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.25rem' }}>
            <Link to="/register" className="btn-gold" style={{ padding: '0.9rem 2.2rem', fontSize: '1rem' }}>
              Create Your Profile
            </Link>
            <Link to="/contact" className="btn-secondary" style={{ padding: '0.9rem 2.2rem', fontSize: '1rem' }}>
              Contact Our Team
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Full Story Modal */}
      {selectedStory && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(5, 19, 41, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            padding: '1.5rem',
            zIndex: 2000
          }}
          onClick={() => setSelectedStory(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              maxWidth: '650px',
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedStory(null)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                cursor: 'pointer',
                zIndex: 10
              }}
            >
              <X size={20} color="#0F172A" />
            </button>

            <img
              src={selectedStory.image}
              alt={selectedStory.coupleNames}
              style={{ width: '100%', height: '280px', objectFit: 'cover', objectPosition: 'center' }}
            />

            <div style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.6rem', color: '#0A3D91', fontWeight: '800' }}>
                  {selectedStory.coupleNames}
                </h3>
                <div style={{ display: 'flex', gap: '0.2rem', color: '#D4A017' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill="#D4A017" color="#D4A017" />
                  ))}
                </div>
              </div>

              <div style={{ fontSize: '0.9rem', color: '#0284c7', fontWeight: '700', marginBottom: '1.25rem' }}>
                {selectedStory.city || selectedStory.location} • <span style={{ color: '#966D03' }}>{selectedStory.weddingMonth || selectedStory.marriageMonth}</span>
              </div>

              <p style={{ fontSize: '0.98rem', color: '#334155', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                {selectedStory.fullStory || selectedStory.shortStory}
              </p>

              <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#137333', fontSize: '0.88rem', fontWeight: '700' }}>
                <CheckCircle2 size={18} color="#137333" /> Verified SS Matrimony Union
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


