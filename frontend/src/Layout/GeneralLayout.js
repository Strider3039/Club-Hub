import { Col, Container, Row } from "react-bootstrap";
import NavBar from "../Navigation/NavBar";
import Sidebar from "../Navigation/Sidebar";
import React from "react";
import "./GeneralLayout.css";

function GeneralLayout({ children, pageTitle, buttons }) {
    return (
        <div className="general-layout">
            <Container fluid className="p-0 m-0">
                <Row className="g-0">
                    <Col xs="auto" className="general-layout-sidebar">
                        <Sidebar>
                            {buttons}
                        </Sidebar>
                    </Col>
                    <Col className="general-layout-main">
                        <NavBar pageTitle={pageTitle} />
                        <div className="general-layout-content">
                            {children}
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default GeneralLayout;
