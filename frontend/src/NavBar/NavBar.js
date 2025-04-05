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
                    <div className="dropdown">
                        <Link to="/friends/my-friends">My Friends</Link>
                        <Link to="/friends/requests">Requests</Link>
                        <Link to="/friends/search">Search</Link>
                    </div>
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
