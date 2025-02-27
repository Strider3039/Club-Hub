import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isSignup, setIsSignup] = useState(false);
    const navigate = useNavigate(); // Hook for navigation

    // Dummy account for testing
    const dummyUser = {
        username: "testuser",
        password: "testpass"
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if username and password match the dummy account
        if (username === dummyUser.username && password === dummyUser.password) {
            // Simulate successful login
            alert("Login successful!");
            navigate("/home"); // Redirect to Home page (adjust path if needed)
        } else {
            alert("Invalid username or password.");
        }
    };

    return (
        <div className={"Login"}>
            <h2>{isSignup ? "Sign Up" : "Login"}</h2>
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
                <button
                    className={"submitButton"} type="submit"> {isSignup ? "Sign Up" : "Login"}
                </button>
                <button className={"signupButton"} onClick={() => setIsSignup(!isSignup)}>
                    {isSignup ? "Already have an account? Login" : "Don't have an account? Sign Up"}
                </button>
            </form>
        </div>
    );
}

export default Login;
