import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dropdown, Container } from "react-bootstrap";
import LightLogo from "../assets/Logo_Club_Hub.png";
import "./NavBar.css";

function NavBar({ pageTitle }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");
        localStorage.removeItem("username");
        navigate("/login");
        window.location.reload();
    };

    return (
        <nav className="custom-navbar navbar-expand-lg shadow-sm">
            <Container fluid>
                <Link className="navbar-brand d-flex align-items-center" to="/home">
                    <img
                        src={LightLogo}
                        alt="ClubHub Logo"
                        height="44"
                        className="me-2"
                    />
                </Link>

                <div className="navbar-divider" />

                <div className="d-flex align-items-center flex-grow-1">
                    <span className="navbar-page-title">{pageTitle}</span>

                    <ul className="navbar-nav ms-4 mb-0 d-flex flex-row gap-3 align-items-center">
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
                </div>

                <div className="d-flex align-items-center gap-3">
                    <Dropdown align="end">
                        <Dropdown.Toggle
                            id="dropdown-basic"
                            variant="light"
                            className="profile-dropdown"
                        >
                            {localStorage.getItem("username") || "Profile"}
                        </Dropdown.Toggle>

                        <Dropdown.Menu align="end" style={{ zIndex: 9999 }}>
                            <Dropdown.Item as={Link} to="/dashboard">My Profile</Dropdown.Item>
                            <Dropdown.Item as={Link} to="/settings">Account Settings</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </Container>
        </nav>
    );
}

export default NavBar;
