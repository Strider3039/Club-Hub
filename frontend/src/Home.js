import React, { useEffect, useState } from "react";
import Layout from "./Layout/Layout";
import GenLayout from "./Layout/GeneralLayout";
import { useNavigate } from "react-router-dom";
import { fetchAnnouncements, postComment, postReply, toggleLike } from "./utils/authAxios";
import { Card, Button, Form } from "react-bootstrap";

function Home() {
    const navigate = useNavigate();
    const [announcements, setAnnouncements] = useState([]);
    const [commentInputs, setCommentInputs] = useState({});
    const [replyInputs, setReplyInputs] = useState({});

    const userId = parseInt(localStorage.getItem("user_id"));

    const loadAnnouncements = async () => {
        try {
            const clubIds = JSON.parse(localStorage.getItem("user"))?.memberships?.map(m => m.club);
            if (!clubIds || clubIds.length === 0) return;
            const all = await Promise.all(
                clubIds.map(id => fetchAnnouncements(id).then(res => res.data))
            );
            setAnnouncements(all.flat().sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
        } catch (err) {
            console.error("Failed to load announcements", err);
        }
    };

    useEffect(() => {
        loadAnnouncements();
    }, []);

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

    return (
        <GenLayout pageTitle={"Home"}>
            <Layout
                middleContentHeader={"Announcements"}
                middleContentBody={
                    announcements.length === 0 ? (
                        <p>No announcements to show.</p>
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

                                    {/* Comments */}
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
                    )
                }
                rightContentHeader={"Quick Access"}
                rightContentBody={<p>right test</p>}
            />
        </GenLayout>
    );
}

export default Home;
