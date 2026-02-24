/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UploadMaterial from './pages/UploadMaterial';
import MaterialsList from './pages/MaterialsList';
import AdminPanel from './pages/AdminPanel';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes with Navbar */}
            <Route element={<ProtectedRoute />}>
              <Route
                path="/*"
                element={
                  <>
                    <Navbar />
                    <Routes>
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="materials" element={<MaterialsList />} />
                      <Route element={<ProtectedRoute allowedRoles={['lecturer']} />}>
                        <Route path="upload" element={<UploadMaterial />} />
                      </Route>
                      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                        <Route path="admin" element={<AdminPanel />} />
                      </Route>
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </>
                }
              />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

