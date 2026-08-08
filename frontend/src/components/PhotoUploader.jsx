import React, { useState } from 'react';
import { profileAPI } from '../services/api';
import { Upload, Star, Trash2, Image, Sparkles, Check } from 'lucide-react';

export default function PhotoUploader({ photos = [], onPhotosUpdated }) {
  const [photoInput, setPhotoInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [msg, setMsg] = useState('');

  const handleUploadPhoto = async (url) => {
    if (!url) return;
    try {
      setLoading(true);
      setMsg('');
      const res = await profileAPI.uploadPhoto(url);
      setPhotoInput('');
      setMsg('Photo added to gallery!');
      if (onPhotosUpdated) onPhotosUpdated(res.data.photos);
    } catch (err) {
      console.error('Upload photo error:', err);
      setMsg('Failed to upload photo.');
    } finally {
      setLoading(false);
    }
  };

  const handleSetPrimary = async (index) => {
    try {
      setLoading(true);
      const res = await profileAPI.setPrimaryPhoto(index);
      setMsg('Primary profile picture updated!');
      if (onPhotosUpdated) onPhotosUpdated(res.data.photos);
    } catch (err) {
      console.error('Set primary photo error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePhoto = async (index) => {
    try {
      setLoading(true);
      const res = await profileAPI.deletePhoto(index);
      setMsg('Photo removed');
      if (onPhotosUpdated) onPhotosUpdated(res.data.photos);
    } catch (err) {
      console.error('Delete photo error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleUploadPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        handleUploadPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="glass-card" style={{ padding: '1.75rem' }}>
      <h3 style={{ fontSize: '1.25rem', color: '#800020', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <Image size={20} color="#d4af37" /> Profile Photo Gallery
      </h3>
      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.5rem' }}>
        Upload up to 5 high quality photos. Profiles with clear photos receive 8x more interest requests.
      </p>

      {msg && (
        <div style={{ backgroundColor: '#e6f4ea', color: '#137333', padding: '0.6rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.25rem', fontWeight: '600' }}>
          {msg}
        </div>
      )}

      {/* Drag and Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        style={{
          border: dragActive ? '2px dashed #800020' : '2px dashed #d4af37',
          backgroundColor: dragActive ? '#fff0f3' : '#faf6f0',
          borderRadius: '12px',
          padding: '2rem 1rem',
          textAlign: 'center',
          marginBottom: '1.5rem',
          transition: 'all 0.2s ease',
        }}
      >
        <Upload size={36} color="#800020" style={{ marginBottom: '0.5rem' }} />
        <div style={{ fontWeight: '700', color: '#1f2937', marginBottom: '0.2rem' }}>
          Drag & Drop your photo here
        </div>
        <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '1rem' }}>
          Supports JPG, PNG, WEBP files
        </div>

        <label className="btn-primary" style={{ cursor: 'pointer', padding: '0.5rem 1.25rem', fontSize: '0.85rem', display: 'inline-flex' }}>
          Browse Local File
          <input type="file" accept="image/*" onChange={handleFileInput} style={{ display: 'none' }} />
        </label>
      </div>

      {/* Or Upload via URL */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
        <input
          type="text"
          className="form-input"
          placeholder="Paste Photo Image URL (e.g. https://images.unsplash.com/...)"
          value={photoInput}
          onChange={(e) => setPhotoInput(e.target.value)}
        />
        <button
          onClick={() => handleUploadPhoto(photoInput)}
          disabled={loading || !photoInput}
          className="btn-gold"
          style={{ whiteSpace: 'nowrap', padding: '0.6rem 1.25rem' }}
        >
          Add Photo URL
        </button>
      </div>

      {/* Existing Photo Gallery */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '1rem' }}>
        {photos.map((url, idx) => (
          <div
            key={idx}
            style={{
              position: 'relative',
              height: '160px',
              borderRadius: '10px',
              overflow: 'hidden',
              border: idx === 0 ? '3px solid #800020' : '1px solid #e5e7eb',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            }}
          >
            <img src={url} alt={`Gallery ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

            {/* Primary Badge */}
            {idx === 0 ? (
              <span style={{
                position: 'absolute',
                top: '6px',
                left: '6px',
                background: '#800020',
                color: 'white',
                fontSize: '0.65rem',
                fontWeight: '700',
                padding: '0.2rem 0.5rem',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.2rem'
              }}>
                <Star size={10} fill="white" /> Primary
              </span>
            ) : (
              <button
                onClick={() => handleSetPrimary(idx)}
                title="Set as Main Profile Picture"
                style={{
                  position: 'absolute',
                  top: '6px',
                  left: '6px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '26px',
                  height: '26px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Star size={14} color="#d4af37" />
              </button>
            )}

            {/* Delete Photo Button */}
            <button
              onClick={() => handleDeletePhoto(idx)}
              title="Delete Photo"
              style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                background: 'rgba(197, 34, 31, 0.9)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '26px',
                height: '26px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
