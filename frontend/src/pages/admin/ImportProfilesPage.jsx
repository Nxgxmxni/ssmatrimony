import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import Toast from '../../components/Toast';
import {
  Upload,
  Download,
  FileSpreadsheet,
  Plus,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Users,
  Clock,
  Eye,
  Edit3,
  Trash2,
  X,
  Lock,
  Camera,
  ArrowUp,
  ArrowDown,
  Info,
  Ban,
  Save,
  RotateCcw,
} from 'lucide-react';

const DRAFT_STORAGE_KEY = 'ss_import_profile_draft_form';

const INITIAL_FORM = {
  // 1. Basic Information
  fullName: '',
  gender: 'bride',
  profileCreatedFor: 'Self',
  dateOfBirth: '',
  age: '',
  maritalStatus: 'Never Married',
  customId: '',

  // 2. Personal Details
  height: '',
  heightCm: '',
  religion: 'Hindu',
  caste: '',
  subCaste: '',
  gothram: '',
  motherTongue: 'Telugu',
  rashi: '',
  nakshatram: '',
  complexion: '',
  lifestyle: '',

  // 3. Education
  highestEducation: '',
  college: '',
  additionalEducation: '',

  // 4. Profession
  occupation: '',
  company: '',
  workLocation: '',
  annualIncome: '',

  // 5. Family Details
  fatherName: '',
  fatherOccupation: '',
  motherName: '',
  motherOccupation: '',
  siblings: '',
  siblingDetails: '',
  familyBackground: '',
  nativePlace: '',
  propertiesAssets: '',

  // 6. Location
  city: '',
  state: '',
  country: 'India',
  address: '',

  // 7. Horoscope Details
  placeOfBirth: '',
  timeOfBirth: '',
  rashiHoroscope: '',
  nakshatraHoroscope: '',
  gothramHoroscope: '',
  horoscopeNotes: '',
  horoscopeDetails: '',

  // 8. Partner Preferences
  partnerExpectations: {
    preferredAge: '',
    preferredHeight: '',
    religion: '',
    preferredCaste: '',
    education: '',
    preferredOccupation: '',
    location: '',
    otherExpectations: '',
  },

  // 9. About Profile
  aboutMe: '',
  additionalInformation: '',

  // 10. Contact Information (ADMIN ONLY)
  contactPhone: '',
  contactAltPhone: '',
  contactEmail: '',
  contactAddress: '',

  // 11. Photos
  photos: [],

  // Metadata
  profileSource: 'Admin Imported',
  status: 'Draft',
};

export default function ImportProfilesPage() {
  const [profiles, setProfiles] = useState([]);
  const [stats, setStats] = useState({
    totalImportedProfiles: 0,
    draftCount: 0,
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0,
    suspendedCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState({ type: '', text: '' });

  // Auto-dismiss toast message after 4 seconds
  useEffect(() => {
    if (toastMsg.text) {
      const timer = setTimeout(() => {
        setToastMsg({ type: '', text: '' });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMsg]);

  // Search & Filters
  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalFiltered, setTotalFiltered] = useState(0);

  // Form Modal State
  const [showFormModal, setShowFormModal] = useState(false);
  const [activeFormTab, setActiveFormTab] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [editingProfileId, setEditingProfileId] = useState(null);
  const [newPhotoInput, setNewPhotoInput] = useState('');
  const [hasSavedLocalDraft, setHasSavedLocalDraft] = useState(false);

  // Action Modals
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewProfile, setPreviewProfile] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState(null);

  const [showExcelModal, setShowExcelModal] = useState(false);
  const [excelFileRecords, setExcelFileRecords] = useState([]);
  const [importing, setImporting] = useState(false);

  // Auto-Save Draft to LocalStorage
  useEffect(() => {
    if (showFormModal && !editingProfileId) {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        setHasSavedLocalDraft(true);
      }
    }
  }, [showFormModal, editingProfileId]);

  useEffect(() => {
    if (showFormModal && !editingProfileId && formData.fullName) {
      try {
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(formData));
      } catch (err) {
        console.error('LocalStorage save error:', err);
      }
    }
  }, [formData, showFormModal, editingProfileId]);

  const handleRestoreLocalDraft = () => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        setFormData(JSON.parse(saved));
        setToastMsg({ type: 'info', text: 'Restored saved draft from local storage!' });
      }
    } catch (err) {
      console.error('Restore draft error:', err);
    }
  };

  const handleClearLocalDraft = () => {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    setHasSavedLocalDraft(false);
  };

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const params = {
        search,
        gender: genderFilter,
        status: statusFilter,
        source: sourceFilter,
        page,
        limit: 10,
      };
      const res = await adminAPI.getImportedProfiles(params);
      setProfiles(res.data.profiles || []);
      setStats(res.data.stats || {});
      setTotalPages(res.data.totalPages || 1);
      setTotalFiltered(res.data.total || 0);
    } catch (err) {
      console.error('Error fetching imported profiles:', err);
      setToastMsg({ type: 'error', text: 'Failed to load profiles list.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [search, genderFilter, statusFilter, sourceFilter, page]);

  // Open Form to Add New Profile
  const handleOpenAddForm = () => {
    setEditingProfileId(null);
    setFormData({
      ...INITIAL_FORM,
      profileSource: 'Admin Imported',
      status: 'Draft',
    });
    setActiveFormTab(1);
    setShowFormModal(true);
  };

  // Open Form to Edit Profile
  const handleOpenEditForm = async (profile) => {
    try {
      setEditingProfileId(profile._id);
      const res = await adminAPI.getImportedProfileById(profile._id);
      const p = res.data;

      setFormData({
        fullName: p.fullName || '',
        gender: p.gender || 'bride',
        profileCreatedFor: p.profileCreatedFor || 'Self',
        dateOfBirth: p.dateOfBirth ? p.dateOfBirth.slice(0, 10) : '',
        age: p.age || '',
        maritalStatus: p.maritalStatus || 'Never Married',
        customId: p.customId || `SSM${p._id.toString().slice(-6).toUpperCase()}`,

        height: p.height || (p.heightCm ? `${p.heightCm} cm` : ''),
        heightCm: p.heightCm || '',
        religion: p.religion || 'Hindu',
        caste: p.caste || '',
        subCaste: p.subCaste || '',
        gothram: p.gothram || '',
        motherTongue: p.motherTongue || 'Telugu',
        rashi: p.rashi || '',
        nakshatram: p.nakshatram || '',
        complexion: p.complexion || '',
        lifestyle: p.lifestyle || '',

        highestEducation: p.highestEducation || '',
        college: p.college || '',
        additionalEducation: p.additionalEducation || '',

        occupation: p.occupation || '',
        company: p.company || '',
        workLocation: p.workLocation || '',
        annualIncome: p.annualIncome || '',

        fatherName: p.fatherName || '',
        fatherOccupation: p.fatherOccupation || '',
        motherName: p.motherName || '',
        motherOccupation: p.motherOccupation || '',
        siblings: p.siblings || '',
        siblingDetails: p.siblingDetails || '',
        familyBackground: p.familyBackground || '',
        nativePlace: p.nativePlace || '',
        propertiesAssets: p.propertiesAssets || '',

        city: p.city || '',
        state: p.state || '',
        country: p.country || 'India',
        address: p.address || '',

        placeOfBirth: p.placeOfBirth || '',
        timeOfBirth: p.timeOfBirth || '',
        rashiHoroscope: p.rashi || '',
        nakshatraHoroscope: p.nakshatram || '',
        gothramHoroscope: p.gothram || '',
        horoscopeNotes: p.horoscopeNotes || '',
        horoscopeDetails: p.horoscopeDetails || '',

        partnerExpectations: {
          preferredAge: p.partnerExpectations?.preferredAge || '',
          preferredHeight: p.partnerExpectations?.preferredHeight || '',
          religion: p.partnerExpectations?.religion || '',
          preferredCaste: p.partnerExpectations?.preferredCaste || '',
          education: p.partnerExpectations?.education || '',
          preferredOccupation: p.partnerExpectations?.preferredOccupation || '',
          location: p.partnerExpectations?.location || '',
          otherExpectations: p.partnerExpectations?.otherExpectations || '',
        },

        aboutMe: p.aboutMe || '',
        additionalInformation: p.additionalInformation || '',

        contactPhone: p.contactPhone || p.user?.mobile || '',
        contactAltPhone: p.contactAltPhone || '',
        contactEmail: p.contactEmail || p.user?.email || '',
        contactAddress: p.contactAddress || p.address || '',

        photos: Array.isArray(p.photos) ? p.photos : [],
        profileSource: p.profileSource || 'Admin Imported',
        status: p.status || 'Draft',
      });

      setActiveFormTab(1);
      setShowFormModal(true);
    } catch (err) {
      console.error('Error fetching profile details for edit:', err);
      setToastMsg({ type: 'error', text: 'Error loading profile details.' });
    }
  };

  // Open Preview Modal
  const handleOpenPreview = (profile) => {
    setPreviewProfile(profile);
    setShowPreviewModal(true);
  };

  // Form Field Change Handler
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePartnerExpectationsChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      partnerExpectations: {
        ...prev.partnerExpectations,
        [field]: value,
      },
    }));
  };

  // DOB auto-calculate Age
  const handleDobChange = (e) => {
    const dobStr = e.target.value;
    handleInputChange('dateOfBirth', dobStr);
    if (dobStr) {
      const dob = new Date(dobStr);
      const diffMs = Date.now() - dob.getTime();
      const ageDate = new Date(diffMs);
      const calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);
      if (!isNaN(calculatedAge) && calculatedAge > 18 && calculatedAge < 90) {
        handleInputChange('age', calculatedAge);
      }
    }
  };

  // Photo Management Handlers
  const handleAddPhotoUrl = () => {
    if (!newPhotoInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, newPhotoInput.trim()],
    }));
    setNewPhotoInput('');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (result) {
        setFormData((prev) => ({
          ...prev,
          photos: [...prev.photos, result],
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = (index) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleSetPrimaryPhoto = (index) => {
    if (index === 0) return;
    setFormData((prev) => {
      const updated = [...prev.photos];
      const [selected] = updated.splice(index, 1);
      updated.unshift(selected);
      return { ...prev, photos: updated };
    });
  };

  const handleMovePhoto = (index, direction) => {
    setFormData((prev) => {
      const updated = [...prev.photos];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= updated.length) return prev;
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      return { ...prev, photos: updated };
    });
  };

  // Submit Profile Form Actions
  const handleSaveProfile = async (targetStatus, advanceNextSection = false) => {
    // Only required fields: Full Name & Gender
    if (!formData.fullName.trim()) {
      setToastMsg({ type: 'error', text: 'Full Name is required.' });
      setActiveFormTab(1);
      return;
    }
    if (!formData.gender) {
      setToastMsg({ type: 'error', text: 'Gender is required.' });
      setActiveFormTab(1);
      return;
    }

    const payload = {
      ...formData,
      status: targetStatus || formData.status || 'Draft',
    };

    try {
      setImporting(true);
      let savedResult = null;
      if (editingProfileId) {
        const res = await adminAPI.updateImportedProfile(editingProfileId, payload);
        savedResult = res.data.profile;
        setToastMsg({ type: 'success', text: `Profile updated successfully as ${payload.status}!` });
      } else {
        const res = await adminAPI.createAdminProfile(payload);
        savedResult = res.data.profile;
        if (savedResult?._id) {
          setEditingProfileId(savedResult._id);
        }
        setToastMsg({ type: 'success', text: `Profile saved successfully as ${payload.status}!` });
      }

      handleClearLocalDraft();

      if (advanceNextSection) {
        setActiveFormTab((curr) => Math.min(11, curr + 1));
      } else if (targetStatus === 'Pending Review' || targetStatus === 'Approved') {
        setShowFormModal(false);
      }
      fetchProfiles();
    } catch (err) {
      console.error('Error saving profile:', err);
      setToastMsg({ type: 'error', text: err.response?.data?.message || 'Error saving profile.' });
    } finally {
      setImporting(false);
    }
  };

  // Direct Status Update (Approve, Reject, Suspend)
  const handleUpdateStatus = async (id, status) => {
    try {
      await adminAPI.updateImportedProfileStatus(id, status);
      setToastMsg({ type: 'success', text: `Profile status updated to ${status}!` });
      fetchProfiles();
    } catch (err) {
      console.error('Status update error:', err);
      setToastMsg({ type: 'error', text: 'Failed to update profile status.' });
    }
  };

  // Delete Handler
  const handleDeleteProfile = async () => {
    if (!profileToDelete?._id) return;
    try {
      await adminAPI.deleteImportedProfile(profileToDelete._id);
      setToastMsg({ type: 'success', text: 'Profile deleted successfully.' });
      setShowDeleteModal(false);
      setProfileToDelete(null);
      fetchProfiles();
    } catch (err) {
      console.error('Delete profile error:', err);
      setToastMsg({ type: 'error', text: 'Error deleting profile.' });
    }
  };

  // CSV Import Logic
  const handleCSVFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result || '';
        const lines = text.split('\n').filter((l) => l.trim());
        if (lines.length <= 1) {
          setToastMsg({ type: 'error', text: 'File contains no data rows.' });
          return;
        }
        const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
        const parsed = [];
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
          const rowObj = {};
          headers.forEach((h, idx) => {
            rowObj[h] = values[idx] || '';
          });
          parsed.push(rowObj);
        }
        setExcelFileRecords(parsed);
      } catch (err) {
        console.error('Parse error:', err);
        setToastMsg({ type: 'error', text: 'Failed to parse CSV file.' });
      }
    };
    reader.readAsText(file);
  };

  const handleExecuteBulkImport = async () => {
    if (!excelFileRecords.length) return;
    try {
      setImporting(true);
      const res = await adminAPI.importProfiles({ records: excelFileRecords });
      setToastMsg({
        type: 'success',
        text: `Bulk import completed! ${res.data.summary?.importedCount || 0} profile(s) imported.`,
      });
      setShowExcelModal(false);
      setExcelFileRecords([]);
      fetchProfiles();
    } catch (err) {
      console.error('Bulk import error:', err);
      setToastMsg({ type: 'error', text: err.response?.data?.message || 'Error executing bulk import.' });
    } finally {
      setImporting(false);
    }
  };

  const handleDownloadSampleCSV = () => {
    const csv =
      'Full Name,Gender,Profile Created For,Date of Birth,Age,Marital Status,Height,Religion,Caste,Sub Caste,Gothram,Mother Tongue,Education,Profession,Annual Income,City,State,Country,Phone Number,Email,About Me,Status\n' +
      'Ananya Sharma,Bride,Parent,1998-07-15,26,Never Married,5 ft 5 in,Hindu,Brahmin,Vaidiki,Bharadwaja,Telugu,M.Tech,Senior Software Engineer,18-20 Lakhs,Hyderabad,Telangana,India,+91 9876543210,ananya.adminimport@example.com,Educated and soft-spoken bride from Hyderabad.,Draft\n' +
      'Karthik Varma,Groom,Self,1995-11-20,29,Never Married,5 ft 10 in,Hindu,Kshatriya,Raju,Kashyapa,Telugu,MS in USA,Product Manager,30-35 Lakhs,Visakhapatnam,Andhra Pradesh,India,+91 9876543211,karthik.adminimport@example.com,Product manager working in MNC looking for cultured Telugu bride.,Draft\n';

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'SS_Matrimony_Import_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToastMsg({ type: 'success', text: 'Sample CSV Template downloaded successfully!' });
  };

  // Helper Badge Colors for Status
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return { bg: '#DEF7EC', color: '#03543F', border: '#BCF0DA', icon: CheckCircle };
      case 'Pending Review':
        return { bg: '#FEF08A', color: '#854D0E', border: '#FDE047', icon: Clock };
      case 'Draft':
        return { bg: '#E2E8F0', color: '#475569', border: '#CBD5E1', icon: Save };
      case 'Rejected':
        return { bg: '#FDE8E8', color: '#9B1C1C', border: '#F8B4B4', icon: XCircle };
      case 'Suspended':
        return { bg: '#FED7AA', color: '#9A3412', border: '#FDBA74', icon: Ban };
      default:
        return { bg: '#F1F5F9', color: '#64748B', border: '#E2E8F0', icon: Info };
    }
  };

  return (
    <div style={{ padding: '1.5rem 2rem', fontFamily: 'Inter, system-ui, sans-serif', color: '#1E293B', backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
      <Toast type={toastMsg.type} message={toastMsg.text} onClose={() => setToastMsg({ type: '', text: '' })} />

      {/* HEADER SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.65rem', margin: 0 }}>
            <span style={{ fontSize: '1.8rem' }}>📥</span> Import Profiles
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.92rem', marginTop: '0.35rem', margin: 0 }}>
            Add and manage real bride and groom profiles received by SS Matrimony.
          </p>
        </div>

        {/* PROMINENT ACTION BUTTONS */}
        <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
          <button
            onClick={handleOpenAddForm}
            style={{
              backgroundColor: '#0B3B91',
              color: '#FFFFFF',
              border: 'none',
              padding: '0.75rem 1.4rem',
              borderRadius: '10px',
              fontWeight: '700',
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 14px rgba(11, 59, 145, 0.3)',
              transition: 'all 0.2s ease',
            }}
          >
            <Plus size={20} />
            <span>+ Add New Profile</span>
          </button>

          <button
            onClick={() => setShowExcelModal(true)}
            style={{
              backgroundColor: '#FFFFFF',
              color: '#0F172A',
              border: '1.5px solid #CBD5E1',
              padding: '0.75rem 1.25rem',
              borderRadius: '10px',
              fontWeight: '700',
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
              transition: 'all 0.2s ease',
            }}
          >
            <span>📥</span> Import Excel / CSV
          </button>
        </div>
      </div>

      {/* STATS SUMMARY BAR */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
        {[
          { label: 'Total Profiles', count: stats.totalImportedProfiles || totalFiltered, color: '#0B3B91', bg: '#EFF6FF' },
          { label: 'Draft', count: stats.draftCount || 0, color: '#475569', bg: '#F1F5F9' },
          { label: 'Pending Review', count: stats.pendingCount || 0, color: '#D97706', bg: '#FEF3C7' },
          { label: 'Approved', count: stats.approvedCount || 0, color: '#059669', bg: '#D1FAE5' },
          { label: 'Rejected', count: stats.rejectedCount || 0, color: '#DC2626', bg: '#FEE2E2' },
          { label: 'Suspended', count: stats.suspendedCount || 0, color: '#C2410C', bg: '#FFEDD5' },
        ].map((item, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '1.1rem 1.25rem',
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {item.label}
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: item.color, marginTop: '0.2rem' }}>
                {item.count}
              </div>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={20} color={item.color} />
            </div>
          </div>
        ))}
      </div>

      {/* SEARCH AND FILTERS BAR */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '1.25rem', border: '1px solid #E2E8F0', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          {/* Search Input */}
          <div style={{ flex: '1 1 260px', position: 'relative' }}>
            <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by Name, Profile ID, City, Phone, Email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem 0.65rem 2.4rem',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '0.88rem',
                outline: 'none',
              }}
            />
          </div>

          {/* Gender Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Gender:</span>
            <select
              value={genderFilter}
              onChange={(e) => {
                setGenderFilter(e.target.value);
                setPage(1);
              }}
              style={{ padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem', backgroundColor: '#FFFFFF' }}
            >
              <option value="All">All Genders</option>
              <option value="Bride">Bride (Female)</option>
              <option value="Groom">Groom (Male)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              style={{ padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem', backgroundColor: '#FFFFFF' }}
            >
              <option value="All">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          {/* Profile Source Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Source:</span>
            <select
              value={sourceFilter}
              onChange={(e) => {
                setSourceFilter(e.target.value);
                setPage(1);
              }}
              style={{ padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem', backgroundColor: '#FFFFFF' }}
            >
              <option value="All">All Sources</option>
              <option value="Admin Imported">Admin Imported</option>
              <option value="Registered User">Registered User</option>
            </select>
          </div>
        </div>
      </div>

      {/* PROFILES TABLE */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)' }}>
        {loading ? (
          <div style={{ padding: '4rem 1rem', textAlign: 'center', color: '#0B3B91', fontWeight: '700' }}>
            Loading imported profiles data...
          </div>
        ) : profiles.length === 0 ? (
          <div style={{ padding: '4rem 1rem', textAlign: 'center' }}>
            <FileSpreadsheet size={48} color="#94A3B8" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#334155' }}>No Profiles Found</h3>
            <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '0.3rem' }}>
              No bride or groom profiles match your search criteria. Click "+ Add New Profile" to create one.
            </p>
            <button
              onClick={handleOpenAddForm}
              style={{ marginTop: '1.25rem', backgroundColor: '#0B3B91', color: '#FFFFFF', border: 'none', padding: '0.65rem 1.25rem', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
            >
              + Add New Profile
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '1px solid #E2E8F0', color: '#475569', fontWeight: '700' }}>
                  <th style={{ padding: '0.85rem 1rem' }}>Profile ID</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Name</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Gender</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Age</th>
                  <th style={{ padding: '0.85rem 1rem' }}>City</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Occupation</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Profile Source</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Created Date</th>
                  <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((p) => {
                  const badge = getStatusBadge(p.status || 'Draft');
                  const StatusIcon = badge.icon;
                  const formattedGender = (p.gender || '').toLowerCase().includes('bride') || (p.gender || '').toLowerCase() === 'female' ? 'Bride' : 'Groom';
                  const pId = p.customId || `SSM${p._id.toString().slice(-6).toUpperCase()}`;

                  return (
                    <tr key={p._id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.15s ease' }}>
                      {/* Profile ID */}
                      <td style={{ padding: '0.9rem 1rem', fontWeight: '700', color: '#0B3B91' }}>
                        {pId}
                      </td>

                      {/* Name & Photo */}
                      <td style={{ padding: '0.9rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div
                            style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '50%',
                              backgroundColor: '#E2E8F0',
                              backgroundImage: p.photos && p.photos[0] ? `url(${p.photos[0]})` : undefined,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: '700',
                              color: '#475569',
                              border: '1px solid #CBD5E1',
                              overflow: 'hidden',
                              flexShrink: 0,
                            }}
                          >
                            {!p.photos || !p.photos[0] ? (p.fullName ? p.fullName[0].toUpperCase() : 'P') : null}
                          </div>
                          <div>
                            <div style={{ fontWeight: '700', color: '#0F172A' }}>{p.fullName}</div>
                            {p.contactPhone || p.contactEmail ? (
                              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                                {p.contactPhone || p.contactEmail}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </td>

                      {/* Gender */}
                      <td style={{ padding: '0.9rem 1rem' }}>
                        <span
                          style={{
                            padding: '0.25rem 0.6rem',
                            borderRadius: '12px',
                            fontSize: '0.78rem',
                            fontWeight: '700',
                            backgroundColor: formattedGender === 'Bride' ? '#FCE7F3' : '#E0F2FE',
                            color: formattedGender === 'Bride' ? '#BE185D' : '#0369A1',
                          }}
                        >
                          {formattedGender}
                        </span>
                      </td>

                      {/* Age */}
                      <td style={{ padding: '0.9rem 1rem', fontWeight: '600' }}>{p.age ? `${p.age} yrs` : 'N/A'}</td>

                      {/* City */}
                      <td style={{ padding: '0.9rem 1rem', color: '#475569' }}>{p.city || 'N/A'}</td>

                      {/* Occupation */}
                      <td style={{ padding: '0.9rem 1rem', color: '#475569' }}>{p.occupation || 'N/A'}</td>

                      {/* Profile Source */}
                      <td style={{ padding: '0.9rem 1rem' }}>
                        <span
                          style={{
                            padding: '0.25rem 0.6rem',
                            borderRadius: '12px',
                            fontSize: '0.78rem',
                            fontWeight: '700',
                            backgroundColor: p.profileSource === 'Admin Imported' ? '#FEF3C7' : '#F1F5F9',
                            color: p.profileSource === 'Admin Imported' ? '#92400E' : '#475569',
                            border: `1px solid ${p.profileSource === 'Admin Imported' ? '#FDE68A' : '#E2E8F0'}`,
                          }}
                        >
                          {p.profileSource || 'Admin Imported'}
                        </span>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '0.9rem 1rem' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            padding: '0.3rem 0.65rem',
                            borderRadius: '20px',
                            fontSize: '0.78rem',
                            fontWeight: '700',
                            backgroundColor: badge.bg,
                            color: badge.color,
                            border: `1px solid ${badge.border}`,
                          }}
                        >
                          <StatusIcon size={13} />
                          <span>{p.status || 'Draft'}</span>
                        </span>
                      </td>

                      {/* Created Date */}
                      <td style={{ padding: '0.9rem 1rem', color: '#64748B', fontSize: '0.82rem' }}>
                        {p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-IN') : 'Recent'}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '0.9rem 1rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end', flexWrap: 'nowrap' }}>
                          <button
                            title="Preview Profile"
                            onClick={() => handleOpenPreview(p)}
                            style={{ padding: '0.35rem 0.5rem', backgroundColor: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '6px', cursor: 'pointer', color: '#0F172A' }}
                          >
                            <Eye size={15} />
                          </button>

                          <button
                            title="Edit Profile"
                            onClick={() => handleOpenEditForm(p)}
                            style={{ padding: '0.35rem 0.5rem', backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '6px', cursor: 'pointer', color: '#1D4ED8' }}
                          >
                            <Edit3 size={15} />
                          </button>

                          {/* Quick Status Actions */}
                          {p.status !== 'Approved' && (
                            <button
                              title="Approve Profile"
                              onClick={() => handleUpdateStatus(p._id, 'Approved')}
                              style={{ padding: '0.35rem 0.55rem', backgroundColor: '#DEF7EC', border: '1px solid #BCF0DA', borderRadius: '6px', cursor: 'pointer', color: '#03543F', fontWeight: '700', fontSize: '0.75rem' }}
                            >
                              Approve
                            </button>
                          )}

                          {p.status !== 'Rejected' && (
                            <button
                              title="Reject Profile"
                              onClick={() => handleUpdateStatus(p._id, 'Rejected')}
                              style={{ padding: '0.35rem 0.55rem', backgroundColor: '#FDE8E8', border: '1px solid #F8B4B4', borderRadius: '6px', cursor: 'pointer', color: '#9B1C1C', fontWeight: '700', fontSize: '0.75rem' }}
                            >
                              Reject
                            </button>
                          )}

                          {p.status !== 'Suspended' && (
                            <button
                              title="Suspend Profile"
                              onClick={() => handleUpdateStatus(p._id, 'Suspended')}
                              style={{ padding: '0.35rem 0.55rem', backgroundColor: '#FED7AA', border: '1px solid #FDBA74', borderRadius: '6px', cursor: 'pointer', color: '#9A3412', fontWeight: '700', fontSize: '0.75rem' }}
                            >
                              Suspend
                            </button>
                          )}

                          <button
                            title="Delete Profile"
                            onClick={() => {
                              setProfileToDelete(p);
                              setShowDeleteModal(true);
                            }}
                            style={{ padding: '0.35rem 0.5rem', backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '6px', cursor: 'pointer', color: '#DC2626' }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 11-SECTION COPY/PASTE FRIENDLY PROFILE EDIT / ADD FORM MODAL */}
      {/* ========================================================================= */}
      {showFormModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', width: '100%', maxWidth: '980px', maxHeight: '92vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            
            {/* MODAL HEADER */}
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0F172A', color: '#FFFFFF' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>{editingProfileId ? '✏️ Edit Profile' : '➕ Add New Profile (Biodata Copy/Paste Mode)'}</span>
                </h2>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.2rem' }}>
                  {editingProfileId ? `Updating Profile ID: ${formData.customId}` : 'Optimized for fast typing & pasting real biodata received via email, WhatsApp, or PDF'}
                </div>
              </div>
              <button onClick={() => setShowFormModal(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '0.3rem' }}>
                <X size={22} />
              </button>
            </div>

            {/* RESTORE DRAFT BANNER IF LOCAL DRAFT EXISTS */}
            {hasSavedLocalDraft && !editingProfileId && (
              <div style={{ padding: '0.65rem 1.5rem', backgroundColor: '#FEF3C7', borderBottom: '1px solid #FDE68A', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.83rem', color: '#92400E' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <RotateCcw size={16} />
                  <span>Unsaved local draft found from your previous session.</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={handleRestoreLocalDraft} style={{ backgroundColor: '#B45309', color: '#FFFFFF', border: 'none', padding: '0.3rem 0.75rem', borderRadius: '6px', fontWeight: '700', fontSize: '0.78rem', cursor: 'pointer' }}>
                    Restore Draft
                  </button>
                  <button onClick={handleClearLocalDraft} style={{ backgroundColor: 'transparent', color: '#78350F', border: 'none', fontSize: '0.78rem', cursor: 'pointer', textDecoration: 'underline' }}>
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            {/* SECTION TABS HEADER (11 SECTIONS) */}
            <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', overflowX: 'auto', backgroundColor: '#F8FAFC', padding: '0 0.5rem' }}>
              {[
                { id: 1, label: '1. Basic Info' },
                { id: 2, label: '2. Personal' },
                { id: 3, label: '3. Education' },
                { id: 4, label: '4. Profession' },
                { id: 5, label: '5. Family' },
                { id: 6, label: '6. Location' },
                { id: 7, label: '7. Horoscope' },
                { id: 8, label: '8. Preferences' },
                { id: 9, label: '9. About' },
                { id: 10, label: '10. Contact (Admin Only)' },
                { id: 11, label: '11. Photos' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFormTab(tab.id)}
                  style={{
                    padding: '0.75rem 0.9rem',
                    border: 'none',
                    borderBottom: activeFormTab === tab.id ? '3px solid #0B3B91' : '3px solid transparent',
                    backgroundColor: 'transparent',
                    color: activeFormTab === tab.id ? '#0B3B91' : '#64748B',
                    fontWeight: activeFormTab === tab.id ? '800' : '600',
                    fontSize: '0.82rem',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* FORM BODY */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
              
              {/* SECTION 1: BASIC INFORMATION */}
              {activeFormTab === 1 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Full Name *</label>
                    <input
                      type="text"
                      placeholder="Enter or paste full name"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Gender *</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', backgroundColor: '#FFFFFF' }}
                    >
                      <option value="bride">Bride (Female)</option>
                      <option value="groom">Groom (Male)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Profile Created For</label>
                    <select
                      value={formData.profileCreatedFor}
                      onChange={(e) => handleInputChange('profileCreatedFor', e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', backgroundColor: '#FFFFFF' }}
                    >
                      <option value="Self">Self</option>
                      <option value="Son">Son</option>
                      <option value="Daughter">Daughter</option>
                      <option value="Brother">Brother</option>
                      <option value="Sister">Sister</option>
                      <option value="Relative">Relative</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Date of Birth</label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleDobChange}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Age</label>
                    <input
                      type="number"
                      placeholder="e.g. 26"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Marital Status</label>
                    <select
                      value={formData.maritalStatus}
                      onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', backgroundColor: '#FFFFFF' }}
                    >
                      <option value="Never Married">Never Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                      <option value="Separated">Separated</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Profile ID</label>
                    <input
                      type="text"
                      placeholder="Auto-generated if left blank (e.g. SSM10203)"
                      value={formData.customId}
                      onChange={(e) => handleInputChange('customId', e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Profile Source</label>
                    <select
                      value={formData.profileSource}
                      onChange={(e) => handleInputChange('profileSource', e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', backgroundColor: '#FFFFFF' }}
                    >
                      <option value="Admin Imported">Admin Imported</option>
                      <option value="Registered User">Registered User</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Profile Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', backgroundColor: '#FFFFFF' }}
                    >
                      <option value="Draft">Draft (Not visible to users)</option>
                      <option value="Pending Review">Pending Review (Under Verification)</option>
                      <option value="Approved">Approved (Visible on Matchmaking)</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
                </div>
              )}

              {/* SECTION 2: PERSONAL DETAILS */}
              {activeFormTab === 2 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Height (Free-form Text)</label>
                    <input
                      type="text"
                      placeholder="e.g. 5'8&quot;, 5 ft 8 in, 173 cm"
                      value={formData.height}
                      onChange={(e) => handleInputChange('height', e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                    />
                    <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.2rem' }}>Type height in any format (e.g. 5'8", 173 cm). No fixed dropdown restriction.</div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Religion</label>
                    <input
                      type="text"
                      list="religion-suggestions"
                      placeholder="e.g. Hindu, Muslim, Christian, etc."
                      value={formData.religion}
                      onChange={(e) => handleInputChange('religion', e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                    />
                    <datalist id="religion-suggestions">
                      <option value="Hindu" />
                      <option value="Muslim" />
                      <option value="Christian" />
                      <option value="Sikh" />
                      <option value="Jain" />
                      <option value="Buddhist" />
                    </datalist>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Caste</label>
                    <input
                      type="text"
                      placeholder="e.g. Kamma, Reddy, Brahmin, Kapu, etc."
                      value={formData.caste}
                      onChange={(e) => handleInputChange('caste', e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Sub Caste</label>
                    <input
                      type="text"
                      placeholder="e.g. Vaidiki, Niyogi, etc."
                      value={formData.subCaste}
                      onChange={(e) => handleInputChange('subCaste', e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Gothram</label>
                    <input
                      type="text"
                      placeholder="e.g. Kasyapa, Bharadwaja"
                      value={formData.gothram}
                      onChange={(e) => handleInputChange('gothram', e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Mother Tongue</label>
                    <input
                      type="text"
                      placeholder="e.g. Telugu, Tamil, Hindi"
                      value={formData.motherTongue}
                      onChange={(e) => handleInputChange('motherTongue', e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Rashi</label>
                    <input
                      type="text"
                      placeholder="e.g. Mesha, Vrishabha"
                      value={formData.rashi}
                      onChange={(e) => handleInputChange('rashi', e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Nakshatra</label>
                    <input
                      type="text"
                      placeholder="e.g. Aswini, Rohini"
                      value={formData.nakshatram}
                      onChange={(e) => handleInputChange('nakshatram', e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Complexion</label>
                    <input
                      type="text"
                      placeholder="e.g. Fair, Wheatish, Very Fair"
                      value={formData.complexion}
                      onChange={(e) => handleInputChange('complexion', e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Lifestyle</label>
                    <input
                      type="text"
                      placeholder="e.g. Vegetarian, Non-Smoker"
                      value={formData.lifestyle}
                      onChange={(e) => handleInputChange('lifestyle', e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>
              )}

              {/* SECTION 3: EDUCATION */}
              {activeFormTab === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Highest Education</label>
                      <input
                        type="text"
                        placeholder="e.g. B.Tech, MS in US, MBBS, MBA"
                        value={formData.highestEducation}
                        onChange={(e) => handleInputChange('highestEducation', e.target.value)}
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>College / University</label>
                      <input
                        type="text"
                        placeholder="e.g. Osmania University, JNTU, IIT"
                        value={formData.college}
                        onChange={(e) => handleInputChange('college', e.target.value)}
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Additional Education Details</label>
                    <textarea
                      rows={3}
                      placeholder={`e.g. MBBS – GSL Medical College\nMD Paediatrics – Narayana Medical College`}
                      value={formData.additionalEducation}
                      onChange={(e) => handleInputChange('additionalEducation', e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', fontFamily: 'inherit' }}
                    />
                    <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.2rem' }}>Large text area allowing pasting multiple degrees, certifications, or complete educational history.</div>
                  </div>
                </div>
              )}

              {/* SECTION 4: PROFESSION */}
              {activeFormTab === 4 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Occupation</label>
                    <input
                      type="text"
                      placeholder="e.g. Senior Software Engineer, Doctor"
                      value={formData.occupation}
                      onChange={(e) => handleInputChange('occupation', e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Company Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Microsoft, TCS, Self-Employed"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Work Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Hyderabad, USA, Bangalore"
                      value={formData.workLocation}
                      onChange={(e) => handleInputChange('workLocation', e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Annual Income (Free-form Text)</label>
                    <input
                      type="text"
                      placeholder="e.g. ₹25 Lakhs, 25 LPA, ₹25.80 Lakhs + Bonus"
                      value={formData.annualIncome}
                      onChange={(e) => handleInputChange('annualIncome', e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                    />
                    <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.2rem' }}>Allows any text format (e.g. "₹25 Lakhs", "25 LPA", "10L/annum + 2L incentives").</div>
                  </div>
                </div>
              )}

              {/* SECTION 5: FAMILY DETAILS */}
              {activeFormTab === 5 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Father's Name</label>
                      <input
                        type="text"
                        placeholder="Father's full name"
                        value={formData.fatherName}
                        onChange={(e) => handleInputChange('fatherName', e.target.value)}
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Father's Profession</label>
                      <input
                        type="text"
                        placeholder="e.g. Retired Govt Employee, Businessman"
                        value={formData.fatherOccupation}
                        onChange={(e) => handleInputChange('fatherOccupation', e.target.value)}
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Mother's Name</label>
                      <input
                        type="text"
                        placeholder="Mother's full name"
                        value={formData.motherName}
                        onChange={(e) => handleInputChange('motherName', e.target.value)}
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Mother's Profession</label>
                      <input
                        type="text"
                        placeholder="e.g. Homemaker, Teacher"
                        value={formData.motherOccupation}
                        onChange={(e) => handleInputChange('motherOccupation', e.target.value)}
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Native Place</label>
                      <input
                        type="text"
                        placeholder="e.g. Vijayawada, Guntur"
                        value={formData.nativePlace}
                        onChange={(e) => handleInputChange('nativePlace', e.target.value)}
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Siblings Summary</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. 1 Brother (Married), 1 Sister (Unmarried)"
                      value={formData.siblings}
                      onChange={(e) => handleInputChange('siblings', e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', fontFamily: 'inherit' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Sibling Details</label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Elder brother MS in USA working at Amazon; Younger sister B.Tech student"
                      value={formData.siblingDetails}
                      onChange={(e) => handleInputChange('siblingDetails', e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', fontFamily: 'inherit' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Family Background</label>
                    <textarea
                      rows={3}
                      placeholder="Paste complete family background paragraph from biodata..."
                      value={formData.familyBackground}
                      onChange={(e) => handleInputChange('familyBackground', e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', fontFamily: 'inherit' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Properties / Assets</label>
                    <textarea
                      rows={3}
                      placeholder="e.g. 2 Independent houses in Jubilee Hills, 5 acres agricultural land in Guntur"
                      value={formData.propertiesAssets}
                      onChange={(e) => handleInputChange('propertiesAssets', e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', fontFamily: 'inherit' }}
                    />
                  </div>
                </div>
              )}

              {/* SECTION 6: LOCATION */}
              {activeFormTab === 6 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Current City</label>
                      <input
                        type="text"
                        placeholder="e.g. Hyderabad"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>State</label>
                      <input
                        type="text"
                        placeholder="e.g. Telangana"
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Country</label>
                      <input
                        type="text"
                        placeholder="e.g. India"
                        value={formData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Native Place</label>
                      <input
                        type="text"
                        placeholder="e.g. Visakhapatnam"
                        value={formData.nativePlace}
                        onChange={(e) => handleInputChange('nativePlace', e.target.value)}
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Address</label>
                    <textarea
                      rows={3}
                      placeholder="Full residential address..."
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', fontFamily: 'inherit' }}
                    />
                  </div>
                </div>
              )}

              {/* SECTION 7: HOROSCOPE DETAILS */}
              {activeFormTab === 7 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Place of Birth</label>
                      <input
                        type="text"
                        placeholder="e.g. Hyderabad"
                        value={formData.placeOfBirth}
                        onChange={(e) => handleInputChange('placeOfBirth', e.target.value)}
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Time of Birth (Text / Picker)</label>
                      <input
                        type="text"
                        placeholder="e.g. 11:45 PM, 6 PM, 05:45 AM"
                        value={formData.timeOfBirth}
                        onChange={(e) => handleInputChange('timeOfBirth', e.target.value)}
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                      />
                      <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.2rem' }}>Allows text entry like "11:45 PM", "6 PM", "05:45 AM" directly from biodata.</div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Rashi</label>
                      <input
                        type="text"
                        placeholder="e.g. Kanya"
                        value={formData.rashi}
                        onChange={(e) => handleInputChange('rashi', e.target.value)}
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Nakshatra</label>
                      <input
                        type="text"
                        placeholder="e.g. Hasta"
                        value={formData.nakshatram}
                        onChange={(e) => handleInputChange('nakshatram', e.target.value)}
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Gothram</label>
                      <input
                        type="text"
                        placeholder="e.g. Kasyapa"
                        value={formData.gothram}
                        onChange={(e) => handleInputChange('gothram', e.target.value)}
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Horoscope Details / Notes</label>
                    <textarea
                      rows={4}
                      placeholder="Paste horoscope details, padmaka, dosham, or astro chart notes from biodata..."
                      value={formData.horoscopeNotes}
                      onChange={(e) => handleInputChange('horoscopeNotes', e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', fontFamily: 'inherit' }}
                    />
                  </div>
                </div>
              )}

              {/* SECTION 8: PARTNER PREFERENCES */}
              {activeFormTab === 8 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Preferred Age</label>
                      <input
                        type="text"
                        placeholder="e.g. 23 - 28 years"
                        value={formData.partnerExpectations?.preferredAge || ''}
                        onChange={(e) => handlePartnerExpectationsChange('preferredAge', e.target.value)}
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Preferred Height</label>
                      <input
                        type="text"
                        placeholder="e.g. 5'2&quot; to 5'8&quot;"
                        value={formData.partnerExpectations?.preferredHeight || ''}
                        onChange={(e) => handlePartnerExpectationsChange('preferredHeight', e.target.value)}
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Religion Preference</label>
                      <input
                        type="text"
                        placeholder="e.g. Hindu / Any"
                        value={formData.partnerExpectations?.religion || ''}
                        onChange={(e) => handlePartnerExpectationsChange('religion', e.target.value)}
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Caste Preference</label>
                      <input
                        type="text"
                        placeholder="e.g. Kamma / Open to All"
                        value={formData.partnerExpectations?.preferredCaste || ''}
                        onChange={(e) => handlePartnerExpectationsChange('preferredCaste', e.target.value)}
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Education Preference</label>
                      <input
                        type="text"
                        placeholder="e.g. B.Tech, MS, Graduate"
                        value={formData.partnerExpectations?.education || ''}
                        onChange={(e) => handlePartnerExpectationsChange('education', e.target.value)}
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Occupation Preference</label>
                      <input
                        type="text"
                        placeholder="e.g. Working Doctors / Software Professionals"
                        value={formData.partnerExpectations?.preferredOccupation || ''}
                        onChange={(e) => handlePartnerExpectationsChange('preferredOccupation', e.target.value)}
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Location Preference</label>
                      <input
                        type="text"
                        placeholder="e.g. Prefer Hyderabad / Bangalore"
                        value={formData.partnerExpectations?.location || ''}
                        onChange={(e) => handlePartnerExpectationsChange('location', e.target.value)}
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Other Expectations (Large Textarea)</label>
                    <textarea
                      rows={4}
                      placeholder={`e.g. Working doctors/software professionals. Prefer Hyderabad/Bangalore. No foreign matches.`}
                      value={formData.partnerExpectations?.otherExpectations || ''}
                      onChange={(e) => handlePartnerExpectationsChange('otherExpectations', e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', fontFamily: 'inherit' }}
                    />
                  </div>
                </div>
              )}

              {/* SECTION 9: ABOUT PROFILE */}
              {activeFormTab === 9 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>About Me (Large Textarea)</label>
                    <textarea
                      rows={5}
                      placeholder="Copy and paste entire paragraphs describing personality, background, and aspirations from biodata..."
                      value={formData.aboutMe}
                      onChange={(e) => handleInputChange('aboutMe', e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', fontFamily: 'inherit' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Additional Information (Large Textarea)</label>
                    <textarea
                      rows={4}
                      placeholder="Any extra information, notes, or raw biodata text received..."
                      value={formData.additionalInformation}
                      onChange={(e) => handleInputChange('additionalInformation', e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', fontFamily: 'inherit' }}
                    />
                  </div>
                </div>
              )}

              {/* SECTION 10: CONTACT INFORMATION (ADMIN ONLY) */}
              {activeFormTab === 10 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* ADMIN ONLY WARNING BANNER */}
                  <div style={{ backgroundColor: '#FEF2F2', border: '1.5px solid #FCA5A5', borderRadius: '10px', padding: '1rem 1.25rem', color: '#991B1B', display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                    <Lock size={22} style={{ flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: '800', fontSize: '0.9rem' }}>🔒 ADMIN ONLY PRIVACY STRICT GUARANTEE</div>
                      <div style={{ fontSize: '0.82rem', marginTop: '0.2rem' }}>
                        Phone numbers, email addresses, and full address entered here are <strong>ADMIN ONLY</strong>. Normal registered users will NEVER see these contact details on the matchmaking dashboard.
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Phone Number (Admin Only)</label>
                      <input
                        type="text"
                        placeholder="e.g. +91 9876543210"
                        value={formData.contactPhone}
                        onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Alternate Phone Number (Admin Only)</label>
                      <input
                        type="text"
                        placeholder="e.g. +91 9123456789 (Parent Phone)"
                        value={formData.contactAltPhone}
                        onChange={(e) => handleInputChange('contactAltPhone', e.target.value)}
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Email Address (Admin Only)</label>
                      <input
                        type="email"
                        placeholder="e.g. sravani.admin@example.com"
                        value={formData.contactEmail}
                        onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Address (Admin Only Large Textarea)</label>
                    <textarea
                      rows={3}
                      placeholder="Flat no, Street, Landmark, City, Pincode..."
                      value={formData.contactAddress}
                      onChange={(e) => handleInputChange('contactAddress', e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', fontFamily: 'inherit' }}
                    />
                  </div>
                </div>
              )}

              {/* SECTION 11: PROFILE PHOTOS */}
              {activeFormTab === 11 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* PHOTO POLICY BANNER */}
                  <div style={{ backgroundColor: '#FFFBEB', border: '1.5px solid #FDE68A', borderRadius: '10px', padding: '0.9rem 1.25rem', color: '#92400E', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <AlertTriangle size={20} style={{ flexShrink: 0 }} />
                    <div style={{ fontSize: '0.84rem' }}>
                      <strong>Photo Policy:</strong> DO NOT use Unsplash or any random/demo images. If no real photo exists, leave the photo empty.
                    </div>
                  </div>

                  {/* Upload Controls */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', backgroundColor: '#F8FAFC', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>[ Upload Primary / Additional Photo File ]</label>
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleFileUpload}
                        style={{ width: '100%', fontSize: '0.85rem' }}
                      />
                      <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.3rem' }}>Supports JPG, JPEG, PNG, WEBP files</div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Or Paste Image URL</label>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                          type="text"
                          placeholder="Paste photo image URL..."
                          value={newPhotoInput}
                          onChange={(e) => setNewPhotoInput(e.target.value)}
                          style={{ flex: 1, padding: '0.55rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
                        />
                        <button
                          type="button"
                          onClick={handleAddPhotoUrl}
                          style={{ backgroundColor: '#0B3B91', color: '#FFFFFF', border: 'none', padding: '0.55rem 1rem', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Uploaded Photos Gallery List */}
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#334155', marginBottom: '0.75rem' }}>
                      Profile Photo Preview ({formData.photos.length})
                    </h4>
                    {formData.photos.length === 0 ? (
                      <div style={{ border: '2px dashed #CBD5E1', borderRadius: '12px', padding: '2.5rem', textAlign: 'center', color: '#94A3B8' }}>
                        <Camera size={36} style={{ marginBottom: '0.5rem' }} />
                        <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#64748B' }}>No profile photo uploaded</div>
                        <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.2rem' }}>If no photo exists in biodata, leave photo empty.</div>
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
                        {formData.photos.map((photoUrl, idx) => (
                          <div key={idx} style={{ border: idx === 0 ? '2px solid #0B3B91' : '1px solid #E2E8F0', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#FFFFFF', position: 'relative' }}>
                            {idx === 0 && (
                              <span style={{ position: 'absolute', top: '6px', left: '6px', backgroundColor: '#0B3B91', color: '#FFFFFF', fontSize: '0.68rem', fontWeight: '800', padding: '0.2rem 0.4rem', borderRadius: '4px', zIndex: 2 }}>
                                PRIMARY
                              </span>
                            )}
                            <img src={photoUrl} alt={`Photo ${idx + 1}`} style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
                            <div style={{ padding: '0.4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
                              {idx !== 0 && (
                                <button
                                  type="button"
                                  onClick={() => handleSetPrimaryPhoto(idx)}
                                  title="Set as Primary"
                                  style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.7rem', color: '#0B3B91', fontWeight: '700' }}
                                >
                                  Set Primary
                                </button>
                              )}
                              <div style={{ display: 'flex', gap: '0.2rem', marginLeft: 'auto' }}>
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => handleMovePhoto(idx, -1)}
                                  style={{ border: 'none', background: 'none', cursor: idx === 0 ? 'default' : 'pointer', color: idx === 0 ? '#CBD5E1' : '#475569' }}
                                >
                                  <ArrowUp size={14} />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === formData.photos.length - 1}
                                  onClick={() => handleMovePhoto(idx, 1)}
                                  style={{ border: 'none', background: 'none', cursor: idx === formData.photos.length - 1 ? 'default' : 'pointer', color: idx === formData.photos.length - 1 ? '#CBD5E1' : '#475569' }}
                                >
                                  <ArrowDown size={14} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemovePhoto(idx)}
                                  style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#DC2626' }}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* MODAL FOOTER BUTTONS */}
            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', flexWrap: 'wrap', gap: '0.75rem' }}>
              {/* Tab Navigation Controls */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  disabled={activeFormTab === 1}
                  onClick={() => setActiveFormTab((t) => Math.max(1, t - 1))}
                  style={{ padding: '0.55rem 0.9rem', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', cursor: activeFormTab === 1 ? 'not-allowed' : 'pointer', fontSize: '0.85rem', fontWeight: '600' }}
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={activeFormTab === 11}
                  onClick={() => setActiveFormTab((t) => Math.min(11, t + 1))}
                  style={{ padding: '0.55rem 0.9rem', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', cursor: activeFormTab === 11 ? 'not-allowed' : 'pointer', fontSize: '0.85rem', fontWeight: '600' }}
                >
                  Next
                </button>
              </div>

              {/* ACTION FORM BUTTONS EXACT MATCH TO REQUEST */}
              <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  style={{ padding: '0.65rem 1.1rem', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#475569', fontWeight: '700', cursor: 'pointer' }}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={importing}
                  onClick={() => handleSaveProfile('Draft', false)}
                  style={{ padding: '0.65rem 1.1rem', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#475569', color: '#FFFFFF', fontWeight: '700', cursor: 'pointer' }}
                >
                  Save Draft
                </button>

                <button
                  type="button"
                  disabled={importing}
                  onClick={() => handleSaveProfile('Draft', true)}
                  style={{ padding: '0.65rem 1.1rem', borderRadius: '8px', border: '1.5px solid #0B3B91', backgroundColor: '#EFF6FF', color: '#0B3B91', fontWeight: '700', cursor: 'pointer' }}
                >
                  Save & Continue
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPreviewProfile(formData);
                    setShowPreviewModal(true);
                  }}
                  style={{ padding: '0.65rem 1.1rem', borderRadius: '8px', border: '1.5px solid #D4A017', backgroundColor: '#FFFBEB', color: '#92400E', fontWeight: '700', cursor: 'pointer' }}
                >
                  Preview Profile
                </button>

                <button
                  type="button"
                  disabled={importing}
                  onClick={() => handleSaveProfile('Pending Review', false)}
                  style={{ padding: '0.65rem 1.25rem', borderRadius: '8px', border: 'none', backgroundColor: '#0B3B91', color: '#FFFFFF', fontWeight: '800', cursor: 'pointer', boxShadow: '0 4px 12px rgba(11, 59, 145, 0.25)' }}
                >
                  Submit for Verification
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PREVIEW PROFILE MODAL */}
      {/* ========================================================================= */}
      {showPreviewModal && previewProfile && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)', zIndex: 1010, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', width: '100%', maxWidth: '750px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)' }}>
            
            {/* PREVIEW HEADER */}
            <div style={{ position: 'relative', height: '180px', background: 'linear-gradient(135deg, #0F172A 0%, #0B3B91 100%)', padding: '1.5rem', color: '#FFFFFF', display: 'flex', alignItems: 'flex-end' }}>
              <button
                onClick={() => setShowPreviewModal(false)}
                style={{ position: 'absolute', top: '16px', right: '16px', backgroundColor: 'rgba(255, 255, 255, 0.2)', border: 'none', color: '#FFFFFF', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', transform: 'translateY(35px)' }}>
                <div
                  style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: '50%',
                    border: '4px solid #FFFFFF',
                    backgroundColor: '#CBD5E1',
                    backgroundImage: previewProfile.photos && previewProfile.photos[0] ? `url(${previewProfile.photos[0]})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    fontWeight: '800',
                    color: '#0F172A',
                  }}
                >
                  {!previewProfile.photos || !previewProfile.photos[0] ? (previewProfile.fullName ? previewProfile.fullName[0].toUpperCase() : 'P') : null}
                </div>

                <div style={{ marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#FFFFFF', margin: 0 }}>
                    {previewProfile.fullName || 'Bride / Groom Name'}
                  </h3>
                  <div style={{ fontSize: '0.88rem', color: '#F1F5F9', marginTop: '0.2rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <span>{previewProfile.customId || 'SSM-PREVIEW'}</span>
                    <span>•</span>
                    <span>{(previewProfile.gender || '').toLowerCase().includes('bride') || (previewProfile.gender || '').toLowerCase() === 'female' ? 'Bride' : 'Groom'}</span>
                    <span>•</span>
                    <span>{previewProfile.age ? `${previewProfile.age} yrs` : 'Age N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* PREVIEW CONTENT */}
            <div style={{ padding: '3.5rem 1.75rem 2rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Privacy Notice */}
              <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '10px', padding: '0.75rem 1rem', fontSize: '0.82rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={16} />
                <span>Verified User View: Phone numbers, emails, and address are hidden from normal users.</span>
              </div>

              {/* Basic Quick Specs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', backgroundColor: '#F8FAFC', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>Religion / Caste</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#0F172A', marginTop: '0.2rem' }}>
                    {previewProfile.religion || 'N/A'} {previewProfile.caste ? `, ${previewProfile.caste}` : ''}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>Location</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#0F172A', marginTop: '0.2rem' }}>
                    {previewProfile.city ? `${previewProfile.city}, ${previewProfile.state || ''}` : 'Location N/A'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>Education</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#0F172A', marginTop: '0.2rem' }}>
                    {previewProfile.highestEducation || 'N/A'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>Occupation / Income</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#0F172A', marginTop: '0.2rem' }}>
                    {previewProfile.occupation || 'N/A'} {previewProfile.annualIncome ? `(${previewProfile.annualIncome})` : ''}
                  </div>
                </div>
              </div>

              {/* About Myself */}
              {previewProfile.aboutMe && (
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0F172A', marginBottom: '0.5rem' }}>About Profile</h4>
                  <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: '1.6', margin: 0, whiteSpace: 'pre-line' }}>{previewProfile.aboutMe}</p>
                </div>
              )}

              {/* Family Background */}
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0F172A', marginBottom: '0.5rem' }}>Family Details</h4>
                <div style={{ fontSize: '0.88rem', color: '#475569', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div>Father: {previewProfile.fatherName || 'N/A'} ({previewProfile.fatherOccupation || 'N/A'})</div>
                  <div>Mother: {previewProfile.motherName || 'N/A'} ({previewProfile.motherOccupation || 'N/A'})</div>
                  <div>Siblings: {previewProfile.siblings || 'N/A'}</div>
                  <div>Native Place: {previewProfile.nativePlace || 'N/A'}</div>
                </div>
              </div>

              {/* Partner Expectations */}
              {previewProfile.partnerExpectations && (
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0F172A', marginBottom: '0.5rem' }}>Partner Expectations</h4>
                  <div style={{ fontSize: '0.88rem', color: '#475569', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <div>Age Preference: {previewProfile.partnerExpectations.preferredAge || 'Any'}</div>
                    <div>Caste Preference: {previewProfile.partnerExpectations.preferredCaste || 'Any'}</div>
                    <div>Education: {previewProfile.partnerExpectations.education || 'Any'}</div>
                    <div>Location: {previewProfile.partnerExpectations.location || 'Any'}</div>
                  </div>
                  {previewProfile.partnerExpectations.otherExpectations && (
                    <div style={{ fontSize: '0.88rem', color: '#475569', marginTop: '0.5rem', whiteSpace: 'pre-line' }}>
                      <strong>Other Expectations:</strong> {previewProfile.partnerExpectations.otherExpectations}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* PREVIEW FOOTER */}
            <div style={{ padding: '1rem 1.75rem', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end', backgroundColor: '#F8FAFC' }}>
              <button
                onClick={() => setShowPreviewModal(false)}
                style={{ backgroundColor: '#0B3B91', color: '#FFFFFF', border: 'none', padding: '0.65rem 1.5rem', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
              >
                Close Preview
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BULK EXCEL / CSV IMPORT MODAL */}
      {/* ========================================================================= */}
      {showExcelModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)', zIndex: 1005, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', width: '100%', maxWidth: '650px', padding: '1.75rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>📥 Import Excel / CSV Profiles</span>
              </h2>
              <button onClick={() => setShowExcelModal(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: '1.25rem' }}>
              Upload a bulk CSV file containing bride and groom profile information. Download our sample template to see the required column formatting.
            </p>

            {/* Template Download */}
            <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '10px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#1E40AF' }}>SS Matrimony Bulk Import Template</div>
                <div style={{ fontSize: '0.78rem', color: '#3B82F6' }}>CSV format with pre-configured profile fields</div>
              </div>
              <button
                onClick={handleDownloadSampleCSV}
                style={{ backgroundColor: '#FFFFFF', color: '#1E40AF', border: '1px solid #93C5FD', padding: '0.45rem 0.85rem', borderRadius: '6px', fontWeight: '700', fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
              >
                <Download size={14} /> Download Sample
              </button>
            </div>

            {/* File Upload Box */}
            <div style={{ border: '2px dashed #CBD5E1', borderRadius: '12px', padding: '2rem', textAlign: 'center', backgroundColor: '#F8FAFC', marginBottom: '1.25rem' }}>
              <FileSpreadsheet size={40} color="#0B3B91" style={{ marginBottom: '0.75rem' }} />
              <div style={{ fontWeight: '700', fontSize: '0.92rem', color: '#0F172A' }}>Select CSV File to Import</div>
              <input
                type="file"
                accept=".csv"
                onChange={handleCSVFileSelect}
                style={{ marginTop: '0.75rem', fontSize: '0.85rem' }}
              />
            </div>

            {excelFileRecords.length > 0 && (
              <div style={{ backgroundColor: '#F1F5F9', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem', color: '#334155', fontWeight: '600', marginBottom: '1.25rem' }}>
                ✅ Ready to import {excelFileRecords.length} record(s) from file.
              </div>
            )}

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                onClick={() => setShowExcelModal(false)}
                style={{ padding: '0.65rem 1.1rem', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', fontWeight: '700', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                disabled={!excelFileRecords.length || importing}
                onClick={handleExecuteBulkImport}
                style={{ padding: '0.65rem 1.3rem', borderRadius: '8px', border: 'none', backgroundColor: excelFileRecords.length ? '#0B3B91' : '#94A3B8', color: '#FFFFFF', fontWeight: '800', cursor: excelFileRecords.length ? 'pointer' : 'not-allowed' }}
              >
                {importing ? 'Importing...' : 'Execute Import'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {showDeleteModal && profileToDelete && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.7)', zIndex: 1020, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', width: '100%', maxWidth: '450px', padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
              <Trash2 size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>Delete Imported Profile?</h3>
            <p style={{ fontSize: '0.88rem', color: '#64748B', marginTop: '0.5rem' }}>
              Are you sure you want to permanently delete profile <strong>{profileToDelete.fullName}</strong> ({profileToDelete.customId})? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '1.5rem' }}>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={{ padding: '0.66rem 1.2rem', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', fontWeight: '700', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProfile}
                style={{ padding: '0.66rem 1.2rem', borderRadius: '8px', border: 'none', backgroundColor: '#DC2626', color: '#FFFFFF', fontWeight: '800', cursor: 'pointer' }}
              >
                Delete Profile
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
