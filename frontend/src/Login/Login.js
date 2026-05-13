import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import LightLogo from "../assets/Logo_Club_Hub.png";

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/login/`, {
                username,
                password,
            });

            if (response.data.access && response.data.refresh) {
                localStorage.setItem("access", response.data.access);
                localStorage.setItem("refresh", response.data.refresh);
                localStorage.setItem("user", JSON.stringify(response.data.user));
                localStorage.setItem("username", response.data.user.username);
                navigate("/home");
            } else {
                setError("Invalid response from server.");
            }
        } catch (err) {
            console.error("Login error:", err.response?.data || err.message);
            setError("Incorrect username or password.");
        }
    };

    return (
        <div className="Login">
            <div className="login-card">
                <div className="login-logo">
                    <img src={LightLogo} alt="ClubHub" />
                </div>
                <h2>Welcome back</h2>
                <p className="login-subtitle">Sign in to your ClubHub account</p>

                <form onSubmit={handleLogin}>
                    <div className="login-field">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoComplete="username"
                        />
                    </div>
                    <div className="login-field">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                        />
                    </div>
                    <button type="submit" className="login-submit-btn">Sign In</button>
                </form>

                {error && <p className="login-error">{error}</p>}

                <p className="login-footer">
                    Don't have an account? <a href="/register">Register here</a>
                </p>
            </div>
        </div>
    );
}

export default Login;
