import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dropdown, Button } from "react-bootstrap";
import LightLogo from "../assets/Logo_Club_Hub.png";
import DarkLogo from "../assets/Logo_Dark_Mode.png";

function NavBar({ toggleTheme }) {
    const navigate = useNavigate();
    const [isDark, setIsDark] = useState(false);

    // Watch for class changes on <body> or app root to detect dark mode
    useEffect(() => {
        const observer = new MutationObserver(() => {
            const app = document.querySelector(".app");
            setIsDark(app?.classList.contains("dark"));
        });

        const app = document.querySelector(".app");
        if (app) {
            observer.observe(app, { attributes: true, attributeFilter: ["class"] });
            setIsDark(app.classList.contains("dark"));
        }

        return () => observer.disconnect();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");
        navigate("/login");
        window.location.reload();
    };

    return (
        <nav className="custom-navbar navbar-expand-lg px-4 py-3 shadow-sm">
            <Link className="navbar-brand d-flex align-items-center" to="/home">
                <img
                    src={isDark ? DarkLogo : LightLogo}
                    alt="ClubHub Logo"
                    height="60"
                    className="me-2"
                />
            </Link>

            <div className="collapse navbar-collapse">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-flex gap-4">
                    <li className="nav-item">
                        <Link className="nav-link text-white" to="/home">Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link text-white" to="/clubs">Clubs</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link text-white" to="/friends">Friends</Link>
                    </li>
                </ul>

                <div className="d-flex align-items-center gap-3">
                    <Button variant="outline-light" onClick={toggleTheme}>
                        Toggle Theme
                    </Button>

                    <Dropdown align="end">
                        <Dropdown.Toggle
                            id="dropdown-basic"
                            variant="light"
                            className="profile-dropdown"
                        >
                            Profile
                        </Dropdown.Toggle>

                        <Dropdown.Menu align="end">
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
