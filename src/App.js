import './styles.css'; // Ensure styles.css is imported
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Authentication/Login';
import Register from './Authentication/Register';
import Home from './Home';
import Payroll from './Payroll';
import Attendance from './Attendance';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/home" 
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/payroll" 
            element={
              <PrivateRoute>
                <Payroll />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/attendance" 
            element={
              <PrivateRoute>
                <Attendance />
              </PrivateRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/home" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
