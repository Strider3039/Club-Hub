import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchAnnouncements, toggleLike, postComment, postReply
} from "../utils/authAxios";
import { Card, Button, Form, Spinner } from "react-bootstrap";

function AnnouncementDetail() {
  const { clubId, announcementId } = useParams();
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");

  const loadAnnouncement = async () => {
    try {
      const res = await fetchAnnouncements(clubId);
      const found = res.data.find(a => a.id === parseInt(announcementId));
      setAnnouncement(found);
    } catch (err) {
      console.error("Failed to load announcement", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncement();
  }, [clubId, announcementId]);

  const handleLike = async () => {
    await toggleLike(announcementId);
    loadAnnouncement(); // refresh likes
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    await postComment(announcementId, { content: commentText });
    setCommentText("");
    loadAnnouncement(); // refresh comments
  };

  if (loading) return <Spinner animation="border" className="m-4" />;

  if (!announcement) return <p>Announcement not found.</p>;

  return (
    <div className="container mt-4">
      <Card>
        <Card.Body>
          <Card.Title>{announcement.title}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            Posted by {announcement.author.username} on{" "}
            {new Date(announcement.created_at).toLocaleString()}
          </Card.Subtitle>
          <Card.Text>{announcement.content}</Card.Text>
          <Button variant="outline-danger" size="sm" onClick={handleLike}>
            ❤️ {announcement.likes.length}
          </Button>
        </Card.Body>
      </Card>

      <div className="mt-4">
        <h5>Comments</h5>
        {announcement.comments.map(comment => (
          <Card key={comment.id} className="mb-3 ms-3">
            <Card.Body>
              <strong>{comment.user.username}</strong> said:
              <p>{comment.content}</p>
              <small>{new Date(comment.created_at).toLocaleString()}</small>

              {comment.replies.map(reply => (
                <Card key={reply.id} className="mt-2 ms-4">
                  <Card.Body>
                    <strong>{reply.user.username}</strong> replied:
                    <p>{reply.content}</p>
                    <small>{new Date(reply.created_at).toLocaleString()}</small>
                  </Card.Body>
                </Card>
              ))}
            </Card.Body>
          </Card>
        ))}

        <Form onSubmit={handleCommentSubmit}>
          <Form.Group>
            <Form.Control
              as="textarea"
              rows={2}
              value={commentText}
              placeholder="Write a comment..."
              onChange={(e) => setCommentText(e.target.value)}
            />
          </Form.Group>
          <Button className="mt-2" type="submit">Post Comment</Button>
        </Form>
      </div>
    </div>
  );
}

export default AnnouncementDetail;
