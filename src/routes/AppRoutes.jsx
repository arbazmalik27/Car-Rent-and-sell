import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from '../components/ProtectedRoute';

// Public pages
import Home from '../pages/Home';
import RentCars from '../pages/RentCars';
import RentalDetails from '../pages/RentalDetails';
import BuyCars from '../pages/BuyCars';
import BuyCarDetails from '../pages/BuyCarDetails';
import SellCar from '../pages/SellCar';
import Booking from '../pages/Booking';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Login from '../pages/Login';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';

// Admin pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import CarsManagement from '../pages/admin/CarsManagement';
import BookingsManagement from '../pages/admin/BookingsManagement';
import SellRequests from '../pages/admin/SellRequests';
import UsersManagement from '../pages/admin/UsersManagement';
import AdminAnalytics from '../pages/admin/AdminAnalytics';
import FeaturedCars from '../pages/admin/FeaturedCars';
import AdminReviews from '../pages/admin/AdminReviews';
import AdminNotifications from '../pages/admin/AdminNotifications';
import AdminSettings from '../pages/admin/AdminSettings';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes inside MainLayout */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="rent" element={<RentCars />} />
        <Route path="rent/:id" element={<RentalDetails />} />
        <Route path="buy" element={<BuyCars />} />
        <Route path="buy/:id" element={<BuyCarDetails />} />
        <Route path="sell" element={<SellCar />} />
        <Route path="booking" element={<Booking />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        
        {/* Customer Profile Route (Protected - must be at least customer role) */}
        <Route path="profile" element={
          <ProtectedRoute requiredRole="customer">
            <Profile />
          </ProtectedRoute>
        } />
      </Route>

      {/* Login Page (Independent of Layout) */}
      <Route path="/login" element={<Login />} />

      {/* Protected Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute requiredRole="admin">
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="cars" element={<CarsManagement />} />
        <Route path="bookings" element={<BookingsManagement />} />
        <Route path="sell-requests" element={<SellRequests />} />
        <Route path="users" element={<UsersManagement />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="featured" element={<FeaturedCars />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Aliases and Redirects as per specifications */}
      <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/dashboard/*" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/cars/manage" element={<Navigate to="/admin/cars" replace />} />

      {/* Fallback 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;

