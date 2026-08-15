import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import FAQPage from './pages/FAQPage';
import SuccessStoriesPage from './pages/SuccessStoriesPage';
import AllSuccessStoriesPage from './pages/AllSuccessStoriesPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Unauthorized from './pages/Unauthorized';
import Profiles from './pages/Profiles';
import ProfileDetail from './pages/ProfileDetail';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';

// Admin CRM Components
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import InterestManagementPage from './pages/admin/InterestManagementPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import ContactInboxPage from './pages/admin/ContactInboxPage';
import VerificationsPage from './pages/admin/VerificationsPage';
import SuccessStoriesCMSPage from './pages/admin/SuccessStoriesCMSPage';
import ImportProfilesPage from './pages/admin/ImportProfilesPage';
import WebsiteCMSPage from './pages/admin/WebsiteCMSPage';
import ReportsAnalyticsPage from './pages/admin/ReportsAnalyticsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminLogin from './pages/admin/AdminLogin';

// Protected Route Component (Requires authentication)
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0', color: '#0B3B91', fontWeight: '700' }}>
        Loading authentication status...
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Component (Restricts logged-in users from accessing Login/Register)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0', color: '#0B3B91', fontWeight: '700' }}>
        Loading authentication status...
      </div>
    );
  }
  if (!isAuthenticated) return children;
  return <Navigate to="/dashboard" replace />;
};

// Admin Route Component (Requires Admin role)
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0', color: '#0B3B91', fontWeight: '700' }}>
        Loading authentication status...
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  return isAdmin ? children : <Navigate to="/unauthorized" replace />;
};

export default function App() {
  return (
    <Routes>
      {/* Admin Login Route (Independent Flow) */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected Admin CRM Panel (Isolated Layout without Website Navbar/Footer) */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="interests" element={<InterestManagementPage />} />
        <Route path="users" element={<UserManagementPage />} />
        <Route path="verifications" element={<VerificationsPage />} />
        <Route path="success-stories" element={<SuccessStoriesCMSPage />} />
        <Route path="contact" element={<ContactInboxPage />} />
        <Route path="import-profiles" element={<ImportProfilesPage />} />
        <Route path="cms" element={<WebsiteCMSPage />} />
        <Route path="reports" element={<ReportsAnalyticsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      {/* Public & Member Portal Wrapper with Public Navbar and Footer */}
      <Route
        path="*"
        element={
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main style={{ flexGrow: 1 }}>
              <Routes>
                {/* Public Unrestricted Pages */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/success-stories" element={<SuccessStoriesPage />} />
                <Route path="/success-stories/all" element={<AllSuccessStoriesPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-conditions" element={<TermsConditions />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* Authentication Guest-Only Pages */}
                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <PublicRoute>
                      <Register />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/forgot-password"
                  element={
                    <PublicRoute>
                      <ForgotPassword />
                    </PublicRoute>
                  }
                />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/verify-email/:token" element={<VerifyEmail />} />

                {/* Member Profiles */}
                <Route path="/profiles" element={<Profiles />} />
                <Route path="/profiles/:id" element={<ProfileDetail />} />

                {/* Protected Onboarding & Profile Creation Wizard */}
                <Route
                  path="/onboarding"
                  element={
                    <ProtectedRoute>
                      <Onboarding />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/create-profile"
                  element={
                    <ProtectedRoute>
                      <Onboarding />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/edit-profile"
                  element={
                    <ProtectedRoute>
                      <Onboarding isEditMode={true} />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Member Dashboard */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback Redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        }
      />
    </Routes>
  );
}
