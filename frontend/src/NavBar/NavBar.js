// navigation bar component
import React from "react";
import "./NavBar.css";
import { Link, useNavigate } from "react-router-dom";

function NavBar(props) {
    const navigate = useNavigate(); // Hook for navigation

    const handleLogout = () => {
        // Remove the token from localStorage
        localStorage.removeItem("token");

        // Redirect to login page
        navigate("/login");
        window.location.reload();
    }

    return (
    <nav className="navbar">
        <h1>{props.page}</h1>
        <div className="menu">
            <Link to="/Home">Home</Link>
            <Link to="/Clubs">Clubs</Link>
            <Link to="/friends">
                Friends
                <div className="dropdown">
                    <a href={"#"}>My Friends</a>
                    <a href={"#"}>Requests</a>
                    <a href={"#"}>Search</a>
                </div>
            </Link>
            <Link to="/dashboard">Dashboard</Link>

            {/*Add a button to logout*/}
            <button onClick={handleLogout} className={"logout-button"}>Logout</button>
        </div>
    </nav>
    )
}

export default NavBar;
