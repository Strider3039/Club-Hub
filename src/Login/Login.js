import React, { useState } from "react";
import axios from "axios";
import "./Login.css";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isSignup, setIsSignup] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isSignup ? "/signup" : "/login";
        try {
            const response = await axios.post(`http://localhost:8000${endpoint}`, { username, password });
            if (response.data.success) {
                // Redirect to the main app page
                window.location.href = "/";
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error("There was an error!", error);
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
