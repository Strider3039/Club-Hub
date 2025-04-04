import React, { useState } from "react";
import { Container, Row, Col } from 'react-bootstrap';
import Navbar from "../NavBar/NavBar";
import Calendar from "./ClubCalendar"

// layout for a club dashboard. layout uses bootstrap containers
function ClubDashboard() {

    return (
        <>
            <Navbar page={"Club Dashboard"} />
            <Container fluid style={{backgroundColor: '#fdfcf7'}} className="vh-100  mt-0 p-4 flex-column">
                <Row className="align-items-start felx-grow-1 mb-3 text-center">
                    <Col className="p-3 mt-0 m-2 bg-light border border-dark-subtle text-dark rounded">
                        <p>
                            __________________<br />
                            |&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|<br />
                            |&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|<br />
                            |________________|<br /><br />
                            cursor parking lot bitch
                        </p>
                    </Col>

                    <Col xs={6} className="p-3 mt-0 m-2 bg-light border border-dark-subtle text-dark rounded">
                        this column is wider. it will contain the
                    </Col>
                    <Col className="p-3 mt-0 m-2 bg-light border border-dark-subtle text-dark rounded">
                        <Calendar/>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default ClubDashboard;