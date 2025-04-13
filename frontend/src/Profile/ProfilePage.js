import Logo from '../assets/clubLogo.png'
import pfp from '../assets/noProfilePhoto.jpg'
import React from 'react';
import { Container, Row, Col, Button, Form, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ProfilePage.css';
import SideButton from '../CustomSideButton/CustomeSideButton';

const Sidebar = () => (
    <div className="sidebar d-flex flex-column align-items-center py-4">
        {/* need custom button */}
        <Col className="ml-auto d-flex flex-column gap-2">
            <SideButton text={"Clubs"}/>
            <SideButton text={"Events"}/>
            <SideButton
                text={"Friends"}
                style={"popover"}
                placement={"right-start"}
                buttons={[
                    { text: "Add friends", onClick: () => console.log("Add friends") }, // these logs are just placeholders
                    { text: "Remove friends", onClick: () => console.log("Remove friends") },
                    { text: "View friends", onClick: () => console.log("View friends") },
                ]}
            />
        </Col>
    </div>
);

const ProfilePanel = () => (
    <div className="bg-light p-4 text-center">
        <img src='../assets/noProfilePhoto.jpg' className="rounded-circle" style={{ width: '100px', height: '100px', marginTop: '20px'}}></img>
        <div className="mt-3">
            <Button variant="light" className="mb-2">edit photo</Button>
            <hr />
            <Button variant="light" className="mb-3">edit bio</Button>
            <div className="mt-4">
                <Button variant="dark" size="sm" className="me-2">change password</Button>
                <Button variant="danger" size="sm">delete account</Button>
            </div>
        </div>
    </div>
);

const App = () => (
    <Container fluid className="p-0">
        <Row noGutters>
            <Col xs={2} className="min-vh-100">
                <Sidebar />
            </Col>
            <Col xs={7} className="min-vh-100">
                {/* Middle Content Placeholder */}
            </Col>
            <Col xs={3} className="min-vh-100">
                <ProfilePanel />
            </Col>
        </Row>
    </Container>
);

export default App;
