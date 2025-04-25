import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import GenLayout from "../Layout/GeneralLayout";
import Calendar from "./ClubCalendar";
import { fetchAnnouncements, postComment, postReply, toggleLike } from "../utils/authAxios";
import authAxios from "../utils/authAxios";

function ClubDashboard() {
    const { id } = useParams();
    const [announcements, setAnnouncements] = useState([]);
    const [commentInputs, setCommentInputs] = useState({});
    const [replyInputs, setReplyInputs] = useState({});
    const [role, setRole] = useState("");

    const loadAnnouncements = async () => {
        try {
            const res = await fetchAnnouncements(id);
            setAnnouncements(res.data);
        } catch (err) {
            console.error("Error fetching announcements:", err);
        }
    };

    const loadMembership = async () => {
        try {
            const res = await authAxios.get(`/membershipList/${id}/`);
            const myEntry = res.data.find(m => m.username === localStorage.getItem("username"));
            if (myEntry) setRole(myEntry.position);
        } catch (err) {
            console.error("Error loading membership:", err);
        }
    };

    useEffect(() => {
        loadAnnouncements();
        loadMembership();
    }, [id]);

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

    const isOfficer = ["President", "Vice President", "officer"].includes(role);

    return (
        <GenLayout pageTitle="Club Dashboard">
            <Container fluid className="p-4">
                <Row>
                    <Col md={4} className="bg-light border rounded p-3">
                        <h5>Club Calendar</h5>
                        <Calendar clubId={id} />
                        {isOfficer && (
                            <div className="mt-3">
                                <Link to={`/clubs/${id}/announcements/new`}>
                                    <Button variant="primary" size="sm">➕ Create Announcement</Button>
                                </Link>
                            </div>
                        )}
                    </Col>
                    <Col md={8} className="bg-light border rounded p-3">
                        <h5>Announcements</h5>
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
