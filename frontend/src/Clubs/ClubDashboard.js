import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Container, Row, Col, Modal, Button, Form, Card, Badge, Image } from "react-bootstrap";
import Calendar from "./ClubCalendar";
import GenLayout from "../Layout/GeneralLayout";
import SideButton from "../CustomSideButton/CustomeSideButton";
import authAxios, { fetchAnnouncements, postComment, postReply, toggleLike } from "../utils/authAxios";
import "./ClubDashboard.css";
import destructImage from "../assets/Self-Destruct.png";

function ClubDashboard() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [members, setMembers] = useState([]);
    const [myRole, setMyRole] = useState("");
    const [myId, setMyId] = useState(null);
    const [showRemoveMemberModal, setShowRemoveMemberModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [usernameToRemove, setUsernameToRemove] = useState("");
    const [showEditClubModal, setShowEditClubModal] = useState(false);
    const [clubDescription, setClubDescription] = useState("");
    const [clubName, setClubName] = useState("");
    const [announcements, setAnnouncements] = useState([]);
    const [commentInputs, setCommentInputs] = useState({});
    const [replyInputs, setReplyInputs] = useState({});

    useEffect(() => {
        getMembers();
        getClubInfo();
        loadAnnouncements();
    }, []);

    const getMembers = async () => {
        try {
            const response = await authAxios.get(`membershipList/${id}/`);
            setMembers(response.data);
            const user = JSON.parse(localStorage.getItem("user"));
            if (user) setMyId(user.id);
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

    const loadAnnouncements = async () => {
        try {
            const res = await fetchAnnouncements(id);
            setAnnouncements(res.data);
        } catch (err) {
            console.error("Error fetching announcements:", err);
        }
    };

    const handleComment = async (announcementId) => {
        const content = commentInputs[announcementId];
        if (!content.trim()) return;
        await postComment(announcementId, { content });
        setCommentInputs({ ...commentInputs, [announcementId]: "" });
        loadAnnouncements();
    };

    const handleReply = async (commentId, announcementId) => {
        const content = replyInputs[commentId];
        if (!content.trim()) return;
        await postReply(commentId, { content });
        setReplyInputs({ ...replyInputs, [commentId]: "" });
        loadAnnouncements();
    };

    const handleLike = async (announcementId) => {
        await toggleLike(announcementId);
        loadAnnouncements();
    };

    const handleRoleChange = async (userId, newRole) => {
        const targetMember = members.find(m => m.user_id === userId);
        if (!targetMember) return;

        if (myRole === "Vice President" && targetMember.position === "President") return;

        if (newRole === "President") {
            const confirmed = window.confirm("Are you sure you want to promote this user to President? You will be demoted to Member.");
            if (!confirmed) return;
        }

        if (["President", "Vice President"].includes(newRole)) {
            const exists = members.some(m => m.position === newRole);
            if (exists && !members.find(m => m.user_id === userId && m.position === newRole)) {
                alert(`There is already a ${newRole} in this club.`);
                return;
            }
        }

        try {
            if (newRole === "President") {
                await authAxios.patch(`/membershipUpdate/${id}/${userId}/`, { position: "President" });
                await authAxios.patch(`/membershipUpdate/${id}/${myId}/`, { position: "member" });
                alert("Transfer of Presidency successful.");
                window.location.reload();
            } else {
                await authAxios.patch(`/membershipUpdate/${id}/${userId}/`, { position: newRole });
                alert("Role updated successfully.");
                getMembers();
            }
        } catch (error) {
            console.error("Error updating role:", error);
            alert("Failed to update role.");
        }
    };

    const handleDeleteClub = async () => {
        try {
            await authAxios.delete(`/clubs/delete/${id}/`);
            alert("Club deleted.");
            navigate("/clubs");
        } catch (err) {
            alert("Failed to delete club. You may not have permission.");
        }
    };

    const handleEditClub = async () => {
        try {
            await authAxios.patch(`/clubs/update/${id}/`, {
                name: clubName,
                description: clubDescription,
            });
            alert("Club updated successfully.");
            setShowEditClubModal(false);
        } catch (error) {
            console.error("Error updating club: ", error);
            alert("Failed to update club.");
        }
    };

    const canManage = ["President", "Vice President"].includes(myRole);
    const isPresident = myRole === "President";
    const isOfficer = ["President", "Vice President", "officer"].includes(myRole);

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
                            { text: "Edit Club Info", onClick: () => setShowEditClubModal(true) },
                            { text: "Delete Club", onClick: () => setShowDeleteConfirm(true) }
                        ]}
                    />
                )
            }
        >
            <Container fluid className="dashboard-container">
                <Row className="align-items-start flex-grow-1 mb-3 text-center">
                    <Col md={3} className="dashboard-sidebar">
                        <h5>Club Calendar</h5>
                        <Calendar clubId={id} />
                        <h6 className="mt-4">Members</h6>
                        <div className="member-list">
                            <ul className="list-unstyled">
                                {members.map((member, index) => (
                                    <li key={index} className="mb-3 d-flex justify-content-between align-items-center">
                                        <span><strong>{member.username}</strong> — {member.position}</span>
                                        {canManage && (myId === member.user_id || (myRole === "President" && member.position !== "President")) && (
                                            <Form.Select
                                                size="sm"
                                                defaultValue={member.position}
                                                style={{ width: "140px" }}
                                                onChange={(e) => handleRoleChange(member.user_id, e.target.value)}
                                            >
                                                <option value="member">Member</option>
                                                <option value="officer">Officer</option>
                                                <option value="Vice President">Vice President</option>
                                                {isPresident && <option value="President">President</option>}
                                            </Form.Select>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Col>

                    <Col md={8} className="dashboard-main">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5>About the Club</h5>
                            {isOfficer && (
                                <Link to={`/clubs/${id}/announcements/new`}>
                                    <Button variant="primary" size="sm">➕ Create Announcement</Button>
                                </Link>
                            )}
                        </div>

                        <div className="club-info">
                            <p className="fw-semibold mb-2">
                                <span className="text-muted">Name:</span> <span className="fs-5">{clubName}</span>
                            </p>
                            <p className="fw-semibold">
                                <span className="text-muted">Description:</span> <span>{clubDescription}</span>
                            </p>
                        </div>

                        <h5 className="mt-5">Announcements</h5>
                        {announcements.length === 0 ? (
                            <p>No announcements yet.</p>
                        ) : (
                            announcements.map(ann => (
                                <Card key={ann.id} className="mb-4">
                                    <Card.Body>
                                        <Card.Title>{ann.title}</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">
                                            Posted by {ann.author.username} on {new Date(ann.created_at).toLocaleString()}
                                        </Card.Subtitle>
                                        <Card.Text>{ann.content}</Card.Text>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleLike(ann.id)}
                                            className="me-2"
                                        >
                                            ❤️ {ann.likes.length}
                                        </Button>

                                        <div className="mt-3">
                                            <Form onSubmit={e => { e.preventDefault(); handleComment(ann.id); }}>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Add a comment..."
                                                    value={commentInputs[ann.id] || ""}
                                                    onChange={(e) => setCommentInputs({ ...commentInputs, [ann.id]: e.target.value })}
                                                />
                                                <Button type="submit" size="sm" className="mt-2">Comment</Button>
                                            </Form>

                                            {ann.comments.map(comment => (
                                                <Card key={comment.id} className="mt-2 ms-2">
                                                    <Card.Body>
                                                        <strong>{comment.user.username}</strong>
                                                        <p>{comment.content}</p>
                                                        <Form
                                                            className="mt-2"
                                                            onSubmit={e => {
                                                                e.preventDefault();
                                                                handleReply(comment.id, ann.id);
                                                            }}
                                                        >
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="Reply..."
                                                                value={replyInputs[comment.id] || ""}
                                                                onChange={(e) => setReplyInputs({ ...replyInputs, [comment.id]: e.target.value })}
                                                            />
                                                            <Button type="submit" size="sm" className="mt-1">Reply</Button>
                                                        </Form>

                                                        {comment.replies.map(reply => (
                                                            <Card key={reply.id} className="mt-2 ms-3">
                                                                <Card.Body>
                                                                    <strong>{reply.user.username}</strong>
                                                                    <p>{reply.content}</p>
                                                                </Card.Body>
                                                            </Card>
                                                        ))}
                                                    </Card.Body>
                                                </Card>
                                            ))}
                                        </div>
                                    </Card.Body>
                                </Card>
                            ))
                        )}
                    </Col>
                </Row>

                {/* Self-Destruct Modal */}
                <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Are you sure?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="text-center">
                        <Image src={destructImage} alt="Self Destruct" fluid />
                        <Button variant="danger" className="mt-3" onClick={handleDeleteClub}>Self-Destruct</Button>
                        <div>
                            <Button variant="secondary" className="mt-2" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
                        </div>
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
                                <Form.Label>Club Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter new club name"
                                    value={clubName}
                                    onChange={(e) => setClubName(e.target.value)}
                                />
                                <Form.Label className="mt-3">Club Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Enter new club description"
                                    value={clubDescription}
                                    onChange={(e) => setClubDescription(e.target.value)}
                                />
                                <Button variant="primary" className="mt-3" onClick={handleEditClub}>Save Changes</Button>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                </Modal>
            </Container>
        </GenLayout>
    );
}

export default ClubDashboard;
