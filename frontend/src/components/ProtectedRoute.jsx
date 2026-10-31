import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

/**
 * ProtectedRoute
 *
 * Wraps routes that require authentication.
 *
 * Usage (two patterns):
 *
 *   // Wrapping a layout with nested routes (uses <Outlet>):
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/admin/dashboard" element={<Dashboard />} />
 *   </Route>
 *
 *   // Wrapping a single component (uses children prop):
 *   <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  // While we're verifying the stored token, show a full-page spinner
  if (isLoading) {
    return <LoadingSpinner fullPage size="lg" label="Verifying session…" />;
  }

  // Not authenticated — redirect to login, preserving the intended destination
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Render nested routes (layout pattern) OR a direct child
  return children ? children : <Outlet />;
}
