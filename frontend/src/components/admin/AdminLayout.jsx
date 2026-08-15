import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

export default function AdminLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      {/* Fixed Admin Left Sidebar */}
      <AdminSidebar
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Content Area Offset by Sidebar Width */}
      <div
        style={{
          flexGrow: 1,
          marginLeft: '260px',
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          transition: 'margin-left 0.3s ease',
        }}
        className="admin-main-wrapper"
      >
        {/* Top Header */}
        <AdminHeader onToggleMobile={() => setIsMobileOpen(!isMobileOpen)} />

        {/* Dynamic Nested Route Content Window */}
        <main style={{ flexGrow: 1, padding: '2rem 2.25rem 4rem', backgroundColor: '#F8FAFC' }}>
          <Outlet />
        </main>
      </div>

      {/* Mobile Styles */}
      <style>{`
        @media (max-width: 1024px) {
          .admin-sidebar {
            transform: translateX(-100%);
          }
          .admin-sidebar.open {
            transform: translateX(0);
          }
          .admin-main-wrapper {
            margin-left: 0 !important;
          }
          .admin-date-display {
            display: none;
          }
        }
        @media (max-width: 640px) {
          .admin-profile-meta {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
