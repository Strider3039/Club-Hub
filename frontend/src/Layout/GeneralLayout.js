import { Container } from "react-bootstrap";
import NavBar from "../Navigation/NavBar";
import React from "react";
import "./GeneralLayout.css";

function GeneralLayout({ children, pageTitle, buttons }) {
    return (
        <div className="general-layout">
            <Container fluid className="p-0 m-0">
                <div className="general-layout-main">
                    <NavBar pageTitle={pageTitle} />
                    {buttons && (
                        <div className="general-layout-actions">
                            <span className="general-layout-actions-label">Page Actions</span>
                            <div className="general-layout-actions-content">
                                {buttons}
                            </div>
                        </div>
                    )}
                    <div className="general-layout-content">
                        {children}
                    </div>
                </div>
            </Container>
        </div>
    );
}

export default GeneralLayout;
