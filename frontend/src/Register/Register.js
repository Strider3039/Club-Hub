import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import LightLogo from "../assets/Logo_Club_Hub.png";

function Register() {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            await axios.post(`${process.env.REACT_APP_API_BASE_URL}/register/`, {
                first_name: firstName,
                last_name: lastName,
                email,
                date_of_birth: dateOfBirth,
                username,
                password,
            });

            const loginResponse = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/login/`, {
                username,
                password,
            });

            localStorage.setItem("access", loginResponse.data.access);
            localStorage.setItem("refresh", loginResponse.data.refresh);
            localStorage.setItem("user", JSON.stringify(loginResponse.data.user));
            localStorage.setItem("username", loginResponse.data.user.username);
            navigate("/home");

        } catch (err) {
            if (err.response?.data) {
                if (err.response.data.email) {
                    setError("An account with this email already exists.");
                } else if (err.response.data.username) {
                    setError("This username is already taken.");
                } else {
                    setError("Registration failed. Please try again.");
                }
            } else {
                setError("Registration failed. Please try again.");
            }
        }
    };

    return (
        <div className="Register">
            <div className="register-card">
                <div className="register-logo">
                    <img src={LightLogo} alt="ClubHub" />
                </div>
                <h2>Create an account</h2>
                <p className="register-subtitle">Join ClubHub and find your community</p>

                <form onSubmit={handleRegister}>
                    <div className="register-row">
                        <div className="register-field">
                            <label>First Name</label>
                            <input
                                type="text"
                                placeholder="First name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="register-field">
                            <label>Last Name</label>
                            <input
                                type="text"
                                placeholder="Last name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="register-field">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="register-field">
                        <label>Date of Birth</label>
                        <input
                            type="date"
                            value={dateOfBirth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                        />
                    </div>

                    <div className="register-field">
                        <label>Username</label>
                        <input
                            type="text"
                            placeholder="Choose a username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="register-field">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="register-field">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="register-submit-btn">Create Account</button>
                </form>

                {error && <p className="register-error">{error}</p>}

                <p className="register-footer">
                    Already have an account? <a href="/login">Sign in</a>
                </p>
            </div>
        </div>
    );
}

export default Register;
