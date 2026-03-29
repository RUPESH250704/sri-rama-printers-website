import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';

import Cards from './pages/Cards';
import OrderCard from './pages/OrderCard';
import MyOrders from './pages/MyOrders';
import AdminDashboard from './pages/AdminDashboard';
import SriRamaPrints from './pages/SriRamaPrints';
import Xerox from './pages/Xerox';
import ShopForm from './pages/ShopForm';
import MonthlyEntries from './pages/MonthlyEntries';
import BillbooksOrder from './pages/BillbooksOrder';
import RubberStampsOrder from './pages/RubberStampsOrder';
import BookbindingOrder from './pages/BookbindingOrder';
import VisitingCardsOrder from './pages/VisitingCardsOrder';
import Attendance from './pages/Attendance';

const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean; restrictedEmail?: boolean }> = ({ children, adminOnly = false, restrictedEmail = false }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && !user.isAdmin) return <Navigate to="/" />;
  if (restrictedEmail && user.email === 'chrupesh025@gmail.com') return <Navigate to="/" />;

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />

            <Route path="/cards" element={<Cards />} />
            <Route path="/order/:id" element={
              <ProtectedRoute>
                <OrderCard />
              </ProtectedRoute>
            } />
            <Route path="/my-orders" element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute adminOnly restrictedEmail>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/sri-rama-prints" element={
              <ProtectedRoute>
                <SriRamaPrints />
              </ProtectedRoute>
            } />
            <Route path="/xerox" element={
              <ProtectedRoute restrictedEmail>
                <Xerox />
              </ProtectedRoute>
            } />
            <Route path="/shop/:shopId" element={
              <ProtectedRoute restrictedEmail>
                <ShopForm />
              </ProtectedRoute>
            } />
            <Route path="/monthly-entries" element={
              <ProtectedRoute restrictedEmail>
                <MonthlyEntries />
              </ProtectedRoute>
            } />
            <Route path="/billbooks-order" element={
              <ProtectedRoute>
                <BillbooksOrder />
              </ProtectedRoute>
            } />
            <Route path="/rubber-stamps-order" element={
              <ProtectedRoute>
                <RubberStampsOrder />
              </ProtectedRoute>
            } />
            <Route path="/bookbinding-order" element={
              <ProtectedRoute>
                <BookbindingOrder />
              </ProtectedRoute>
            } />
            <Route path="/visiting-cards-order" element={
              <ProtectedRoute>
                <VisitingCardsOrder />
              </ProtectedRoute>
            } />
            <Route path="/attendance" element={
              <ProtectedRoute restrictedEmail>
                <Attendance />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;