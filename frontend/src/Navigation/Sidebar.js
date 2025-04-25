import { Col, Row, Button } from "react-bootstrap";
import SideButton from "../CustomSideButton/CustomeSideButton";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LightLogo from "../assets/Logo_Club_Hub.png";
import { Modal } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import authAxios from "../utils/authAxios";
import "./Sidebar.css";

function Sidebar({ children }) {
    const [showAddForm, setShowAddForm] = React.useState(false);
    const [friendUsername, setFriendUsername] = React.useState("");
    const navigate = useNavigate();
    const [friendsError, setFriendsError] = useState("");

    const handleNewFriend = async () => {
        if (!friendUsername) return;

        try {
            await authAxios.post("/friend-requests/", { friendUsername });
            alert("Friend request sent!");
        } catch (err) {
            console.error("Error adding friend:", err.response?.data || err.message);
            setFriendsError("Failed to add friend.");
        }
    };

    return (
        <>
            <div className="sidebar-container">
                <Row>
                    <Col>
                        <Link className="navbar-brand d-flex align-items-center" to="/home">
                            <img
                                src={LightLogo}
                                alt="ClubHub Logo"
                                className="sidebar-logo"
                            />
                        </Link>
                    </Col>
                </Row>
                <Row>
                    <Col className="sidebar-buttons">
                        <SideButton text={"Clubs"} onClick={() => navigate("/clubs")} />
                        <SideButton text={"Events"} />
                        <SideButton
                            text={"Friends"}
                            style={"popover"}
                            placement={"right-start"}
                            buttons={[
                                { text: "Add friends", onClick: () => setShowAddForm(!showAddForm) },
                                { text: "View friends", onClick: () => navigate("/friends") },
                            ]}
                        />
                        {children}
                    </Col>
                </Row>
            </div>
            <Modal show={showAddForm} onHide={() => setShowAddForm(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add Friend</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={(e) => {
                        e.preventDefault();
                        handleNewFriend();
                    }}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Control
                                type="text"
                                placeholder="Username"
                                value={friendUsername}
                                onChange={(e) => setFriendUsername(e.target.value)}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Send Friend Request
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default Sidebar;
