import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Heart,
  Users,
  Award,
  ArrowRight,
  CheckCircle2,
  Lock,
  Play,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Building2,
  Sparkles,
  UserCheck,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Star,
  X,
  Send
} from 'lucide-react';

// Motion Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 35 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
};

const floatingAnimation = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const reverseFloatingAnimation = {
  animate: {
    y: [0, 10, 0],
    transition: {
      duration: 5.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export default function Home() {
  // Hero Carousel State & Data
  const heroSlides = [
    {
      image: '/images/hero-main-couple.jpg',
      title: 'Made With Love',
      subtitle: 'Where hearts meet with trust, family values, and sacred traditions. Begin your beautiful journey towards lifelong togetherness.',
      tag: 'SACRED TELUGU MATRIMONY'
    },
    {
      image: '/images/hero-authentic-couple.jpg',
      title: 'Authentic Relationships',
      subtitle: 'Connecting verified Telugu brides & grooms worldwide with dedicated family guidance and complete privacy protection.',
      tag: 'PREMIER MATCHMAKING'
    },
    {
      image: '/images/hero-couple-placeholder.jpg',
      title: 'Trusted Since 2018',
      subtitle: 'Over 5000+ happy families connected with dedicated relationship advisors and 100% background verified profiles.',
      tag: 'ESTABLISHED LEGACY'
    }
  ];
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  // Interactive UI States
  const [activeFaqIndex, setActiveFaqIndex] = useState(0);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  
  // Contact Form State
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', time: 'Morning', message: '' });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // ESC Key listener for Video Modal
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setVideoModalOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Services Data
  const servicesList = [
    { title: 'Elite Matchmaking', desc: 'Handpicked verified matches curated specifically for your family preferences and traditional values.', icon: Heart, badge: 'Premium' },
    { title: 'Profile Verification', desc: 'Rigorous 100% manual identity verification including Aadhaar and background checks for complete peace of mind.', icon: ShieldCheck, badge: 'Verified' },
    { title: 'Relationship Guidance', desc: 'Personal relationship advisors assisting families from initial introduction to lifelong matrimonial bond.', icon: Sparkles, badge: 'Assisted' },
    { title: 'Family Counselling', desc: 'Dedicated family interaction sessions facilitating smooth, transparent, and respectful communication.', icon: Users, badge: 'Family' },
    { title: 'NRI Matchmaking', desc: 'Specialized NRI consultation for Telugu families living in USA, UK, Canada, Australia, and Gulf nations.', icon: Award, badge: 'Global' },
    { title: 'Wedding Assistance', desc: 'Complete venue, muhurtham, and event management consultation for your dream Telugu marriage.', icon: CheckCircle2, badge: 'Complete' },
  ];

  // Success Stories Data
  const successStories = [
    { name: 'Sai Krishna & Sravani', date: 'Married Dec 2024', story: 'Bride and groom during Jeelakarra Bellam.', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=2400&q=95', location: 'Hyderabad' },
    { name: 'Rohan & Harika', date: 'Married Nov 2024', story: 'Outdoor pre-wedding photoshoot in traditional Telugu attire.', image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=2400&q=95', location: 'Dallas / Vijayawada' },
    { name: 'Vikram & Sushma', date: 'Married Jan 2025', story: 'Bride and groom receiving blessings from both families.', image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=2400&q=95', location: 'Visakhapatnam' },
    { name: 'Karthik & Ananya', date: 'Married Oct 2024', story: 'Beautiful Telugu wedding reception portrait.', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2400&q=95', location: 'Tirupati' },
  ];

  // Our Wedding Traditions Data
  const weddingTraditions = [
    {
      category: 'Traditional Ritual',
      title: 'Jeelakarra Bellam',
      description: 'Bride and groom applying Jeelakarra Bellam (cumin and jaggery paste) on each other\'s heads during the sacred Telugu wedding ritual. Close-up emotional moment.',
      src: '/images/traditions/jeelakarra-bellam.jpg',
    },
    {
      category: 'Family Ritual',
      title: 'Kanyadanam',
      description: 'Bride\'s parents performing Kanyadanam while giving their daughter to the groom with priest, sacred fire and traditional decorations visible.',
      src: '/images/traditions/kanyadanam.jpg',
    },
    {
      category: 'Sacred Ritual',
      title: 'Mangalsutra Dharana',
      description: 'Groom tying the Mangalsutra around the bride\'s neck. Close-up with smiling faces, emotional expressions and beautiful wedding decorations.',
      src: '/images/traditions/mangalsutra-dharana.jpg',
    },
    {
      category: 'Wedding Ritual',
      title: 'Talambralu',
      description: 'Bride and groom joyfully showering turmeric rice (Talambralu) on each other while laughing. Colorful festive atmosphere.',
      src: '/images/traditions/talambralu.jpg',
    },
    {
      category: 'Seven Sacred Steps',
      title: 'Saptapadi',
      description: 'Bride and groom taking the seven sacred steps around the holy fire with priest guiding the ritual.',
      src: '/images/traditions/saptapadi.jpg',
    },
    {
      category: 'Family Blessings',
      title: 'Appaginthalu',
      description: 'Bride emotionally saying goodbye to her parents before leaving with the groom. Family members smiling with tears of joy.',
      src: '/images/traditions/appaginthalu.jpg',
    },
  ];

  // FAQ Items
  const faqList = [
    { q: 'How does SS Matrimony ensure profile verification?', a: 'Our compliance team manually verifies every submitted profile against government-issued identity documents (Aadhaar, Passport, etc.) before issuing the verified badge.' },
    { q: 'Can parents or siblings manage candidate profiles?', a: 'Yes! Over 65% of our registered profiles are managed by parents, guardians, or elder siblings to ensure maximum privacy and family involvement.' },
    { q: 'What privacy settings are available for photos and phone numbers?', a: 'You have full granular privacy controls. You can set phone numbers and photos to be visible only to accepted connection requests.' },
    { q: 'Is registration free on SS Matrimony?', a: 'Yes, basic registration and profile creation are 100% free with draft saving capabilities.' },
    { q: 'Do you offer specialized NRI Telugu matrimony services?', a: 'Yes, we have a dedicated NRI desk helping Telugu families across USA, UK, Canada, Australia, and Gulf region connect with verified matches.' }
  ];

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => setContactSubmitted(false), 5000);
    setContactForm({ name: '', email: '', phone: '', time: 'Morning', message: '' });
  };

  return (
    <div style={{ overflowX: 'hidden', backgroundColor: '#FFFFFF' }}>
      
      {/* 
        ====================================================
        FULL-SCREEN HERO CAROUSEL WITH CENTERED GLASS CARD
        (INSPIRED BY REFERENCE LAYOUT WITH SS MATRIMONY BRANDING)
        ====================================================
      */}
      <section style={{
        position: 'relative',
        width: '100%',
        minHeight: '86vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: '#051329',
      }}>
        {/* Full-Bleed Background Image Carousel with Smooth Fade & Enhanced Brightness */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${heroSlides[currentSlide].image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(1.15) contrast(1.06) saturate(1.08)',
              zIndex: 0
            }}
          />
        </AnimatePresence>

        {/* Light Translucent Overlay Gradient for Maximum Background Brightness & Readability */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(10, 61, 145, 0.10) 0%, rgba(5, 19, 41, 0.18) 100%)',
          zIndex: 1
        }} />

        {/* Decorative Top Sawtooth Edge Border Divider */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '24px',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 24' preserveAspectRatio='none'%3E%3Cpath d='M0,0 L20,24 L40,0 L60,24 L80,0 L100,24 L120,0 L140,24 L160,0 L180,24 L200,0 L220,24 L240,0 L260,24 L280,0 L300,24 L320,0 L340,24 L360,0 L380,24 L400,0 L420,24 L440,0 L460,24 L480,0 L500,24 L520,0 L540,24 L560,0 L580,24 L600,0 L620,24 L640,0 L660,24 L680,0 L700,24 L720,0 L740,24 L760,0 L780,24 L800,0 L820,24 L840,0 L860,24 L880,0 L900,24 L920,0 L940,24 L960,0 L980,24 L1000,0 L1020,24 L1040,0 L1060,24 L1080,0 L1100,24 L1120,0 L1140,24 L1160,0 L1180,24 L1200,0 L1200,0 L0,0 Z' fill='%23FFFFFF'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat-x',
          zIndex: 10
        }} />

        {/* CENTERED GLASSMORPHISM CONTENT CARD */}
        <div className="container" style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'center', padding: '1.5rem 1rem' }}>
          <motion.div
            key={`card-${currentSlide}`}
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{
              maxWidth: '420px',
              width: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.22)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              borderRadius: '20px',
              border: '1.5px solid rgba(255, 255, 255, 0.45)',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.25)',
              padding: '1.45rem 1.35rem',
              textAlign: 'center',
              color: '#FFFFFF'
            }}
          >
            {/* Tagline Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              backgroundColor: 'rgba(212, 160, 23, 0.3)',
              border: '1px solid rgba(212, 160, 23, 0.75)',
              color: '#4A3200',
              fontWeight: '700',
              fontSize: '0.7rem',
              letterSpacing: '1.1px',
              padding: '0.25rem 0.75rem',
              borderRadius: '50px',
              marginBottom: '0.6rem'
            }}>
              <Sparkles size={11} color="#B8860B" /> {heroSlides[currentSlide].tag}
            </div>

            {/* Cursive Calligraphic Heading (Recreating "Made With Love" Style) */}
            <h1 style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.15rem)',
              color: '#FFFFFF',
              fontWeight: '700',
              fontFamily: 'serif',
              fontStyle: 'italic',
              lineHeight: '1.15',
              marginBottom: '0.6rem',
              textShadow: '0 3px 10px rgba(0,0,0,0.5)'
            }}>
              {heroSlides[currentSlide].title}
            </h1>

            {/* Subtitle Description */}
            <p style={{
              fontSize: '0.86rem',
              color: '#F8FAFC',
              lineHeight: '1.6',
              maxWidth: '330px',
              margin: '0 auto 1rem',
              textShadow: '0 2px 6px rgba(0,0,0,0.6)',
              fontWeight: '400'
            }}>
              {heroSlides[currentSlide].subtitle}
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link
                to="/register"
                style={{
                  background: 'linear-gradient(135deg, #D4A017 0%, #B8860B 100%)',
                  color: '#FFFFFF',
                  padding: '0.65rem 1.4rem',
                  borderRadius: '50px',
                  fontWeight: '700',
                  fontSize: '0.84rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 6px 20px rgba(212, 160, 23, 0.45)',
                  textDecoration: 'none',
                  border: '1.5px solid #D4A017',
                  transition: 'transform 0.3s ease'
                }}
              >
                Create Free Profile <ArrowRight size={15} />
              </Link>

              <Link
                to="/contact"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.35)',
                  color: '#FFFFFF',
                  padding: '0.65rem 1.2rem',
                  borderRadius: '50px',
                  fontWeight: '600',
                  fontSize: '0.84rem',
                  textDecoration: 'none',
                  border: '1.5px solid rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(8px)',
                  transition: 'background 0.3s ease'
                }}
              >
                We Can Help
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Carousel Left Navigation Arrow */}
        <button
          onClick={prevSlide}
          aria-label="Previous Slide"
          style={{
            position: 'absolute',
            left: '24px',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
            border: '1.5px solid rgba(255, 255, 255, 0.5)',
            color: '#FFFFFF',
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            zIndex: 20,
            transition: 'all 0.3s ease'
          }}
        >
          <ChevronLeft size={24} />
        </button>

        {/* Carousel Right Navigation Arrow */}
        <button
          onClick={nextSlide}
          aria-label="Next Slide"
          style={{
            position: 'absolute',
            right: '24px',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
            border: '1.5px solid rgba(255, 255, 255, 0.5)',
            color: '#FFFFFF',
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            zIndex: 20,
            transition: 'all 0.3s ease'
          }}
        >
          <ChevronRight size={24} />
        </button>

        {/* Bottom Slide Indicators */}
        <div style={{ position: 'absolute', bottom: '35px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.6rem', zIndex: 20 }}>
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              style={{
                width: idx === currentSlide ? '32px' : '10px',
                height: '10px',
                borderRadius: '50px',
                backgroundColor: idx === currentSlide ? '#D4A017' : 'rgba(255, 255, 255, 0.5)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.35s ease'
              }}
            />
          ))}
        </div>

        {/* Decorative Bottom Sawtooth Edge Border Divider */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '24px',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 24' preserveAspectRatio='none'%3E%3Cpath d='M0,24 L20,0 L40,24 L60,0 L80,24 L100,0 L120,24 L140,0 L160,24 L180,0 L200,24 L220,0 L240,24 L260,0 L280,24 L300,0 L320,24 L340,0 L360,24 L380,0 L400,24 L420,0 L440,24 L460,0 L480,24 L500,0 L520,24 L540,0 L560,24 L580,0 L600,24 L620,0 L640,24 L660,0 L680,24 L700,0 L720,24 L740,0 L760,24 L780,0 L800,24 L820,0 L840,24 L860,0 L880,24 L900,0 L920,24 L940,0 L960,24 L980,0 L1000,24 L1020,0 L1040,24 L1060,0 L1080,24 L1100,0 L1120,24 L1140,0 L1160,24 L1180,0 L1200,24 L1200,24 L0,24 Z' fill='%23FFFFFF'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat-x',
          zIndex: 10
        }} />

        {/* FLOATING ACTION WIDGETS (BOTTOM LEFT & BOTTOM RIGHT) */}
        {/* Bottom Left Phone Action Widget */}
        <a
          href="tel:7893069580"
          className="animate-pulse"
          title="Call SS Matrimony Assistance (+91 78930 69580)"
          style={{
            position: 'fixed',
            bottom: '28px',
            left: '28px',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#0A3D91',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 25px rgba(10, 61, 145, 0.45)',
            border: '2.5px solid #FFFFFF',
            zIndex: 999,
            transition: 'transform 0.3s ease'
          }}
        >
          <Phone size={24} color="#FFFFFF" />
        </a>

        {/* Bottom Right WhatsApp Action Widget */}
        <a
          href="https://wa.me/917893069580?text=Hello%20SS%20Matrimony%20Team%2C%20I%20would%20like%20to%20know%20more%20about%20your%20matrimonial%20services."
          target="_blank"
          rel="noopener noreferrer"
          className="animate-pulse"
          title="Chat with SS Matrimony on WhatsApp"
          style={{
            position: 'fixed',
            bottom: '28px',
            right: '28px',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#25D366',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            boxShadow: '0 8px 25px rgba(37, 211, 102, 0.45)',
            border: '2.5px solid #FFFFFF',
            zIndex: 999,
            transition: 'transform 0.3s ease'
          }}
        >
          <MessageCircle size={26} color="#FFFFFF" />
        </a>
      </section>



      {/* 
        ====================================================
        OUR BEAUTIFUL JOURNEY TO FOREVER TIMELINE SECTION
        ====================================================
      */}
      <section style={{
        position: 'relative',
        background: 'linear-gradient(180deg, #FAF9F6 0%, #EBF4FF 22%, #FFFFFF 50%, #EFF6FF 78%, #FAF9F6 100%)',
        padding: '7.5rem 0 7rem',
        borderBottom: '1px solid #E2E8F0',
        overflow: 'hidden'
      }}>
        {/* Soft Golden Glowing Radial Ambient Background Orbs */}
        <div style={{
          position: 'absolute',
          top: '-5%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '1100px',
          height: '1100px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,175,55,0.07) 0%, rgba(11,59,145,0.035) 45%, rgba(255,255,255,0) 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        <div style={{
          position: 'absolute',
          top: '40%',
          left: '5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        <div style={{
          position: 'absolute',
          bottom: '10%',
          right: '5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(11,59,145,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        {/* Telugu Wedding Mandala & Lotus Floral Watermark SVG */}
        <svg style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '800px',
          height: '800px',
          opacity: 0.035,
          pointerEvents: 'none',
          zIndex: 0
        }} viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="250" cy="250" r="230" stroke="#D4AF37" strokeWidth="2" strokeDasharray="6 6" />
          <circle cx="250" cy="250" r="180" stroke="#0B3B91" strokeWidth="1.5" />
          <circle cx="250" cy="250" r="120" stroke="#D4AF37" strokeWidth="2" />
          <path d="M 250 20 C 270 100, 400 230, 480 250 C 400 270, 270 400, 250 480 C 230 400, 100 270, 20 250 C 100 230, 230 100, 250 20 Z" stroke="#D4AF37" strokeWidth="1.5" fill="none" />
          <path d="M 250 70 C 265 140, 360 235, 430 250 C 360 265, 265 360, 250 430 C 235 360, 140 265, 70 250 C 140 235, 235 140, 250 70 Z" stroke="#0B3B91" strokeWidth="1" fill="none" />
        </svg>

        {/* Floating Gold Sparkles & Heart Motifs */}
        <motion.div
          animate={{ y: [-10, 10, -10], rotate: [0, 8, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', top: '15%', left: '8%', color: '#D4AF37', opacity: 0.65, zIndex: 1, fontSize: '1.5rem', pointerEvents: 'none' }}
        >
          ✨
        </motion.div>
        <motion.div
          animate={{ y: [12, -12, 12], rotate: [0, -10, 10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', top: '45%', right: '7%', color: '#D4AF37', opacity: 0.65, zIndex: 1, fontSize: '1.4rem', pointerEvents: 'none' }}
        >
          💖
        </motion.div>
        <motion.div
          animate={{ y: [-8, 8, -8], scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', bottom: '25%', left: '6%', color: '#D4AF37', opacity: 0.55, zIndex: 1, fontSize: '1.6rem', pointerEvents: 'none' }}
        >
          🌸
        </motion.div>
        <motion.div
          animate={{ y: [10, -10, 10], rotate: [0, 15, -15, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', bottom: '8%', right: '9%', color: '#D4AF37', opacity: 0.7, zIndex: 1, fontSize: '1.5rem', pointerEvents: 'none' }}
        >
          ✨
        </motion.div>

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
            <div className="badge-gold" style={{ marginBottom: '0.85rem', boxShadow: '0 4px 18px rgba(212,175,55,0.28)' }}>
              <Heart size={14} fill="#D4A017" color="#D4A017" /> OUR BEAUTIFUL JOURNEY
            </div>
            <h2 style={{
              fontSize: 'clamp(2.4rem, 4.3vw, 3.6rem)',
              color: '#0F172A',
              fontWeight: '800',
              fontFamily: 'Outfit, sans-serif',
              lineHeight: '1.2'
            }}>
              ❤ Our Beautiful Journey <span style={{ color: '#0B2A6B', fontFamily: 'serif', fontStyle: 'italic' }}>Begins Here</span>
            </h2>
            <p style={{ color: '#64748B', maxWidth: '760px', margin: '0.85rem auto 0', fontSize: '1.08rem', lineHeight: '1.8' }}>
              Every successful marriage begins with trust, family values, meaningful conversations, and the right guidance. Here's how SS Matrimony helps two families become one.
            </p>
          </div>

          {/* Timeline Wrapper with Central Gold Line */}
          <div className="timeline-container" style={{ position: 'relative', maxWidth: '1160px', margin: '0 auto' }}>
            
            {/* Luxurious Multi-stop Gold Gradient Timeline Axis with Intense Soft Glow */}
            <div className="center-timeline-axis" style={{
              position: 'absolute',
              top: '35px',
              bottom: '35px',
              left: '50%',
              width: '6px',
              transform: 'translateX(-50%)',
              background: 'linear-gradient(180deg, #0B3B91 0%, #D4AF37 12%, #F59E0B 35%, #D4AF37 65%, #F59E0B 88%, #0B3B91 100%)',
              boxShadow: '0 0 24px rgba(212, 175, 55, 0.65), 0 0 45px rgba(212, 175, 55, 0.3)',
              borderRadius: '3px',
              zIndex: 1
            }} />

            {/* 7 Storytelling Steps with Authentic Telugu Matrimony Images */}
            {[
              {
                step: '01',
                title: 'Profile Created',
                desc: 'The bride or groom registers with SS Matrimony and completes profile verification.',
                image: '/images/timeline-step1-profile.jpg',
                badge: 'Verified Profile',
                side: 'left'
              },
              {
                step: '02',
                title: 'Finding the Right Match',
                desc: 'Our experienced matchmaking team carefully suggests compatible profiles based on family values, education, traditions, and preferences.',
                image: '/images/timeline-step2-match.jpg',
                side: 'right'
              },
              {
                step: '03',
                title: 'First Conversation',
                desc: 'Both families connect through trusted communication with complete privacy and confidence.',
                image: '/images/timeline-step3-call.jpg',
                floatingIcon: '📞',
                side: 'left'
              },
              {
                step: '04',
                title: 'Families Meet',
                desc: 'Bride’s family welcomes groom’s family to discuss traditions, values, expectations, and compatibility over tea and sweets.',
                image: '/images/timeline-step4-families-meet.jpg',
                floatingIcon: '🏠',
                side: 'right'
              },
              {
                step: '05',
                title: 'Engagement Ceremony',
                desc: 'Bride and Groom exchange rings with parental blessings and traditional engagement celebration.',
                image: '/images/timeline-step5-engagement.jpg',
                floatingIcon: '💖',
                side: 'left'
              },
              {
                step: '06',
                title: 'Traditional Telugu Wedding',
                desc: 'The wedding is celebrated with sacred rituals including Jeelakarra Bellam, Mangalsutra tying, garlands, and lifelong promises under a traditional mandap.',
                image: '/images/timeline-step6-telugu-wedding.jpg',
                floatingIcon: '💍',
                side: 'right'
              },
              {
                step: '07',
                title: 'Happily Married',
                desc: 'Newly married Telugu couple begins their beautiful journey together with family blessings under golden evening light.',
                image: '/images/timeline-step7-happily-married.jpg',
                side: 'left'
              }
            ].map((st, idx) => {
              const isLeftCard = st.side === 'left';
              return (
                <div
                  key={idx}
                  className="timeline-row"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'calc(50% - 38px) calc(50% - 38px)',
                    gap: '76px',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '6.5rem',
                    position: 'relative'
                  }}
                >
                  {/* Subtle Gold Connector Branch Line Connecting Center Line to Left/Right Cards */}
                  <div className="timeline-connector-branch" style={{
                    position: 'absolute',
                    top: '50%',
                    left: isLeftCard ? 'calc(50% - 48px)' : '50%',
                    width: '48px',
                    height: '2px',
                    background: isLeftCard
                      ? 'linear-gradient(to left, #D4AF37, rgba(212, 175, 55, 0.2))'
                      : 'linear-gradient(to right, #D4AF37, rgba(212, 175, 55, 0.2))',
                    transform: 'translateY(-50%)',
                    zIndex: 2,
                    pointerEvents: 'none'
                  }} />

                  {/* Premium Circular Milestone Badge with Glassmorphism & Gold Gradient */}
                  <motion.div
                    whileHover={{ scale: 1.18, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    className="milestone-badge"
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #FEF08A 0%, #D4AF37 40%, #9A3412 100%)',
                      border: '4px solid #FFFFFF',
                      boxShadow: '0 0 30px rgba(212, 175, 55, 0.65), 0 10px 25px rgba(11, 42, 107, 0.2)',
                      color: '#FFFFFF',
                      fontWeight: '800',
                      fontSize: '1.1rem',
                      fontFamily: 'Outfit, sans-serif',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 10,
                      cursor: 'pointer',
                      backdropFilter: 'blur(8px)'
                    }}
                  >
                    <span style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>{st.step}</span>
                  </motion.div>

                  {/* LEFT COLUMN CONTENT (Text Card or Image Container) */}
                  <motion.div
                    initial={{ opacity: 0, x: isLeftCard ? -60 : -40, scale: 0.96 }}
                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    style={{ order: isLeftCard ? 1 : 2, textAlign: isLeftCard ? 'right' : 'left' }}
                  >
                    {isLeftCard ? (
                      /* Ultra-Luxury White Glass Text Card on Left */
                      <motion.div
                        whileHover={{ y: -8, scale: 1.02 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="glass-card timeline-card"
                        style={{
                          position: 'relative',
                          padding: '2.75rem 2.5rem',
                          backgroundColor: 'rgba(255, 255, 255, 0.96)',
                          borderRadius: '28px',
                          border: '1.5px solid rgba(212, 175, 55, 0.45)',
                          boxShadow: '0 25px 55px rgba(11, 42, 107, 0.09), 0 4px 20px rgba(212, 175, 55, 0.08)',
                          backdropFilter: 'blur(18px)',
                          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                          overflow: 'hidden',
                          marginRight: '-8px'
                        }}
                      >
                        {/* Vertical Gold Ribbon Accent on Left Edge */}
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          bottom: 0,
                          left: 0,
                          width: '6px',
                          background: 'linear-gradient(180deg, #FEF08A 0%, #D4AF37 50%, #B45309 100%)',
                          borderTopLeftRadius: '28px',
                          borderBottomLeftRadius: '28px',
                          boxShadow: '0 0 14px rgba(212, 175, 55, 0.45)',
                          pointerEvents: 'none'
                        }} />

                        {/* Subtle Internal Lotus Watermark SVG */}
                        <svg style={{
                          position: 'absolute',
                          bottom: '-20px',
                          left: '-20px',
                          width: '180px',
                          height: '180px',
                          opacity: 0.035,
                          pointerEvents: 'none'
                        }} viewBox="0 0 100 100" fill="none">
                          <circle cx="50" cy="50" r="45" stroke="#D4AF37" strokeWidth="2" strokeDasharray="3 3" />
                          <path d="M 50 10 C 60 30, 70 40, 90 50 C 70 60, 60 70, 50 90 C 40 70, 30 60, 10 50 C 30 40, 40 30, 50 10 Z" stroke="#0B3B91" strokeWidth="1.5" />
                        </svg>

                        {/* Small Gold Floral Ornament in Top Corner */}
                        <div style={{
                          position: 'absolute',
                          top: '18px',
                          left: '22px',
                          color: '#D4AF37',
                          fontSize: '1rem',
                          opacity: 0.7,
                          pointerEvents: 'none'
                        }}>
                          🌸
                        </div>

                        {/* Gold STEP Label Capsule Badge */}
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                          padding: '0.4rem 1.1rem',
                          borderRadius: '50px',
                          background: 'linear-gradient(135deg, #FEF08A 0%, #D4AF37 50%, #9A3412 100%)',
                          border: '1px solid #FFFFFF',
                          boxShadow: '0 4px 14px rgba(212, 175, 55, 0.35)',
                          color: '#FFFFFF',
                          fontSize: '0.8rem',
                          fontWeight: '800',
                          letterSpacing: '1.8px',
                          marginBottom: '1rem',
                          textShadow: '0 1px 3px rgba(0,0,0,0.3)'
                        }}>
                          <span>✨</span> STEP {st.step}
                        </div>

                        {/* Bold Deep Navy Heading */}
                        <h3 style={{
                          fontSize: '1.68rem',
                          color: '#0B2A6B',
                          fontWeight: '800',
                          marginBottom: '0.6rem',
                          fontFamily: 'Outfit, sans-serif',
                          lineHeight: '1.25'
                        }}>
                          {st.title}
                        </h3>

                        {/* Decorative Gold Divider under Title */}
                        <div style={{
                          width: '60px',
                          height: '2.5px',
                          background: 'linear-gradient(90deg, rgba(212, 175, 55, 0.1) 0%, #F59E0B 50%, #D4AF37 100%)',
                          borderRadius: '2px',
                          margin: '0.75rem 0 1rem auto'
                        }} />

                        {/* Description Text */}
                        <p style={{
                          fontSize: '1.02rem',
                          color: '#475569',
                          lineHeight: '1.85',
                          margin: 0
                        }}>
                          {st.desc}
                        </p>
                      </motion.div>
                    ) : (
                      /* Redesigned Image Container on Left (EXACT SAME IMAGE FILE & SIZE) */
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="timeline-image-wrapper"
                        style={{
                          borderRadius: '24px',
                          overflow: 'hidden',
                          position: 'relative',
                          border: '3.5px solid #D4AF37',
                          boxShadow: '0 22px 50px rgba(11, 59, 145, 0.16), 0 0 20px rgba(212, 175, 55, 0.2)',
                          height: '320px',
                          width: '100%',
                          marginRight: '-8px'
                        }}
                      >
                        <img
                          src={st.image}
                          alt={st.title}
                          className="timeline-img"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block',
                            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                          }}
                        />

                        {/* Glass Overlay Gradient at Bottom */}
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(to top, rgba(0, 0, 0, 0.18) 0%, rgba(0, 0, 0, 0.08) 45%, transparent 100%)',
                          pointerEvents: 'none'
                        }} />

                        {/* Bottom Floating Identity Badge */}
                        <div style={{
                          position: 'absolute',
                          bottom: '16px',
                          left: '16px',
                          background: 'rgba(255, 255, 255, 0.92)',
                          backdropFilter: 'blur(12px)',
                          borderRadius: '50px',
                          padding: '0.4rem 0.9rem',
                          border: '1px solid rgba(212, 175, 55, 0.4)',
                          boxShadow: '0 8px 20px rgba(0,0,0,0.18)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          fontSize: '0.78rem',
                          fontWeight: '800',
                          color: '#0B3B91',
                          zIndex: 10
                        }}>
                          <span style={{ color: '#D4AF37' }}>✨</span> SS Matrimony Journey
                        </div>

                        {st.floatingIcon && (
                          <div className="floating-step-icon" style={{
                            position: 'absolute',
                            bottom: '16px',
                            right: '16px',
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(8px)',
                            borderRadius: '50%',
                            width: '48px',
                            height: '48px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.45rem',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.22)',
                            border: '1.5px solid #D4AF37',
                            zIndex: 10
                          }}>
                            {st.floatingIcon}
                          </div>
                        )}

                        {st.badge && (
                          <div style={{
                            position: 'absolute',
                            top: '16px',
                            right: '16px',
                            backgroundColor: '#E6F4EA',
                            color: '#137333',
                            fontWeight: '800',
                            fontSize: '0.78rem',
                            padding: '0.4rem 0.9rem',
                            borderRadius: '50px',
                            border: '1px solid rgba(19, 115, 51, 0.3)',
                            boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                            zIndex: 10
                          }}>
                            ✓ {st.badge}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </motion.div>

                  {/* RIGHT COLUMN CONTENT (Text Card or Image Container) */}
                  <motion.div
                    initial={{ opacity: 0, x: isLeftCard ? 60 : 40, scale: 0.96 }}
                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    style={{ order: isLeftCard ? 2 : 1, textAlign: isLeftCard ? 'left' : 'right' }}
                  >
                    {!isLeftCard ? (
                      /* Ultra-Luxury White Glass Text Card on Right */
                      <motion.div
                        whileHover={{ y: -8, scale: 1.02 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="glass-card timeline-card"
                        style={{
                          position: 'relative',
                          padding: '2.75rem 2.5rem',
                          backgroundColor: 'rgba(255, 255, 255, 0.96)',
                          borderRadius: '28px',
                          border: '1.5px solid rgba(212, 175, 55, 0.45)',
                          boxShadow: '0 25px 55px rgba(11, 42, 107, 0.09), 0 4px 20px rgba(212, 175, 55, 0.08)',
                          backdropFilter: 'blur(18px)',
                          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                          overflow: 'hidden',
                          marginLeft: '-8px'
                        }}
                      >
                        {/* Vertical Gold Ribbon Accent on Left Edge */}
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          bottom: 0,
                          left: 0,
                          width: '6px',
                          background: 'linear-gradient(180deg, #FEF08A 0%, #D4AF37 50%, #B45309 100%)',
                          borderTopLeftRadius: '28px',
                          borderBottomLeftRadius: '28px',
                          boxShadow: '0 0 14px rgba(212, 175, 55, 0.45)',
                          pointerEvents: 'none'
                        }} />

                        {/* Subtle Internal Lotus Watermark SVG */}
                        <svg style={{
                          position: 'absolute',
                          bottom: '-20px',
                          right: '-20px',
                          width: '180px',
                          height: '180px',
                          opacity: 0.035,
                          pointerEvents: 'none'
                        }} viewBox="0 0 100 100" fill="none">
                          <circle cx="50" cy="50" r="45" stroke="#D4AF37" strokeWidth="2" strokeDasharray="3 3" />
                          <path d="M 50 10 C 60 30, 70 40, 90 50 C 70 60, 60 70, 50 90 C 40 70, 30 60, 10 50 C 30 40, 40 30, 50 10 Z" stroke="#0B3B91" strokeWidth="1.5" />
                        </svg>

                        {/* Small Gold Floral Ornament in Top Right Corner */}
                        <div style={{
                          position: 'absolute',
                          top: '18px',
                          right: '22px',
                          color: '#D4AF37',
                          fontSize: '1rem',
                          opacity: 0.7,
                          pointerEvents: 'none'
                        }}>
                          🌸
                        </div>

                        {/* Gold STEP Label Capsule Badge */}
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                          padding: '0.4rem 1.1rem',
                          borderRadius: '50px',
                          background: 'linear-gradient(135deg, #FEF08A 0%, #D4AF37 50%, #9A3412 100%)',
                          border: '1px solid #FFFFFF',
                          boxShadow: '0 4px 14px rgba(212, 175, 55, 0.35)',
                          color: '#FFFFFF',
                          fontSize: '0.8rem',
                          fontWeight: '800',
                          letterSpacing: '1.8px',
                          marginBottom: '1rem',
                          textShadow: '0 1px 3px rgba(0,0,0,0.3)'
                        }}>
                          <span>✨</span> STEP {st.step}
                        </div>

                        {/* Bold Deep Navy Heading */}
                        <h3 style={{
                          fontSize: '1.68rem',
                          color: '#0B2A6B',
                          fontWeight: '800',
                          marginBottom: '0.6rem',
                          fontFamily: 'Outfit, sans-serif',
                          lineHeight: '1.25'
                        }}>
                          {st.title}
                        </h3>

                        {/* Decorative Gold Divider under Title */}
                        <div style={{
                          width: '60px',
                          height: '2.5px',
                          background: 'linear-gradient(90deg, #D4AF37 0%, #F59E0B 50%, rgba(212, 175, 55, 0.1) 100%)',
                          borderRadius: '2px',
                          margin: '0.75rem auto 1rem 0'
                        }} />

                        {/* Description Text */}
                        <p style={{
                          fontSize: '1.02rem',
                          color: '#475569',
                          lineHeight: '1.85',
                          margin: 0
                        }}>
                          {st.desc}
                        </p>
                      </motion.div>
                    ) : (
                      /* Redesigned Image Container on Right (EXACT SAME IMAGE FILE & SIZE) */
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="timeline-image-wrapper"
                        style={{
                          borderRadius: '24px',
                          overflow: 'hidden',
                          position: 'relative',
                          border: '3.5px solid #D4AF37',
                          boxShadow: '0 22px 50px rgba(11, 59, 145, 0.16), 0 0 20px rgba(212, 175, 55, 0.2)',
                          height: '320px',
                          width: '100%',
                          marginLeft: '-8px'
                        }}
                      >
                        <img
                          src={st.image}
                          alt={st.title}
                          className="timeline-img"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block',
                            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                          }}
                        />

                        {/* Glass Overlay Gradient at Bottom */}
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(to top, rgba(0, 0, 0, 0.18) 0%, rgba(0, 0, 0, 0.08) 45%, transparent 100%)',
                          pointerEvents: 'none'
                        }} />

                        {/* Bottom Floating Identity Badge */}
                        <div style={{
                          position: 'absolute',
                          bottom: '16px',
                          right: '16px',
                          background: 'rgba(255, 255, 255, 0.92)',
                          backdropFilter: 'blur(12px)',
                          borderRadius: '50px',
                          padding: '0.4rem 0.9rem',
                          border: '1px solid rgba(212, 175, 55, 0.4)',
                          boxShadow: '0 8px 20px rgba(0,0,0,0.18)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          fontSize: '0.78rem',
                          fontWeight: '800',
                          color: '#0B3B91',
                          zIndex: 10
                        }}>
                          <span style={{ color: '#D4AF37' }}>✨</span> SS Matrimony Journey
                        </div>

                        {st.floatingIcon && (
                          <div className="floating-step-icon" style={{
                            position: 'absolute',
                            bottom: '16px',
                            left: '16px',
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(8px)',
                            borderRadius: '50%',
                            width: '48px',
                            height: '48px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.45rem',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.22)',
                            border: '1.5px solid #D4AF37',
                            zIndex: 10
                          }}>
                            {st.floatingIcon}
                          </div>
                        )}

                        {st.badge && (
                          <div style={{
                            position: 'absolute',
                            top: '16px',
                            left: '16px',
                            backgroundColor: '#E6F4EA',
                            color: '#137333',
                            fontWeight: '800',
                            fontSize: '0.78rem',
                            padding: '0.4rem 0.9rem',
                            borderRadius: '50px',
                            border: '1px solid rgba(19, 115, 51, 0.3)',
                            boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                            zIndex: 10
                          }}>
                            ✓ {st.badge}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              );
            })}

          </div>

          {/* BOTTOM SUMMARY TRUST SECTION */}
          <div style={{ textAlign: 'center', marginTop: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={22} fill="#D4A017" color="#D4A017" />
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#0B2A6B', fontFamily: 'Outfit, sans-serif' }}>5000+</div>
                <div style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: '600' }}>Happy Families</div>
              </div>
              <div style={{ height: '35px', width: '1px', backgroundColor: '#E2E8F0' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#D4A017', fontFamily: 'Outfit, sans-serif' }}>10000+</div>
                <div style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: '600' }}>Verified Members</div>
              </div>
              <div style={{ height: '35px', width: '1px', backgroundColor: '#E2E8F0' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#0B2A6B', fontFamily: 'Outfit, sans-serif' }}>Since 2018</div>
                <div style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: '600' }}>Trusted Matrimonial Service</div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Responsive & Luxury Hover Styles */}
        <style>{`
          .timeline-card:hover {
            transform: translateY(-8px) !important;
            box-shadow: 0 30px 60px rgba(11, 42, 107, 0.14), 0 0 25px rgba(212, 175, 55, 0.25) !important;
            border-color: rgba(212, 175, 55, 0.85) !important;
          }
          .timeline-image-wrapper:hover .timeline-img {
            transform: scale(1.08) !important;
          }
          @media (max-width: 900px) {
            .center-timeline-axis {
              left: 24px !important;
            }
            .milestone-badge {
              left: 24px !important;
              transform: translateY(-50%) !important;
            }
            .timeline-connector-branch {
              display: none !important;
            }
            .timeline-row {
              grid-template-columns: 1fr !important;
              gap: 1.75rem !important;
              padding-left: 65px !important;
            }
            .timeline-row > div {
              order: unset !important;
              text-align: left !important;
              margin-left: 0 !important;
              margin-right: 0 !important;
            }
          }
        `}</style>
      </section>

      {/* 
        ====================================================
        WHY CHOOSE US (6 LUXURY CARDS)
        ====================================================
      */}
      <section style={{ backgroundColor: '#F8FAFC', padding: '5.5rem 0', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div className="badge-gold" style={{ marginBottom: '0.75rem' }}>WHY CHOOSE US</div>
            <h2 style={{ fontSize: '2.4rem', color: '#0F172A', fontWeight: '800', fontFamily: 'Outfit, sans-serif' }}>
              Designed for Families Who Value <span style={{ color: '#0B3B91' }}>Excellence</span>
            </h2>
            <p style={{ color: '#64748B', maxWidth: '600px', margin: '0.5rem auto 0', fontSize: '0.95rem' }}>
              Everything we do is focused on building long-term trust, safety, and cultural harmony.
            </p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem' }}
          >
            {[
              { icon: ShieldCheck, title: 'Verified Profiles', desc: 'Comprehensive 100% manual document verification process for genuine candidates.' },
              { icon: Users, title: 'Dedicated Managers', desc: 'Personal relationship managers assigned to guide your search and discussions.' },
              { icon: Heart, title: 'Family Assisted Matching', desc: 'Facilitated communication designed for respect, tradition, and mutual alignment.' },
              { icon: Lock, title: 'Privacy Protection', desc: 'Control photo and contact visibility with strict authorization parameters.' },
              { icon: CheckCircle2, title: 'Background Verification', desc: 'Thorough address, employment, and educational background checks.' },
              { icon: MessageSquare, title: 'Secure Communication', desc: 'Safe internal chat and contact requests without revealing private details.' },
            ].map((card, idx) => {
              const IconComp = card.icon;
              return (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  className="glass-card"
                  style={{ padding: '2.25rem 1.75rem', backgroundColor: '#FFFFFF', borderRadius: '20px' }}
                >
                  <div style={{ background: 'linear-gradient(135deg, #0B3B91 0%, #072B6B 100%)', color: '#FFFFFF', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', boxShadow: '0 8px 20px rgba(11,59,145,0.2)' }}>
                    <IconComp size={26} color="#D4AF37" />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', color: '#0F172A', fontWeight: '700', marginBottom: '0.5rem' }}>{card.title}</h3>
                  <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: '1.6' }}>{card.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* 
        ====================================================
        HOW IT WORKS TIMELINE (6 STEPS)
        ====================================================
      */}
      <section id="how-it-works" className="container" style={{ padding: '5.5rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div className="badge-gold" style={{ marginBottom: '0.75rem' }}>SIMPLE PROCESS</div>
          <h2 style={{ fontSize: '2.4rem', color: '#0F172A', fontWeight: '800' }}>
            How SS Matrimony Works
          </h2>
          <p style={{ color: '#64748B', maxWidth: '600px', margin: '0.5rem auto 0', fontSize: '0.95rem' }}>
            Your journey to finding your life partner in 6 transparent steps.
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1.25rem' }}
        >
          {[
            { step: '01', title: 'Register Profile', desc: 'Create your free candidate or family profile.' },
            { step: '02', title: 'Verification', desc: 'Our team verifies submitted ID documents.' },
            { step: '03', title: 'Consultation', desc: 'Consult with our relationship managers.' },
            { step: '04', title: 'Express Interest', desc: 'Send interest requests to compatible matches.' },
            { step: '05', title: 'Family Interaction', desc: 'Connect with family assistance & guidance.' },
            { step: '06', title: 'Marriage', desc: 'Celebrate a beautiful lifelong bond.' },
          ].map((st, idx) => (
            <motion.div
              key={idx}
              variants={fadeInUp}
              style={{
                background: '#FFFFFF',
                border: '1.5px solid #E2E8F0',
                borderRadius: '20px',
                padding: '1.75rem 1rem',
                textAlign: 'center',
                boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                position: 'relative'
              }}
            >
              <div style={{ background: 'linear-gradient(135deg, #0B3B91 0%, #D4AF37 100%)', color: '#FFFFFF', width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontWeight: '800', fontSize: '1rem', boxShadow: '0 4px 12px rgba(11,59,145,0.2)' }}>
                {st.step}
              </div>
              <h4 style={{ fontSize: '1rem', color: '#0F172A', fontWeight: '700', marginBottom: '0.4rem' }}>{st.title}</h4>
              <p style={{ fontSize: '0.8rem', color: '#64748B', lineHeight: '1.5' }}>{st.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 
        ====================================================
        OUR SERVICES GRID
        ====================================================
      */}
      <section id="services" className="container" style={{ padding: '5.5rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div className="badge-gold" style={{ marginBottom: '0.75rem' }}>OUR SERVICES</div>
          <h2 style={{ fontSize: '2.4rem', color: '#0F172A', fontWeight: '800' }}>
            Luxury Relationship Services
          </h2>
          <p style={{ color: '#64748B', maxWidth: '600px', margin: '0.5rem auto 0', fontSize: '0.95rem' }}>
            Tailored match consultation for families seeking absolute reliability and respect.
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}
        >
          {servicesList.map((srv, idx) => {
            const IconComp = srv.icon;
            return (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="glass-card"
                style={{ padding: '2.25rem', backgroundColor: '#FFFFFF', borderRadius: '20px', position: 'relative' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <div style={{ background: '#EAF4FF', color: '#0B3B91', padding: '0.75rem', borderRadius: '14px', display: 'flex' }}>
                    <IconComp size={26} color="#0B3B91" />
                  </div>
                  <span className="badge-gold">{srv.badge}</span>
                </div>
                <h3 style={{ fontSize: '1.25rem', color: '#0F172A', fontWeight: '700', marginBottom: '0.6rem' }}>{srv.title}</h3>
                <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: '1.6' }}>{srv.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* 
        ====================================================
        LUXURY WEDDING GALLERY SUCCESS STORIES SECTION
        ====================================================
      */}
      <section style={{
        position: 'relative',
        backgroundColor: '#FFFFFF',
        padding: '6rem 0',
        borderTop: '1px solid #E2E8F0',
        borderBottom: '1px solid #E2E8F0',
        overflow: 'hidden'
      }}>
        {/* Subtle Decorative Vector Floral & Mandala Watermark Backdrop */}
        <div style={{
          position: 'absolute',
          top: '-15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '900px',
          height: '900px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,175,55,0.04) 0%, rgba(11,59,145,0.02) 40%, rgba(255,255,255,0) 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          {/* Section Heading & Subtitle */}
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div className="badge-gold" style={{ marginBottom: '0.85rem', boxShadow: '0 4px 14px rgba(212,175,55,0.2)' }}>
              <Heart size={14} fill="#D4AF37" color="#D4AF37" /> SUCCESS STORIES
            </div>
            <h2 style={{
              fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
              color: '#0F172A',
              fontWeight: '800',
              fontFamily: 'Outfit, sans-serif',
              lineHeight: '1.2'
            }}>
              Celebrating Beautiful <span style={{ color: '#0B3B91', fontFamily: 'serif', fontStyle: 'italic' }}>Beginnings</span>
            </h2>
            <p style={{ color: '#64748B', maxWidth: '680px', margin: '0.85rem auto 0', fontSize: '1.05rem', lineHeight: '1.7' }}>
              Thousands of Telugu families have trusted SS Matrimony to find their perfect life partner.
            </p>
          </div>

          {/* Responsive Luxury 3x2 Grid Gallery (3 Top Row, 3 Bottom Row Equal Cards) */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="wedding-masonry-grid"
          >
            {[
              { id: 1, names: "Sai Krishna ❤️ Sravani", location: "Hyderabad", date: "Dec 2024", image: "/images/success1.jpg" },
              { id: 2, names: "Rohan ❤️ Harika", location: "Dallas / Vijayawada", date: "Nov 2024", image: "/images/success2.jpg" },
              { id: 3, names: "Vikram ❤️ Sushma", location: "Visakhapatnam", date: "Jan 2025", image: "/images/success3.jpg" },
              { id: 4, names: "Karthik ❤️ Ananya", location: "Tirupati • Engagement", date: "Oct 2024", image: "/images/success4.jpg" },
              { id: 5, names: "Venkat ❤️ Prasanthi", location: "Vijayawada • Blessings", date: "Feb 2025", image: "/images/success5.jpg" },
              { id: 6, names: "Tarun ❤️ Bhavana", location: "Guntur / Hyderabad", date: "Mar 2025", image: "/images/success6.jpg" },
            ].map((item) => (
              <motion.div
                key={item.id}
                variants={fadeInUp}
                className="gallery-card"
                onClick={() => setLightboxImage({ title: item.names, tag: `${item.location} • ${item.date}`, src: item.image })}
                style={{
                  borderRadius: '24px',
                  overflow: 'hidden',
                  position: 'relative',
                  height: '380px',
                  boxShadow: '0 15px 35px rgba(11, 59, 145, 0.1)',
                  border: '1.5px solid rgba(212, 175, 55, 0.4)',
                  cursor: 'pointer',
                  backgroundColor: '#FFFFFF'
                }}
              >
                {/* Background Image with Hover Zoom */}
                <img
                  src={item.image}
                  alt={item.names}
                  className="gallery-image"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                />

                {/* Top Right Verified Badge */}
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  backgroundColor: '#E6F4EA',
                  color: '#137333',
                  fontWeight: '700',
                  fontSize: '0.75rem',
                  padding: '0.35rem 0.8rem',
                  borderRadius: '50px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  zIndex: 10
                }}>
                  <CheckCircle2 size={13} color="#137333" /> Verified
                </div>

                {/* Light Bottom Gradient Overlay */}
                <div className="gallery-overlay" style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0, 0, 0, 0.22), rgba(0, 0, 0, 0.08), transparent)',
                  transition: 'background 0.5s ease',
                  zIndex: 5
                }} />

                {/* Content Info */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '1.5rem 1.35rem',
                  zIndex: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem'
                }}>
                  <h3 style={{
                    color: '#FFFFFF',
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    fontFamily: 'Outfit, sans-serif',
                    lineHeight: '1.3',
                    textShadow: '0 2px 8px rgba(0,0,0,0.5)'
                  }}>
                    {item.names}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.2rem' }}>
                    <span style={{ color: '#EAF4FF', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                      <MapPin size={14} color="#D4AF37" /> {item.location}
                    </span>
                    <span style={{
                      color: '#D4AF37',
                      fontSize: '0.78rem',
                      fontWeight: '700',
                      backgroundColor: 'rgba(5, 19, 41, 0.65)',
                      padding: '0.2rem 0.65rem',
                      borderRadius: '50px',
                      border: '1px solid rgba(212, 175, 55, 0.4)'
                    }}>
                      {item.date}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Star Rating Banner & View More Button */}
          <div style={{ textAlign: 'center', marginTop: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '0.3rem' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={22} fill="#D4AF37" color="#D4AF37" />
                ))}
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0F172A', fontFamily: 'Outfit, sans-serif', letterSpacing: '0.3px' }}>
                "5000+ Happy Marriages Since 2018"
              </div>
            </div>

            <Link to="/success-stories" className="btn-gold" style={{ padding: '0.95rem 2.6rem', fontSize: '1rem' }}>
              View More Success Stories <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* Gallery Masonry CSS Rules */}
        <style>{`
          .wedding-masonry-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1.75rem;
          }
          .gallery-card:hover .gallery-image {
            transform: scale(1.06);
          }
          .gallery-card:hover .gallery-overlay {
            background: linear-gradient(to top, rgba(0, 0, 0, 0.28), rgba(0, 0, 0, 0.10), transparent) !important;
          }
          @media (max-width: 992px) {
            .wedding-masonry-grid {
              grid-template-columns: repeat(2, 1fr);
              gap: 1.25rem;
            }
          }
          @media (max-width: 640px) {
            .wedding-masonry-grid {
              grid-template-columns: 1fr;
              gap: 1.25rem;
            }
          }
            .card-large, .card-medium, .card-small {
              grid-column: span 1;
              height: 320px;
            }
          }
        `}</style>
      </section>

      {/* 
        ====================================================
        OUR WEDDING TRADITIONS SECTION (WITH LIGHTBOX PREVIEW)
        ====================================================
      */}
      <section className="container" style={{ padding: '6rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="badge-gold" style={{ marginBottom: '0.85rem', boxShadow: '0 4px 14px rgba(212,175,55,0.2)' }}>
            <Sparkles size={14} color="#D4AF37" /> SACRED TELUGU CUSTOMS
          </div>
          <h2 style={{
            fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
            color: '#0F172A',
            fontWeight: '800',
            fontFamily: 'Outfit, sans-serif',
            lineHeight: '1.2'
          }}>
            Our Wedding <span style={{ color: '#0B3B91', fontFamily: 'serif', fontStyle: 'italic' }}>Traditions</span>
          </h2>
          <p style={{ color: '#64748B', maxWidth: '720px', margin: '0.85rem auto 0', fontSize: '1.05rem', lineHeight: '1.75' }}>
            Explore the beautiful rituals and timeless customs that make every Telugu wedding a celebration of love, family, and togetherness.
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem'
          }}
        >
          {weddingTraditions.map((t, idx) => (
            <motion.div
              key={idx}
              variants={fadeInUp}
              className="tradition-card"
              onClick={() => setLightboxImage({ title: t.title, tag: `${t.category} • Telugu Tradition`, src: t.src })}
              style={{
                borderRadius: '24px',
                overflow: 'hidden',
                position: 'relative',
                height: '380px',
                cursor: 'pointer',
                boxShadow: '0 15px 35px rgba(11, 59, 145, 0.12)',
                border: '1.5px solid rgba(212, 175, 55, 0.4)',
                backgroundColor: '#FFFFFF',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              {/* Background Image */}
              <img
                src={t.src}
                alt={t.title}
                className="tradition-image"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              />

              {/* Light Bottom Gradient Overlay for Text Readability */}
              <div
                className="tradition-overlay"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(5, 15, 40, 0.65), rgba(5, 15, 40, 0.15), transparent)',
                  transition: 'background 0.5s ease',
                  zIndex: 5
                }}
              />

              {/* Card Category Badge */}
              <div style={{
                position: 'absolute',
                top: '18px',
                left: '18px',
                zIndex: 10
              }}>
                <span style={{
                  color: '#D4AF37',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  backgroundColor: 'rgba(5, 19, 41, 0.75)',
                  backdropFilter: 'blur(8px)',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '50px',
                  border: '1px solid rgba(212, 175, 55, 0.5)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}>
                  <Sparkles size={12} color="#D4AF37" /> {t.category}
                </span>
              </div>

              {/* Card Content Info */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '1.75rem',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                <h3 style={{
                  color: '#FFFFFF',
                  fontSize: '1.45rem',
                  fontWeight: '700',
                  fontFamily: 'Outfit, sans-serif',
                  lineHeight: '1.25',
                  textShadow: '0 2px 8px rgba(0,0,0,0.6)'
                }}>
                  {t.title}
                </h3>
                <p style={{
                  color: '#E2E8F0',
                  fontSize: '0.92rem',
                  lineHeight: '1.6',
                  opacity: 0.95,
                  margin: 0
                }}>
                  {t.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tradition Card Hover CSS rules */}
        <style>{`
          .tradition-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 25px 50px rgba(212, 175, 55, 0.35), 0 15px 35px rgba(11, 59, 145, 0.2) !important;
            border-color: #D4AF37 !important;
          }
          .tradition-card:hover .tradition-image {
            transform: scale(1.08);
          }
          .tradition-card:hover .tradition-overlay {
            background: linear-gradient(to top, rgba(0, 0, 0, 0.28), rgba(0, 0, 0, 0.10), transparent) !important;
          }
        `}</style>
      </section>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(5, 19, 41, 0.9)',
              backdropFilter: 'blur(8px)',
              zIndex: 2000,
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              padding: '2rem'
            }}
          >
            <div style={{ position: 'relative', maxWidth: '750px', width: '100%' }} onClick={e => e.stopPropagation()}>
              <button
                onClick={() => setLightboxImage(null)}
                style={{ position: 'absolute', top: '-40px', right: '0', background: '#FFFFFF', borderRadius: '50%', padding: '0.5rem', border: 'none' }}
              >
                <X size={20} color="#0B3B91" />
              </button>
              <img src={lightboxImage.src} alt={lightboxImage.title} style={{ width: '100%', height: 'auto', borderRadius: '20px', border: '3px solid #D4AF37' }} />
              <div style={{ marginTop: '1rem', color: '#FFFFFF', textAlign: 'center' }}>
                <h3 style={{ color: '#FFFFFF', fontSize: '1.4rem' }}>{lightboxImage.title}</h3>
                <span className="badge-gold" style={{ marginTop: '0.5rem' }}>{lightboxImage.tag}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 
        ====================================================
        TESTIMONIALS SECTION
        ====================================================
      */}
      <section style={{ backgroundColor: '#F8FAFC', padding: '5.5rem 0', borderTop: '1px solid #E2E8F0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="badge-gold" style={{ marginBottom: '0.75rem' }}>FAMILY REVIEWS</div>
            <h2 style={{ fontSize: '2.4rem', color: '#0F172A', fontWeight: '800' }}>
              What Families Say About SS Matrimony
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {[
              { name: 'K. Ramachandra Rao', role: 'Father of Bride (Hyderabad)', text: 'As parents, safety and background verification were our top concerns. SS Matrimony handled our match with utmost respect and transparency.', img: '/images/testimonial1.svg' },
              { name: 'P. Sushmitha', role: 'Bride (Vijayawada)', text: 'The consultation is personal and private. Finding a traditional family through their relationship manager was smooth and transparent.', img: '/images/testimonial2.svg' },
              { name: 'G. Vamshi Krishna', role: 'Groom (USA NRI)', text: 'Living in the US, I needed a trusted platform. Their relationship manager coordinated video calls with candidate families seamlessly.', img: '/images/testimonial3.svg' },
            ].map((t, idx) => (
              <div key={idx} className="glass-card" style={{ padding: '2rem', backgroundColor: '#FFFFFF', borderRadius: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                  <img src={t.img} alt={t.name} style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #D4AF37' }} />
                  <div>
                    <h4 style={{ fontSize: '1.05rem', color: '#0F172A', fontWeight: '700' }}>{t.name}</h4>
                    <span style={{ fontSize: '0.8rem', color: '#0B3B91', fontWeight: '600' }}>{t.role}</span>
                  </div>
                </div>
                <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: '1.6', fontStyle: 'italic' }}>"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* 
        ====================================================
        FAQ ACCORDION SECTION
        ====================================================
      */}
      <section style={{ backgroundColor: '#F8FAFC', padding: '5.5rem 0', borderTop: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div className="badge-gold" style={{ marginBottom: '0.75rem' }}>FREQUENTLY ASKED QUESTIONS</div>
            <h2 style={{ fontSize: '2.4rem', color: '#0F172A', fontWeight: '800' }}>
              Got Questions? We Have Answers.
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqList.map((f, idx) => {
              const isOpen = activeFaqIndex === idx;
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #E2E8F0',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                  }}
                >
                  <button
                    onClick={() => setActiveFaqIndex(isOpen ? -1 : idx)}
                    style={{
                      width: '100%',
                      padding: '1.25rem 1.5rem',
                      textAlign: 'left',
                      background: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'space-between',
                      fontWeight: '700',
                      fontSize: '1.05rem',
                      color: isOpen ? '#0B3B91' : '#0F172A'
                    }}
                  >
                    <span>{f.q}</span>
                    {isOpen ? <ChevronUp size={20} color="#0B3B91" /> : <ChevronDown size={20} color="#64748B" />}
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ padding: '0 1.5rem 1.25rem', color: '#475569', fontSize: '0.925rem', lineHeight: '1.7' }}
                      >
                        {f.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 
        ====================================================
        LUXURY CONTACT SECTION
        ====================================================
      */}
      <section className="container" style={{ padding: '5.5rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div className="badge-gold" style={{ marginBottom: '0.75rem' }}>GET IN TOUCH</div>
          <h2 style={{ fontSize: '2.4rem', color: '#0F172A', fontWeight: '800' }}>
            We are Here to Help Your Family
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'start' }}>
          {/* Left: Contact Info & Map */}
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: '#0B3B91', color: '#FFFFFF', padding: '0.75rem', borderRadius: '12px', display: 'flex' }}>
                  <Phone size={22} color="#D4AF37" />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: '600' }}>Direct Helpline</div>
                  <a href="tel:7893069580" style={{ fontSize: '1.1rem', color: '#0F172A', fontWeight: '700', textDecoration: 'none' }}>+91 78930 69580</a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: '#0B3B91', color: '#FFFFFF', padding: '0.75rem', borderRadius: '12px', display: 'flex' }}>
                  <Mail size={22} color="#D4AF37" />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: '600' }}>Official Email</div>
                  <a href="mailto:ssmatrimony2018@gmail.com" style={{ fontSize: '1.05rem', color: '#0F172A', fontWeight: '700', textDecoration: 'none' }}>ssmatrimony2018@gmail.com</a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: '#0B3B91', color: '#FFFFFF', padding: '0.75rem', borderRadius: '12px', display: 'flex' }}>
                  <Users size={22} color="#D4AF37" />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: '600' }}>Relationship Support</div>
                  <div style={{ fontSize: '1rem', color: '#0F172A', fontWeight: '700' }}>Worldwide Online Matchmaking</div>
                </div>
              </div>
            </div>

            {/* Relationship Support Card */}
            <div style={{ borderRadius: '20px', backgroundColor: '#EFF6FF', border: '1.5px solid #BAE6FD', padding: '1.5rem' }}>
              <div style={{ fontWeight: '700', color: '#0B3B91', fontSize: '1.05rem', marginBottom: '0.5rem' }}>
                Online &amp; Phone Consultations
              </div>
              <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: '1.6', margin: 0 }}>
                Most consultations, profile discussions and matchmaking guidance are provided through phone, WhatsApp and online meetings for family convenience.
              </p>
            </div>
          </div>

          {/* Right: Quick Contact Form */}
          <div className="glass-card" style={{ padding: '2.5rem', backgroundColor: '#FFFFFF', borderRadius: '24px' }}>
            <h3 style={{ fontSize: '1.4rem', color: '#0F172A', fontWeight: '700', marginBottom: '1.25rem' }}>Send Us a Message</h3>

            {contactSubmitted ? (
              <div style={{ backgroundColor: '#E6F4EA', color: '#137333', padding: '1.25rem', borderRadius: '12px', textAlign: 'center', fontWeight: '600' }}>
                Thank you! Our relationship team will call you back shortly.
              </div>
            ) : (
              <form onSubmit={handleContactSubmit}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="Enter your name"
                    value={contactForm.name}
                    onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      required
                      className="form-input"
                      placeholder="+91 98765 43210"
                      value={contactForm.phone}
                      onChange={e => setContactForm({ ...contactForm, phone: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Preferred Time</label>
                    <select
                      className="form-select"
                      value={contactForm.time}
                      onChange={e => setContactForm({ ...contactForm, time: e.target.value })}
                    >
                      <option>Morning</option>
                      <option>Afternoon</option>
                      <option>Evening</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Message / Consultation Requirements</label>
                  <textarea
                    rows={3}
                    className="form-textarea"
                    placeholder="Tell us what match consultation specifications you seek..."
                    value={contactForm.message}
                    onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn-gold" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
                  Submit Inquiry <Send size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 
        ====================================================
        PRE-FOOTER CTA BANNER
        ====================================================
      */}
      <div className="container" style={{ padding: '0 1.5rem 6rem' }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          style={{
            background: 'linear-gradient(135deg, #0B3B91 0%, #051329 100%)',
            borderRadius: '28px',
            padding: '3.5rem 2.5rem',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
            flexWrap: 'wrap',
            gap: '2rem',
            boxShadow: '0 20px 50px rgba(11, 59, 145, 0.3)',
            border: '2px solid #D4AF37'
          }}
        >
          <div>
            <span className="badge-gold" style={{ marginBottom: '0.75rem', backgroundColor: '#FFF9E6', color: '#966D03' }}>START YOUR JOURNEY TODAY</span>
            <h2 style={{ fontSize: '2.1rem', color: '#FFFFFF', fontWeight: '800', fontFamily: 'Outfit, sans-serif', marginBottom: '0.5rem' }}>
              Find Your Telugu Soulmate on SS Matrimony
            </h2>
            <p style={{ color: '#EAF4FF', fontSize: '0.95rem', maxWidth: '550px' }}>
              Join thousands of families who trust SS Matrimony for verified matchmaking, guidance, and complete privacy.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn-gold" style={{ padding: '0.95rem 2.2rem' }}>
              Create Free Profile
            </Link>
            <a
              href="https://wa.me/917893069580"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{ padding: '0.95rem 1.8rem', backgroundColor: '#FFFFFF' }}
            >
              <MessageCircle size={18} color="#25D366" /> Chat on WhatsApp
            </a>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
