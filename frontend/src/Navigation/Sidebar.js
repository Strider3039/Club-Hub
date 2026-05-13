import { Button } from "react-bootstrap";
import SideButton from "../CustomSideButton/CustomeSideButton";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LightLogo from "../assets/Logo_Club_Hub.png";
import { Modal } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import authAxios from "../utils/authAxios";

function Sidebar({ children }) {
    const [showAddForm, setShowAddForm] = useState(false);
    const [friendUsername, setFriendUsername] = useState("");
    const navigate = useNavigate();
    const [friendsError, setFriendsError] = useState("");

    const handleNewFriend = async () => {
        if (!friendUsername) return;

        try {
            await authAxios.post("/friend-requests/", { friendUsername });
            alert("Friend request sent!");
            setFriendUsername("");
            setShowAddForm(false);
        } catch (err) {
            console.error("Error adding friend:", err.response?.data || err.message);
            setFriendsError("Failed to add friend.");
        }
    };

    return (
        <>
            <div className="sidebar d-flex flex-column">
                <div className="sidebar-logo-wrap">
                    <Link to="/home">
                        <img
                            src={LightLogo}
                            alt="ClubHub Logo"
                            width="90"
                            height="90"
                        />
                    </Link>
                </div>

                <div className="sidebar-section">
                    <div className="sidebar-section-label">Navigate</div>
                    <SideButton text={"Home"} onClick={() => navigate("/home")} />
                    <SideButton text={"Clubs"} onClick={() => navigate("/clubs")} />
                    <SideButton
                        text={"Friends"}
                        style={"popover"}
                        placement={"right-start"}
                        buttons={[
                            { text: "Add friend", onClick: () => setShowAddForm(true) },
                            { text: "View friends", onClick: () => navigate("/friends") },
                        ]}
                    />
                </div>

                <div className="sidebar-section">
                    <div className="sidebar-section-label">Account</div>
                    <SideButton text={"My Profile"} onClick={() => navigate("/dashboard")} />
                    <SideButton text={"Settings"} onClick={() => navigate("/settings")} />
                </div>

                {children && (
                    <div className="sidebar-section">
                        <div className="sidebar-section-label">Actions</div>
                        {children}
                    </div>
                )}
            </div>

            <Modal show={showAddForm} onHide={() => setShowAddForm(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add Friend</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter username..."
                                value={friendUsername}
                                onChange={(e) => setFriendUsername(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleNewFriend()}
                            />
                            {friendsError && <p className="text-danger small mt-1">{friendsError}</p>}
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddForm(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleNewFriend}>Send Request</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Sidebar;
