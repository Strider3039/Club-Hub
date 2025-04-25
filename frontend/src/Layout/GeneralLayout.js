import { Col, Container, Row } from "react-bootstrap";
import NavBar from "../Navigation/NavBar";
import Sidebar from "../Navigation/Sidebar";
import React, { useState } from "react";
import "./GeneralLayout.css";

function GeneralLayout({ children, pageTitle, buttons }) {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        window.location.reload();
    };

    return (
        <div className="general-layout-wrapper">
            <Container fluid className="general-layout-container">
                <Row className="general-layout-row">
                    <Col xs="auto" className="sidebar-column">
                        <Sidebar>
                            {buttons}
                        </Sidebar>
                    </Col>
                    <Col className="main-content-column">
                        <Row>
                            <Col className="navbar-column">
                                <NavBar toggleTheme={toggleTheme} pageTitle={pageTitle} />
                            </Col>
                        </Row>
                        <Row>
                            <Col className="page-content-column">
                                {children}
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default GeneralLayout;
