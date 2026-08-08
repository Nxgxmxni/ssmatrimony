import React from 'react';
import { Search, RotateCcw, Filter } from 'lucide-react';

export default function SearchFilters({ filters, setFilters, onApplyFilters, onResetFilters }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#800020' }}>
          <Filter size={18} color="#d4af37" /> Find Your Perfect Partner
        </h3>
        <button
          onClick={onResetFilters}
          style={{
            background: 'none',
            color: '#6b7280',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontWeight: '600'
          }}
        >
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        {/* Gender Filter */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Looking For</label>
          <select name="gender" value={filters.gender || ''} onChange={handleChange} className="form-select">
            <option value="">All Profiles</option>
            <option value="bride">Bride (Female)</option>
            <option value="groom">Groom (Male)</option>
          </select>
        </div>

        {/* Age Range */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Age Range</label>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input
              type="number"
              name="minAge"
              placeholder="Min Age"
              value={filters.minAge || ''}
              onChange={handleChange}
              className="form-input"
              min="18"
              max="70"
            />
            <span style={{ color: '#9ca3af' }}>to</span>
            <input
              type="number"
              name="maxAge"
              placeholder="Max Age"
              value={filters.maxAge || ''}
              onChange={handleChange}
              className="form-input"
              min="18"
              max="70"
            />
          </div>
        </div>

        {/* Religion */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Religion</label>
          <select name="religion" value={filters.religion || ''} onChange={handleChange} className="form-select">
            <option value="All">All Religions</option>
            <option value="Hindu">Hindu</option>
            <option value="Muslim">Muslim</option>
            <option value="Christian">Christian</option>
            <option value="Sikh">Sikh</option>
            <option value="Jain">Jain</option>
            <option value="Buddhist">Buddhist</option>
          </select>
        </div>

        {/* Mother Tongue */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Mother Tongue</label>
          <select name="motherTongue" value={filters.motherTongue || ''} onChange={handleChange} className="form-select">
            <option value="All">All Languages</option>
            <option value="Hindi">Hindi</option>
            <option value="Marathi">Marathi</option>
            <option value="Gujarati">Gujarati</option>
            <option value="Punjabi">Punjabi</option>
            <option value="Tamil">Tamil</option>
            <option value="Telugu">Telugu</option>
            <option value="Malayalam">Malayalam</option>
            <option value="Bengali">Bengali</option>
          </select>
        </div>

        {/* Marital Status */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Marital Status</label>
          <select name="maritalStatus" value={filters.maritalStatus || ''} onChange={handleChange} className="form-select">
            <option value="All">Any Status</option>
            <option value="Never Married">Never Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
          </select>
        </div>

        {/* City / Keyword Search */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>City or Profession</label>
          <input
            type="text"
            name="search"
            placeholder="e.g. Mumbai, Engineer..."
            value={filters.search || ''}
            onChange={handleChange}
            className="form-input"
          />
        </div>
      </div>

      <div style={{ marginTop: '1.25rem', textAlign: 'right' }}>
        <button onClick={onApplyFilters} className="btn-gold" style={{ padding: '0.6rem 1.75rem', fontSize: '0.9rem' }}>
          <Search size={16} /> Search Matches
        </button>
      </div>
    </div>
  );
}
