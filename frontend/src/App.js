import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
import Login from "./Login/Login";
import Register from "./Register/Register";
import ClubSearch from "./Clubs/ClubSearch";
import ClubRegister from "./Clubs/RegisterClub";
import 'bootstrap/dist/css/bootstrap.min.css';

// For testing
import ClubDashboard from "./Clubs/ClubDashboard";
import Friends from "./Friends/Friends";
import Dashboard from "./Dashboard/Dashboard";

// ✅ Auth check using correct key
const isAuthenticated = () => {
  const token = localStorage.getItem("access");
  console.log("Token check:", token);
  return token !== null;
};

function App() {
  useEffect(() => {
    const currentPath = window.location.pathname;
    if (["/login", "/register"].includes(currentPath)) {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("user");
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={!isAuthenticated() ? <Login /> : <Navigate to="/home" />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/home" element={isAuthenticated() ? <Home /> : <Navigate to="/login" />} />
        <Route path="/clubs" element={isAuthenticated() ? <ClubSearch /> : <Navigate to="/login" />} />
        <Route path="/friends" element={isAuthenticated() ? <Friends /> : <Navigate to="/login" />} />
        <Route path="/dashboard" element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/clubHome" element={isAuthenticated() ? <ClubDashboard /> : <Navigate to="/login" />} />
        <Route path="/clubRegister" element={isAuthenticated() ? <ClubRegister /> : <Navigate to="/login" />} />

        {/* Catch-all Route */}
        <Route path="*" element={isAuthenticated() ? <Navigate to="/home" /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
