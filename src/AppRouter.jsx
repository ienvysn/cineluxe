import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Header } from './components/layout/Header';
import Index from './pages/Index';
import MovieDetail from './pages/MovieDetail';
import AuthPage from './pages/AuthPage';
import MyBookings from './pages/MyBookings';
import BookingConfirmation from './pages/BookingConfirmation';
import NotFound from './pages/NotFound';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLogin from './pages/admin/AdminLogin';
import AdminMovies from './pages/admin/AdminMovies';
import AdminScreens from './pages/admin/AdminScreens';
import AdminShowtimes from './pages/admin/AdminShowtimes';
import AdminBookings from './pages/admin/AdminBookings';
import AdminValidate from './pages/admin/AdminValidate';
import AdminPricing from './pages/admin/AdminPricing';

// Layout with Header
const MainLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col pt-0">
    <Header />
    <main className="flex-1 pt-0">
      {children}
    </main>
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

// Placeholder Pages for Phase 4+
const BookingPage = () => <div className="p-20 text-center text-gold pt-32">Booking Page (Coming in Phase 4)</div>;

const AppRouter = () => {
  return (
    <Router>
      <Toaster position="top-right" expand={false} richColors />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout><Index /></MainLayout>} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/movie/:id" element={<MainLayout><MovieDetail /></MainLayout>} />

        {/* Protected Routes */}
        <Route path="/bookings" element={
          <PrivateRoute>
            <MainLayout><MyBookings /></MainLayout>
          </PrivateRoute>
        } />
        <Route path="/booking/success" element={
          <PrivateRoute>
            <BookingConfirmation />
          </PrivateRoute>
        } />
        <Route path="/booking/:id" element={
          <PrivateRoute>
            <MainLayout><BookingPage /></MainLayout>
          </PrivateRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="movies" element={<AdminMovies />} />
          <Route path="screens" element={<AdminScreens />} />
          <Route path="showtimes" element={<AdminShowtimes />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="validate" element={<AdminValidate />} />
          <Route path="pricing" element={<AdminPricing />} />

        </Route>

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
