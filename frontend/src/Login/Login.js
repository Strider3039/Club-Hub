import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
        const response =await axios.post(`${process.env.REACT_APP_API_BASE_URL}/login/`, {
            username,
            password,
        });

            // Ensure that you have a valid token in response.data.access
            if (response.data.access) {
                // Store the token correctly
                localStorage.setItem("token", response.data.access);
                localStorage.setItem("user", JSON.stringify(response.data.user));


                // Redirect to the home page
                navigate("/home");
                window.location.reload();
            } else {
                setError("Invalid response from server.");
            }
        } catch (error) {
            console.error("Error logging in", error);
            setError("Login failed. Please check your credentials.");
        }

};

  return (
    <div className="Login">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <p>Don't have an account? <a href="/register">Register here</a></p>
    </div>
  );
}

export default Login;


// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./Login.css";
//
// function Login() {
//     const [username, setUsername] = useState("");
//     const [password, setPassword] = useState("");
//     const [isSignup, setIsSignup] = useState(false); // Add this line
//     const navigate = useNavigate();
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//
//         try {
//             const response = await axios.post("http://localhost:8000/login/", {
//                 username,
//                 password
//             });
//
//             if (response.data.success) {
//                 alert(response.data.message);
//                 navigate("/home"); // Redirect to Home page
//             } else {
//                 alert(response.data.detail);
//             }
//         } catch (error) {
//             alert(error.response.data.detail || "An error occurred");
//         }
//     };
//
//     return (
//         <div className={"Login"}>
//             <h2>{isSignup ? "Sign Up" : "Login"}</h2>
//             <form onSubmit={handleSubmit}>
//                 <input
//                     className="inputUsername"
//                     type="text"
//                     placeholder="Username"
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                     required
//                 />
//                 <input
//                     className="inputPassword"
//                     type="password"
//                     placeholder="Password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                 />
//                 <button className={"submitButton"} type="submit">
//                     {isSignup ? "Sign Up" : "Login"}
//                 </button>
//             </form>
//             <button onClick={() => setIsSignup(!isSignup)}>
//                 {isSignup ? "Already have an account? Login" : "Don't have an account? Sign Up"}
//             </button>
//         </div>
//     );
// }
//
// export default Login;