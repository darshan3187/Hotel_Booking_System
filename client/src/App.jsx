import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Preloader from './components/Preloader';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Public & User Pages
import Home from './pages/Home';
import Hotels from './pages/Hotels';
import HotelDetails from './pages/HotelDetails';
import BookRoom from './pages/BookRoom';
import BookingSuccess from './pages/BookingSuccess';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Bookings from './pages/Bookings';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminHotels from './pages/admin/AdminHotels';
import AdminRooms from './pages/admin/AdminRooms';
import AdminBookings from './pages/admin/AdminBookings';
import AdminUsers from './pages/admin/AdminUsers';

// Route Protection
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    // Show preloader animation for 4.5 seconds on initial load, then smoothly reveal the app
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      {initialLoading && (
        <Preloader
          fullscreen={true}
          isLoading={initialLoading}
          onComplete={() => setInitialLoading(false)}
        />
      )}
      <BrowserRouter>
        <Routes>
          {/* Main Guest & User Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/hotels/:id" element={<HotelDetails />} />
            <Route path="/rooms/:roomId" element={<BookRoom />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected User Routes */}
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/bookings" 
              element={
                <ProtectedRoute>
                  <Bookings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/book/:roomId" 
              element={
                <ProtectedRoute>
                  <BookRoom />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/booking-success/:id" 
              element={<BookingSuccess />} 
            />
          </Route>

          {/* Admin Routes with AdminLayout */}
          <Route 
            path="/admin" 
            element={<AdminLayout />}
          >
            <Route index element={<AdminDashboard />} />
            <Route path="hotels" element={<AdminHotels />} />
            <Route path="rooms" element={<AdminRooms />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>

          {/* Catch-all 404 Route */}
          <Route element={<MainLayout />}>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
