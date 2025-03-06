import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
import Login from "./Login/Login";
import Register from "./Register/Register";

const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes - Allow login and register pages regardless of authentication */}
        <Route path="/login" element={!isAuthenticated() ? <Login /> : <Navigate to="/home" />} />
        <Route path="/register" element={!isAuthenticated() ? <Register /> : <Navigate to="/home" />} />

        {/* Protected Route - Redirect to login if not authenticated */}
        <Route path="/home" element={isAuthenticated() ? <Home /> : <Navigate to="/login" />} />

        {/* Redirect to login if no matching route */}
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