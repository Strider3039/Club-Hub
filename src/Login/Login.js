import React, { useState } from "react";
import axios from "axios";

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
        <div>
            <h2>{isSignup ? "Sign Up" : "Login"}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit"> {isSignup ? "Sign Up" : "Login"} </button>
            </form>
            <button onClick={() => setIsSignup(!isSignup)}>
                {isSignup ? "Already have an account? Login" : "Don't have an account? Sign Up"}
            </button>
        </div>
    );
}

export default Login;
