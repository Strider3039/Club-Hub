import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
import Login from "./Login/Login";
import Register from "./Register/Register";
import ClubSearch from "./Clubs/ClubSearch";
import ClubRegister from "./Clubs/RegisterClub";
import 'bootstrap/dist/css/bootstrap.min.css';
import ClubDashboard from "./Clubs/ClubDashboard";
import Friends from "./Friends/Friends";
import ProfileDashboard from "./Profile/ProfilePage";
import NavBar from "./NavBar/NavBar";

// Check authentication by looking for the access token in localStorage
const isAuthenticated = () => {
    const token = localStorage.getItem("access");
    console.log("Token check:", token);
    return token !== null;
};

function App() {
    const [auth, setAuth] = useState(isAuthenticated());

    // 🌗 Theme state
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setAuth(isAuthenticated());
        }, 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`app ${theme}`}>
            <Router>
                {auth && <NavBar toggleTheme={toggleTheme} />}
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={!auth ? <Login /> : <Navigate to="/home" />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected Routes */}
                    <Route path="/home" element={auth ? <Home /> : <Navigate to="/login" />} />
                    <Route path="/clubs" element={auth ? <ClubSearch /> : <Navigate to="/login" />} />
                    <Route path="/friends" element={auth ? <Friends /> : <Navigate to="/login" />} />
                    <Route path="/dashboard" element={auth ? <ProfileDashboard /> : <Navigate to="/login" />} />
                    <Route path="/clubRegister" element={auth ? <ClubRegister /> : <Navigate to="/login" />} />
                    <Route path="/clubHome/:id" element={auth ? <ClubDashboard /> : <Navigate to="/login" />} />

                    {/* Catch-all */}
                    <Route path="*" element={auth ? <Navigate to="/home" /> : <Navigate to="/login" />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
