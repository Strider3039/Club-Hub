import React, {useEffect} from "react";
import {Container, Row, Col, Modal} from "react-bootstrap";
import Calendar from "./ClubCalendar";
import { useParams } from "react-router-dom";
import GenLayout from "../Layout/GeneralLayout"
import SideButton from "../CustomSideButton/CustomeSideButton"
import authAxios from "../utils/authAxios";
import Form from "react-bootstrap/Form";

function ClubDashboard() {
    const [members, setMembers] = React.useState([]); // list of club members
    const [myRole, setMyRole] = React.useState(""); // my role in the club
    const [hasPermission, setHasPermission] = React.useState(false);
    const [showRemoveMemberModal, setShowRemoveMemberModal] = React.useState(false);
    const [usernameToRemove, setUsernameToRemove] = React.useState("");
    // Get the club ID from the URL parameter
    const { id } = useParams();

    useEffect(() => {
        getMembers();
    },[])

    const getMembers = async () => {
        try
        {
            const response = await authAxios.get(`membershipList/${id}/`);
            setMembers(response.data); // data includes user_id, username, position
            console.log("Membership list", response);
        }
        catch (error) {
            console.error("Error fetching Member list: ", error);
        }
    }

    const handleEditClub = async () => {
        try {
            await authAxios.patch(`/clubs/update/?club_id=${id}`, {
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
            await authAxios.delete(`/clubs/delete/?club_id=${id}`);
            alert("Club deleted successfully.");
            // Redirect or refresh UI
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
                const userId = member.id;
                await authAxios.delete(`/membershipDelete/${id}/${userId}/`);
                alert("Member removed.");
                getMembers();
            }
        } catch (error) {
            console.error("Error removing member: ", error);
            alert("Failed to remove member.");
        }
    };

    const canPost = ["president", "vice_president", "officer"].includes(myRole);
    const canManage = ["president", "vice_president"].includes(myRole);
    const isPresident = myRole === "president";

    return (
        <GenLayout
            buttons={
                hasPermission ? (
                    <SideButton
                        text={"Members"}
                        style={"popover"}
                        placement={"right-start"}
                        buttons={[
                            {text: "Remove", onClick: () => setShowRemoveMemberModal(!showRemoveMemberModal)},
                            {text: "Permissions", onClick: () => console.log("Permissions")},
                        ]}
                    ></SideButton>,
                    <SideButton
                        text={"Club"}
                        style={"popover"}
                        placement={"right-start"}
                        buttons={[
                            {text: "Edit Bio", onClick: () => console.log("edit bio")},
                            {}
                        ]}
                    ></SideButton>
                ) : null
            }
        >
            <Container fluid className="vh-100 mt-0 p-4 flex-column bg-light">
                <Row className="align-items-start flex-grow-1 mb-3 text-center">
                    <Col className="p-3 m-2 bg-light border border-dark-subtle text-dark rounded">
                        <Calendar clubId={id} />
                    </Col>

                    <Col xs={6} className="p-3 m-2 bg-light border border-dark-subtle text-dark rounded">
                        This column is wider. It will contain the club description, announcements, etc.
                    </Col>

                    <Col className="p-3 m-2 bg-light border border-dark-subtle text-dark rounded">
                        {/*members are listed here*/}
                        <ul className="list-unstyled">
                            {members.map((member, index) => (
                                <li key={index} className="mb-2">
                                    <strong>{member.username}</strong> — {member.position}
                                </li>
                            ))}
                        </ul>
                    </Col>
                </Row>
                <Modal show={showRemoveMemberModal} onHide={() => setShowRemoveMemberModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Member to Remove</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Control
                                    type="text"
                                    placeholder="Username"
                                    value={usernameToRemove}
                                    onChange={(e) => setUsernameToRemove(e.target.value)}
                                    onSubmit={() => handleRemoveMember(usernameToRemove)}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                </Modal>
            </Container>
        </GenLayout>
    );
}

export default ClubDashboard;
