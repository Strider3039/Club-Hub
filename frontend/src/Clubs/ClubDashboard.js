import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Container, Row, Col, Modal, Button, Form, Card } from "react-bootstrap";
import Calendar from "./ClubCalendar";
import GenLayout from "../Layout/GeneralLayout";
import SideButton from "../CustomSideButton/CustomeSideButton";
import authAxios, { fetchAnnouncements, postComment, postReply, toggleLike } from "../utils/authAxios";

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
                            { text: "Edit Club Info", onClick: () => setShowEditClubModal(true) }
                        ]}
                    />
                )
            }
        >
            <Container fluid className="vh-100 mt-0 p-4 flex-column bg-light">
                <Row className="align-items-start flex-grow-1 mb-3 text-center">
                    <Col md={3} className="p-3 m-2 bg-light border border-dark-subtle text-dark rounded">
                        <h5>Club Calendar</h5>
                        <Calendar clubId={id} />
                        <h6 className="mt-4">Members</h6>
                        <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                            <ul className="list-unstyled">
                                {members.map((member, index) => (
                                    <li key={index} className="mb-3">
                                        <strong>{member.username}</strong> — {member.position}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Col>

                    <Col md={8} className="p-3 m-2 bg-light border border-dark-subtle text-dark rounded">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5>About the Club</h5>
                            {isOfficer && (
                                <Link to={`/clubs/${id}/announcements/new`}>
                                    <Button variant="primary" size="sm">➕ Create Announcement</Button>
                                </Link>
                            )}
                        </div>

                        <div className="text-start px-4">
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
            </Container>
        </GenLayout>
    );
}

export default ClubDashboard;
