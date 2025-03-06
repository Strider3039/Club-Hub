import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
import Login from "./Login/Login";
import Register from "./Register/Register";

const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  console.log("Token check:", token); // Log the token to debug
  return token !== null;
};

function App() {
  useEffect(() => {
    // Clear token if it's there and we're on the login page
    if (window.location.pathname === "/login" && isAuthenticated()) {
      localStorage.removeItem("token");
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={!isAuthenticated() ? <Login /> : <Navigate to="/home" />} />
        <Route path="/register" element={!isAuthenticated() ? <Register /> : <Navigate to="/home" />} />

        {/* Protected Route */}
        <Route path="/home" element={isAuthenticated() ? <Home /> : <Navigate to="/login" />} />

        {/* Default Route */}
        <Route path="*" element={<Navigate to="/login" />} />
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