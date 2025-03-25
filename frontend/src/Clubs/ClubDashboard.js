import React, { useState } from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from "../NavBar/NavBar";

function ClubDashboard() {
    return (
        <>
            <Navbar page={"Club Dashboard"} />
            <Container fluid style={{backgroundColor: '#f7f5ed'}} className="vh-100  mt-0 p-4 flex-column">
                <Row className="align-items-start felx-grow-1 mb-3 text-center">
                    <Col className="p-3 mt-0 m-2 bg-light border border-dark-subtle text-dark rounded">
                        <p>
                         columns are independent and stretch with the content
                            inside it. see?
                        </p>
                    </Col>
                    <Col xs={6} className="p-3 mt-0 m-2 bg-light border border-dark-subtle text-dark rounded"> this column is wider. it will contain the  </Col>
                    <Col className="p-3 mt-0 m-2 bg-light border border-dark-subtle text-dark rounded">3 of 3</Col>
                </Row>
            </Container>
        </>
    );
}

export default ClubDashboard;