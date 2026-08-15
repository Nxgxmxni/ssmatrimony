import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Search, Bell, Menu, LogOut, ShieldCheck, Check, UserPlus, FileCheck, Mail, Sparkles, X } from 'lucide-react';
import { adminAPI } from '../../services/api';

export default function AdminHeader({ onToggleMobile }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsList, setNotificationsList] = useState([]);

  const fetchLiveNotifications = async () => {
    try {
      const res = await adminAPI.getStats();
      const stats = res.data;
      if (!stats) return;

      const items = [];
      if (stats.unreadMessages > 0) {
        items.push({
          id: 'contact_unread',
          type: 'contact',
          title: 'Unread Support Messages',
          text: `${stats.unreadMessages} unread enquiry message(s) in support inbox`,
          time: 'Active Inbox',
          icon: Mail,
          read: false,
        });
      }

      if (stats.pendingVerifications > 0) {
        items.push({
          id: 'pending_verifications',
          type: 'verification',
          title: 'Pending ID Verifications',
          text: `${stats.pendingVerifications} member profile(s) awaiting verification review`,
          time: 'Action Required',
          icon: FileCheck,
          read: false,
        });
      }

      if (stats.recentRegistrations?.length > 0) {
        const latestUser = stats.recentRegistrations[0];
        items.push({
          id: `latest_user_${latestUser._id}`,
          type: 'registration',
          title: 'New Member Registration',
          text: `${latestUser.fullName} (${latestUser.email}) joined SS Matrimony`,
          time: new Date(latestUser.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          icon: UserPlus,
          read: false,
        });
      }

      setNotificationsList(items);
      setUnreadCount(items.length);
    } catch (err) {
      console.error('Error fetching admin notifications:', err);
    }
  };

  useEffect(() => {
    fetchLiveNotifications();
  }, []);

  const handleMarkAllRead = () => {
    setUnreadCount(0);
    setNotificationsList((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const todayDateString = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <header
      style={{
        height: '70px',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        padding: '0 1.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 990,
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
      }}
    >
      {/* Left: Mobile Menu Toggle & Search Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onToggleMobile}
          style={{
            background: 'none',
            border: 'none',
            color: '#475569',
            cursor: 'pointer',
            padding: '0.4rem',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
          }}
          className="admin-mobile-toggle"
        >
          <Menu size={22} />
        </button>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: '#F1F5F9',
            padding: '0.5rem 0.9rem',
            borderRadius: '20px',
            border: '1px solid #E2E8F0',
            width: '280px',
          }}
        >
          <Search size={16} color="#94A3B8" />
          <input
            type="text"
            placeholder="Search admin console..."
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: '0.85rem',
              width: '100%',
              color: '#1E293B',
            }}
          />
        </div>
      </div>

      {/* Right: Date, Notifications & Admin Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Date Display */}
        <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: '600' }} className="admin-date-display">
          {todayDateString}
        </div>

        {/* Interactive Notifications Bell */}
        <div style={{ position: 'relative' }}>
          <div
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: showNotifications ? '#0B3B91' : '#F1F5F9',
              color: showNotifications ? '#FFFFFF' : '#475569',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <Bell size={18} />
          </div>

          {unreadCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                backgroundColor: '#EF4444',
                color: '#FFFFFF',
                fontSize: '0.65rem',
                fontWeight: '800',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #FFFFFF',
                pointerEvents: 'none',
              }}
            >
              {unreadCount}
            </span>
          )}

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '48px',
                width: '340px',
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                border: '1px solid #E2E8F0',
                padding: '1.25rem',
                zIndex: 1000,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.75rem' }}>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '800', color: '#0F172A' }}>Live System Alerts</h4>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#0B3B91',
                      fontSize: '0.78rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.2rem',
                    }}
                  >
                    <Check size={14} /> Mark Read
                  </button>
                )}
              </div>

              {notificationsList.length === 0 ? (
                <div style={{ padding: '1.5rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem' }}>
                  No pending system notifications
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {notificationsList.map((n) => {
                    const Icon = n.icon;
                    return (
                      <div
                        key={n.id}
                        style={{
                          display: 'flex',
                          gap: '0.75rem',
                          padding: '0.65rem',
                          borderRadius: '10px',
                          backgroundColor: n.read ? '#FFFFFF' : '#F8FAFC',
                          border: '1px solid #E2E8F0',
                        }}
                      >
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            backgroundColor: '#EFF6FF',
                            color: '#0B3B91',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <Icon size={16} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.825rem', fontWeight: '700', color: '#0F172A' }}>{n.title}</div>
                          <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.15rem' }}>{n.text}</div>
                          <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '0.2rem' }}>{n.time}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Admin Profile Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', paddingLeft: '0.5rem', borderLeft: '1px solid #E2E8F0' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: '#0B3B91',
              color: '#FFFFFF',
              fontWeight: '800',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1.5px solid #D4A017',
            }}
          >
            A
          </div>
          <div className="admin-profile-meta">
            <div style={{ fontSize: '0.88rem', fontWeight: '800', color: '#0F172A', lineHeight: '1.2' }}>
              {user?.fullName || 'SS Matrimony Admin'}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#166534', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <ShieldCheck size={12} /> System Admin
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Logout"
            style={{
              background: 'none',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              marginLeft: '0.5rem',
              padding: '0.3rem',
              borderRadius: '6px',
            }}
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </header>
  );
}
