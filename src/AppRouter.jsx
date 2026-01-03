import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Header } from './components/layout/Header';
import AuthPage from './pages/AuthPage';

// Layout with Header
const MainLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1 pt-16">
      {children}
    </main>
  </div>
);

const AdminLayout = ({ children }) => (
  <div className="min-h-screen bg-background">
    {children}
  </div>
);

// Route Guards
const PrivateRoute = ({ children }) => {
  const isAuthenticated = false; // Placeholder for actual auth logic
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

const AdminRoute = ({ children }) => {
  const isAdmin = false; // Placeholder for actual admin logic
  return isAdmin ? children : <Navigate to="/" />;
};

// Placeholder Pages for Phase 3+
const HomePage = () => <div className="p-20 text-center text-gold">Home Page (Coming in Phase 3)</div>;
const MovieDetail = () => <div className="p-20 text-center text-gold">Movie Detail (Coming in Phase 4)</div>;
const BookingPage = () => <div className="p-20 text-center text-gold">Booking Page (Coming in Phase 4)</div>;
const AdminDashboard = () => <div className="p-20 text-center text-gold">Admin Dashboard (Coming in Phase 5)</div>;

const AppRouter = () => {
  return (
    <Router>
      <Toaster position="top-right" expand={false} richColors />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/movie/:id" element={<MainLayout><MovieDetail /></MainLayout>} />

        {/* Protected Routes */}
        <Route path="/booking/:id" element={
          <PrivateRoute>
            <MainLayout><BookingPage /></MainLayout>
          </PrivateRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin/*" element={
          <AdminRoute>
            <AdminLayout><AdminDashboard /></AdminLayout>
          </AdminRoute>
        } />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
