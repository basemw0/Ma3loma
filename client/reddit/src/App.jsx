import './App.css';
import { useEffect } from 'react';
import { useLocation, useNavigate, Routes, Route } from 'react-router-dom';
import React from 'react';

// Import Pages
import Login from '../components/Pages/Login'; // Adjust path as needed
import Signup from "../components/Pages/Signup"; // Adjust path as needed
import ForgotPassword from "../components/Pages/ForgotPassword";
import ResetPassword from "../components/Pages/ResetPassword"; // <--- NEW IMPORT

// ... (Keep your other component imports like Landing, etc.) ...
import Landing from "../components/Landing/Landing";

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // Google Auth Logic
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      window.history.replaceState({}, document.title, "/");
      navigate("/");
    }
  }, [location, navigate]);

  return (
    <div className="App">
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} /> {/* <--- NEW ROUTE */}
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        {/* Main Routes */}
        <Route path="/" element={<Landing />} />
        {/* ... keep your other routes ... */}
      </Routes>
    </div>
  );
}

export default App;