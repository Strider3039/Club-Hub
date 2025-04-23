import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Modal, Button, Form } from "react-bootstrap";
import Calendar from "./ClubCalendar";
import GenLayout from "../Layout/GeneralLayout";
import SideButton from "../CustomSideButton/CustomeSideButton";
import authAxios from "../utils/authAxios";

function ClubDashboard() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [members, setMembers] = useState([]);
    const [myRole, setMyRole] = useState("");
    const [showRemoveMemberModal, setShowRemoveMemberModal] = useState(false);
    const [usernameToRemove, setUsernameToRemove] = useState("");
    const [showEditClubModal, setShowEditClubModal] = useState(false);
    const [clubDescription, setClubDescription] = useState("");
    const [clubName, setClubName] = useState("");

    useEffect(() => {
        getMembers();
        getClubInfo();
    }, []);

    const getMembers = async () => {
        try {
            const response = await authAxios.get(`membershipList/${id}/`);
            setMembers(response.data);
            const myEntry = response.data.find(m => m.username === localStorage.getItem("username"));
            if (myEntry) setMyRole(myEntry.position);
        } catch (error) {
            console.error("Error fetching Member list: ", error);
        }
    };

    const getClubInfo = async () => {
        try {
            const response = await authAxios.get(`/clubs/${id}/`);
            setClubDescription(response.data.description);
            setClubName(response.data.name);
        } catch (error) {
            console.error("Error fetching club info: ", error);
        }
    };

    const handleEditClub = async () => {
        try {
            await authAxios.patch(`/clubs/update/${id}/`, {
                name: clubName,
                description: clubDescription,
            });
            alert("Club updated successfully.");
            // close modal after editing
            setShowEditClubModal(false);
        } catch (error) {
            console.error("Error updating club: ", error);
            alert("Failed to update club.");
        }
    };

    const handleDeleteClub = async () => {
        if (!window.confirm("Are you sure you want to delete this club?")) return;
        try {
            await authAxios.delete(`/clubs/delete/${id}/`);
            alert("Club deleted successfully.");
            navigate("/clubs");
        } catch (error) {
            console.error("Error deleting club: ", error);
            alert("Failed to delete club.");
        }
    };

    const handleUpdateRole = async (userId, newRole) => {
        try {
            await authAxios.patch(`/membershipUpdate/${id}/${userId}/`, {
                position: newRole,
            });
            alert("Role updated.");
            getMembers();
        } catch (error) {
            console.error("Error updating role: ", error);
            alert("Failed to update role.");
        }
    };

    const handleRemoveMember = async (userName) => {
        if (!window.confirm("Remove this member?")) return;
        try {
            const member = members.find(m => m.username === userName);
            if (member) {
                const userId = member.user_id;
                await authAxios.delete(`/membershipDelete/${id}/${userId}/`);
                alert("Member removed.");
                getMembers();
            }
        } catch (error) {
            console.error("Error removing member: ", error);
            alert("Failed to remove member.");
        }
    };

    const canManage = ["President", "Vice_president"].includes(myRole);
    const isPresident = myRole === "President";

    return (
        <GenLayout
            pageTitle={`${clubName} Dashboard`}
            buttons={
                canManage && (
                    <SideButton
                        text={"Manage Club"}
                        style={"popover"}
                        placement={"right-start"}
                        buttons={[
                            { text: "Remove Member", onClick: () => setShowRemoveMemberModal(true) },
                            { text: "Edit Club Info", onClick: () => setShowEditClubModal(true) }
                        ]}
                    />
                )
            }
        >
            <Container fluid className="vh-100 mt-0 p-4 flex-column bg-light">
                <Row className="align-items-start flex-grow-1 mb-3 text-center">
                    <Col className="p-3 m-2 bg-light border border-dark-subtle text-dark rounded">
                        <h5>Club Calendar</h5>
                        <Calendar clubId={id} />
                    </Col>

                    <Col xs={6} className="p-3 m-2 bg-light border border-dark-subtle text-dark rounded">
                        <h5 className="mb-4">About the Club</h5>
                        <div className="text-start px-4">
                            <p className="fw-semibold mb-2">
                                <span className="text-muted">Name:</span> <span className="fs-5">{clubName}</span>
                            </p>
                            <p className="fw-semibold">
                                <span className="text-muted">Description:</span> <span>{clubDescription}</span>
                            </p>
                        </div>
                    </Col>

                    <Col className="p-3 m-2 bg-light border border-dark-subtle text-dark rounded">
                        <h5>Members</h5>
                        <ul className="list-unstyled">
                            {members.map((member, index) => (
                                <li key={index} className="mb-3 d-flex justify-content-between align-items-center">
                                    <span>
                                        <strong>{member.username}</strong> — {member.position}
                                    </span>
                                    {canManage && member.username !== localStorage.getItem("username") && (
                                        <Form.Select
                                            size="sm"
                                            defaultValue={member.position}
                                            style={{ width: "150px" }}
                                            onChange={(e) => handleUpdateRole(member.user_id, e.target.value)}
                                        >
                                            <option value="member">Member</option>
                                            <option value="officer">Officer</option>
                                            <option value="vice_president">Vice President</option>
                                            <option value="president">President</option>
                                        </Form.Select>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </Col>

                    {isPresident && (
                        <div className="text-center mt-3">
                            <Button variant="danger" onClick={handleDeleteClub}>
                                Delete Club
                            </Button>
                        </div>
                    )}
                </Row>

                {/* Remove Member Modal */}
                <Modal show={showRemoveMemberModal} onHide={() => setShowRemoveMemberModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Member to Remove</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Control
                                    type="text"
                                    placeholder="Username"
                                    value={usernameToRemove}
                                    onChange={(e) => setUsernameToRemove(e.target.value)}
                                />
                                <Button onClick={() => handleRemoveMember(usernameToRemove)}>Remove</Button>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                </Modal>

                {/* Edit Club Info Modal */}
                <Modal show={showEditClubModal} onHide={() => setShowEditClubModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Club Info</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <h6>Club Name</h6>
                                <Form.Control
                                    type="text"
                                    placeholder="Club Name"
                                    value={clubName}
                                    onChange={(e) => setClubName(e.target.value)}
                                />
                                <h6>Club Description</h6>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Club Description"
                                    value={clubDescription}
                                    onChange={(e) => setClubDescription(e.target.value)}
                                />
                                <Button onClick={handleEditClub}>Save</Button>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                </Modal>
            </Container>
        </GenLayout>
    );
}

export default ClubDashboard;