import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem('ss_token');
    const refreshToken = localStorage.getItem('ss_refresh_token');

    if (!token && !refreshToken) {
      setUser(null);
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      const res = await authAPI.getMe();
      setUser(res.data.user);
      setProfile(res.data.profile);
    } catch (error) {
      if (refreshToken) {
        try {
          const refreshRes = await authAPI.refreshToken(refreshToken);
          const newToken = refreshRes.data.token;
          const newRefreshToken = refreshRes.data.refreshToken;
          if (newToken) localStorage.setItem('ss_token', newToken);
          if (newRefreshToken) localStorage.setItem('ss_refresh_token', newRefreshToken);

          const meRes = await authAPI.getMe();
          setUser(meRes.data.user);
          setProfile(meRes.data.profile);
          setLoading(false);
          return;
        } catch (refreshErr) {
          console.warn('Auto refresh failed on startup:', refreshErr);
        }
      }
      localStorage.removeItem('ss_token');
      localStorage.removeItem('ss_refresh_token');
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = (token, refreshToken, userData, profileData) => {
    if (token) localStorage.setItem('ss_token', token);
    if (refreshToken) localStorage.setItem('ss_refresh_token', refreshToken);
    setUser(userData);
    setProfile(profileData);
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('ss_token');
      localStorage.removeItem('ss_refresh_token');
      setUser(null);
      setProfile(null);
    }
  };

  const updateProfileState = (updatedProfile) => {
    setProfile(updatedProfile);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        login,
        logout,
        fetchCurrentUser,
        updateProfileState,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
