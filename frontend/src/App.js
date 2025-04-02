import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
import Login from "./Login/Login";
import Register from "./Register/Register";
import ClubSearch from "./Clubs/ClubSearch";
import ClubRegister from "./Clubs/RegisterClub";
import 'bootstrap/dist/css/bootstrap.min.css';


// for testing
import ClubDashboard from "./Clubs/ClubDashboard";

import Friends from "./Friends/Friends";
import Dashboard from "./Dashboard/Dashboard";

const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  console.log("Token check:", token); // Debugging token

  // FOR FRONTEND DEV PURPOSES. REMOVE BEFORE MERGING
  // return true;

  return token !== null;
  try {
    if (!token) return false;
    // Optionally: add more checks later like expiry
    return true;
  } catch {
    return false;
  }
};

function App() {
  useEffect(() => {
    const currentPath = window.location.pathname;
    if (["/login", "/register"].includes(currentPath)) {
      localStorage.removeItem("token");
    }
  }, []);


  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={!isAuthenticated() ? <Login /> : <Navigate to="/home" />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Route */}
        <Route path="/home" element={isAuthenticated() ? <Home /> : <Navigate to="/login" />} />
        <Route path="/clubs" element={isAuthenticated() ? <ClubSearch /> : <Navigate to="/login" />} />
        <Route path="/friends" element={isAuthenticated() ? <Friends /> : <Navigate to="/login" />} />
        <Route path="/dashboard" element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/clubHome" element={isAuthenticated() ? <ClubDashboard /> : <Navigate to="/login" />} />
        <Route path="/clubRegister" element={isAuthenticated() ? <ClubRegister /> : <Navigate to="/login" />} />


        {/* Default Route */}
        <Route path="*" element={isAuthenticated() ? <Navigate to="/home" /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;


//TESTING CARD
// import ProfileCard from './ProfileCard/ProfileCard';
// import profilePic from './assets/profilePic.png'
// import ProfilePage from './Profile/ProfilePage.js';
//
// function App() {
//     return(
//         <ProfilePage/>
//     );
// }
// export default App;