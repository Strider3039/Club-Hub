import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Navbar from "../NavBar/NavBar";
import Calendar from "./ClubCalendar";
import { useParams } from "react-router-dom";

function ClubDashboard() {
    // Get the club ID from the URL parameter
    const { id } = useParams();

    return (
        <>
            <Navbar page={"Club Dashboard"} />
            <Container fluid style={{ backgroundColor: "#fdfcf7" }} className="vh-100 mt-0 p-4 flex-column">
                <Row className="align-items-start flex-grow-1 mb-3 text-center">
                    <Col className="p-3 m-2 bg-light border border-dark-subtle text-dark rounded">
                        <p>
                            Club ID: {id} <br />
                            __________________<br />
                            |&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|<br />
                            |&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|<br />
                            |________________|<br /><br />
                            Cursor parking lot, bitch!
                        </p>
                    </Col>

                    <Col xs={6} className="p-3 m-2 bg-light border border-dark-subtle text-dark rounded">
                        This column is wider. It will contain the club description, announcements, etc.
                    </Col>
                    <Col className="p-3 m-2 bg-light border border-dark-subtle text-dark rounded">
                        <Calendar clubId={id} />
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default ClubDashboard;
