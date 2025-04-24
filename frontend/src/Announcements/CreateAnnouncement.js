import React, { useState } from "react";
import { createAnnouncement } from "../utils/authAxios";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";

function CreateAnnouncement() {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", content: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await createAnnouncement(clubId, form);
      setSuccess(true);
      setTimeout(() => navigate(`/clubs/${clubId}/announcements`), 1000);
    } catch (err) {
      setError("Failed to post announcement.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create Announcement</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Content</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            name="content"
            value={form.content}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {loading ? (
          <Spinner animation="border" />
        ) : (
          <Button type="submit" variant="success">Post</Button>
        )}
      </Form>

      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      {success && <Alert variant="success" className="mt-3">Announcement posted!</Alert>}
    </div>
  );
}

export default CreateAnnouncement;
