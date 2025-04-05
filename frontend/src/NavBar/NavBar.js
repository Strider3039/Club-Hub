import React from "react";
import "./NavBar.css";
import { Link, useNavigate } from "react-router-dom";

function NavBar(props) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
        window.location.reload(); // Optional: force re-render after logout
    };

    return (
        <nav className="navbar">
            <h1>{props.page}</h1>
            <div className="menu">
                <Link to="/Home">Home</Link>
                <Link to="/Clubs">Clubs</Link>

                <div className="menu-item">
                    <Link to="/friends">Friends</Link>
                </div>

                <Link to="/dashboard">Dashboard</Link>

                <button onClick={handleLogout} className="logout-button">
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default NavBar;
