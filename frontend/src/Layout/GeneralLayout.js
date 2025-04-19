import {Col, Container, Row} from "react-bootstrap";
import NavBar from "../NavBar/NavBar";
import Sidebar from "../NavBar/Sidebar";
import React, {useState} from "react";


function GeneralLayout({children, pageTitle}) {

    // 🌗 Theme state
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    };


    return (
    <Container fluid className="p-0 m-0 h-auto">
        <Row noGutters>
            <Col noGutters xs={"auto"} style={{padding: "0px"}} className="h-auto bg-light">
                <Sidebar/>
            </Col>
            <Col className="bg-white">
                <Row noGutters>
                    <Col className="w-100" style={{marginBottom: "7px"}}>
                        <NavBar toggleTheme={toggleTheme} pageTitle={pageTitle} />
                    </Col>
                </Row>
                <Row noGutters>
                    <Col className="min-vh-100 w-100">
                        {children}
                    </Col>
                </Row>
            </Col>
        </Row>
    </Container>
    );
}

export default GeneralLayout;