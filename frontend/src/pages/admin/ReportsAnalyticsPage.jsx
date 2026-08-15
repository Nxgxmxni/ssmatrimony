import React, { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '../../services/api';
import Toast from '../../components/Toast';
import {
  BarChart2,
  Users,
  ShieldCheck,
  Clock,
  AlertTriangle,
  Download,
  RefreshCw,
  Heart,
  MapPin,
  Briefcase,
  GraduationCap,
  PieChart,
  TrendingUp,
  MessageSquare,
  BookOpen,
  Activity,
  UserPlus,
  UserX,
  Eye,
  Star,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════
   REUSABLE CHART COMPONENTS (Pure CSS — no chart library)
   ═══════════════════════════════════════════════════════════ */

const CHART_COLORS = [
  '#0B3B91', '#EC4899', '#16A34A', '#F59E0B', '#8B5CF6',
  '#06B6D4', '#EF4444', '#D4AF37', '#10B981', '#6366F1',
];

/* ---------- Stat Card ---------- */
const StatCard = ({ label, value, color = '#0F172A', icon: Icon, subtext }) => (
  <div style={{
    backgroundColor: '#FFFFFF', padding: '1.25rem 1.4rem', borderRadius: '16px',
    border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
    display: 'flex', flexDirection: 'column', gap: '0.3rem',
    transition: 'transform 0.2s, box-shadow 0.2s',
  }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.06)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)'; }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ color: '#64748B', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
      {Icon && <Icon size={16} color={color} />}
    </div>
    <div style={{ fontSize: '1.75rem', fontWeight: '800', color, lineHeight: 1.1 }}>{value}</div>
    {subtext && <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{subtext}</div>}
  </div>
);

/* ---------- Horizontal Bar Chart ---------- */
const HBarChart = ({ data, maxVal, colorFn }) => {
  const mx = maxVal || Math.max(...data.map(d => d.count), 1);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
      {data.map((item, i) => (
        <div key={item._id || i}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '3px' }}>
            <span style={{ maxWidth: '70%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item._id || 'Unknown'}</span>
            <span>{item.count}</span>
          </div>
          <div style={{ width: '100%', height: '10px', backgroundColor: '#F1F5F9', borderRadius: '5px', overflow: 'hidden' }}>
            <div style={{
              width: `${Math.min((item.count / mx) * 100, 100)}%`,
              backgroundColor: colorFn ? colorFn(i) : CHART_COLORS[i % CHART_COLORS.length],
              height: '100%', borderRadius: '5px',
              transition: 'width 0.8s ease',
            }} />
          </div>
        </div>
      ))}
    </div>
  );
};

/* ---------- Donut Chart (CSS conic-gradient) ---------- */
const DonutChart = ({ segments, size = 160, thickness = 22 }) => {
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  let accumulated = 0;
  const gradientParts = [];
  segments.forEach((seg, i) => {
    const pct = (seg.value / total) * 100;
    gradientParts.push(`${seg.color} ${accumulated}% ${accumulated + pct}%`);
    accumulated += pct;
  });
  const gradient = `conic-gradient(${gradientParts.join(', ')})`;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
      <div style={{
        width: size, height: size, borderRadius: '50%',
        background: gradient, position: 'relative', flexShrink: 0,
      }}>
        <div style={{
          position: 'absolute', inset: thickness, borderRadius: '50%',
          backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column',
        }}>
          <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0F172A' }}>{total}</span>
          <span style={{ fontSize: '0.65rem', color: '#94A3B8', fontWeight: '600' }}>Total</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1, minWidth: 120 }}>
        {segments.map((seg, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: seg.color, flexShrink: 0 }} />
            <span style={{ color: '#475569', fontWeight: '600' }}>{seg.label}</span>
            <span style={{ marginLeft: 'auto', fontWeight: '800', color: '#0F172A' }}>{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------- Section Card ---------- */
const SectionCard = ({ title, icon: Icon, iconColor = '#0B3B91', children, span = 1 }) => (
  <div style={{
    backgroundColor: '#FFFFFF', padding: '1.5rem', borderRadius: '20px',
    border: '1px solid #E2E8F0', boxShadow: '0 4px 14px rgba(0,0,0,0.02)',
    gridColumn: span > 1 ? `span ${span}` : undefined,
  }}>
    <h3 style={{
      fontSize: '1.05rem', fontWeight: '800', color: '#0F172A',
      marginBottom: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
    }}>
      {Icon && <Icon size={20} color={iconColor} />} {title}
    </h3>
    {children}
  </div>
);

/* ---------- Data Row ---------- */
const DataRow = ({ label, value, color, border = true }) => (
  <div style={{
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '0.5rem 0', borderBottom: border ? '1px solid #F1F5F9' : 'none',
    fontSize: '0.85rem',
  }}>
    <span style={{ color: '#475569' }}>{label}</span>
    <strong style={{ color: color || '#0F172A' }}>{value}</strong>
  </div>
);

/* ---------- Age Label Mapper ---------- */
const ageLabelMap = { 18: '18–22', 23: '23–27', 28: '28–32', 33: '33–40', 41: '40+' };

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════ */

export default function ReportsAnalyticsPage() {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('30days');
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [toastMsg, setToastMsg] = useState({ type: '', text: '' });

  const fetchReportsData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getReports({ range });
      setReports(res.data || null);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error('Error fetching BI analytics reports:', err);
      setToastMsg({ type: 'error', text: 'Failed to fetch real-time analytics from MongoDB.' });
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => { fetchReportsData(); }, [fetchReportsData]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchReportsData, 30000);
    return () => clearInterval(interval);
  }, [fetchReportsData]);

  /* ── Export CSV ── */
  const handleExportCSV = () => {
    if (!reports) return;
    const s = reports.summary || {};
    const v = reports.verification || {};
    const c = reports.profileCompletion || {};
    const int = reports.interests || {};
    const cms = reports.cmsAndContact || {};

    let rows = [
      ['Metric', 'Value'],
      ['Total Registered Members', s.totalRegisteredMembers],
      ['Total Brides', s.totalBrides],
      ['Total Grooms', s.totalGrooms],
      ['Active Members', s.activeMembers],
      ['Verified Members', s.verifiedMembers],
      ['Pending Verification', s.pendingVerification],
      ['Suspended Accounts', s.suspendedAccounts],
      ['New Registrations Today', s.newToday],
      ['New Registrations This Week', s.newThisWeek],
      ['New Registrations This Month', s.newThisMonth],
      ['---', '---'],
      ['Completed Profiles', c.completedProfiles],
      ['Incomplete Profiles', c.incompleteProfiles],
      ['Avg Completion %', c.avgCompletionPercentage],
      ['Photos Missing', c.photosMissing],
      ['Religion Missing', c.religionMissing],
      ['Education Missing', c.educationMissing],
      ['---', '---'],
      ['Verification Approval Rate', v.approvalRate],
      ['Approved Today', v.approvedToday],
      ['Rejected Today', v.rejectedToday],
      ['---', '---'],
      ['Total Interests Sent', int.totalInterestsSent],
      ['Interests Accepted', int.accepted],
      ['Interests Declined', int.rejected],
      ['Interests Pending', int.pending],
      ['---', '---'],
      ['Published Success Stories', cms.publishedStories],
      ['Total Contact Enquiries', cms.totalContactEnquiries],
      ['Open Support Tickets', cms.openContactTickets],
      ['Closed Tickets', cms.closedContactTickets],
    ];

    // Demographics
    (reports.demographics?.religion || []).forEach(r => rows.push([`Religion: ${r._id}`, r.count]));
    (reports.demographics?.education || []).forEach(r => rows.push([`Education: ${r._id}`, r.count]));
    (reports.demographics?.occupation || []).forEach(r => rows.push([`Occupation: ${r._id}`, r.count]));
    (reports.location?.states || []).forEach(r => rows.push([`State: ${r._id}`, r.count]));
    (reports.location?.cities || []).forEach(r => rows.push([`City: ${r._id}`, r.count]));

    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SS_Matrimony_BI_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setToastMsg({ type: 'success', text: 'BI Analytics Report exported as CSV!' });
  };

  /* ── Destructure ── */
  const summary = reports?.summary || {};
  const completion = reports?.profileCompletion || {};
  const verification = reports?.verification || {};
  const location = reports?.location || {};
  const demographics = reports?.demographics || {};
  const interests = reports?.interests || {};
  const cmsAndContact = reports?.cmsAndContact || {};

  /* ── Age chart data ── */
  const ageData = (demographics.age || []).map(b => ({
    _id: ageLabelMap[b._id] || `${b._id}+`,
    count: b.count,
  }));

  /* ── Gender donut segments ── */
  const genderSegments = [
    { label: 'Brides', value: summary.totalBrides || 0, color: '#EC4899' },
    { label: 'Grooms', value: summary.totalGrooms || 0, color: '#2563EB' },
  ];

  /* ── Profile completion donut segments ── */
  const completionSegments = [
    { label: 'Complete', value: completion.completedProfiles || 0, color: '#16A34A' },
    { label: 'Incomplete', value: completion.incompleteProfiles || 0, color: '#F59E0B' },
  ];

  /* ── Interest donut segments ── */
  const interestSegments = [
    { label: 'Accepted', value: interests.accepted || 0, color: '#16A34A' },
    { label: 'Pending', value: interests.pending || 0, color: '#F59E0B' },
    { label: 'Declined', value: interests.rejected || 0, color: '#EF4444' },
  ];

  /* ── Contact Tickets donut ── */
  const ticketSegments = [
    { label: 'Open', value: cmsAndContact.openContactTickets || 0, color: '#EA580C' },
    { label: 'Closed', value: cmsAndContact.closedContactTickets || 0, color: '#16A34A' },
  ];

  /* ═══════ RENDER ═══════ */
  return (
    <div style={{ padding: '1.5rem 2rem', fontFamily: 'Inter, sans-serif', maxWidth: 1400, margin: '0 auto' }}>
      <Toast type={toastMsg.type} message={toastMsg.text} onClose={() => setToastMsg({ type: '', text: '' })} />

      {/* ── HEADER ── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem',
      }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.6rem', margin: 0 }}>
            <BarChart2 color="#0B3B91" size={26} /> Reports &amp; Analytics
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.85rem', margin: 0, marginTop: 4 }}>
            Real-time business intelligence powered by MongoDB aggregation queries. Auto-refreshes every 30 seconds.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.72rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Activity size={12} /> {lastRefreshed.toLocaleTimeString()}
          </span>

          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            style={{
              padding: '0.55rem 0.8rem', borderRadius: '10px', border: '1px solid #CBD5E1',
              fontSize: '0.82rem', fontWeight: '700', color: '#334155', backgroundColor: '#FFFFFF',
              cursor: 'pointer',
            }}
          >
            <option value="today">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="thisMonth">This Month</option>
            <option value="thisYear">This Year</option>
          </select>

          <button onClick={fetchReportsData} title="Refresh Now"
            style={{
              padding: '0.55rem', borderRadius: '10px', border: '1px solid #CBD5E1',
              backgroundColor: '#FFFFFF', cursor: 'pointer', color: '#0B3B91', display: 'flex', alignItems: 'center',
            }}>
            <RefreshCw size={17} className={loading ? 'spin' : ''} />
          </button>

          <button onClick={handleExportCSV}
            style={{
              background: 'linear-gradient(135deg, #0B3B91, #1E40AF)', color: '#FFF',
              fontWeight: '700', fontSize: '0.82rem', padding: '0.55rem 1.1rem',
              borderRadius: '10px', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              boxShadow: '0 4px 14px rgba(11,59,145,0.2)',
            }}>
            <Download size={15} /> Export CSV
          </button>
        </div>
      </div>

      {/* ── ALERT BANNER ── */}
      {(summary.pendingVerification > 0 || cmsAndContact.openContactTickets > 0) && (
        <div style={{
          background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)', border: '1px solid #FCD34D',
          padding: '0.85rem 1.25rem', borderRadius: '14px', marginBottom: '1.75rem',
          display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#92400E',
        }}>
          <AlertTriangle size={20} color="#D97706" />
          <span style={{ fontSize: '0.82rem', fontWeight: '700' }}>
            Attention: <strong>{summary.pendingVerification || 0}</strong> pending verifications &amp; <strong>{cmsAndContact.openContactTickets || 0}</strong> open support tickets need your action.
          </span>
        </div>
      )}

      {/* ═══════════════════════════════════════════
          SECTION 1 — OVERVIEW SUMMARY CARDS (10)
          ═══════════════════════════════════════════ */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))',
        gap: '1rem', marginBottom: '2rem',
      }}>
        <StatCard label="Total Members" value={summary.totalRegisteredMembers || 0} icon={Users} color="#0B3B91" />
        <StatCard label="Brides" value={summary.totalBrides || 0} icon={Users} color="#EC4899" />
        <StatCard label="Grooms" value={summary.totalGrooms || 0} icon={Users} color="#2563EB" />
        <StatCard label="Active" value={summary.activeMembers || 0} icon={Activity} color="#16A34A" />
        <StatCard label="Verified" value={summary.verifiedMembers || 0} icon={ShieldCheck} color="#D4AF37" />
        <StatCard label="Pending Verif." value={summary.pendingVerification || 0} icon={Clock} color="#EA580C" />
        <StatCard label="Suspended" value={summary.suspendedAccounts || 0} icon={UserX} color="#DC2626" />
        <StatCard label="New Today" value={summary.newToday || 0} icon={UserPlus} color="#0B3B91" subtext="Registrations" />
        <StatCard label="New This Week" value={summary.newThisWeek || 0} icon={TrendingUp} color="#8B5CF6" subtext="Last 7 days" />
        <StatCard label="New This Month" value={summary.newThisMonth || 0} icon={TrendingUp} color="#06B6D4" subtext="Current month" />
      </div>

      {/* ═══════════════════════════════════════════
          SECTION 2 — GENDER RATIO & PROFILE COMPLETION & VERIFICATION
          ═══════════════════════════════════════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>

        {/* Gender Ratio Donut */}
        <SectionCard title="Gender Distribution" icon={Users} iconColor="#0B3B91">
          <DonutChart segments={genderSegments} />
        </SectionCard>

        {/* Profile Completion Donut */}
        <SectionCard title="Profile Completion" icon={PieChart} iconColor="#16A34A">
          <DonutChart segments={completionSegments} />
          <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#475569' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span>Average Completion</span>
              <strong style={{ color: '#16A34A' }}>{completion.avgCompletionPercentage || 0}%</strong>
            </div>
            <div style={{ width: '100%', height: 8, backgroundColor: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: `${completion.avgCompletionPercentage || 0}%`, height: '100%', backgroundColor: '#16A34A', borderRadius: 4, transition: 'width 0.8s ease' }} />
            </div>
          </div>
        </SectionCard>

        {/* Verification Analytics */}
        <SectionCard title="Verification Analytics" icon={ShieldCheck} iconColor="#D4AF37">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
            <span style={{ fontSize: '0.82rem', color: '#475569' }}>Approval Rate</span>
            <span style={{ fontSize: '1.3rem', fontWeight: '800', color: '#D4AF37' }}>{verification.approvalRate || '0%'}</span>
          </div>
          <DataRow label="Verified Today" value={verification.approvedToday || 0} color="#16A34A" />
          <DataRow label="Rejected Today" value={verification.rejectedToday || 0} color="#DC2626" />
          <DataRow label="Pending Queue" value={verification.pendingVerification || 0} color="#EA580C" border={false} />
        </SectionCard>
      </div>

      {/* ═══════════════════════════════════════════
          SECTION 3 — MISSING DATA & PROFILE GAPS
          ═══════════════════════════════════════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <SectionCard title="Top Missing Sections" icon={AlertTriangle} iconColor="#F59E0B">
          <HBarChart
            data={[
              { _id: 'Photos Missing', count: completion.photosMissing || 0 },
              { _id: 'Religion Missing', count: completion.religionMissing || 0 },
              { _id: 'Education Missing', count: completion.educationMissing || 0 },
            ]}
            colorFn={() => '#F59E0B'}
          />
        </SectionCard>

        {/* Contact Enquiries */}
        <SectionCard title="Contact Enquiries" icon={MessageSquare} iconColor="#0B3B91">
          <DonutChart segments={ticketSegments} size={130} thickness={18} />
          <div style={{ marginTop: '0.75rem' }}>
            <DataRow label="Total Enquiries" value={cmsAndContact.totalContactEnquiries || 0} />
            <DataRow label="Published Stories" value={cmsAndContact.publishedStories || 0} color="#8B5CF6" border={false} />
          </div>
        </SectionCard>

        {/* Interest & Match Analytics */}
        <SectionCard title="Interest & Match Analytics" icon={Heart} iconColor="#EC4899">
          <DonutChart segments={interestSegments} size={130} thickness={18} />
          <div style={{ marginTop: '0.75rem' }}>
            <DataRow label="Total Interests Sent" value={interests.totalInterestsSent || 0} color="#0B3B91" border={false} />
          </div>
        </SectionCard>
      </div>

      {/* ═══════════════════════════════════════════
          SECTION 4 — LOCATION ANALYTICS
          ═══════════════════════════════════════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <SectionCard title="Top States" icon={MapPin} iconColor="#0B3B91">
          {location.states?.length > 0
            ? <HBarChart data={location.states} colorFn={(i) => CHART_COLORS[i]} />
            : <EmptyPlaceholder text="State data populates when profiles complete the onboarding wizard." />
          }
        </SectionCard>

        <SectionCard title="Top Cities" icon={MapPin} iconColor="#06B6D4">
          {location.cities?.length > 0
            ? <HBarChart data={location.cities} colorFn={(i) => CHART_COLORS[i + 3]} />
            : <EmptyPlaceholder text="City data populates when profiles complete the onboarding wizard." />
          }
        </SectionCard>
      </div>

      {/* ═══════════════════════════════════════════
          SECTION 5 — DEMOGRAPHICS (Age, Religion, Education, Profession)
          ═══════════════════════════════════════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>

        {/* Age Distribution */}
        <SectionCard title="Age Distribution" icon={Users} iconColor="#8B5CF6">
          {ageData.length > 0
            ? <HBarChart data={ageData} colorFn={(i) => ['#0B3B91', '#EC4899', '#16A34A', '#F59E0B', '#8B5CF6'][i]} />
            : <EmptyPlaceholder text="Age distribution populates from profile data." />
          }
        </SectionCard>

        {/* Religion Distribution */}
        <SectionCard title="Religion / Community" icon={BookOpen} iconColor="#D4AF37">
          {demographics.religion?.length > 0
            ? <HBarChart data={demographics.religion} />
            : <EmptyPlaceholder text="Religion data populates from profile data." />
          }
        </SectionCard>

        {/* Education Breakdown */}
        <SectionCard title="Education Levels" icon={GraduationCap} iconColor="#16A34A">
          {demographics.education?.length > 0
            ? <HBarChart data={demographics.education} colorFn={(i) => CHART_COLORS[(i + 2) % CHART_COLORS.length]} />
            : <EmptyPlaceholder text="Education data populates from profile data." />
          }
        </SectionCard>

        {/* Profession / Occupation */}
        <SectionCard title="Top Professions" icon={Briefcase} iconColor="#EA580C">
          {demographics.occupation?.length > 0
            ? <HBarChart data={demographics.occupation} colorFn={(i) => CHART_COLORS[(i + 5) % CHART_COLORS.length]} />
            : <EmptyPlaceholder text="Profession data populates from profile data." />
          }
        </SectionCard>
      </div>

      {/* ═══════════════════════════════════════════
          SECTION 6 — SUCCESS STORIES QUICK METRICS
          ═══════════════════════════════════════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <SectionCard title="Success Stories Overview" icon={Star} iconColor="#D4AF37">
          <DataRow label="Published Stories" value={cmsAndContact.publishedStories || 0} color="#16A34A" />
          <DataRow label="Open Contact Tickets" value={cmsAndContact.openContactTickets || 0} color="#EA580C" />
          <DataRow label="Closed Tickets" value={cmsAndContact.closedContactTickets || 0} color="#16A34A" />
          <DataRow label="Total Enquiries Received" value={cmsAndContact.totalContactEnquiries || 0} color="#0B3B91" border={false} />
        </SectionCard>

        {/* Quick Registration Summary */}
        <SectionCard title="Registration Trend Summary" icon={TrendingUp} iconColor="#8B5CF6">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0B3B91' }}>{summary.newToday || 0}</div>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: '600' }}>TODAY</div>
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#8B5CF6' }}>{summary.newThisWeek || 0}</div>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: '600' }}>THIS WEEK</div>
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#06B6D4' }}>{summary.newThisMonth || 0}</div>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: '600' }}>THIS MONTH</div>
            </div>
          </div>
          {/* Mini bar visualization */}
          <div style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.4rem', height: 60, alignItems: 'flex-end' }}>
              {[summary.newToday || 0, summary.newThisWeek || 0, summary.newThisMonth || 0].map((val, i) => {
                const max = Math.max(summary.newToday || 0, summary.newThisWeek || 0, summary.newThisMonth || 0, 1);
                return (
                  <div key={i} style={{
                    flex: 1, backgroundColor: ['#0B3B91', '#8B5CF6', '#06B6D4'][i],
                    height: `${Math.max((val / max) * 100, 8)}%`, borderRadius: '6px 6px 0 0',
                    transition: 'height 0.8s ease',
                  }} />
                );
              })}
            </div>
          </div>
        </SectionCard>
      </div>

      {/* ── FOOTER NOTE ── */}
      <div style={{
        textAlign: 'center', padding: '1rem', color: '#94A3B8', fontSize: '0.75rem',
        borderTop: '1px solid #F1F5F9', marginTop: '1rem',
      }}>
        All statistics are fetched in real-time from MongoDB using aggregation queries. Dashboard auto-refreshes every 30 seconds.
        {reports?.generatedAt && <span> · Report generated at {new Date(reports.generatedAt).toLocaleString()}</span>}
      </div>
    </div>
  );
}

/* ── Empty State Placeholder ── */
function EmptyPlaceholder({ text }) {
  return (
    <div style={{
      padding: '1.5rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.82rem',
      backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px dashed #E2E8F0',
    }}>
      {text}
    </div>
  );
}
