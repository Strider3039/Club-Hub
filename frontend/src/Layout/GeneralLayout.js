import {Col, Container, Row} from "react-bootstrap";
import NavBar from "../Navigation/NavBar";
import Sidebar from "../Navigation/Sidebar";
import React, {useState} from "react";


function GeneralLayout({children, pageTitle, buttons}) {

    // 🌗 Theme state
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        window.location.reload();
    };

    return (
        <div style={{zIndex: 9999}}>
            <Container fluid className="p-0 m-0 h-auto w-100">
                <Row className="w-100 mr-0" >
                    <Col xs={"auto"} style={{padding: "0px"}} className="h-auto bg-light">
                        <Sidebar>
                            {buttons}
                        </Sidebar>
                    </Col>
                    <Col className="bg-white">
                        <Row >
                            <Col className="w-100" style={{marginBottom: "7px"}}>
                                <NavBar toggleTheme={toggleTheme} pageTitle={pageTitle} />
                            </Col>
                        </Row>
                        <Row >
                            <Col className="min-vh-100 w-100">
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