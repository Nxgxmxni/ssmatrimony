import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SearchFilters from '../components/SearchFilters';
import ProfileCard from '../components/ProfileCard';
import InterestModal from '../components/InterestModal';
import { profileAPI } from '../services/api';
import { Search } from 'lucide-react';

export default function Profiles() {
  const location = useLocation();

  // Extract initial filters from URL params
  const queryParams = new URLSearchParams(location.search);
  const [filters, setFilters] = useState({
    gender: queryParams.get('gender') || '',
    minAge: queryParams.get('minAge') || '',
    maxAge: queryParams.get('maxAge') || '',
    religion: queryParams.get('religion') || 'All',
    caste: 'All',
    motherTongue: 'All',
    maritalStatus: 'All',
    highestEducation: 'All',
    search: '',
  });

  const [profiles, setProfiles] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedProfileForModal, setSelectedProfileForModal] = useState(null);

  const fetchProfiles = async (page = 1) => {
    try {
      setLoading(true);
      const params = { ...filters, page };
      const res = await profileAPI.getProfiles(params);
      setProfiles(res.data.profiles || []);
      setPagination(res.data.pagination || { page: 1, pages: 1, total: 0 });
    } catch (err) {
      console.error('Fetch profiles error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles(1);
  }, []);

  const handleApplyFilters = () => {
    fetchProfiles(1);
  };

  const handleResetFilters = () => {
    const resetState = {
      gender: '',
      minAge: '',
      maxAge: '',
      religion: 'All',
      caste: 'All',
      motherTongue: 'All',
      maritalStatus: 'All',
      highestEducation: 'All',
      search: '',
    };
    setFilters(resetState);
    // fetch after state update
    setTimeout(() => {
      fetchProfiles(1);
    }, 50);
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 4rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2.2rem', color: '#800020' }}>Matrimony Profiles</h2>
        <p style={{ color: '#6b7280' }}>
          Showing {pagination.total} prospective brides & grooms
        </p>
      </div>

      {/* Filter Component */}
      <SearchFilters
        filters={filters}
        setFilters={setFilters}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />

      {/* Profiles Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>
          Searching verified profiles...
        </div>
      ) : profiles.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
          <Search size={48} color="#d4af37" style={{ marginBottom: '1rem' }} />
          <h3>No profiles match your filter criteria</h3>
          <p style={{ marginTop: '0.5rem' }}>Try broadening your search parameters or resetting filters.</p>
          <button onClick={handleResetFilters} className="btn-secondary" style={{ marginTop: '1.25rem' }}>
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          <div className="profile-grid">
            {profiles.map((p) => (
              <ProfileCard
                key={p._id}
                profile={p}
                onOpenInterestModal={(prof) => setSelectedProfileForModal(prof)}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '3rem' }}>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => fetchProfiles(pageNum)}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    fontWeight: '700',
                    background: pageNum === pagination.page ? '#800020' : 'white',
                    color: pageNum === pagination.page ? 'white' : '#4b5563',
                    border: '1px solid #d4af37',
                  }}
                >
                  {pageNum}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* Interest Modal */}
      {selectedProfileForModal && (
        <InterestModal
          targetProfile={selectedProfileForModal}
          onClose={() => setSelectedProfileForModal(null)}
          onSuccess={() => alert('Interest request sent successfully!')}
        />
      )}
    </div>
  );
}
