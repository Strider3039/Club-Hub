import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:8000/signup/", {
                username,
                password
            });

            if (response.data.success) {
                alert(response.data.message);
                navigate("/login"); // Redirect to Login page
            } else {
                alert(response.data.detail);
            }
        } catch (error) {
            alert(error.response.data.detail || "An error occurred");
        }
    };

    return (
        <div className={"Register"}>
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <input
                    className="inputUsername"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    className="inputPassword"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button className={"submitButton"} type="submit">Sign Up</button>
            </form>
        </div>
    );
}

export default Register;
