import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css";

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

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/register/`, {
                first_name: firstName,
                last_name: lastName,
                email,
                date_of_birth: dateOfBirth,
                username,
                password,
            });

            // Auto-login after registration
            const loginResponse = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/login/`, {
                username,
                password,
            });

            // Save user info and token
            localStorage.setItem("token", loginResponse.data.access);
            localStorage.setItem("user", JSON.stringify(loginResponse.data.user));
            navigate("/home");

        } catch (error) {
            if (error.response && error.response.data) {
                if (error.response.data.email) {
                    setError("Email already exists");
                } else if (error.response.data.username) {
                    setError("Username already exists");
                } else {
                    setError("Registration failed. Please try again.");
                }
            } else {
                console.error("Error during registration", error);
                setError("Registration failed. Please try again.");
            }
        }
    };

    return (
        <div className="Register">
            <h1>Register</h1>
            <form onSubmit={handleRegister}>
                <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="date" placeholder="Date of Birth" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                <button type="submit">Register</button>
            </form>
            {error && <p className="error">{error}</p>}
            <p>Already have an account? <a href="/login">Login here</a></p>
        </div>
    );
}

export default Register;
