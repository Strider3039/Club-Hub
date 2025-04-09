import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Dropdown, Button } from "react-bootstrap";
import ClubHubLogo from "../assets/Logo_Club_Hub.png"; // ✅ Logo import

function NavBar({ toggleTheme }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");
        navigate("/login");
        window.location.reload();
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light px-4 shadow-sm">
            <Link className="navbar-brand d-flex align-items-center" to="/home">
                <img
                    src={ClubHubLogo}
                    alt="ClubHub Logo"
                    height="40"
                    className="me-2"
                />
            </Link>

            <div className="collapse navbar-collapse">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                        <Link className="nav-link" to="/home">Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/clubs">Clubs</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/friends">Friends</Link>
                    </li>
                </ul>

                <div className="d-flex align-items-center gap-3">
                    {/* Dark/Light Toggle */}
                    <Button variant="outline-secondary" onClick={toggleTheme}>
                        Toggle Theme
                    </Button>

                    {/* Profile Dropdown */}
                    <Dropdown align="end">
                        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                            Profile
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item as={Link} to="/settings">Settings</Dropdown.Item>
                            <Dropdown.Item as={Link} to="/dashboard">Dashboard</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;
