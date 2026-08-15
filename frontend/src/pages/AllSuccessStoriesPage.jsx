import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowRight, Heart, X, CheckCircle2, Sparkles, ChevronRight } from 'lucide-react';
import { adminAPI } from '../services/api';

export default function AllSuccessStoriesPage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);

  const fetchPublishedStories = async (pageNum = 1, isAppend = false) => {
    try {
      if (isAppend) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const res = await adminAPI.getStories({ page: pageNum, limit: 9 });
      const newStories = res.data?.stories || (Array.isArray(res.data) ? res.data : []);
      const more = res.data?.hasMore || false;

      if (isAppend) {
        setStories((prev) => [...prev, ...newStories]);
      } else {
        setStories(newStories);
      }

      setHasMore(more);
      setPage(pageNum);
    } catch (err) {
      console.error('Error fetching published success stories:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPublishedStories(1, false);
  }, []);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchPublishedStories(page + 1, true);
    }
  };

  return (
    <div style={{ backgroundColor: '#F8FAFC', paddingBottom: '5rem' }}>
      {/* Header Banner */}
      <section
        style={{
          backgroundColor: '#FFFFFF',
          padding: '3.5rem 0 3rem',
          borderBottom: '1px solid #E2E8F0',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          {/* Breadcrumb Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#64748B', marginBottom: '1rem' }}>
            <Link to="/" style={{ color: '#64748B', textDecoration: 'none' }}>Home</Link>
            <ChevronRight size={14} />
            <Link to="/success-stories" style={{ color: '#64748B', textDecoration: 'none' }}>Success Stories</Link>
            <ChevronRight size={14} />
            <span style={{ color: '#0A3D91', fontWeight: '700' }}>All Published Stories</span>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.85rem',
              marginBottom: '1rem',
              padding: '0.45rem 1.1rem',
              borderRadius: '50px',
              background: '#FFF9E6',
              color: '#966D03',
              fontWeight: '700',
              border: '1px solid rgba(212, 160, 23, 0.4)',
            }}
          >
            <Heart size={14} fill="#D4A017" color="#D4A017" /> Community Wedding Archive
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
              color: '#0A3D91',
              fontWeight: '800',
              lineHeight: '1.2',
              marginBottom: '0.85rem',
            }}
          >
            All Wedded Couples &amp; Success Stories
          </h1>

          <p style={{ fontSize: '1.1rem', color: '#475569', maxWidth: '650px', lineHeight: '1.6' }}>
            Explore every published matrimony success story. Real couples, authentic journeys, and blessed family unions recorded on SS Matrimony.
          </p>
        </div>
      </section>

      {/* Main Stories Grid Section */}
      <section className="container" style={{ marginTop: '3.5rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#0A3D91', fontWeight: '700' }}>
            Loading published success stories from MongoDB...
          </div>
        ) : stories.length === 0 ? (
          <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center', color: '#64748B', maxWidth: '600px', margin: '0 auto' }}>
            <Sparkles size={48} color="#D4A017" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.5rem', color: '#0A3D91', fontWeight: '800' }}>No Published Stories Available</h3>
            <p style={{ marginTop: '0.5rem', lineHeight: '1.6' }}>
              Check back soon as new verified wedding announcements are published daily from the admin console.
            </p>
          </div>
        ) : (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
              {stories.map((c) => (
                <div
                  key={c._id}
                  className="glass-card"
                  style={{
                    padding: '1.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '1.25rem',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                      {/* Circular Couple Photo */}
                      <img
                        src={c.featuredImage || c.images?.[0] || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=300&q=80'}
                        alt={c.coupleNames}
                        style={{
                          width: '64px',
                          height: '64px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          objectPosition: 'center',
                          border: '2.5px solid #D4A017',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        }}
                      />
                      <div>
                        <h4 style={{ fontSize: '1.15rem', color: '#0A3D91', fontWeight: '700' }}>
                          {c.coupleNames}
                        </h4>
                        <div style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: '600' }}>
                          {c.location}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#966D03', fontWeight: '700' }}>
                          Wedded {c.weddingDate}
                        </div>
                      </div>
                    </div>

                    <p style={{ fontSize: '0.92rem', color: '#334155', lineHeight: '1.6', fontStyle: 'italic' }}>
                      "{c.description || c.story || c.shortStory}"
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.2rem', color: '#D4A017' }}>
                      {[...Array(5)].map((_, i) => (
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
                        gap: '0.25rem',
                      }}
                    >
                      View Story <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination / Load More */}
            {hasMore && (
              <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="btn-gold"
                  style={{
                    padding: '0.85rem 2.25rem',
                    fontSize: '0.95rem',
                    borderRadius: '50px',
                    fontWeight: '800',
                    boxShadow: '0 8px 20px rgba(212, 175, 55, 0.3)',
                    cursor: 'pointer',
                  }}
                >
                  {loadingMore ? 'Loading More Stories...' : 'Load More Success Stories'}
                </button>
              </div>
            )}
          </div>
        )}
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
            justifyContent: 'center',
            padding: '1.5rem',
            zIndex: 2000,
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
              position: 'relative',
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
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10,
              }}
            >
              <X size={20} color="#0F172A" />
            </button>

            <img
              src={selectedStory.featuredImage || selectedStory.images?.[0] || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80'}
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

              <div style={{ fontSize: '0.9rem', color: '#0284C7', fontWeight: '700', marginBottom: '1.25rem' }}>
                {selectedStory.location} • <span style={{ color: '#966D03' }}>Wedded in {selectedStory.weddingDate}</span>
              </div>

              <p style={{ fontSize: '0.98rem', color: '#334155', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                {selectedStory.description || selectedStory.fullStory || selectedStory.story}
              </p>

              <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#166534', fontSize: '0.88rem', fontWeight: '700' }}>
                <CheckCircle2 size={18} color="#166534" /> Verified SS Matrimony Union
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
