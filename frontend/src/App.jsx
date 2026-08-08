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
import Messages from './pages/Messages';
import AdminDashboard from './pages/AdminDashboard';
import Onboarding from './pages/Onboarding';

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
  const { isAuthenticated, profile, loading } = useAuth();
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0', color: '#0B3B91', fontWeight: '700' }}>
        Loading authentication status...
      </div>
    );
  }
  if (!isAuthenticated) return children;
  return profile?.isWizardCompleted ? <Navigate to="/dashboard" replace /> : <Navigate to="/onboarding" replace />;
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
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return isAdmin ? children : <Navigate to="/unauthorized" replace />;
};

export default function App() {
  return (
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

          {/* Protected Member Dashboard & Messaging */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            }
          />

          {/* Protected Admin Console */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* Fallback Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
