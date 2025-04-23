import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Modal, Button } from "react-bootstrap";
import Calendar from "./ClubCalendar";
import { useParams } from "react-router-dom";
import GenLayout from "../Layout/GeneralLayout";
import SideButton from "../CustomSideButton/CustomeSideButton";
import authAxios from "../utils/authAxios";
import Form from "react-bootstrap/Form";
import axios from "axios";

function ClubDashboard() {
    const navigate = useNavigate();
    const [members, setMembers] = React.useState([]);
    const [myRole, setMyRole] = React.useState("");
    const [showRemoveMemberModal, setShowRemoveMemberModal] = React.useState(false);
    const [usernameToRemove, setUsernameToRemove] = React.useState("");
    const [showEditClubModal, setShowEditClubModal] = React.useState(false);
    const [clubDescription, setClubDescription] = React.useState("");
    const [clubName, setClubName] = React.useState("");
    const { id } = useParams();

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

    const handleEditClub = async (clubName, clubDescription) => {
        try {
            await authAxios.patch(`/clubs/update/${id}/`, {
                name: clubName,
                description: clubDescription,
            });
            alert("Club updated successfully.");
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

    const canPost = ["President", "Vice_president", "officer"].includes(myRole);
    const canManage = ["President", "Vice_president"].includes(myRole);
    const isPresident = myRole === "President";

    return (
        <GenLayout
            buttons={
                canManage ? (
                    <>
                        <SideButton
                            text={"Members"}
                            style={"popover"}
                            placement={"right-start"}
                            buttons={[
                                { text: "Remove", onClick: () => setShowRemoveMemberModal(!showRemoveMemberModal) },
                                { text: "Permissions", onClick: () => console.log("Permissions") },
                            ]}
                        />
                        <SideButton
                            text={"Club"}
                            style={"popover"}
                            placement={"right-start"}
                            buttons={[
                                { text: "Edit Bio", onClick: () => setShowEditClubModal(true) },
                                { text: "Edit Club Name", onClick: () => setShowEditClubModal(true) },
                            ]}
                        />
                    </>
                ) : null
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
                <Modal show={showEditClubModal} onHide={() => setShowEditClubModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Club</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Control
                                    type="text"
                                    placeholder="Club Name"
                                    value={clubName}
                                    onChange={(e) => setClubName(e.target.value)}
                                />
                                <Form.Control
                                    type="text"
                                    placeholder="Club Description"
                                    value={clubDescription}
                                    onChange={(e) => setClubDescription(e.target.value)}
                                />
                                <Button onClick={() => handleEditClub(clubName, clubDescription)}>Save</Button>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                </Modal>
            </Container>
        </GenLayout>
    );
}

export default ClubDashboard;
