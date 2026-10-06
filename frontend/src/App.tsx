import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Xerox from './pages/Xerox';
import ShopForm from './pages/ShopForm';
import MonthlyEntries from './pages/MonthlyEntries';
import Attendance from './pages/Attendance';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isUnlocked, loading } = useAuth();
  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>;
  if (!isUnlocked) return <Navigate to="/login" />;
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<ProtectedRoute><Xerox /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/shop/:shopId" element={<ProtectedRoute><ShopForm /></ProtectedRoute>} />
            <Route path="/monthly-entries" element={<ProtectedRoute><MonthlyEntries /></ProtectedRoute>} />
            <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
