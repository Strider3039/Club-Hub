import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
import Login from "./Login/Login";
import Register from "./Register/Register";
import ClubSearch from "./Clubs/ClubSearch";
import ClubRegister from "./Clubs/RegisterClub";
import 'bootstrap/dist/css/bootstrap.min.css';

// For testing and club pages
import ClubDashboard from "./Clubs/ClubDashboard";
import ClubDetail from "./Clubs/ClubDetail"; // New Club Detail page
import Friends from "./Friends/Friends";
import Dashboard from "./Dashboard/Dashboard";

// Check authentication by looking for the access token in localStorage
const isAuthenticated = () => {
  const token = localStorage.getItem("access");
  console.log("Token check:", token);
  return token !== null;
};

function App() {
  // auth state will force re-render when the login status changes
  const [auth, setAuth] = useState(isAuthenticated());

  // Periodically check localStorage for changes (e.g., after login or logout)
  useEffect(() => {
    const interval = setInterval(() => {
      setAuth(isAuthenticated());
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={!auth ? <Login /> : <Navigate to="/home" />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/home" element={auth ? <Home /> : <Navigate to="/login" />} />
        <Route path="/clubs" element={auth ? <ClubSearch /> : <Navigate to="/login" />} />
        <Route path="/friends" element={auth ? <Friends /> : <Navigate to="/login" />} />
        <Route path="/dashboard" element={auth ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/clubRegister" element={auth ? <ClubRegister /> : <Navigate to="/login" />} />

        {/* Club Detail Route */}
        <Route path="/clubHome/:id" element={auth ? <ClubDetail /> : <Navigate to="/login" />} />

        {/* Catch-all Route */}
        <Route path="*" element={auth ? <Navigate to="/home" /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
