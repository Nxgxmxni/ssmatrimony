import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import Toast from '../../components/Toast';
import {
  Globe,
  Layout,
  Info,
  Briefcase,
  Image as ImageIcon,
  BarChart2,
  MessageSquare,
  HelpCircle,
  PhoneCall,
  FileText,
  Search,
  CheckCircle,
  Save,
  RotateCcw,
  Eye,
  Clock,
  Sparkles,
  Layers,
  PlusCircle,
  Trash2,
  Edit,
  ShieldCheck,
  Award,
} from 'lucide-react';

export default function WebsiteCMSPage() {
  const [stats, setStats] = useState({
    websiteStatus: 'Live',
    activeBanners: 1,
    activeTestimonials: 1,
    publishedStories: 0,
    totalCmsSections: 10,
    lastUpdated: new Date(),
  });

  const [activeTab, setActiveTab] = useState('homePage');
  const [sectionData, setSectionData] = useState({});
  const [sectionStatus, setSectionStatus] = useState('Published');
  const [currentVersion, setCurrentVersion] = useState(1);
  const [versionHistory, setVersionHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [toastMsg, setToastMsg] = useState({ type: '', text: '' });

  const tabs = [
    { id: 'homePage', label: '1. Home Page', icon: Layout },
    { id: 'aboutUs', label: '2. About Us', icon: Info },
    { id: 'services', label: '3. Services', icon: Briefcase },
    { id: 'heroBanners', label: '4. Hero Banner', icon: ImageIcon },
    { id: 'statistics', label: '5. Statistics', icon: BarChart2 },
    { id: 'testimonials', label: '6. Testimonials', icon: MessageSquare },
    { id: 'faq', label: '7. FAQ', icon: HelpCircle },
    { id: 'contactInfo', label: '8. Contact Info', icon: PhoneCall },
    { id: 'footer', label: '9. Footer', icon: FileText },
    { id: 'seoSettings', label: '10. SEO Settings', icon: Search },
  ];

  const fetchCmsStats = async () => {
    try {
      const res = await adminAPI.getCmsStats();
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching CMS stats:', err);
    }
  };

  const fetchSectionData = async (sectionKey) => {
    try {
      setLoading(true);
      const res = await adminAPI.getAdminCmsSection(sectionKey);
      setSectionData(res.data.data || {});
      setSectionStatus(res.data.status || 'Published');
      setCurrentVersion(res.data.version || 1);
      setVersionHistory(res.data.history || []);
    } catch (err) {
      console.error(`Error loading section ${sectionKey}:`, err);
      setToastMsg({ type: 'error', text: `Failed to load CMS section ${sectionKey}.` });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCmsStats();
    fetchSectionData(activeTab);
  }, [activeTab]);

  const handleSave = async (statusToSet = 'Published') => {
    try {
      setSaving(true);
      await adminAPI.updateCmsSection(activeTab, {
        data: sectionData,
        status: statusToSet,
      });

      setToastMsg({
        type: 'success',
        text: `CMS Section "${activeTab}" saved and ${statusToSet.toLowerCase()} successfully!`,
      });

      fetchCmsStats();
      fetchSectionData(activeTab);
    } catch (err) {
      console.error('Error saving CMS section:', err);
      setToastMsg({ type: 'error', text: 'Failed to save CMS section.' });
    } finally {
      setSaving(false);
    }
  };

  const handleRollback = async (version) => {
    try {
      setSaving(true);
      await adminAPI.rollbackCmsSection(activeTab, version);
      setToastMsg({
        type: 'success',
        text: `Restored version ${version} for "${activeTab}".`,
      });
      fetchSectionData(activeTab);
    } catch (err) {
      console.error('Error performing rollback:', err);
      setToastMsg({ type: 'error', text: 'Failed to rollback CMS version.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: '1.5rem 2rem', fontFamily: 'Inter, sans-serif' }}>
      <Toast type={toastMsg.type} message={toastMsg.text} onClose={() => setToastMsg({ type: '', text: '' })} />

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Globe color="#0B3B91" size={28} /> Website CMS Module
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Control public website text, banners, services, FAQs, and SEO settings directly in MongoDB.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => setShowPreviewModal(true)}
            style={{
              backgroundColor: '#FFFFFF',
              color: '#0B3B91',
              fontWeight: '700',
              fontSize: '0.875rem',
              padding: '0.7rem 1.25rem',
              borderRadius: '10px',
              border: '1.5px solid #0B3B91',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Eye size={16} /> Live Preview
          </button>

          <button
            onClick={() => handleSave('Published')}
            disabled={saving}
            style={{
              backgroundColor: '#0B3B91',
              color: '#FFFFFF',
              fontWeight: '700',
              fontSize: '0.875rem',
              padding: '0.7rem 1.4rem',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 14px rgba(11, 59, 145, 0.2)',
            }}
          >
            <Save size={16} /> {saving ? 'Publishing...' : 'Publish Changes'}
          </button>
        </div>
      </div>

      {/* 1. CMS DASHBOARD STAT CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>
            <span>Website Status</span>
            <CheckCircle size={18} color="#16A34A" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#16A34A', marginTop: '0.5rem' }}>
            {stats.websiteStatus || 'Live'}
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>
            <span>Active Banners</span>
            <ImageIcon size={18} color="#0B3B91" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0F172A', marginTop: '0.5rem' }}>
            {stats.activeBanners || 1}
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>
            <span>Testimonials</span>
            <MessageSquare size={18} color="#EA580C" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0F172A', marginTop: '0.5rem' }}>
            {stats.activeTestimonials || 1}
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>
            <span>Success Stories</span>
            <Sparkles size={18} color="#D4AF37" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0F172A', marginTop: '0.5rem' }}>
            {stats.publishedStories || 0}
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>
            <span>CMS Sections</span>
            <Layers size={18} color="#2563EB" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0F172A', marginTop: '0.5rem' }}>
            {stats.totalCmsSections || 10}
          </div>
        </div>
      </div>

      {/* MAIN LAYOUT: LEFT SIDEBAR TABS + RIGHT EDITOR PANEL */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* LEFT MENU TABS */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <div style={{ padding: '0.5rem 0.75rem', fontSize: '0.75rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            CMS Sections
          </div>
          {tabs.map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: isActive ? '#0B3B91' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#334155',
                  fontWeight: isActive ? '700' : '600',
                  fontSize: '0.875rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <IconComp size={18} color={isActive ? '#FFFFFF' : '#64748B'} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* RIGHT EDITOR FORM PANEL */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '2rem', boxShadow: '0 4px 14px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0F172A', textTransform: 'capitalize' }}>
                Editing {activeTab.replace(/([A-Z])/g, ' $1')} Section
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '0.2rem' }}>
                Version: <strong>v{currentVersion}</strong> | Status: <span style={{ color: '#16A34A', fontWeight: '700' }}>{sectionStatus}</span>
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => handleSave('Draft')}
                style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#F8FAFC', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer' }}
              >
                Save Draft
              </button>
            </div>
          </div>

          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
              Loading CMS section data from MongoDB...
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* SECTION SPECIFIC FORM FIELDS */}
              {activeTab === 'homePage' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.3rem' }}>Website Title</label>
                    <input
                      type="text"
                      value={sectionData.websiteTitle || ''}
                      onChange={(e) => setSectionData({ ...sectionData, websiteTitle: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.3rem' }}>Main Headline</label>
                    <input
                      type="text"
                      value={sectionData.mainHeading || ''}
                      onChange={(e) => setSectionData({ ...sectionData, mainHeading: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.3rem' }}>Sub Heading</label>
                    <input
                      type="text"
                      value={sectionData.subHeading || ''}
                      onChange={(e) => setSectionData({ ...sectionData, subHeading: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.3rem' }}>Hero Description</label>
                    <textarea
                      rows="3"
                      value={sectionData.heroDescription || ''}
                      onChange={(e) => setSectionData({ ...sectionData, heroDescription: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.3rem' }}>Hero Button Text</label>
                      <input
                        type="text"
                        value={sectionData.heroButtonText || ''}
                        onChange={(e) => setSectionData({ ...sectionData, heroButtonText: e.target.value })}
                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.3rem' }}>Hero Button Link</label>
                      <input
                        type="text"
                        value={sectionData.heroButtonLink || ''}
                        onChange={(e) => setSectionData({ ...sectionData, heroButtonLink: e.target.value })}
                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                      />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'aboutUs' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.3rem' }}>About Section Heading</label>
                    <input
                      type="text"
                      value={sectionData.heading || ''}
                      onChange={(e) => setSectionData({ ...sectionData, heading: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.3rem' }}>Full Description</label>
                    <textarea
                      rows="4"
                      value={sectionData.description || ''}
                      onChange={(e) => setSectionData({ ...sectionData, description: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.3rem' }}>Mission Statement</label>
                      <textarea
                        rows="3"
                        value={sectionData.mission || ''}
                        onChange={(e) => setSectionData({ ...sectionData, mission: e.target.value })}
                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.3rem' }}>Vision Statement</label>
                      <textarea
                        rows="3"
                        value={sectionData.vision || ''}
                        onChange={(e) => setSectionData({ ...sectionData, vision: e.target.value })}
                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                      />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'statistics' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.3rem' }}>Happy Marriages Count</label>
                    <input
                      type="number"
                      value={sectionData.happyMarriages || 12500}
                      onChange={(e) => setSectionData({ ...sectionData, happyMarriages: parseInt(e.target.value, 10) || 0 })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.3rem' }}>Verified Profiles Count</label>
                    <input
                      type="number"
                      value={sectionData.verifiedProfiles || 97000}
                      onChange={(e) => setSectionData({ ...sectionData, verifiedProfiles: parseInt(e.target.value, 10) || 0 })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.3rem' }}>Years of Service</label>
                    <input
                      type="number"
                      value={sectionData.yearsOfService || 12}
                      onChange={(e) => setSectionData({ ...sectionData, yearsOfService: parseInt(e.target.value, 10) || 0 })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'contactInfo' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.3rem' }}>Company Name</label>
                    <input
                      type="text"
                      value={sectionData.companyName || ''}
                      onChange={(e) => setSectionData({ ...sectionData, companyName: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.3rem' }}>Office Address</label>
                    <input
                      type="text"
                      value={sectionData.address || ''}
                      onChange={(e) => setSectionData({ ...sectionData, address: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.3rem' }}>Support Phone</label>
                      <input
                        type="text"
                        value={sectionData.phone || ''}
                        onChange={(e) => setSectionData({ ...sectionData, phone: e.target.value })}
                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.3rem' }}>Support Email</label>
                      <input
                        type="email"
                        value={sectionData.email || ''}
                        onChange={(e) => setSectionData({ ...sectionData, email: e.target.value })}
                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                      />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'seoSettings' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.3rem' }}>Homepage Title (SEO)</label>
                    <input
                      type="text"
                      value={sectionData.homepageTitle || ''}
                      onChange={(e) => setSectionData({ ...sectionData, homepageTitle: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.3rem' }}>Meta Description</label>
                    <textarea
                      rows="3"
                      value={sectionData.metaDescription || ''}
                      onChange={(e) => setSectionData({ ...sectionData, metaDescription: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.3rem' }}>Meta Keywords</label>
                    <input
                      type="text"
                      value={sectionData.metaKeywords || ''}
                      onChange={(e) => setSectionData({ ...sectionData, metaKeywords: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                    />
                  </div>
                </>
              )}

              {/* RAW JSON OVERRIDE EDITOR FOR ADVANCED LIST SECTIONS */}
              {['services', 'heroBanners', 'testimonials', 'faq', 'footer'].includes(activeTab) && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.3rem' }}>
                    Section Items Configuration (JSON Data)
                  </label>
                  <textarea
                    rows="10"
                    value={typeof sectionData === 'string' ? sectionData : JSON.stringify(sectionData, null, 2)}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        setSectionData(parsed);
                      } catch (err) {
                        setSectionData(e.target.value);
                      }
                    }}
                    style={{ width: '100%', fontFamily: 'monospace', fontSize: '0.85rem', padding: '0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#F8FAFC' }}
                  />
                </div>
              )}

              {/* VERSION HISTORY & ROLLBACK */}
              {versionHistory.length > 0 && (
                <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #E2E8F0' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0F172A', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Clock size={16} /> Version History &amp; Restore
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {versionHistory.map((h) => (
                      <div key={h._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 1rem', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '0.8rem' }}>
                        <div>
                          <strong>Version v{h.version}</strong> • Saved by {h.updatedBy || 'Admin'} on {new Date(h.createdAt).toLocaleString()}
                        </div>
                        <button
                          onClick={() => handleRollback(h.version)}
                          style={{ border: '1px solid #0B3B91', color: '#0B3B91', background: '#FFFFFF', padding: '0.3rem 0.75rem', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                        >
                          <RotateCcw size={13} /> Restore v{h.version}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
