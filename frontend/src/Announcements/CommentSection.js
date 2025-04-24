import React, { useState } from "react";
import { postComment, postReply } from "../utils/authAxios";
import { Card, Form, Button } from "react-bootstrap";

function CommentSection({ announcement, reload }) {
  const [text, setText] = useState("");
  const [replyInputs, setReplyInputs] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      await postComment(announcement.id, { content: text });
      setText("");
      reload();
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  };

  const handleReplySubmit = async (commentId, content) => {
    if (!content.trim()) return;
    try {
      await postReply(commentId, { content });
      setReplyInputs((prev) => ({ ...prev, [commentId]: "" }));
      reload();
    } catch (err) {
      console.error("Failed to post reply:", err);
    }
  };

  return (
    <div className="mt-4">
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Control
            as="textarea"
            rows={2}
            value={text}
            placeholder="Write a comment..."
            onChange={(e) => setText(e.target.value)}
          />
        </Form.Group>
        <Button className="mt-2" type="submit">Post Comment</Button>
      </Form>

      {announcement.comments.map(comment => (
        <Card key={comment.id} className="my-3">
          <Card.Body>
            <strong>{comment.user.username}</strong>
            <p>{comment.content}</p>
            <small>{new Date(comment.created_at).toLocaleString()}</small>

            {/* Replies */}
            <div className="ms-4 mt-3">
              {comment.replies.map(reply => (
                <Card key={reply.id} className="mb-2">
                  <Card.Body className="bg-light border">
                    <strong>{reply.user.username}</strong>
                    <p className="mb-1">{reply.content}</p>
                    <small>{new Date(reply.created_at).toLocaleString()}</small>
                  </Card.Body>
                </Card>
              ))}

              {/* Reply input */}
              <Form
                className="mt-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleReplySubmit(comment.id, replyInputs[comment.id] || "");
                }}
              >
                <Form.Control
                  type="text"
                  placeholder="Write a reply..."
                  value={replyInputs[comment.id] || ""}
                  onChange={(e) =>
                    setReplyInputs({ ...replyInputs, [comment.id]: e.target.value })
                  }
                />
                <Button type="submit" size="sm" className="mt-1">
                  Reply
                </Button>
              </Form>
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}

export default CommentSection;
