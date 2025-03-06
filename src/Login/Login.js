import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

function displaySignInFields() {

}

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

        // are we logging in or signing up?
        if (isSignup === false) {
            // logging in

            // Check if username and password match the dummy account
            if (username === dummyUser.username && password === dummyUser.password) {
                // Simulate successful login
                alert("Login successful!");
                navigate("/home"); // Redirect to Home page (adjust path if needed)
            } else {
                alert("Invalid username or password.");
            }

            const loginResponse = await axios.post('/api/register/', {
                username,
                password,
            });
            localStorage.setItem("user", JSON.stringify(loginResponse.data.token));

        }
        else
        {
            // signing up.
            // now we need to render forms for Email and Confirm Password.
            // logic for handling submitted data goes here

            const signupResponse = await axios.post('/api/register/', {
                username,
                // email,
                password,
            })

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
                    // if isSignup == true, button displays "Sign Up". Displays "Login" otherwise
                    className={"submitButton"} type="submit"> {isSignup ? "Sign Up" : "Login"}
                </button>
                <button
                    // flip the state of isSignup
                    className={"signupButton"} onClick={() => setIsSignup(!isSignup)}>

                    {/*// "Already have an account? Login" if true. "Don't have an account? Sign Up" if false.*/}
                    {isSignup ? "Already have an account? Login" : "Don't have an account? Sign Up"}
                </button>
            </form>
        </div>
    );
}

export default Login;
