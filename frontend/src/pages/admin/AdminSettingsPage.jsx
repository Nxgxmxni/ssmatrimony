import React, { useState, useEffect, useCallback, useRef } from 'react';
import { adminAPI } from '../../services/api';
import Toast from '../../components/Toast';
import {
  Settings, Globe, Home, CreditCard, UserPlus, User, Bell, Wallet,
  Search as SearchIcon, Shield, Database, Mail, Palette, Monitor,
  Save, RotateCcw, ChevronRight, AlertTriangle, Check, X, Plus, Trash2,
  Eye, EyeOff, Server, HardDrive, Clock, Cpu, Info,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════
   TAB DEFINITIONS
   ═══════════════════════════════════════════════════ */
const TABS = [
  { key: 'general', label: 'General', icon: Globe },
  { key: 'homepage', label: 'Homepage', icon: Home },
  { key: 'membership', label: 'Membership', icon: CreditCard },
  { key: 'registration', label: 'Registration', icon: UserPlus },
  { key: 'profile', label: 'Profile', icon: User },
  { key: 'notification', label: 'Notifications', icon: Bell },
  { key: 'payment', label: 'Payment', icon: Wallet },
  { key: 'seo', label: 'SEO', icon: SearchIcon },
  { key: 'security', label: 'Security', icon: Shield },
  { key: 'backup', label: 'Backup', icon: Database },
  { key: 'emailTemplates', label: 'Email Templates', icon: Mail },
  { key: 'theme', label: 'Theme', icon: Palette },
  { key: 'system', label: 'System Info', icon: Monitor },
];

/* ═══════════════════════════════════════════════════
   REUSABLE FORM COMPONENTS
   ═══════════════════════════════════════════════════ */
const inputStyle = {
  width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px',
  border: '1px solid #CBD5E1', fontSize: '0.85rem', fontFamily: 'Inter, sans-serif',
  color: '#1E293B', backgroundColor: '#F8FAFC', outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s', boxSizing: 'border-box',
};

const labelStyle = {
  display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#334155',
  marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.3px',
};

const FormField = ({ label, children, hint }) => (
  <div style={{ marginBottom: '1.1rem' }}>
    <label style={labelStyle}>{label}</label>
    {children}
    {hint && <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '0.25rem' }}>{hint}</div>}
  </div>
);

const TextInput = ({ label, value, onChange, placeholder, hint, type = 'text' }) => (
  <FormField label={label} hint={hint}>
    <input
      type={type} value={value || ''} onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || ''} style={inputStyle}
      onFocus={e => { e.target.style.borderColor = '#0B3B91'; e.target.style.boxShadow = '0 0 0 3px rgba(11,59,145,0.08)'; }}
      onBlur={e => { e.target.style.borderColor = '#CBD5E1'; e.target.style.boxShadow = 'none'; }}
    />
  </FormField>
);

const TextArea = ({ label, value, onChange, placeholder, hint, rows = 4 }) => (
  <FormField label={label} hint={hint}>
    <textarea
      value={value || ''} onChange={(e) => onChange(e.target.value)} rows={rows}
      placeholder={placeholder || ''} style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }}
      onFocus={e => { e.target.style.borderColor = '#0B3B91'; e.target.style.boxShadow = '0 0 0 3px rgba(11,59,145,0.08)'; }}
      onBlur={e => { e.target.style.borderColor = '#CBD5E1'; e.target.style.boxShadow = 'none'; }}
    />
  </FormField>
);

const SelectInput = ({ label, value, onChange, options, hint }) => (
  <FormField label={label} hint={hint}>
    <select value={value || ''} onChange={(e) => onChange(e.target.value)}
      style={{ ...inputStyle, cursor: 'pointer' }}>
      {options.map((o) => (
        <option key={typeof o === 'string' ? o : o.value} value={typeof o === 'string' ? o : o.value}>
          {typeof o === 'string' ? o : o.label}
        </option>
      ))}
    </select>
  </FormField>
);

const ToggleSwitch = ({ label, checked, onChange, hint }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.7rem 0', borderBottom: '1px solid #F1F5F9' }}>
    <div>
      <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1E293B' }}>{label}</div>
      {hint && <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: 2 }}>{hint}</div>}
    </div>
    <div onClick={() => onChange(!checked)} style={{
      width: 44, height: 24, borderRadius: 12, cursor: 'pointer', position: 'relative',
      backgroundColor: checked ? '#0B3B91' : '#CBD5E1', transition: 'background-color 0.25s',
    }}>
      <div style={{
        width: 18, height: 18, borderRadius: '50%', backgroundColor: '#FFF',
        position: 'absolute', top: 3, left: checked ? 23 : 3,
        transition: 'left 0.25s', boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
      }} />
    </div>
  </div>
);

const NumberInput = ({ label, value, onChange, hint, min, max }) => (
  <FormField label={label} hint={hint}>
    <input
      type="number" value={value ?? ''} onChange={(e) => onChange(Number(e.target.value))}
      min={min} max={max} style={{ ...inputStyle, width: 120 }}
      onFocus={e => { e.target.style.borderColor = '#0B3B91'; }}
      onBlur={e => { e.target.style.borderColor = '#CBD5E1'; }}
    />
  </FormField>
);

const SectionTitle = ({ children }) => (
  <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#0F172A', margin: '1.5rem 0 0.75rem', paddingBottom: '0.5rem', borderBottom: '2px solid #E2E8F0' }}>
    {children}
  </h3>
);

const CardContainer = ({ children }) => (
  <div style={{
    backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0',
    padding: '1.5rem 1.75rem', boxShadow: '0 4px 14px rgba(0,0,0,0.02)',
  }}>
    {children}
  </div>
);

const Grid2 = ({ children }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0 1.5rem' }}>
    {children}
  </div>
);

/* ═══════════════════════════════════════════════════
   MAIN SETTINGS PAGE
   ═══════════════════════════════════════════════════ */
export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [allSettings, setAllSettings] = useState({});
  const [originalSettings, setOriginalSettings] = useState({});
  const [systemInfo, setSystemInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState({ type: '', text: '' });
  const [tabSearch, setTabSearch] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [showConfirm, setShowConfirm] = useState(null); // 'reset' | null

  // Fetch all settings on mount
  const fetchAllSettings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getAllSettings();
      setAllSettings(res.data || {});
      setOriginalSettings(JSON.parse(JSON.stringify(res.data || {})));
    } catch (err) {
      console.error('Failed to load settings:', err);
      setToastMsg({ type: 'error', text: 'Failed to load settings from database.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAllSettings(); }, [fetchAllSettings]);

  // Track unsaved changes
  useEffect(() => {
    if (activeTab === 'system') { setHasChanges(false); return; }
    const current = JSON.stringify(allSettings[activeTab] || {});
    const original = JSON.stringify(originalSettings[activeTab] || {});
    setHasChanges(current !== original);
  }, [allSettings, originalSettings, activeTab]);

  // Warn before tab switch with unsaved changes
  const switchTab = (key) => {
    if (hasChanges) {
      if (!window.confirm('You have unsaved changes. Discard and switch tab?')) return;
      // Revert current tab
      setAllSettings(prev => ({ ...prev, [activeTab]: JSON.parse(JSON.stringify(originalSettings[activeTab] || {})) }));
    }
    setActiveTab(key);
  };

  // Update a field
  const updateField = (path, value) => {
    setAllSettings(prev => {
      const next = { ...prev };
      const tabData = { ...(next[activeTab] || {}) };
      const parts = path.split('.');
      let obj = tabData;
      for (let i = 0; i < parts.length - 1; i++) {
        obj[parts[i]] = { ...(obj[parts[i]] || {}) };
        obj = obj[parts[i]];
      }
      obj[parts[parts.length - 1]] = value;
      next[activeTab] = tabData;
      return next;
    });
  };

  const val = (path) => {
    const parts = path.split('.');
    let obj = allSettings[activeTab] || {};
    for (const p of parts) {
      if (obj == null) return '';
      obj = obj[p];
    }
    return obj;
  };

  // Save
  const handleSave = async () => {
    try {
      setSaving(true);
      await adminAPI.saveSettings(activeTab, allSettings[activeTab]);
      setOriginalSettings(prev => ({ ...prev, [activeTab]: JSON.parse(JSON.stringify(allSettings[activeTab])) }));
      setToastMsg({ type: 'success', text: `${TABS.find(t => t.key === activeTab)?.label || activeTab} settings saved successfully!` });
    } catch (err) {
      console.error('Save error:', err);
      setToastMsg({ type: 'error', text: 'Failed to save settings.' });
    } finally {
      setSaving(false);
    }
  };

  // Reset
  const handleReset = async () => {
    try {
      setSaving(true);
      const res = await adminAPI.resetSettings(activeTab);
      const defaults = res.data?.data || {};
      setAllSettings(prev => ({ ...prev, [activeTab]: defaults }));
      setOriginalSettings(prev => ({ ...prev, [activeTab]: JSON.parse(JSON.stringify(defaults)) }));
      setToastMsg({ type: 'success', text: `${TABS.find(t => t.key === activeTab)?.label} settings reset to defaults.` });
    } catch (err) {
      setToastMsg({ type: 'error', text: 'Failed to reset settings.' });
    } finally {
      setSaving(false);
      setShowConfirm(null);
    }
  };

  // Fetch system info when that tab opens
  useEffect(() => {
    if (activeTab === 'system' && !systemInfo) {
      adminAPI.getSystemInfo().then(r => setSystemInfo(r.data)).catch(() => {});
    }
  }, [activeTab]);

  // Filtered tabs
  const filteredTabs = TABS.filter(t => t.label.toLowerCase().includes(tabSearch.toLowerCase()));

  /* ═══════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════ */
  return (
    <div style={{ padding: '1.5rem 2rem', fontFamily: 'Inter, sans-serif', maxWidth: 1400, margin: '0 auto' }}>
      <Toast type={toastMsg.type} message={toastMsg.text} onClose={() => setToastMsg({ type: '', text: '' })} />

      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.6rem', margin: 0 }}>
          <Settings color="#0B3B91" size={26} /> Admin Settings
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.85rem', margin: 0, marginTop: 4 }}>
          Configure your website, features, security, and integrations. All settings are stored in MongoDB.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
        {/* ── LEFT SIDEBAR TABS ── */}
        <div style={{
          width: 220, flexShrink: 0, backgroundColor: '#FFFFFF', borderRadius: '20px',
          border: '1px solid #E2E8F0', padding: '1rem 0.75rem', boxShadow: '0 4px 14px rgba(0,0,0,0.02)',
          position: 'sticky', top: '1rem',
        }}>
          <div style={{ padding: '0 0.25rem 0.75rem', borderBottom: '1px solid #F1F5F9', marginBottom: '0.5rem' }}>
            <div style={{ position: 'relative' }}>
              <SearchIcon size={14} style={{ position: 'absolute', left: 10, top: 10, color: '#94A3B8' }} />
              <input
                value={tabSearch} onChange={(e) => setTabSearch(e.target.value)}
                placeholder="Search settings..."
                style={{ ...inputStyle, paddingLeft: '2rem', fontSize: '0.78rem', padding: '0.5rem 0.5rem 0.5rem 2rem' }}
              />
            </div>
          </div>
          {filteredTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button key={tab.key} onClick={() => switchTab(tab.key)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '0.6rem',
                  padding: '0.6rem 0.75rem', borderRadius: '10px', border: 'none',
                  backgroundColor: isActive ? '#0B3B91' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#475569',
                  fontWeight: isActive ? '700' : '600', fontSize: '0.82rem',
                  cursor: 'pointer', marginBottom: '0.15rem',
                  transition: 'all 0.15s', textAlign: 'left', fontFamily: 'Inter, sans-serif',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = '#F1F5F9'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <Icon size={16} /> {tab.label}
                {isActive && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
              </button>
            );
          })}
        </div>

        {/* ── MAIN CONTENT ── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {loading ? (
            <CardContainer>
              <div style={{ textAlign: 'center', padding: '4rem 0', color: '#94A3B8' }}>
                <div style={{ width: 40, height: 40, border: '4px solid #E2E8F0', borderTopColor: '#0B3B91', borderRadius: '50%', margin: '0 auto 1rem', animation: 'spin 0.8s linear infinite' }} />
                Loading settings from database...
              </div>
            </CardContainer>
          ) : (
            <>
              {/* ── Unsaved Changes Banner ── */}
              {hasChanges && (
                <div style={{
                  background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)', border: '1px solid #FCD34D',
                  padding: '0.7rem 1rem', borderRadius: '12px', marginBottom: '1rem',
                  display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', fontWeight: '700', color: '#92400E',
                }}>
                  <AlertTriangle size={16} /> You have unsaved changes in this section.
                </div>
              )}

              <CardContainer>
                {/* Tab Content Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '2px solid #F1F5F9' }}>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {(() => { const T = TABS.find(t => t.key === activeTab); return T ? <><T.icon size={20} color="#0B3B91" /> {T.label} Settings</> : 'Settings'; })()}
                  </h2>
                  {activeTab !== 'system' && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => setShowConfirm('reset')}
                        style={{
                          padding: '0.5rem 1rem', borderRadius: '10px', border: '1px solid #CBD5E1',
                          backgroundColor: '#FFF', color: '#64748B', fontWeight: '700', fontSize: '0.8rem',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', fontFamily: 'Inter',
                        }}>
                        <RotateCcw size={14} /> Reset Defaults
                      </button>
                      <button onClick={handleSave} disabled={saving || !hasChanges}
                        style={{
                          padding: '0.5rem 1.2rem', borderRadius: '10px', border: 'none',
                          background: hasChanges ? 'linear-gradient(135deg, #0B3B91, #1E40AF)' : '#CBD5E1',
                          color: '#FFF', fontWeight: '700', fontSize: '0.8rem',
                          cursor: hasChanges ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: '0.35rem',
                          boxShadow: hasChanges ? '0 4px 14px rgba(11,59,145,0.2)' : 'none', fontFamily: 'Inter',
                        }}>
                        <Save size={14} /> {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  )}
                </div>

                {/* ═══════ TAB CONTENT RENDERERS ═══════ */}

                {activeTab === 'general' && (
                  <div>
                    <Grid2>
                      <TextInput label="Website Name" value={val('websiteName')} onChange={v => updateField('websiteName', v)} />
                      <TextInput label="Website Tagline" value={val('websiteTagline')} onChange={v => updateField('websiteTagline', v)} />
                    </Grid2>
                    <TextArea label="Website Description" value={val('websiteDescription')} onChange={v => updateField('websiteDescription', v)} rows={3} />
                    <Grid2>
                      <TextInput label="Website Logo URL" value={val('websiteLogo')} onChange={v => updateField('websiteLogo', v)} hint="Paste image URL or upload to cloud storage" />
                      <TextInput label="Website Favicon URL" value={val('websiteFavicon')} onChange={v => updateField('websiteFavicon', v)} />
                    </Grid2>
                    {(val('websiteLogo') || val('websiteFavicon')) && (
                      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem' }}>
                        {val('websiteLogo') && <div><div style={labelStyle}>Logo Preview</div><img src={val('websiteLogo')} alt="Logo" style={{ maxHeight: 60, borderRadius: 8, border: '1px solid #E2E8F0' }} onError={e => { e.target.style.display = 'none'; }} /></div>}
                        {val('websiteFavicon') && <div><div style={labelStyle}>Favicon Preview</div><img src={val('websiteFavicon')} alt="Favicon" style={{ maxHeight: 32, borderRadius: 4, border: '1px solid #E2E8F0' }} onError={e => { e.target.style.display = 'none'; }} /></div>}
                      </div>
                    )}
                    <SectionTitle>Contact Information</SectionTitle>
                    <Grid2>
                      <TextInput label="Support Email" value={val('supportEmail')} onChange={v => updateField('supportEmail', v)} type="email" />
                      <TextInput label="Contact Email" value={val('contactEmail')} onChange={v => updateField('contactEmail', v)} type="email" />
                      <TextInput label="Contact Number" value={val('contactNumber')} onChange={v => updateField('contactNumber', v)} />
                      <TextInput label="WhatsApp Number" value={val('whatsappNumber')} onChange={v => updateField('whatsappNumber', v)} />
                    </Grid2>
                    <TextArea label="Office Address" value={val('officeAddress')} onChange={v => updateField('officeAddress', v)} rows={2} />
                    <TextInput label="Google Maps Embed URL" value={val('googleMapsEmbedUrl')} onChange={v => updateField('googleMapsEmbedUrl', v)} hint="Paste iframe src URL from Google Maps" />
                    <TextInput label="Footer Copyright" value={val('footerCopyright')} onChange={v => updateField('footerCopyright', v)} />

                    <SectionTitle>Social Media Links</SectionTitle>
                    <Grid2>
                      <TextInput label="Facebook" value={val('socialMedia.facebook')} onChange={v => updateField('socialMedia.facebook', v)} placeholder="https://facebook.com/..." />
                      <TextInput label="Instagram" value={val('socialMedia.instagram')} onChange={v => updateField('socialMedia.instagram', v)} placeholder="https://instagram.com/..." />
                      <TextInput label="YouTube" value={val('socialMedia.youtube')} onChange={v => updateField('socialMedia.youtube', v)} placeholder="https://youtube.com/..." />
                      <TextInput label="LinkedIn" value={val('socialMedia.linkedin')} onChange={v => updateField('socialMedia.linkedin', v)} placeholder="https://linkedin.com/..." />
                      <TextInput label="Twitter / X" value={val('socialMedia.twitter')} onChange={v => updateField('socialMedia.twitter', v)} placeholder="https://x.com/..." />
                    </Grid2>
                  </div>
                )}

                {activeTab === 'homepage' && (
                  <div>
                    <SectionTitle>Hero Section</SectionTitle>
                    <Grid2>
                      <TextInput label="Hero Heading" value={val('heroHeading')} onChange={v => updateField('heroHeading', v)} />
                      <TextInput label="Hero Sub Heading" value={val('heroSubHeading')} onChange={v => updateField('heroSubHeading', v)} />
                      <TextInput label="Hero Button Text" value={val('heroButtonText')} onChange={v => updateField('heroButtonText', v)} />
                      <TextInput label="Hero Button Link" value={val('heroButtonLink')} onChange={v => updateField('heroButtonLink', v)} />
                    </Grid2>
                    <TextInput label="Hero Background Image URL" value={val('heroBackgroundImage')} onChange={v => updateField('heroBackgroundImage', v)} />

                    <SectionTitle>Statistics Counters</SectionTitle>
                    <Grid2>
                      <NumberInput label="Happy Marriages" value={val('statistics.happyMarriages')} onChange={v => updateField('statistics.happyMarriages', v)} min={0} />
                      <NumberInput label="Active Profiles" value={val('statistics.activeProfiles')} onChange={v => updateField('statistics.activeProfiles', v)} min={0} />
                      <NumberInput label="Success Stories" value={val('statistics.successStories')} onChange={v => updateField('statistics.successStories', v)} min={0} />
                      <NumberInput label="Years of Service" value={val('statistics.yearsOfService')} onChange={v => updateField('statistics.yearsOfService', v)} min={0} />
                    </Grid2>

                    <SectionTitle>Homepage Sections (Enable / Disable)</SectionTitle>
                    <ToggleSwitch label="Success Stories" checked={val('sections.successStories')} onChange={v => updateField('sections.successStories', v)} />
                    <ToggleSwitch label="Membership Plans" checked={val('sections.membershipPlans')} onChange={v => updateField('sections.membershipPlans', v)} />
                    <ToggleSwitch label="Testimonials" checked={val('sections.testimonials')} onChange={v => updateField('sections.testimonials', v)} />
                    <ToggleSwitch label="Blog" checked={val('sections.blog')} onChange={v => updateField('sections.blog', v)} />
                    <ToggleSwitch label="Featured Profiles" checked={val('sections.featuredProfiles')} onChange={v => updateField('sections.featuredProfiles', v)} />
                    <ToggleSwitch label="Registration Banner" checked={val('sections.registrationBanner')} onChange={v => updateField('sections.registrationBanner', v)} />
                  </div>
                )}

                {activeTab === 'membership' && (
                  <MembershipTab plans={val('plans') || []} onChange={v => updateField('plans', v)} />
                )}

                {activeTab === 'registration' && (
                  <div>
                    <ToggleSwitch label="Mobile OTP Verification" checked={val('mobileOtp')} onChange={v => updateField('mobileOtp', v)} hint="Require OTP on mobile number during registration" />
                    <ToggleSwitch label="Email Verification" checked={val('emailVerification')} onChange={v => updateField('emailVerification', v)} hint="Send verification link to email" />
                    <ToggleSwitch label="Aadhaar Verification" checked={val('aadhaarVerification')} onChange={v => updateField('aadhaarVerification', v)} hint="Require Aadhaar document for identity check" />
                    <ToggleSwitch label="Profile Approval Required" checked={val('profileApproval')} onChange={v => updateField('profileApproval', v)} hint="Admin must approve profile before it appears in search" />
                    <ToggleSwitch label="Auto Login After Registration" checked={val('autoLoginAfterRegistration')} onChange={v => updateField('autoLoginAfterRegistration', v)} />
                    <ToggleSwitch label="Allow Profile Editing" checked={val('allowProfileEditing')} onChange={v => updateField('allowProfileEditing', v)} />
                    <ToggleSwitch label="Allow Multiple Photos" checked={val('allowMultiplePhotos')} onChange={v => updateField('allowMultiplePhotos', v)} />
                    <ToggleSwitch label="Mandatory Horoscope" checked={val('mandatoryHoroscope')} onChange={v => updateField('mandatoryHoroscope', v)} />
                    <ToggleSwitch label="Mandatory Photo Upload" checked={val('mandatoryPhotoUpload')} onChange={v => updateField('mandatoryPhotoUpload', v)} />
                  </div>
                )}

                {activeTab === 'profile' && (
                  <div>
                    <Grid2>
                      <NumberInput label="Maximum Photos" value={val('maximumPhotos')} onChange={v => updateField('maximumPhotos', v)} min={1} max={20} />
                      <NumberInput label="Maximum Gallery Images" value={val('maximumGalleryImages')} onChange={v => updateField('maximumGalleryImages', v)} min={1} max={50} />
                    </Grid2>
                    <Grid2>
                      <TextInput label="Allowed File Types" value={val('allowedFileTypes')} onChange={v => updateField('allowedFileTypes', v)} hint="Comma separated: jpg, png, webp" />
                      <TextInput label="Profile Image Size Limit" value={val('profileImageSizeLimit')} onChange={v => updateField('profileImageSizeLimit', v)} hint="e.g. 5MB" />
                    </Grid2>
                    <Grid2>
                      <TextInput label="Document Upload Size Limit" value={val('documentUploadSize')} onChange={v => updateField('documentUploadSize', v)} />
                      <SelectInput label="Default Privacy" value={val('defaultPrivacy')} onChange={v => updateField('defaultPrivacy', v)} options={['Public', 'ConnectedOnly', 'Private']} />
                    </Grid2>
                    <Grid2>
                      <SelectInput label="Default Profile Status" value={val('defaultProfileStatus')} onChange={v => updateField('defaultProfileStatus', v)} options={['active', 'pending', 'inactive']} />
                    </Grid2>
                    <ToggleSwitch label="Enable Online Status" checked={val('enableOnlineStatus')} onChange={v => updateField('enableOnlineStatus', v)} />
                    <ToggleSwitch label="Enable Recently Active" checked={val('enableRecentlyActive')} onChange={v => updateField('enableRecentlyActive', v)} />
                  </div>
                )}

                {activeTab === 'notification' && (
                  <div>
                    <SectionTitle>Notification Channels</SectionTitle>
                    <ToggleSwitch label="Email Notifications" checked={val('emailNotifications')} onChange={v => updateField('emailNotifications', v)} />
                    <ToggleSwitch label="SMS Notifications" checked={val('smsNotifications')} onChange={v => updateField('smsNotifications', v)} />
                    <ToggleSwitch label="WhatsApp Notifications" checked={val('whatsappNotifications')} onChange={v => updateField('whatsappNotifications', v)} />
                    <ToggleSwitch label="Admin Alerts" checked={val('adminAlerts')} onChange={v => updateField('adminAlerts', v)} />
                    <ToggleSwitch label="Inquiry Alerts" checked={val('inquiryAlerts')} onChange={v => updateField('inquiryAlerts', v)} />
                    <ToggleSwitch label="Match Alerts" checked={val('matchAlerts')} onChange={v => updateField('matchAlerts', v)} />

                    <SectionTitle>SMTP Configuration</SectionTitle>
                    <Grid2>
                      <TextInput label="SMTP Host" value={val('smtp.host')} onChange={v => updateField('smtp.host', v)} placeholder="smtp.gmail.com" />
                      <NumberInput label="SMTP Port" value={val('smtp.port')} onChange={v => updateField('smtp.port', v)} min={1} max={65535} />
                      <TextInput label="SMTP Username" value={val('smtp.username')} onChange={v => updateField('smtp.username', v)} />
                      <TextInput label="SMTP Password" value={val('smtp.password')} onChange={v => updateField('smtp.password', v)} type="password" />
                    </Grid2>
                    <SelectInput label="Encryption" value={val('smtp.encryption')} onChange={v => updateField('smtp.encryption', v)} options={['TLS', 'SSL', 'None']} />
                  </div>
                )}

                {activeTab === 'payment' && (
                  <div>
                    <SectionTitle>Razorpay</SectionTitle>
                    <ToggleSwitch label="Enable Razorpay" checked={val('razorpay.enabled')} onChange={v => updateField('razorpay.enabled', v)} />
                    {val('razorpay.enabled') && (
                      <Grid2>
                        <TextInput label="Razorpay API Key" value={val('razorpay.apiKey')} onChange={v => updateField('razorpay.apiKey', v)} />
                        <TextInput label="Razorpay Secret Key" value={val('razorpay.secretKey')} onChange={v => updateField('razorpay.secretKey', v)} type="password" />
                      </Grid2>
                    )}
                    <SectionTitle>Stripe</SectionTitle>
                    <ToggleSwitch label="Enable Stripe" checked={val('stripe.enabled')} onChange={v => updateField('stripe.enabled', v)} />
                    {val('stripe.enabled') && (
                      <Grid2>
                        <TextInput label="Stripe API Key" value={val('stripe.apiKey')} onChange={v => updateField('stripe.apiKey', v)} />
                        <TextInput label="Stripe Secret Key" value={val('stripe.secretKey')} onChange={v => updateField('stripe.secretKey', v)} type="password" />
                      </Grid2>
                    )}
                    <SectionTitle>Cash Payment</SectionTitle>
                    <ToggleSwitch label="Enable Cash Payment" checked={val('cashPayment.enabled')} onChange={v => updateField('cashPayment.enabled', v)} />
                    <SectionTitle>General</SectionTitle>
                    <Grid2>
                      <SelectInput label="Currency" value={val('currency')} onChange={v => updateField('currency', v)} options={['INR', 'USD', 'EUR', 'GBP']} />
                      <NumberInput label="Tax Percentage (%)" value={val('taxPercentage')} onChange={v => updateField('taxPercentage', v)} min={0} max={100} />
                      <TextInput label="Invoice Prefix" value={val('invoicePrefix')} onChange={v => updateField('invoicePrefix', v)} />
                    </Grid2>
                  </div>
                )}

                {activeTab === 'seo' && (
                  <div>
                    <Grid2>
                      <TextInput label="Meta Title" value={val('metaTitle')} onChange={v => updateField('metaTitle', v)} />
                      <TextInput label="Meta Keywords" value={val('metaKeywords')} onChange={v => updateField('metaKeywords', v)} hint="Comma separated keywords" />
                    </Grid2>
                    <TextArea label="Meta Description" value={val('metaDescription')} onChange={v => updateField('metaDescription', v)} rows={3} />
                    <TextInput label="OG Image URL" value={val('ogImage')} onChange={v => updateField('ogImage', v)} />
                    <TextArea label="robots.txt Content" value={val('robotsTxt')} onChange={v => updateField('robotsTxt', v)} rows={4} hint="Controls search engine crawling" />
                    <SectionTitle>Tracking & Verification</SectionTitle>
                    <Grid2>
                      <TextInput label="Google Analytics ID" value={val('googleAnalyticsId')} onChange={v => updateField('googleAnalyticsId', v)} placeholder="G-XXXXXXXXXX" />
                      <TextInput label="Google Search Console" value={val('googleSearchConsoleVerification')} onChange={v => updateField('googleSearchConsoleVerification', v)} />
                      <TextInput label="Facebook Pixel ID" value={val('facebookPixelId')} onChange={v => updateField('facebookPixelId', v)} />
                    </Grid2>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div>
                    <ToggleSwitch label="Enable Two-Factor Authentication" checked={val('enableTwoFactorAuth')} onChange={v => updateField('enableTwoFactorAuth', v)} />
                    <SelectInput label="Password Policy" value={val('passwordPolicy')} onChange={v => updateField('passwordPolicy', v)}
                      options={[{ value: 'low', label: 'Low — Min 6 characters' }, { value: 'medium', label: 'Medium — Min 8, uppercase + number' }, { value: 'high', label: 'High — Min 12, uppercase + number + special' }]} />
                    <Grid2>
                      <NumberInput label="Session Timeout (minutes)" value={val('sessionTimeout')} onChange={v => updateField('sessionTimeout', v)} min={5} max={1440} />
                      <NumberInput label="Login Attempt Limit" value={val('loginAttemptLimit')} onChange={v => updateField('loginAttemptLimit', v)} min={1} max={20} />
                    </Grid2>
                    <ToggleSwitch label="Enable CAPTCHA" checked={val('captcha')} onChange={v => updateField('captcha', v)} hint="Show CAPTCHA on login and registration" />
                    <TextInput label="Admin IP Restriction" value={val('adminIpRestriction')} onChange={v => updateField('adminIpRestriction', v)} hint="Comma separated allowed IPs. Leave blank to allow all." />
                    <ToggleSwitch label="Activity Logging" checked={val('activityLogging')} onChange={v => updateField('activityLogging', v)} hint="Log all admin actions to the audit trail" />
                  </div>
                )}

                {activeTab === 'backup' && (
                  <div>
                    <SelectInput label="Automatic Backup Frequency" value={val('automaticBackupFrequency')} onChange={v => updateField('automaticBackupFrequency', v)}
                      options={['daily', 'weekly', 'monthly']} />
                    {val('lastBackupDate') && (
                      <div style={{ fontSize: '0.82rem', color: '#64748B', margin: '0.75rem 0' }}>
                        <strong>Last Backup:</strong> {new Date(val('lastBackupDate')).toLocaleString()}
                      </div>
                    )}
                    <SectionTitle>Manual Backup Actions</SectionTitle>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                      <ActionButton icon={Database} label="Create Backup" color="#0B3B91"
                        onClick={() => setToastMsg({ type: 'success', text: 'Backup creation initiated. This feature will connect to your backup service when configured.' })} />
                      <ActionButton icon={RotateCcw} label="Restore Backup" color="#D97706"
                        onClick={() => setToastMsg({ type: 'info', text: 'Restore functionality will be available when backup service is configured.' })} />
                    </div>
                  </div>
                )}

                {activeTab === 'emailTemplates' && (
                  <EmailTemplatesTab data={allSettings.emailTemplates || {}} onChange={(key, val) => {
                    setAllSettings(prev => ({
                      ...prev,
                      emailTemplates: { ...(prev.emailTemplates || {}), [key]: val },
                    }));
                  }} />
                )}

                {activeTab === 'theme' && (
                  <div>
                    <SelectInput label="Theme Mode" value={val('mode')} onChange={v => updateField('mode', v)} options={['light', 'dark']} />
                    <Grid2>
                      <FormField label="Primary Color">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <input type="color" value={val('primaryColor') || '#0B3B91'} onChange={e => updateField('primaryColor', e.target.value)}
                            style={{ width: 40, height: 36, border: 'none', borderRadius: 8, cursor: 'pointer', padding: 0 }} />
                          <input type="text" value={val('primaryColor') || '#0B3B91'} onChange={e => updateField('primaryColor', e.target.value)}
                            style={{ ...inputStyle, width: 120 }} />
                        </div>
                      </FormField>
                      <FormField label="Secondary Color">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <input type="color" value={val('secondaryColor') || '#D4AF37'} onChange={e => updateField('secondaryColor', e.target.value)}
                            style={{ width: 40, height: 36, border: 'none', borderRadius: 8, cursor: 'pointer', padding: 0 }} />
                          <input type="text" value={val('secondaryColor') || '#D4AF37'} onChange={e => updateField('secondaryColor', e.target.value)}
                            style={{ ...inputStyle, width: 120 }} />
                        </div>
                      </FormField>
                    </Grid2>
                    <Grid2>
                      <SelectInput label="Font Family" value={val('fontFamily')} onChange={v => updateField('fontFamily', v)}
                        options={['Inter', 'Roboto', 'Outfit', 'Poppins', 'Open Sans', 'Lato']} />
                      <TextInput label="Border Radius" value={val('borderRadius')} onChange={v => updateField('borderRadius', v)} hint="e.g. 12px, 8px, 0px" />
                    </Grid2>
                    {/* Live Preview */}
                    <SectionTitle>Live Preview</SectionTitle>
                    <div style={{
                      padding: '1.5rem', borderRadius: val('borderRadius') || '12px',
                      background: val('mode') === 'dark' ? '#1E293B' : '#F8FAFC',
                      border: '1px solid #E2E8F0',
                    }}>
                      <div style={{ fontFamily: val('fontFamily') || 'Inter', color: val('mode') === 'dark' ? '#F1F5F9' : '#0F172A' }}>
                        <h4 style={{ margin: '0 0 0.5rem', color: val('primaryColor') || '#0B3B91' }}>SS Matrimony</h4>
                        <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.8 }}>This is how your theme will look.</p>
                        <button style={{
                          marginTop: '0.75rem', padding: '0.5rem 1.5rem', borderRadius: val('borderRadius') || '12px',
                          backgroundColor: val('primaryColor') || '#0B3B91', color: '#FFF',
                          border: 'none', fontWeight: '700', fontFamily: val('fontFamily') || 'Inter', cursor: 'pointer',
                        }}>
                          Sample Button
                        </button>
                        <span style={{
                          marginLeft: '0.75rem', padding: '0.35rem 1rem', borderRadius: val('borderRadius') || '12px',
                          backgroundColor: val('secondaryColor') || '#D4AF37', color: '#FFF',
                          fontWeight: '700', fontFamily: val('fontFamily') || 'Inter', fontSize: '0.82rem',
                        }}>
                          Badge
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'system' && (
                  <div>
                    {systemInfo ? (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                        <InfoRow icon={Info} label="Website Version" value={systemInfo.websiteVersion} />
                        <InfoRow icon={Server} label="Node.js Version" value={systemInfo.nodeVersion} />
                        <InfoRow icon={Database} label="MongoDB Version" value={systemInfo.mongoVersion} />
                        <InfoRow icon={Clock} label="Server Time" value={new Date(systemInfo.serverTime).toLocaleString()} />
                        <InfoRow icon={Cpu} label="Platform" value={systemInfo.platform} />
                        <InfoRow icon={Clock} label="Server Uptime" value={systemInfo.uptime} />
                        <InfoRow icon={HardDrive} label="Memory Usage" value={systemInfo.memoryUsage} />
                        <InfoRow icon={HardDrive} label="DB Storage Used" value={systemInfo.storageUsed} />
                        <InfoRow icon={Database} label="Database Size" value={systemInfo.databaseSize} />
                        <InfoRow icon={Database} label="Collections" value={systemInfo.collections} />
                        <InfoRow icon={Database} label="Total Documents" value={systemInfo.documents} />
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '3rem', color: '#94A3B8' }}>Loading system information...</div>
                    )}
                  </div>
                )}
              </CardContainer>
            </>
          )}
        </div>
      </div>

      {/* ── Reset Confirmation Modal ── */}
      {showConfirm === 'reset' && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 9999,
        }} onClick={() => setShowConfirm(null)}>
          <div onClick={e => e.stopPropagation()} style={{
            backgroundColor: '#FFF', borderRadius: '20px', padding: '2rem', maxWidth: 420,
            width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          }}>
            <h3 style={{ margin: '0 0 0.75rem', color: '#0F172A', fontSize: '1.1rem' }}>Reset to Defaults?</h3>
            <p style={{ color: '#64748B', fontSize: '0.85rem', margin: '0 0 1.5rem' }}>
              This will reset all <strong>{TABS.find(t => t.key === activeTab)?.label}</strong> settings to their default values. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button onClick={() => setShowConfirm(null)} style={{
                padding: '0.5rem 1rem', borderRadius: '10px', border: '1px solid #CBD5E1',
                backgroundColor: '#FFF', color: '#475569', fontWeight: '700', fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'Inter',
              }}>Cancel</button>
              <button onClick={handleReset} style={{
                padding: '0.5rem 1rem', borderRadius: '10px', border: 'none',
                backgroundColor: '#DC2626', color: '#FFF', fontWeight: '700', fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'Inter',
              }}>Reset to Defaults</button>
            </div>
          </div>
        </div>
      )}

      {/* Keyframe for spinner */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════ */

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1rem',
      backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0',
    }}>
      <Icon size={18} color="#0B3B91" />
      <div>
        <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase' }}>{label}</div>
        <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0F172A' }}>{value ?? '—'}</div>
      </div>
    </div>
  );
}

function ActionButton({ icon: Icon, label, color, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '0.65rem 1.25rem', borderRadius: '12px', border: 'none',
      backgroundColor: color, color: '#FFF', fontWeight: '700', fontSize: '0.82rem',
      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem',
      boxShadow: `0 4px 14px ${color}33`, fontFamily: 'Inter',
    }}>
      <Icon size={16} /> {label}
    </button>
  );
}

/* ── Membership Plans CRUD ── */
function MembershipTab({ plans, onChange }) {
  const [editIdx, setEditIdx] = useState(null);
  const empty = { name: '', price: 0, duration: '1 month', features: '', contactVisibility: true, profileBoost: false, unlimitedInterest: false, highlightProfile: false, premiumBadge: false };

  const addPlan = () => {
    onChange([...plans, { ...empty }]);
    setEditIdx(plans.length);
  };

  const updatePlan = (idx, field, value) => {
    const next = [...plans];
    next[idx] = { ...next[idx], [field]: value };
    onChange(next);
  };

  const removePlan = (idx) => {
    onChange(plans.filter((_, i) => i !== idx));
    setEditIdx(null);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.85rem', color: '#64748B' }}>{plans.length} plan(s) configured</div>
        <button onClick={addPlan} style={{
          padding: '0.5rem 1rem', borderRadius: '10px', border: 'none',
          background: 'linear-gradient(135deg, #0B3B91, #1E40AF)', color: '#FFF',
          fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', fontFamily: 'Inter',
        }}>
          <Plus size={14} /> Add Plan
        </button>
      </div>

      {plans.length === 0 && (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px dashed #E2E8F0' }}>
          No membership plans configured yet. Click "Add Plan" to create one.
        </div>
      )}

      {plans.map((plan, idx) => (
        <div key={idx} style={{
          border: '1px solid #E2E8F0', borderRadius: '14px', padding: '1.25rem',
          marginBottom: '0.75rem', backgroundColor: editIdx === idx ? '#F8FAFC' : '#FFF',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: editIdx === idx ? '1rem' : 0 }}>
            <div style={{ fontWeight: '700', color: '#0F172A', fontSize: '0.95rem' }}>
              {plan.name || `Plan #${idx + 1}`}
              {plan.price > 0 && <span style={{ color: '#0B3B91', marginLeft: '0.5rem' }}>₹{plan.price}</span>}
            </div>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button onClick={() => setEditIdx(editIdx === idx ? null : idx)} style={{
                padding: '0.35rem 0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1',
                backgroundColor: '#FFF', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer', color: '#475569', fontFamily: 'Inter',
              }}>{editIdx === idx ? 'Collapse' : 'Edit'}</button>
              <button onClick={() => removePlan(idx)} style={{
                padding: '0.35rem', borderRadius: '8px', border: '1px solid #FECACA',
                backgroundColor: '#FEF2F2', cursor: 'pointer', color: '#DC2626', display: 'flex',
              }}><Trash2 size={14} /></button>
            </div>
          </div>

          {editIdx === idx && (
            <div>
              <Grid2>
                <TextInput label="Plan Name" value={plan.name} onChange={v => updatePlan(idx, 'name', v)} />
                <NumberInput label="Price (₹)" value={plan.price} onChange={v => updatePlan(idx, 'price', v)} min={0} />
              </Grid2>
              <Grid2>
                <TextInput label="Duration" value={plan.duration} onChange={v => updatePlan(idx, 'duration', v)} hint="e.g. 1 month, 3 months, 1 year" />
                <TextInput label="Features" value={plan.features} onChange={v => updatePlan(idx, 'features', v)} hint="Comma separated features" />
              </Grid2>
              <ToggleSwitch label="Contact Visibility" checked={plan.contactVisibility} onChange={v => updatePlan(idx, 'contactVisibility', v)} />
              <ToggleSwitch label="Profile Boost" checked={plan.profileBoost} onChange={v => updatePlan(idx, 'profileBoost', v)} />
              <ToggleSwitch label="Unlimited Interest" checked={plan.unlimitedInterest} onChange={v => updatePlan(idx, 'unlimitedInterest', v)} />
              <ToggleSwitch label="Highlight Profile" checked={plan.highlightProfile} onChange={v => updatePlan(idx, 'highlightProfile', v)} />
              <ToggleSwitch label="Premium Badge" checked={plan.premiumBadge} onChange={v => updatePlan(idx, 'premiumBadge', v)} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Email Templates Tab ── */
const TEMPLATE_KEYS = [
  { key: 'registrationSuccess', label: 'Registration Success' },
  { key: 'otp', label: 'OTP Verification' },
  { key: 'forgotPassword', label: 'Forgot Password' },
  { key: 'profileApproved', label: 'Profile Approved' },
  { key: 'profileRejected', label: 'Profile Rejected' },
  { key: 'membershipPurchased', label: 'Membership Purchased' },
  { key: 'contactInquiry', label: 'Contact Inquiry' },
];

function EmailTemplatesTab({ data, onChange }) {
  const [activeTemplate, setActiveTemplate] = useState(TEMPLATE_KEYS[0].key);
  const tmpl = data[activeTemplate] || { subject: '', body: '' };

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {TEMPLATE_KEYS.map(t => (
          <button key={t.key} onClick={() => setActiveTemplate(t.key)} style={{
            padding: '0.45rem 0.85rem', borderRadius: '8px',
            border: activeTemplate === t.key ? '2px solid #0B3B91' : '1px solid #CBD5E1',
            backgroundColor: activeTemplate === t.key ? '#EFF6FF' : '#FFF',
            color: activeTemplate === t.key ? '#0B3B91' : '#475569',
            fontWeight: '700', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'Inter',
          }}>{t.label}</button>
        ))}
      </div>
      <TextInput label="Email Subject" value={tmpl.subject}
        onChange={v => onChange(activeTemplate, { ...tmpl, subject: v })} />
      <TextArea label="Email Body" value={tmpl.body}
        onChange={v => onChange(activeTemplate, { ...tmpl, body: v })} rows={8}
        hint="Use {{name}}, {{email}}, {{otp}}, {{link}}, {{reason}}, {{plan}}, {{message}} as placeholders" />
    </div>
  );
}

/* ── Reusable Grid2 already defined above ── */
