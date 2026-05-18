import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/users';
import Rooms from './pages/rooms';
import Tenants from './pages/tenants';
import Payments from './pages/payments';
import Staff from './pages/staff';
import Complaints from './pages/complaints';
import Expenses from './pages/expenses';
import Visitors from './pages/visitors';
import Notices from './pages/notices';
import MainLayout from './layouts/MainLayout';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="h-screen w-full flex items-center justify-center bg-slate-900 text-white">Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="h-screen w-full flex items-center justify-center bg-slate-900 text-white">Loading...</div>;

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes (no sidebar) */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />

          {/* Protected routes — all share MainLayout (Sidebar + content area) */}
          <Route element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/tenants" element={<Tenants />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/complaints" element={<Complaints />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/visitors" element={<Visitors />} />
            <Route path="/notices" element={<Notices />} />
            {/* Add more protected pages here:
                <Route path="/settings" element={<Settings />} />
            */}
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
